# Etapa 02 Implementação do protótipo de interface

**Projeto:** AdotaAí  
**Aluno:** Gabriel Santana  
**Disciplina:** Tópicos em Computação e Sistemas II  
**Repositório:** https://github.com/gsantanaoffsec/tcs-II-repo  
**Versão:** tag anotada `etapa-02`

## Escopo e relação com a proposta

Esta entrega transforma a proposta da Etapa 1 em uma interface React Native com Expo SDK 57, TypeScript e Expo Router. Foram implementadas as seis telas previstas e uma sétima tela para o formulário de pet. O foco é a camada visual e estrutural; não há servidor nem persistência. A [proposta original](./proposta.md) permanece como referência para o sistema completo.

A busca, filtros, cadastro de organização e inclusão de pet funcionam com dados em memória. Autenticação é simulada por contexto, sem JWT. As regras RN01 a RN07 são representadas no protótipo: cidade obrigatória, endereço e WhatsApp validados, pet vinculado à organização da sessão, contato por link externo e acesso ao painel condicionado à sessão de demonstração. A proteção de rotas não substitui autorização no servidor em etapas futuras.

## Telas implementadas

| Tela | Rota e arquivo em app/src/app | Comportamento |
|---|---|---|
| T1 Seleção de cidade | `/` · `(public)/index.tsx` | Cidade livre ou sugestões, validação obrigatória, busca e acesso de organização |
| T2 Listagem de pets | `/pets` · `(public)/pets/index.tsx` | Catálogo da cidade da organização, filtros combinados, contagem e estado vazio |
| T3 Detalhes do pet | `/pets/:id` · `(public)/pets/[id].tsx` | Ilustração, descrição, características, organização e botão de WhatsApp |
| T4 Login | `/sign-in` · `(auth)/sign-in.tsx` | Validação de e-mail e senha, erro de acesso e sessão simulada |
| T5 Cadastro de organização | `/sign-up` · `(auth)/sign-up.tsx` | Dados da organização, endereço completo, erros por campo e confirmação |
| T6 Painel da organização | `/dashboard` · `(org)/dashboard.tsx` | Contagem e lista dos próprios pets, estado vazio, novo pet e saída |
| Formulário de novo pet | `/pets/new` · `(org)/pets/new.tsx` | Cadastro em memória e retorno ao painel |

A rota estática `/pets/new` tem precedência sobre `/pets/:id`. O layout `(org)/_layout.tsx` redireciona visitantes sem sessão para o login. A rota `+not-found.tsx` oferece retorno ao início para caminhos inexistentes. Um identificador de pet desconhecido recebe uma mensagem própria.

## Componentes principais e reutilizáveis

`components/ui.tsx` reúne `Screen`, `Heading`, `Button`, `Field`, `Choices`, `Notice` e `Empty`. `Screen` fornece área segura, rolagem, cabeçalho, ação de voltar, suporte ao teclado no iOS e rodapé. `Field` reúne rótulo, entrada e mensagem de erro. `Choices` apresenta opções de toque com indicação de seleção. `Notice` comunica condições do protótipo, resultados e erros; `Empty` trata catálogos sem resultados.

`components/PetCard.tsx` apresenta ilustração, nome, características e acesso aos detalhes, sendo utilizado no catálogo e no painel. `theme/index.ts` centraliza a paleta; os estilos compartilhados são exportados por `ui.tsx`. `contexts/PrototypeContext.tsx` mantém organizações, pets, cidade e sessão. `data/models.ts` define tipos, filtro e montagem do link WhatsApp; `data/fixtures.ts` contém registros ilustrativos. `lib/validation.ts` concentra os schemas Zod.

## Entradas de dados

| Fluxo | Campos e validações |
|---|---|
| Busca | Cidade obrigatória; comparação ignora espaços nas extremidades, maiúsculas e acentos |
| Filtros | Idade e porte em opções fechadas, raça por texto parcial; todos opcionais e combináveis |
| Login | E-mail válido e senha com pelo menos seis caracteres; credenciais públicas de demonstração |
| Organização | Nome, e-mail, senha, WhatsApp com 55 + DDD + número, CEP de oito dígitos, UF válida, cidade, rua e número |
| Pet | Nome, espécie, raça, faixa etária, porte e descrição com pelo menos quinze caracteres |

A cidade do pet deriva da organização, nunca de um campo separado. E-mails são normalizados para minúsculas e não podem se repetir na sessão. Os campos de senha são ocultos visualmente. Os formulários mostram mensagens junto aos campos inválidos. Não há consulta de CEP nem upload nesta etapa; endereço é preenchido manualmente e uma ilustração local é atribuída pela espécie.

## Adaptação do layout e acessibilidade

- `useWindowDimensions` escolhe uma coluna abaixo de 560 px, duas entre 560 e 849 px e três a partir de 850 px.
- Conteúdo limitado a 1080 px, detalhes a 740 px e formulários a 560 px, centralizados em telas maiores.
- Larguras proporcionais, opções com quebra de linha e cabeçalho flexível evitam exigir uma largura fixa.
- Todas as telas têm rolagem vertical; o cadastro extenso continua acessível em telas menores.
- Área segura do dispositivo, ajuste de teclado no iOS, rótulos de entrada, botões com papel acessível, indicação de seleção e mensagens de erro acessíveis.
- Botões principais têm altura mínima de 52 px; controles de opção têm espaçamento para toque. Texto conserva a escala do sistema.

