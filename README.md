# API de Favoritos

Este projeto implementa uma API simples para gerenciar favoritos de clientes, construída com AdonisJS e conteinerizada usando Docker.

## Pré-requisitos

Antes de começar, certifique-se de ter o seguinte instalado em sua máquina:

- [Node.js](https://nodejs.org/en/download/) (versão LTS recomendada)
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Configuração

1.  **Clone o repositório:**

    ```bash
    git clone <url-do-repositorio>
        cd favorites-api
    ```

2.  **Variáveis de Ambiente:**

    Crie um arquivo `.env` na raiz do projeto copiando o arquivo `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Atualize as variáveis em `.env` conforme necessário, especialmente para a conexão com o banco de dados.

3.  **Instalar Dependências:**

    Instale as dependências do Node.js:

    ```bash
    npm install
    ```

## Executando a Aplicação

Para iniciar a aplicação e seus serviços (API e Banco de Dados) usando Docker Compose:

```bash
docker-compose up --build
```

Este comando irá:

- Construir as imagens Docker (se ainda não foram construídas ou se houver alterações detectadas).
- Iniciar o serviço de banco de dados.
- Iniciar o serviço da API AdonisJS.
- Executar as migrações do banco de dados.

## Documentação da API (Swagger)

Uma vez que a aplicação esteja em execução, você pode acessar a documentação interativa da API (Swagger UI) em:

[http://localhost:3333/docs](http://localhost:3333/docs)

## Principais Endpoints

- **Autenticação:**
  - `POST /auth/register`
  - `POST /auth/login`
- **Clientes:**
  - `GET /customers`
  - `GET /customers/:id`
  - `POST /customers`
  - `PUT /customers/:id`
  - `DELETE /customers/:id`
- **Favoritos:**
  - `GET /customers/:customerId/favorites`
  - `POST /customers/:customerId/favorites`
  - `DELETE /customers/:customerId/favorites/:productId`
