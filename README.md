# api-jwt-mongodb

## Descrição
Este é um exemplo de um servidor Node.js que fornece uma API básica para registro de usuários, autenticação com tokens JWT, e operações CRUD em postagens. O servidor utiliza o MongoDB para armazenar dados de usuários e postagens.

## Pré-requisitos
Certifique-se de ter o Node.js e o MongoDB instalados em sua máquina antes de executar o servidor.

## Instalação

1. Clone este repositório em sua máquina:

   ```bash
   git clone https://github.com/fvandrad/api-jwt-mongodb.git
   ```

2. Navegue até o diretório do projeto
  
   ```bash
   cd api-jwt-mongodb
   ```

3. Instale as dependências do projeto:

   ```bash
   npm install
   ```

4. Execute o aplicativo:

   ```bash
   node app.js
   ```

O aplicativo será executado e estará acessível em http://localhost:3000 (ou em outra porta configurada, se aplicável).

# Rotas da API
O servidor fornece as seguintes rotas da API:

### Registro de Usuário

   Rota: POST /register
   <br>Descrição: Registra um novo usuário com um nome de usuário e senha.
   Corpo da Requisição:

   ```bash
   json
   {
      "username": "seu_nome_de_usuario",
      "password": "sua_senha"
   }
   ```

### Login e Geração de Token JWT

Rota: POST /login

Descrição: Autentica um usuário e gera um token JWT válido.

Corpo da Requisição:

   ```bash
   json
   {
      "username": "seu_nome_de_usuario",
      "password": "sua_senha"
   }
   ```
   Resposta:

   ```bash
   json
   {
      "token": "seu_token_jwt"
   }
   ```

### Listar Postagens
   
Rota: GET /posts

Descrição: Retorna uma lista de postagens.

Cabeçalho da Requisição:

Authorization: Bearer seu_token_jwt

Resposta:

   ```bash
   json
   [
      {
         "_id": "ID_da_Postagem",
         "nome": "Nome da Postagem",
         "descricao": "Descrição da Postagem"
      },
      // Outras postagens
   ]
   ```

### Listar Postagem por ID

Rota: GET /posts/:id

Descrição: Retorna uma postagens.

Cabeçalho da Requisição:

Authorization: Bearer seu_token_jwt

Resposta:
   
   ```bash
   json
   [
      {
         "_id": "ID_da_Postagem",
         "nome": "Nome da Postagem",
         "descricao": "Descrição da Postagem"
      }
   ]
   ```

### Criar uma Nova Postagem

   Rota: POST /posts
   
   Descrição: Cria uma nova postagem.

   Cabeçalho da Requisição:

   Authorization: Bearer seu_token_jwt

   Corpo da Requisição:

   ```bash
   json
   {
   "nome": "Nome da Nova Postagem",
   "descricao": "Descrição da Nova Postagem"
   }
   ```

   Resposta
   
   ```bash
   json
   {
      "_id": "ID_da_Nova_Postagem",
      "nome": "Nome da Nova Postagem",
      "descricao": "Descrição da Nova Postagem"
   }
   ```

### Atualizar uma Postagem por ID

Rota: PUT /posts/:id

Descrição: Atualiza uma postagem existente com base em seu ID.

Cabeçalho da Requisição:

Authorization: Bearer seu_token_jwt

Parâmetros da Rota:

id: ID da postagem que você deseja atualizar.

Corpo da Requisição:
  
   ```bash
   json
   {
      "nome": "Novo Nome da Postagem",
      "descricao": "Nova Descrição da Postagem"
   }
   ```
   
   Resposta:

   ```bash
   json
   {
      "_id": "ID_da_Postagem_Atualizada",
      "nome": "Novo Nome da Postagem",
      "descricao": "Nova Descrição da Postagem"
   }
   ```

### Deletar uma Postagem por ID

Rota: DELETE /posts/:id

Descrição: Deleta uma postagem existente com base em seu ID.

Cabeçalho da Requisição:

Authorization: Bearer seu_token_jwt

Parâmetros da Rota:

id: ID da postagem que você deseja deletar.

Resposta:
   
   ```bash
   json
   {
      "message": "Postagem deletada com sucesso"
   }
   ```

## Observações

Certifique-se de substituir <sua_conexao> pela URL correta do seu banco de dados MongoDB e <seu_secreto> pelo seu segredo desejado no arquivo .env.

Para proteger as rotas, é necessário incluir o token JWT no cabeçalho da requisição com a chave Authorization: Bearer seu_token_jwt.

Este é um exemplo básico e pode ser expandido para atender às suas necessidades específicas.

Aproveite o uso deste servidor de exemplo para criar sua própria aplicação de autenticação e gerenciamento de postagens!