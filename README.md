# Iron Atlas API

Uma API completa para gerenciamento de musculação e fitness construída com Node.js, Express, TypeScript e Prisma.

## Funcionalidades

- 🔐 Sistema de Autenticação
- 👥 Gerenciamento de Contas (Treinador/Cliente)
- 📊 Acompanhamento do Progresso Corporal
- 🏋️ Programas de Treinamento
- 🥗 Planos Alimentares
- 💊 Protocolos Hormonais
- 📱 Sistema de Notificações
- 💳 Gerenciamento de Assinaturas

## Stack Tecnológica

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- Autenticação JWT
- Validação com Zod

## Pré-requisitos

- Node.js (v14 ou superior)
- Banco de Dados PostgreSQL
- npm ou pnpm

## Executando a Aplicação

### Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

### Produção

```bash
npm run build
npm start
# ou
pnpm build
pnpm start
```

## Endpoints da API

### Gerenciamento de Contas

- `GET /account` - Listar todas as contas
- `GET /account/:id` - Buscar conta por ID
- `PUT /account/:id` - Atualizar conta
- `DELETE /account/:id` - Excluir conta
- `GET /account/clients` - Listar clientes por ID do treinador

### Progresso Corporal

- `POST /body-progress` - Criar registro de progresso corporal
- `GET /body-progress` - Listar todos os registros de progresso
- `GET /body-progress/:id` - Buscar progresso específico
- `PUT /body-progress/:id` - Atualizar progresso
- `DELETE /body-progress/:id` - Excluir progresso

### Protocolos

- `GET /protocol` - Listar todos os protocolos
- `POST /protocol` - Criar novo protocolo
- `GET /protocol/:id` - Buscar protocolo por ID
- `PUT /protocol/:id` - Atualizar protocolo
- `DELETE /protocol/:id` - Excluir protocolo
