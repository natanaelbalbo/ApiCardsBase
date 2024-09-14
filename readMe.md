# Documentação da API de Cartas

## 1. Cards

- Todos os cards estão armazenados no arquivo `cards.json`, sendo usados na construção de baralhos.
- As cartas podem ser acessadas pela rota de listagem dos 100 cards.

### **Rota: Trazer os 100 cards**
- **Rota**: `/cards`
- **Método**: `GET`
- **Descrição**: Retorna uma lista com os 100 cards disponíveis.

### Exemplo de requisição:

GET /cards

---

## 2. Autenticação e Autorização

O sistema de autenticação utiliza **JWT (JSON Web Tokens)**. Apenas **usuários autenticados** podem criar e editar seus baralhos, garantindo que cada usuário só possa modificar os baralhos que ele criou.

### **Rota: Registro de Usuário**
- **Rota**: `/register`
- **Método**: `POST`
- **Descrição**: Cria um novo usuário.

### Exemplo de requisição:

POST /register
{
  "username": "novoUsuario",
  "password": "senhaSegura"
}

### **Rota: Login**
- **Rota**: `/login`
- **Método**: `POST`
- **Descrição**: Faz login e retorna um token JWT que será usado para autenticação nas próximas requisições.

### Exemplo de requisição:

POST /login
{
  "username": "usuarioExistente",
  "password": "senhaSegura"
}

### Exemplo de resposta (Login bem-sucedido):

{
  "token": "seu-token-jwt"
}

---

## 3. Baralhos

Os baralhos são compostos de um **comandante** e **99 cartas**, que são associadas ao usuário autenticado. Apenas o dono do baralho pode editá-lo.

### **Rota: Criar um Baralho**
- **Rota**: `/decks`
- **Método**: `POST`
- **Autenticação**: Requer JWT (Autenticação necessária)
- **Descrição**: Cria um novo baralho para o usuário autenticado.

### Exemplo de requisição:

POST /decks
Authorization: Bearer <seu-token-jwt>
{
  "commanderId": "id-do-comandante",
  "cardIds": [
    "id-carta1",
    "id-carta2",
    "...",
    "id-carta99"
  ]
}

### **Rota: Editar um Baralho**
- **Rota**: `/decks/:id`
- **Método**: `PUT`
- **Autenticação**: Requer JWT (Autenticação e autorização necessárias)
- **Descrição**: Edita o baralho do usuário autenticado. Apenas o dono do baralho pode editá-lo.

### Exemplo de requisição:

PUT /decks/:id
Authorization: Bearer <seu-token-jwt>
{
  "commanderId": "id-do-novo-comandante",
  "cardIds": [
    "id-carta1",
    "id-carta2",
    "...",
    "id-carta99"
  ]
}

---

## 4. Autorização e Middleware

O sistema de **autorização** garante que apenas **usuários autenticados** podem criar e editar seus baralhos. A API valida se o **usuário autenticado** é o dono do baralho antes de permitir a edição. Para todas as rotas protegidas, você precisa incluir o **token JWT** no header da requisição.

### Header de Autenticação:

Authorization: Bearer <seu-token-jwt>

---

## 5. Testes

A API contém **testes automatizados** para verificar:
- Regras de negócio.
- Validação de endpoints.
- Funcionamento geral da API.

### Como Rodar os Testes:

Para rodar os testes automatizados, utilize o seguinte comando:

npm test

Isso irá executar os testes implementados para garantir que a API funcione corretamente e que os endpoints estejam protegidos e operando conforme esperado.
