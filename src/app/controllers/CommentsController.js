import * as yup from 'yup';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

class CommentsController {
  async store(req, res) {
    const schema = yup.object({
      content: yup.string().required('Comentário é obrigatório').max(500, 'Comentário deve ter no máximo 500 caracteres'),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (error) {
      return res.status(400).json({ error: error.errors });
    }

    const { postId } = req.params;
    const { content } = req.body;
    const user_id = req.userId;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const comment = await new Comment({ user_id, post_id: postId, content }).save();

    // Increment comments count
    post.comments_count += 1;
    await post.save();

    return res.status(201).json({
      mensagem: 'Comentário criado com sucesso!',
      comment,
    });
  }

  async index(req, res) {
    const { postId } = req.params;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    const comments = await Comment.find({ post_id: postId })
      .populate('user_id', 'name nickname')
      .sort({ createdAt: 1 })
      .select('content createdAt updatedAt');

    const formattedComments = comments.map(comment => {
      const commentObj = comment.toObject();
      const author = comment.user_id ? {
        name: comment.user_id.name,
        nickname: comment.user_id.nickname
      } : null;
      const { user_id, ...rest } = commentObj;
      return { ...rest, author };
    });

    return res.json(formattedComments);
  }

  async count(req, res) {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    return res.json({ count: post.comments_count });
  }

  async delete(req, res) {
    const { postId, commentId } = req.params;
    const user_id = req.userId;

    // Verify post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    // Find the comment
    const comment = await Comment.findOne({ _id: commentId, post_id: postId });

    if (!comment) {
      return res.status(404).json({ error: 'Comentário não encontrado' });
    }

    // Check if the user is the author of the comment
    if (comment.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({ error: 'Você não tem permissão para deletar este comentário' });
    }

    // Delete the comment
    await comment.deleteOne();

    // Decrement comments count
    post.comments_count = Math.max(0, post.comments_count - 1);
    await post.save();

    return res.json({ mensagem: 'Comentário deletado com sucesso!' });
  }
}

export default new CommentsController();
