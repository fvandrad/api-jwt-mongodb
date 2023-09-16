const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
const secreto = "secreto";

// Conectar ao MongoDB (substitua 'sua_conexao' pela URL do seu banco de dados)
mongoose.connect('mongodb://localhost:27017/mymongo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors()); 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Definir um modelo de usuário simples no Mongoose
const User = mongoose.model('User', {
  username: String,
  password: String,
});

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'Usuário registrado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar o usuário' });
  }
});

// Rota de login e geração de token JWT
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Usuário não encontrado' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const token = jwt.sign({ username }, secreto, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

const verificarToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    jwt.verify(token, secreto);
    next(); // Continue para a próxima rota se o token for válido
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};

const PostSchema = new mongoose.Schema({
  nome: String,
  descricao: {},
});
const Post = mongoose.model('posts', PostSchema);


app.get('/posts', verificarToken, async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    console.error('Erro ao listar itens:', err);
    res.status(500).json({ error: 'Erro ao listar itens' });
  }
});

// Rota para criar uma nova postagem
app.post('/posts', verificarToken, async (req, res) => {
  try {
    const { nome, descricao } = req.body; // Certifique-se de que seu corpo de requisição inclua 'nome' e 'descricao'

    // Crie uma nova postagem usando o modelo 'Post'
    const novaPostagem = new Post({ nome, descricao });

    // Salve a nova postagem no banco de dados
    const postagemSalva = await novaPostagem.save();

    res.status(201).json(postagemSalva); // Retorna a postagem criada com sucesso
  } catch (err) {
    console.error('Erro ao criar postagem:', err);
    res.status(500).json({ error: 'Erro ao criar postagem' });
  }
});

// Rota para atualizar uma postagem por ID
app.put('/posts/:id', verificarToken, async (req, res) => {
  try {
    const postId = req.params.id;
    const { nome, descricao } = req.body; // Certifique-se de que seu corpo de requisição inclua 'nome' e 'descricao'

    // Verifique se a postagem com o ID fornecido existe
    const postagemExistente = await Post.findById(postId);

    if (!postagemExistente) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    // Atualize os campos da postagem com os novos valores
    postagemExistente.nome = nome;
    postagemExistente.descricao = descricao;

    // Salve as alterações no banco de dados
    const postagemAtualizada = await postagemExistente.save();

    res.json(postagemAtualizada); // Retorna a postagem atualizada
  } catch (err) {
    console.error('Erro ao atualizar postagem:', err);
    res.status(500).json({ error: 'Erro ao atualizar postagem' });
  }
});

// Rota para deletar uma postagem por ID
app.delete('/posts/:id', verificarToken, async (req, res) => {
  try {
    const postId = req.params.id;

    // Verifique se a postagem com o ID fornecido existe
    const postagemExistente = await Post.findById(postId);

    if (!postagemExistente) {
      return res.status(404).json({ error: 'Postagem não encontrada' });
    }

    // Delete a postagem do banco de dados usando o método 'deleteOne'
    await Post.deleteOne({ _id: postId });

    res.json({ message: 'Postagem deletada com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar postagem:', err);
    res.status(500).json({ error: 'Erro ao deletar postagem' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
