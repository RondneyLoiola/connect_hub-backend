import bcrypt from 'bcrypt';
import * as yup from 'yup';
import Post from '../models/Post.js';
import User from '../models/User.js';

class UserController {
  async store(req, res) {
    const schema = yup.object({
      name: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
      nickname: yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { name, email, password, nickname } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        mensagem: 'Usuário ja cadastrado',
      });
    }

    const nicknameExists = await User.findOne({ nickname });

    if (nicknameExists) {
      return res.status(400).json({ error: 'Este nickname já existe' });
    }

    const userPassword = await bcrypt.hash(password, 8);

    const user = await new User({ name, email, password: userPassword, nickname }).save();

    return res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      nickname: user.nickname,
    });
  }

  async index(_req, res) {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async show(req, res) {
    try {
      const user = await User.findById(req.params.id).select('name email nickname createdAt');
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
      res.status(200).json(user);
    } catch (_error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  }

  async update(req, res) {
    const schema = yup.object({
      name: yup.string(),
      email: yup.string().email(),
      nickname: yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    try {
      const { name, email, nickname, oldPassword, password } = req.body;

      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      // Verificar se está tentando mudar o email
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ error: 'Este email já está em uso' });
        }
      }

      // Verificar se está tentando mudar o nickname
      if (nickname && nickname !== user.nickname) {
        const nicknameExists = await User.findOne({ nickname });
        if (nicknameExists) {
          return res.status(400).json({
            error: 'Este nickname já está em uso',
          });
        }
      }

      // Se está mudando a senha, verificar senha antiga
      if (password && oldPassword) {
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Senha antiga incorreta' });
        }
        user.password = await bcrypt.hash(password, 8);
      }

      if (name) user.name = name;
      if (email) user.email = email;
      if (nickname) user.nickname = nickname;

      await user.save();

      return res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        nickname: user.nickname,
      });
    } catch (_error) {
      return res.status(500).json({error: 'Erro ao atualizar usuário'})
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ error: 'Usuário não encontrado!' });
    }

    await user.deleteOne();

    return res.status(200).json({ message: 'Usuário deletado!' });
  }
}

export default new UserController();
