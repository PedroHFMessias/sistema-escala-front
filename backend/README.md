# Sistema de Escala - Backend

Este diretório contém uma sugestão de backend em Node.js/TypeScript para ser usado em conjunto com o frontend deste repositório. Caso deseje mantê-lo em um repositório separado, basta copiar o conteúdo da pasta `backend/` para um novo projeto Git e prosseguir com as instruções abaixo.

## Tecnologias

- [Node.js](https://nodejs.org/) + [TypeScript](https://www.typescriptlang.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/) com banco de dados MySQL
- [Zod](https://github.com/colinhacks/zod) para validação

## Requisitos

- Node.js 18+
- Banco de dados MySQL acessível

## Configuração do projeto

1. Copie o arquivo `.env.example` para `.env` e ajuste a variável `DATABASE_URL` para apontar para sua instância MySQL:

   ```bash
   cp .env.example .env
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Gere o client do Prisma e aplique as migrações (ajuste o nome da migração conforme desejar):

   ```bash
   npx prisma migrate dev --name init
   ```

4. Rode o servidor em ambiente de desenvolvimento:

   ```bash
   npm run dev
   ```

   O servidor ficará disponível em `http://localhost:3333` por padrão e expõe todos os endpoints sob o prefixo `/api`.

## Estrutura de rotas principais

| Método | Rota | Descrição |
| ------ | ---- | --------- |
| `GET` | `/api/users` | Lista usuários |
| `POST` | `/api/users` | Cria usuário (voluntário ou coordenador) |
| `GET` | `/api/ministries` | Lista ministérios |
| `POST` | `/api/ministries` | Cria ministério |
| `GET` | `/api/schedules` | Lista escalas |
| `POST` | `/api/schedules` | Cria nova escala |
| `PUT` | `/api/schedules/:scheduleId/volunteers/:volunteerId/status` | Atualiza status de participação de voluntário |
| `GET` | `/api/trade-requests` | Lista pedidos de troca |
| `POST` | `/api/trade-requests` | Cria pedido de troca |
| `PUT` | `/api/trade-requests/:id/status` | Atualiza status de pedido de troca |
| `GET` | `/api/reports` | Lista relatórios gerados |
| `POST` | `/api/reports` | Gera e salva novo relatório |

## Integração com o frontend

- O backend trabalha com os mesmos formatos de dados definidos em `src/types/index.ts` do frontend, fazendo automaticamente a conversão entre os enums utilizados pelo Prisma e as strings exibidas na interface.
- Utilize o arquivo `DATABASE_URL` para apontar para o banco de dados da sua aplicação. O Prisma criará e manterá as tabelas necessárias conforme o schema definido em `prisma/schema.prisma`.
- Para executar em produção, rode `npm run build` e depois `npm start`.

## Próximos passos sugeridos

- Implementar autenticação (JWT) para proteger os endpoints.
- Adicionar testes automatizados.
- Configurar CI/CD e pipeline de deploy.
