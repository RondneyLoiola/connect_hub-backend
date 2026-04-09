import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as yup from 'yup';
import authConfig from '../../config/auth.js';
import User from '../models/User.js';

class SessionController {
  async store(req, res) {
    const schema = yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(req.body, { strict: true });

    const emailOrPasswordIncorrect = () => {
      return res.status(400).json({
        error: 'Email ou senha incorretos',
      });
    };

    if (!isValid) {
      return emailOrPasswordIncorrect();
    }

    const { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Email e senha obrigatórios' });
    }

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return emailOrPasswordIncorrect();
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      emailOrPasswordIncorrect();
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        name: existingUser.name,
        nickname: existingUser.nickname,
      },
      authConfig.secret,
      {
        expiresIn: authConfig.expiresIn,
      },
    );

    return res.status(200).json({
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        nickname: existingUser.nickname,
      },
      token,
    });
  }
}

export default new SessionController();
