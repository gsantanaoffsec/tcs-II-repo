# AdotaAí

Aplicativo mobile que conecta organizações de resgate animal a pessoas interessadas em adotar um pet.

Projeto desenvolvido progressivamente ao longo da disciplina de **Tópicos em Computação e Sistemas II**.

---

## Sobre o projeto

A adoção de animais depende hoje de canais informais — posts que somem no feed, grupos de WhatsApp e feiras presenciais. O **AdotaAí** centraliza esse catálogo: o adotante escolhe a cidade, filtra os animais por características e fala com a organização responsável em um toque; a organização mantém seus animais publicados em um painel próprio.

Documentação completa da proposta: [`/docs/proposta.md`](./docs/proposta.md)

---

## Etapa 02 implementada

Protótipo visual e navegável com **sete telas**, baseado na [proposta da Etapa 1](./docs/proposta.md) e nos requisitos da Etapa 2. Documentação da entrega: [docs/etapa-02.md](./docs/etapa-02.md).

- Seleção obrigatória de cidade e catálogo público sem login.
- Filtros opcionais de idade, porte e raça, detalhes e link para WhatsApp.
- Login e cadastro simulados de organização.
- Painel com pets da organização da sessão e formulário de novo pet.
- Componentes reutilizáveis, formulários validados com Zod e layout responsivo.

**Dados em memória:** alterações e sessão são descartadas ao recarregar o aplicativo. Os pets, organizações, endereços e telefones iniciais são fictícios. As imagens são ilustrações locais. O login é uma demonstração de navegação, sem segurança de produção.

**Conta de teste:** `demo@adotaai.com` / `adota123`. Organizações criadas na sessão entram com seu e-mail e a mesma senha pública `adota123`; a senha digitada no cadastro é validada, mas não armazenada. Não use dados ou credenciais reais.

---

## Etapa 03 implementada

A [documentação da Etapa 3](./docs/etapa-03.md) descreve a evolução de navegação, UX e acessibilidade:

- Menu inferior persistente com Início, Encontrar pets e Organização/Meu painel.
- Retorno com destino alternativo para rotas abertas diretamente e filtros preservados.
- Confirmações de descarte de formulário, saída da organização e abertura do WhatsApp.
- Feedback de sucesso, erros por campo, foco no primeiro campo inválido e estados de interação.
- Foco de teclado visível, títulos e rótulos acessíveis, regiões de anúncio e diálogos acessíveis.
- Alvos de toque ampliados e testes automatizados de contraste de texto.

A stack e os dados em memória da Etapa 2 foram mantidos. Não há autenticação de produção ou backend nesta etapa. A implementação oferece recursos para leitores de tela; a validação física com VoiceOver/TalkBack segue o roteiro documentado.

---

## Stack atual e planejada

### Mobile — `/app`

| Tecnologia | Papel |
|---|---|
| React Native + Expo | Framework mobile multiplataforma |
| TypeScript | Linguagem |
| Expo Router | Navegação baseada em arquivos |
| Axios + TanStack Query (futuro) | Consumo e cache da API |
| Zod | Validação de formulários |
| Expo SecureStore (futuro) | Armazenamento do token JWT |

### Backend previsto — `/api`

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
└── README.md
```

`api/` será criado na etapa de backend.

---

## Como executar

Pré-requisitos: Node.js **24 LTS**, npm e, para testar em dispositivo, Expo Go compatível com SDK 57 ou um emulador configurado. A versão web permite avaliar toda a interface sem configurar Android ou iOS.

```bash
cd app
npm ci
npm start
```

No terminal do Expo, pressione `w` para web, `a` para Android ou `i` para o simulador iOS (macOS com Xcode). Para iniciar diretamente no navegador:

```bash
npm run web
```

Verificações:

```bash
npm run typecheck
npm test
npm run export:web
npx expo install --check
```

O protótipo **não requer API, Docker, banco, variáveis de ambiente ou serviços externos**. `api/`, Axios, TanStack Query, SecureStore e ViaCEP são previstos para etapas futuras e ainda não foram implementados. A abertura opcional do WhatsApp requer rede e sai do aplicativo.

A exportação web fica em `app/dist`. Para hospedá-la, configure o servidor para encaminhar rotas como `/pets/luna` para `index.html` (SPA).

---

## Entregas da disciplina

| Etapa | Descrição | Tag | Status |
|---|---|---|---|
| 01 | Proposta e planejamento da aplicação | `etapa-01` | ✅ Entregue |
| 02 | Protótipo de interface navegável | `etapa-02` | ✅ Implementado |
| 03 | Navegação, UX e acessibilidade | `etapa-03` | ✅ Implementado |

---

## Convenções

- Commits no padrão [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:`, `chore:`).
- Cada entrega marcada com uma tag anotada do Git.
- Decisões técnicas e mudanças de escopo documentadas em `/docs`.

---

## Autor

**Gabriel Santana** — [@gsantanaoffsec](https://github.com/gsantanaoffsec)
