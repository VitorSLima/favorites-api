# Decisões Arquiteturais

Este documento descreve as principais decisões técnicas tomadas durante o desenvolvimento da API de Favoritos, fornecendo insights sobre as tecnologias e práticas escolhidas.

## 1. Escolha do Framework: AdonisJS

**Decisão:** AdonisJS foi selecionado como o principal framework Node.js para a construção da API.

**Justificativa:**

- **Preferência da Empresa:** Esta escolha alinha-se com a preferência e expertise existentes da empresa em AdonisJS, facilitando a integração, manutenção e colaboração da equipe.
- **Robusto e Opinionado:** AdonisJS oferece uma estrutura robusta e opinionada, promovendo boas práticas e consistência em todo o código. Ele fornece recursos integrados para roteamento, ORM (Lucid), validação e autenticação, acelerando o desenvolvimento.
- **Escalabilidade:** Seu design modular e características de desempenho o tornam adequado para a construção de serviços de API escaláveis.

## 2. Conteinerização: Docker e Docker Compose

**Decisão:** A aplicação é conteinerizada usando Docker, com o Docker Compose orquestrando o ambiente multi-container.

**Justificativa:**

- **Requisito de Teste Técnico:** A conteinerização com Docker foi um requisito específico e um diferencial chave para a avaliação técnica, demonstrando proficiência em tecnologias de contêineres.
- **Consistência do Ambiente:** O Docker garante que os ambientes de desenvolvimento, teste e produção sejam consistentes, eliminando "funciona na minha máquina" problemas.
- **Isolamento:** Cada serviço (API, Banco de Dados) é executado em seu próprio contêiner isolado, prevenindo conflitos e simplificando o gerenciamento de dependências.
- **Facilidade de Implantação:** O Docker Compose simplifica a configuração e o desmantelamento de toda a pilha da aplicação com um único comando, tornando fácil para novos desenvolvedores começarem e para pipelines de implantação.

## 3. Documentação do Código: JSDoc / Docstrings

**Decisão:** JSDoc (docstrings) é amplamente utilizado para documentar funções, classes e métodos em todo o código.

**Justificativa:**

- **Legibilidade e Compreensão do Código:** Docstrings fornecem contexto e explicação imediatos para os elementos do código, tornando significativamente mais fácil para qualquer desenvolvedor entender o propósito, parâmetros e valores de retorno das funções sem a necessidade de aprofundar nos detalhes de implementação.
- **Manutenibilidade:** Código bem documentado é mais fácil de manter e depurar, pois a intenção por trás de cada parte da lógica é claramente articulada.
- **Onboarding:** Facilita muito o processo de integração para novos membros da equipe, permitindo que eles compreendam rapidamente a estrutura e a funcionalidade do código.
- **Geração Automática de Documentação:** Ferramentas como `adonis-autoswagger` (para endpoints de API) e outras podem aproveitar os comentários JSDoc para gerar automaticamente documentação abrangente, reduzindo o esforço manual e garantindo a precisão.

## 4. Banco de Dados: MySQL

**Decisão:** MySQL é utilizado como o banco de dados relacional para a aplicação.

**Justificativa:**

- **Confiabilidade e Maturidade:** MySQL é um sistema de gerenciamento de banco de dados relacional de código aberto amplamente adotado, maduro e confiável.
- **Integração com AdonisJS:** O ORM do AdonisJS, Lucid, oferece excelente suporte para MySQL, simplificando as interações e migrações do banco de dados.
- **Integração com Docker:** Facilmente integrado à configuração do Docker Compose, fornecendo um ambiente de banco de dados consistente.
