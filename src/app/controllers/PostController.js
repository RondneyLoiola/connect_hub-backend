import * as yup from 'yup';
import Post from '../models/Post.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';
import Like from '../models/Like.js';

class PostController {
  async store(req, res) {
    const schema = yup.object({
      description: yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    if(!req.file){
      return res.status(400).json({ error: 'Arquivo é obrigatorio!' });
    }

    const { description } = req.body;
    const { path } = req.file; // ✅ MUDOU AQUI
    const user_id = req.userId;

    const post = await new Post({ user_id, description, path }).save(); // ✅ path já é a URL completa

    return res.status(201).json({
      mensagem: 'Post criado com sucesso!',
      post,
    });
  }

  async update(req, res) {
    const schema = yup.object({
      description: yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { id } = req.params;
    const { description } = req.body;
    const user_id = req.userId;

    const post = await Post.findById(id);

    if (!post) {
      return res.status(400).json({ error: 'Post nao encontrado!' });
    }

    if (post.user_id.toString() !== user_id.toString()) {
      return res.status(400).json({
        error: 'Você não tem permissão para atualizar esse post!',
      });
    }

    if (req.file) {
      post.path = req.file.path; // ✅ MUDOU AQUI
    }
    if (description !== undefined) {
      post.description = description;
    }

    await post.save();

    return res.status(200).json({
      mensagem: 'Post atualizado com sucesso!',
      post,
    });
  }

  async index(_req, res) {
    try {
      const posts = await Post.find().populate('user_id', 'name nickname').sort({ createdAt: -1 });
      
      const formattedPosts = [];
      for (const post of posts) {
        const postObj = post.toObject();
        const author = post.user_id ? {
          name: post.user_id.name,
          nickname: post.user_id.nickname
        } : null;
        const { user_id, ...rest } = postObj;
        const comments_count = await Comment.countDocuments({ post_id: post._id });
        formattedPosts.push({ ...rest, author, comments_count });
      }
      
      return res.json(formattedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
  }

  async userPosts(req, res) {
    try {
      const { userId } = req.params;

      const posts = await Post.find({ user_id: userId })
        .populate('user_id', 'name nickname')
        .sort({ createdAt: -1 });

      const formattedPosts = [];
      for (const post of posts) {
        const postObj = post.toObject();
        const author = postObj.user_id ? {
          name: postObj.user_id.name,
          nickname: postObj.user_id.nickname
        } : null;
        const { user_id, ...rest } = postObj;
        const comments_count = await Comment.countDocuments({ post_id: post._id });
        formattedPosts.push({ ...rest, author, comments_count });
      }

      return res.json({
        posts: formattedPosts,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar posts' });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const post = await Post.findById(id);

      if (!post) {
        return res.status(400).json({ error: 'Post nao encontrado!' });
      }

      if (post.user_id.toString() !== user_id.toString()) {
        return res.status(400).json({
          error: ' Você nao tem permissão para deletar esse post!',
        });
      }

      await post.deleteOne();

      return res.status(204).json({
        mensagem: 'Post deletado com sucesso!',
      });
    } catch (_error) {
      return res.status(500).json({ error: 'Erro ao deletar post' });
    }
  }

  async like(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ error: 'Post não encontrado!' });
      }

      const existingLike = await Like.findOne({ user_id, post_id: id });
      if (existingLike) {
        return res.status(400).json({ error: 'Post já curtido!' });
      }

      await new Like({ user_id, post_id: id }).save();
      post.likes_count += 1;
      await post.save();

      return res.json({ message: 'Post curtido com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao curtir post' });
    }
  }

  async unlike(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.userId;

      const like = await Like.findOne({ user_id, post_id: id });
      if (!like) {
        return res.status(400).json({ error: 'Post não curtido!' });
      }

      await like.deleteOne();
      const post = await Post.findById(id);
      post.likes_count = Math.max(0, post.likes_count - 1);
      await post.save();

      return res.json({ message: 'Curtida removida com sucesso!' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao remover curtida' });
    }
  }

  async likedPosts(req, res) {
    try {
      const user_id = req.userId;

      const likes = await Like.find({ user_id })
        .populate({
          path: 'post_id',
          match: { _id: { $exists: true } },
          populate: { path: 'user_id', select: 'name nickname' },
          options: { sort: { 'post_id.createdAt': -1 } }
        });

      const posts = [];
      for (const like of likes) {
        if (!like.post_id) continue;
        const post = like.post_id;
        const postObj = post.toObject();
        const author = postObj.user_id ? {
          name: postObj.user_id.name,
          nickname: postObj.user_id.nickname
        } : null;
        const { user_id, ...rest } = postObj;
        const comments_count = await Comment.countDocuments({ post_id: post._id });
        posts.push({ ...rest, author, comments_count });
      }

      return res.json(posts);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar posts curtidos' });
    }
  }
}

export default new PostController();