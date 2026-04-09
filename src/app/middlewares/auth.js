import jwt from 'jsonwebtoken';
import authConfig from '../../config/auth.js';

const authMiddleware = (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken) {
    return res.status(401).json({ error: 'Token não autorizado' });
  }

  const token = authToken.split(' ')[1];

  try {
    jwt.verify(token, authConfig.secret, (err, decoded) => {
      if (err) {
        throw Error();
      }

      req.userId = decoded.id;
      req.userName = decoded.name;

      next();
    });
  } catch (_error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export default authMiddleware;
