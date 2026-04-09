import cors from 'cors';
import express from 'express';
import routes from './routes.js';
import fileRouteConfig from './config/fileRoutes.cjs';

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use('/post-image', fileRouteConfig);

app.use(routes);

export default app;
