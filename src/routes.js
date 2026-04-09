import { Router } from 'express';
import multer from 'multer';
import PostController from './app/controllers/PostController.js';
import SessionController from './app/controllers/SessionController.js';
import UserController from './app/controllers/UserController.js';
import authMiddleware from './app/middlewares/auth.js';
import multerConfig from './config/multer.cjs';
import CommentsController from './app/controllers/CommentsController.js';

const routes = new Router();

const upload = multer(multerConfig);

//Health
routes.get('/health', (_req, res) => res.json({ health: 'checked' }));

//Register e Login
routes.post('/users', UserController.store); //register
routes.post('/sessions', SessionController.store); //login

//Posts públicos
routes.get('/posts', PostController.index);
routes.get('/users/:userId/posts', PostController.userPosts);

//Usuários
routes.get('/users', UserController.index);
routes.delete('/users/:id', UserController.delete);

// ==== Middleware ====
routes.use(authMiddleware);

//Usuário logado
routes.get('/me', UserController.show);
routes.put('/users', UserController.update);

//Posts - apenas usuários logados
routes.post('/posts', upload.single('file'), PostController.store);
routes.put('/posts/:id', upload.single('file'), PostController.update);
routes.delete('/posts/:id', PostController.delete);

// Comments routes under posts (authenticated)
routes.get('/posts/:postId/comments', CommentsController.index);
routes.get('/posts/:postId/comments/count', CommentsController.count);
routes.post('/posts/:postId/comments', CommentsController.store);
routes.delete('/posts/:postId/comments/:commentId', CommentsController.delete);

// Likes routes (authenticated)
routes.post('/posts/:id/like', PostController.like);
routes.delete('/posts/:id/like', PostController.unlike);
routes.get('/me/liked-posts', PostController.likedPosts);

export default routes;
