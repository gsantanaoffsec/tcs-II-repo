# AdotaAí

Aplicativo mobile que conecta organizações de resgate animal a pessoas interessadas em adotar um pet.

Projeto desenvolvido progressivamente ao longo da disciplina de **Tópicos em Computação e Sistemas II**.

---

## Sobre o projeto

A adoção de animais depende hoje de canais informais — posts que somem no feed, grupos de WhatsApp e feiras presenciais. O **AdotaAí** centraliza esse catálogo: o adotante escolhe a cidade, filtra os animais por características e fala com a organização responsável em um toque; a organização mantém seus animais publicados em um painel próprio.

Documentação completa da proposta: [`/docs/proposta.md`](./docs/proposta.md)

---

## Funcionalidades previstas

**Adotante (sem login)**

- [ ] Selecionar a cidade da busca
- [ ] Listar pets disponíveis na cidade
- [ ] Filtrar por idade, porte e raça
- [ ] Ver detalhes de um pet
- [ ] Contatar a organização via WhatsApp

**Organização (com login)**

- [ ] Cadastro de organização
- [ ] Login com e-mail e senha
- [ ] Cadastrar um novo pet
- [ ] Listar os pets da própria organização

---

## Stack

### Mobile — `/app`

| Tecnologia | Papel |
|---|---|
| React Native + Expo | Framework mobile multiplataforma |
| TypeScript | Linguagem |
| Expo Router | Navegação baseada em arquivos |
| Axios + TanStack Query | Consumo e cache da API |
| Zod | Validação de formulários |
| Expo SecureStore | Armazenamento do token JWT |

### Backend — `/api`

| Tecnologia | Papel |
|---|---|
| Node.js 24 LTS | Runtime |
| Fastify 5 | Framework HTTP |
| Prisma 6 | ORM e migrations |
| PostgreSQL 16 (Docker) | Banco de dados |
| Zod 4 | Validação |
| `@fastify/jwt` + bcryptjs | Autenticação |
| Vitest 3 + Supertest | Testes unitários e e2e |

---

## Estrutura do repositório

```
tcs-II-repo/
├── docs/          # documentação de cada etapa da disciplina
├── app/           # aplicação mobile (React Native + Expo)
├── api/           # backend (Node.js + Fastify + Prisma)
└── README.md
```

---

## Como executar

> As instruções serão preenchidas conforme o código de cada parte for implementado nas próximas etapas.

### Backend

```bash
cd api
npm install
docker compose up -d          # sobe o PostgreSQL
npx prisma migrate dev        # aplica as migrations
npm run dev
```

### Mobile

```bash
cd app
npm install
npx expo start
```

> O banco de dados **não** é versionado. Cada máquina que clonar o projeto sobe o próprio container e aplica as migrations sobre um banco vazio.

---

## Entregas da disciplina

| Etapa | Descrição | Tag | Status |
|---|---|---|---|
| 01 | Proposta e planejamento da aplicação | `etapa-01` | ✅ Entregue |
| 02 | — | `etapa-02` | ⏳ |
| 03 | — | `etapa-03` | ⏳ |

---

## Convenções

- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada entrega marcada com uma tag anotada do Git.
- Decisões técnicas e mudanças de escopo documentadas em `/docs`.

---

## Autor

**Gabriel Santana** — [@gsantanaoffsec](https://github.com/gsantanaoffsec)
