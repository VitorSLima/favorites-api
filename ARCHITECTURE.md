# Decisões Arquiteturais

Registro das principais decisões técnicas da API de Favoritos.

## 1. Framework: AdonisJS
- **Decisão:** Uso do AdonisJS como framework Node.js.  
- **Motivos:**  
  - Alinhado à expertise da equipe.  
  - Estrutura robusta e opinionada com recursos integrados (roteamento, ORM, validação, autenticação).  
  - Modular e escalável.

## 2. Conteinerização: Docker + Docker Compose
- **Decisão:** Aplicação conteinerizada com Docker e orquestrada pelo Docker Compose.  
- **Motivos:**  
  - Atende requisito técnico do projeto.  
  - Garante consistência entre ambientes.  
  - Isola serviços (API, banco de dados).  
  - Facilita configuração e implantação.

## 3. Documentação
- **Código:** Uso de **JSDoc** para documentar funções, classes e métodos, facilitando manutenção e onboarding.  
- **API:** Uso de **Swagger** (adonis-autoswagger) para documentar endpoints, permitindo geração e atualização automáticas.

## 4. Banco de Dados: MySQL
- **Decisão:** MySQL como banco relacional.  
- **Motivos:**  
  - Confiável e amplamente adotado.  
  - Suporte total no ORM Lucid do AdonisJS.  
  - Fácil integração com Docker Compose.
