📋 Sobre o Projeto
Connect Hub Backend é uma API RESTful completa para uma rede social, desenvolvida com Node.js e Express. O projeto oferece funcionalidades essenciais como autenticação de usuários, criação e gerenciamento de posts, sistema de comentários e likes, além de upload de imagens integrado com Cloudinary.
✨ Características

🔐 Autenticação JWT - Sistema seguro de login e registro
👤 Gerenciamento de Usuários - CRUD completo de usuários
📝 Posts - Criar, editar, deletar e listar publicações
💬 Comentários - Sistema completo de comentários em posts
❤️ Likes - Curtir e descurtir posts
🖼️ Upload de Imagens - Integração com Cloudinary
🔒 Proteção de Rotas - Middleware de autenticação
✅ Validação de Dados - Validação com Yup
🎨 Code Quality - Linting e formatação com Biome

🚀 Tecnologias
Este projeto foi desenvolvido com as seguintes tecnologias:

Node.js - Runtime JavaScript
Express - Framework web
MongoDB - Banco de dados NoSQL
Mongoose - ODM para MongoDB
JWT - Autenticação baseada em tokens
Bcrypt - Hash de senhas
Cloudinary - Armazenamento de imagens
Multer - Upload de arquivos
Yup - Validação de schemas
Biome - Linter e formatador

📦 Instalação
Pré-requisitos

Node.js (v16 ou superior)
MongoDB
npm ou pnpm

Passo a passo

Clone o repositório

bashgit clone https://github.com/RondneyLoiola/connect_hub-backend.git
cd connect_hub-backend

Instale as dependências

bash# Com npm
npm install

# Com pnpm
pnpm install

Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto com as seguintes variáveis:
env# Database
MONGO_URL=mongodb://localhost:27017/connecthub

# JWT
JWT_SECRET=sua_chave_secreta_aqui

# Cloudinary
CLOUDINARY_CLOUD_NAME=seu_cloud_name
CLOUDINARY_API_KEY=sua_api_key
CLOUDINARY_API_SECRET=seu_api_secret

# Server
PORT=3000

Inicie o servidor

bash# Modo desenvolvimento (com hot reload)
npm run dev

# Modo produção
npm start
O servidor estará rodando em http://localhost:3000
🎯 Uso
Scripts Disponíveis
bash# Desenvolvimento com auto-reload
npm run dev

# Iniciar servidor em produção
npm start

# Verificar e corrigir código
npm run build

# Executar linter
npm run lint

# Formatar código
npm run format
📚 API Endpoints
🏥 Health Check
httpGET /health
Verifica se a API está funcionando.
👥 Autenticação
Registrar Usuário
httpPOST /users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
Login
httpPOST /sessions
Content-Type: application/json

{
  "email": "joao@email.com",
  "password": "senha123"
}
Resposta:
json{
  "user": {
    "id": "...",
    "name": "João Silva",
    "email": "joao@email.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
👤 Usuários
Listar Usuários
httpGET /users
Obter Usuário Logado
httpGET /me
Authorization: Bearer {token}
Atualizar Usuário
httpPUT /users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Novo Nome",
  "email": "novoemail@email.com"
}
Deletar Usuário
httpDELETE /users/:id
📝 Posts
Listar Todos os Posts
httpGET /posts
Listar Posts de um Usuário
httpGET /users/:userId/posts
Criar Post
httpPOST /posts
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "content": "Conteúdo do post",
  "file": [arquivo de imagem]
}
Atualizar Post
httpPUT /posts/:id
Authorization: Bearer {token}
Content-Type: multipart/form-data

{
  "content": "Novo conteúdo",
  "file": [arquivo de imagem]
}
Deletar Post
httpDELETE /posts/:id
Authorization: Bearer {token}
💬 Comentários
Listar Comentários de um Post
httpGET /posts/:postId/comments
Authorization: Bearer {token}
Contar Comentários
httpGET /posts/:postId/comments/count
Authorization: Bearer {token}
Criar Comentário
httpPOST /posts/:postId/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "content": "Ótimo post!"
}
Deletar Comentário
httpDELETE /posts/:postId/comments/:commentId
Authorization: Bearer {token}
❤️ Likes
Curtir Post
httpPOST /posts/:id/like
Authorization: Bearer {token}
Descurtir Post
httpDELETE /posts/:id/like
Authorization: Bearer {token}
Listar Posts Curtidos
httpGET /me/liked-posts
Authorization: Bearer {token}
🗂️ Estrutura do Projeto
connect_hub-backend/
├── src/
│   ├── app/
│   │   ├── controllers/      # Controladores da aplicação
│   │   │   ├── CommentsController.js
│   │   │   ├── PostController.js
│   │   │   ├── SessionController.js
│   │   │   └── UserController.js
│   │   ├── middlewares/      # Middlewares personalizados
│   │   │   └── auth.js
│   │   └── models/           # Modelos do MongoDB
│   │       ├── Comment.js
│   │       ├── Like.js
│   │       ├── Post.js
│   │       └── User.js
│   ├── config/               # Configurações
│   │   └── multer.cjs
│   ├── database/             # Configuração do banco
│   ├── app.js                # Configuração do Express
│   ├── routes.js             # Definição de rotas
│   └── server.js             # Inicialização do servidor
├── .env                      # Variáveis de ambiente (não versionado)
├── biome.json               # Configuração do Biome
├── package.json
└── README.md
🔒 Autenticação
A API utiliza JWT (JSON Web Tokens) para autenticação. Para acessar rotas protegidas, inclua o token no header:
Authorization: Bearer seu_token_aqui
Rotas públicas (sem autenticação):

GET /health
POST /users (registro)
POST /sessions (login)
GET /posts
GET /users/:userId/posts
GET /users

Rotas protegidas (requerem autenticação):

Todas as rotas de criação, edição e deleção
Comentários
Likes
Perfil do usuário (/me)

🧪 Validação de Dados
O projeto utiliza Yup para validação de dados. Exemplos de validações implementadas:

Email válido
Senha com mínimo de caracteres
Campos obrigatórios
Tipos de dados corretos

📄 Modelos de Dados
User
javascript{
  name: String,
  email: String (único),
  password: String (hash),
  createdAt: Date,
  updatedAt: Date
}
Post
javascript{
  content: String,
  imageUrl: String,
  userId: ObjectId (ref: User),
  likes: [ObjectId (ref: User)],
  createdAt: Date,
  updatedAt: Date
}
Comment
javascript{
  content: String,
  postId: ObjectId (ref: Post),
  userId: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
Like
javascript{
  postId: ObjectId (ref: Post),
  userId: ObjectId (ref: User),
  createdAt: Date
}
🤝 Contribuindo
Contribuições são sempre bem-vindas! Para contribuir:

Faça um Fork do projeto
Crie uma branch para sua feature (git checkout -b feature/MinhaFeature)
Commit suas mudanças (git commit -m 'Adiciona MinhaFeature')
Push para a branch (git push origin feature/MinhaFeature)
Abra um Pull Request

📝 Licença
Este projeto está sob a licença ISC.
👨‍💻 Autor
Rondney Oliveira Loiola

GitHub: @RondneyLoiola
Deploy: https://connect-hub-app.vercel.app/


<div align="center">
  Feito com ❤️ por Rondney Loiola
</div>
