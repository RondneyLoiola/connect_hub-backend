import 'dotenv/config'

import app from './app.js';
import connectDB from './database/index.js';

const PORT = process.env.PORT || 3333;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
}).catch((error) => {
  console.error('Falha ao iniciar servidor:', error);
});