A interface pode ser executada em Android, iOS e web. A verificação desta entrega foi feita na web; execução física em Android/iOS deve ser conferida pelo aluno com Expo Go compatível ou emulador antes da apresentação.

## Execução

Requer Node.js 24 LTS e npm. A partir da raiz:

```bash
cd app
npm ci
npm start
```

Pressione `w` para navegador ou execute `npm run web`. Para Android, pressione `a`; para iOS, `i` em macOS com simulador configurado. Em aparelho físico, use Expo Go compatível com SDK 57 e o QR code do Expo. Se a versão instalada do Expo Go não aceitar SDK 57, avalie pela web ou use uma development build compatível.

Não é necessário configurar `.env`, API, banco ou Docker. Conta inicial: **demo@adotaai.com / adota123**. São Paulo tem quatro pets, Campinas e Curitiba têm um cada. Uma cidade sem registros exibe o estado vazio.

## Decisões de interface

O verde, fundo claro e espaçamento consistente reforçam acolhimento e legibilidade. A entrada pública destaca a escolha de cidade; o acesso de organizações aparece como ação secundária. Informações básicas ficam nos cards, enquanto descrição e contato ficam nos detalhes. Filtros permanecem visíveis em vez de exigir uma tela extra.

O formulário de pet recebeu uma rota própria para acomodar teclado, rolagem e navegação de retorno. O painel mostra somente animais da organização autenticada na demonstração. Estados vazios orientam a próxima ação, e resultados inválidos não são apresentados como sucesso.

As três ilustrações PNG são locais e produzidas para o protótipo, sem dependência de serviços de imagem. A tela de detalhes informa que os dados são fictícios e oferece confirmação antes de abrir o WhatsApp ilustrativo. O link inclui o telefone da organização e uma mensagem com o nome do pet; abrir o link não envia mensagem automaticamente.

## Simulação e próximos passos

Todas as contas de demonstração usam a senha pública `adota123`. No cadastro, a senha digitada é apenas validada e descartada; a interface explica isso antes e após o envio. Nenhuma senha de cadastro é armazenada. Uma atualização de página ou reinício apaga cadastros e sessão. Não há recuperação de senha, token, edição/exclusão de pets, upload, persistência, ViaCEP ou API nesta etapa.

A stack de backend da proposta continua prevista para etapas futuras, assim como Axios, TanStack Query e SecureStore. Não foram adicionados serviços sem uso ao protótipo. Quando a API existir, a simulação deve ser substituída por autenticação e autorização reais e armazenamento seguro do token.

## Verificação e roteiro de apresentação

```bash
npm run typecheck
npm test
npm run export:web
npx expo install --check
```

Os testes em `app/tests/prototype.test.ts` cobrem cidade obrigatória e relacionamento com a organização, filtros combinados, validação de cadastro, validação de pet e URL WhatsApp. O roteiro manual é:

1. Buscar sem cidade e observar a mensagem; escolher São Paulo e abrir o catálogo.
2. Combinar idade Adulto e porte Pequeno para encontrar Nina; limpar filtros.
3. Abrir um pet, conferir a organização e a ação de contato sem enviar mensagens ao telefone fictício.
4. Entrar com a conta inicial e conferir que pets de Campinas/Curitiba não aparecem no painel.
5. Cadastrar um pet, conferir retorno ao painel e presença na busca de São Paulo.
6. Sair, cadastrar outra organização, entrar com seu e-mail e `adota123` e conferir o painel vazio.
7. Cadastrar pet dessa organização e conferir que sua cidade controla a busca.
8. Recarregar a página e conferir descarte da sessão; tentar acessar `/dashboard` sem login.
9. Conferir layout estreito e largo, rolagem dos formulários e mensagens de validação.

## Resultados da verificação desta entrega

Checagem TypeScript e cinco testes automatizados passaram. A exportação de bundles web, Android e iOS foi concluída. Na web foram conferidos os fluxos de busca, filtros, detalhes, login, cadastro de organização, painel vazio e cadastro de pet, com inspeção visual em 390 px e largura de desktop. Os testes locais usaram Node.js 25.3; Node.js 24 LTS permanece o runtime recomendado pela proposta. A geração de bundles nativos não equivale à execução em aparelho físico.

A checagem online de compatibilidade do Expo passou após fixar TypeScript e os tipos React nas versões recomendadas pelo SDK. A instalação reportou 13 alertas moderados em dependências transitivas; as sugestões automáticas incluíam versões incompatíveis ou anteriores do Expo, portanto não foi aplicado `npm audit fix --force`. Esses alertas devem ser revistos na atualização da stack.

## Identificação da entrega

A entrega deve estar no mesmo repositório da Etapa 1, identificada pela tag anotada `etapa-02`. O código e esta documentação são a evidência principal; capturas, quando incluídas, são complementares. A tag identifica a versão desta etapa e não deve ser movida depois da entrega.
