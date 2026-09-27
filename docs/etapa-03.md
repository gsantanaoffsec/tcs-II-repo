# Etapa 03 Navegação UX e acessibilidade

**Projeto:** AdotaAí  
**Aluno:** Gabriel Santana  
**Disciplina:** Tópicos em Computação e Sistemas II  
**Repositório:** https://github.com/gsantanaoffsec/tcs-II-repo  
**Entrega:** tag anotada `etapa-03`

Esta entrega evolui a interface da [Etapa 2](./etapa-02.md) com navegação persistente, prevenção de perda acidental de dados, feedback e medidas de acessibilidade. O fluxo permanece alinhado à [proposta](./proposta.md): adotantes usam a busca pública, enquanto organizações utilizam um painel protegido por uma sessão simulada. Não foi adicionado backend ou armazenamento persistente.

## Estrutura de navegação

Expo Router continua organizando as rotas em três grupos: `(public)`, `(auth)` e `(org)`. O Stack raiz fica em `app/src/app/_layout.tsx`; o Stack administrativo e a verificação de sessão ficam em `(org)/_layout.tsx`. Ambos observam a preferência de movimento reduzido para remover as transições quando solicitada pelo sistema.

`Screen`, em `app/src/components/ui.tsx`, oferece cabeçalho, botão de retorno e menu inferior fora da área de rolagem. O menu usa botões de navegação com estado selecionado, em vez de abas que exigiriam alterar a estrutura de rotas da proposta. Na web, possui o landmark `navigation` com nome “Navegação principal”.

| Mecanismo | Destino e comportamento |
|---|---|
| Início ou marca AdotaAí | `/`, seleção de cidade |
| Encontrar pets | `/pets` quando há cidade; `/` para escolher a cidade quando ela ainda não foi informada |
| Organização | `/sign-in` sem sessão |
| Meu painel | `/dashboard` com sessão |
| Voltar | Tela anterior da pilha; usa um destino coerente quando não há histórico interno |
| Card de pet | Abre `/pets/:id` |
| Cadastrar novo pet | Abre `/pets/new`, mantendo vínculo com a organização da sessão |

O menu indica a seção atual por texto, marcador, borda e `accessibilityState.selected`; a identificação não depende somente da cor. `/pets/new` pertence à seção Organização, apesar de compartilhar o prefixo das rotas públicas. A função `activeDestination` em `app/src/lib/navigation.ts` trata essa distinção.

As ações do menu utilizam `router.dismissTo`: retornam ao destino existente na pilha ou substituem a tela atual quando o destino não existe. Essa estratégia evita acumular cópias da mesma seção e assegura que um formulário descartado seja removido. A abertura de detalhes e formulários usa `push`; login usa `replace`. Salvar um pet retorna ao painel existente com `dismissTo`.

`fallbackRoute` fornece os retornos sem histórico: novo pet → painel, detalhes → catálogo, cadastro de organização → login e catálogo/login → início. Se o catálogo não possui cidade, redireciona ao início. Se uma rota administrativa não possui sessão, redireciona ao login. Pets inexistentes e rotas desconhecidas continuam com mensagens de recuperação.

## Telas e formas de acesso

| Tela | Arquivo em app/src/app | Acesso |
|---|---|---|
| Seleção de cidade | `(public)/index.tsx` | Abertura, marca ou menu Início |
| Catálogo | `(public)/pets/index.tsx` | Buscar na Home ou menu Encontrar pets |
| Detalhes | `(public)/pets/[id].tsx` | Card do catálogo ou do painel |
| Login | `(auth)/sign-in.tsx` | Sou uma organização ou menu Organização |
| Cadastro de organização | `(auth)/sign-up.tsx` | Criar conta no login |
| Painel | `(org)/dashboard.tsx` | Login válido de demonstração ou menu Meu painel |
| Novo pet | `(org)/pets/new.tsx` | Cadastrar novo pet no painel |

Fluxo público: início → cidade → catálogo → detalhes → confirmação de WhatsApp ou retorno ao catálogo. Fluxo administrativo: início → login → painel → novo pet → painel; o cadastro de organização é acessível pelo login e retorna a ele após confirmação.

## Feedback visual e prevenção de erros

- Login válido exibe mensagem no painel; cadastro de pet identifica o pet salvo; saída da organização confirma o encerramento da sessão no início. As mensagens ficam visíveis até serem fechadas, sem depender de um aviso temporário.
- Cadastro de organização mantém uma confirmação própria, explica a senha pública de demonstração e oferece retorno ao login.
- Erros aparecem junto dos campos, com prefixo “Erro”, borda e mensagem compreensível. `useValidationFeedback` registra a primeira falha de cada tentativa; `Field` leva o foco para ela. Corrigir um campo remove seu erro sem deslocar o foco durante a digitação.
- A contagem do catálogo é uma região de status e se atualiza ao combinar filtros. Idade, porte e raça ficam no contexto de sessão: voltar dos detalhes ou trocar de seção preserva a busca. Alterar a cidade reinicia os filtros para evitar restrições invisíveis de outra busca.
- Botões, opções, cards e menu distinguem pressionado, foco e seleção. Controles indisponíveis possuem estado desabilitado. Na abertura externa do WhatsApp, “Aguarde…” e `busy` impedem repetição da ação enquanto a promessa está pendente; uma falha apresenta mensagem e permite nova tentativa.
- `ConfirmDialog` pergunta antes de abrir o WhatsApp, sair da organização ou descartar um formulário. A opção inicial é “Continuar aqui”. Cancelar conserva os dados e retorna à tela; confirmar executa a ação solicitada.
- A proteção de formulários usa `usePreventRemove` do React Navigation incluído no Expo Router, cobrindo remoção de telas pela pilha, além da interceptação das ações de menu e retorno. Na web, `beforeunload` solicita o aviso nativo do navegador ao atualizar/fechar uma página com formulário alterado; a exibição desse aviso depende das regras do navegador e de interação prévia. Não existe recuperação persistente de rascunhos. O histórico Voltar/Avançar do navegador pode alterar a rota sem disparar a confirmação interna; essa limitação foi observada na verificação web. Para conservar um rascunho, use os controles internos e cancele o descarte.

## Decisões de UX e ergonomia

A Lei de Fitts orientou o aumento dos alvos e a redução do deslocamento entre ações frequentes. O menu inferior mantém as três seções principais em uma posição estável, próxima à região de alcance do polegar em celulares. Ele permanece disponível sem exigir rolar até o início ou final da tela.

Botões principais, retorno e confirmações têm altura mínima de 52 unidades lógicas. As opções têm largura e altura mínimas de 48; os itens do menu têm altura mínima de 56. O card inteiro abre os detalhes, sem exigir acertar apenas o texto “Conhecer”. Espaços de 8 unidades entre opções/menu e 16 entre cards reduzem a proximidade entre alvos diferentes.

As ações têm rótulos explícitos: Encontrar pets, Cadastrar novo pet, Salvar pet e Descartar e sair. Ações com consequência possuem confirmação; a opção que preserva os dados recebe o foco inicial. A área pública continua utilizável sem login, e a mensagem de simulação permanece visível para evitar confusão com uma conta real.

O layout mantém limites de largura, quebra de linha, rolagem e uma a três colunas. Com escala de fonte nativa maior que 1,3, o catálogo passa a uma coluna. A altura dos controles pode crescer com o texto; os diálogos têm conteúdo rolável. A tipografia respeita a ampliação do sistema, sem desativar `allowFontScaling`.

## Medidas de acessibilidade

**Leitores de tela.** Títulos usam papel de cabeçalho. Controles têm nomes claros, estados de seleção/desabilitado/ocupado e dicas quando a ação leva a um serviço externo. Os rótulos das opções incluem seu grupo, por exemplo “Porte: Pequeno”, para evitar opções “Todos” indistinguíveis. O card é um único alvo acessível com nome, espécie, idade, porte, raça e cidade; seu conteúdo decorativo não vira uma sequência duplicada de anúncios.

**Foco e teclado.** `useAccessibleFocus` leva o foco ao título quando uma tela ganha foco: na web, atualiza o título do documento e usa foco programático fora da sequência de Tab; nas plataformas nativas, usa a API de foco de acessibilidade. Os botões e campos possuem borda visível de foco. Na web, Tab e Shift+Tab percorrem os controles; Enter/Espaço acionam botões. O `Modal` do React Native Web mantém o foco dentro do diálogo e o restaura ao fechar; Escape cancela. No Android, `onRequestClose` trata o botão de voltar no diálogo. O botão Voltar da tela permanece acessível sem depender de um gesto.

**Formulários e anúncios.** Rótulos visíveis também identificam as entradas para tecnologia assistiva. Na web, erros usam `aria-invalid` e `aria-describedby`; Android recebe associação com `accessibilityLabelledBy` e dica de erro. Mensagens de falha têm papel de alerta. Feedback e contagem usam regiões de anúncio; avisos de resultado também utilizam `announceForAccessibility` no iOS. O documento web declara português do Brasil por `expo.web.lang` em `app/app.json`, e os títulos informam `accessibilityLanguage="pt-BR"`.

**Contraste.** A cor secundária de texto passou de `#65756A` para `#58695F`, após a verificação encontrar contraste insuficiente em avisos sobre fundo verde claro. O teste em `app/tests/accessibility.test.ts` calcula a luminância relativa e exige pelo menos 4,5:1 nos pares de texto da interface: corpo, legendas, cards, avisos, botões primários/secundários, erros e confirmação de saída/descarte. Foco e seleção também usam borda e marcador; falhas não são sinalizadas apenas com cor.

**Movimento e tamanho.** Os dois Stacks acompanham a preferência de movimento reduzido. Diálogos abrem sem animação. Há área segura do dispositivo, alvos ampliados, adaptação a fontes maiores e rolagem para campos ou mensagens longas.

Essas medidas representam suporte implementado, não uma declaração de conformidade integral WCAG nem uma garantia de comportamento idêntico em todas as tecnologias assistivas. O teste com leitores de tela físicos faz parte do roteiro abaixo.

Referências utilizadas: [acessibilidade no React Native](https://reactnative.dev/docs/accessibility), [contraste mínimo WCAG](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) e [tamanho mínimo de alvos WCAG](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). As dimensões adotadas no app são decisões de ergonomia em unidades lógicas, não uma equivalência automática entre medidas nativas e CSS.

## Execução e testes

Requer Node.js 24 LTS e npm. Na raiz do repositório:

```bash
cd app
npm ci
npm run web
```

Para dispositivo/emulador, execute `npm start`; use Expo Go compatível com SDK 57, `a` para Android ou `i` para iOS com ambiente configurado. A conta inicial é `demo@adotaai.com` / `adota123`. Contas cadastradas nesta sessão também usam a senha pública `adota123`; a senha digitada no cadastro é apenas validada e descartada. Não utilize credenciais reais.

```bash
npm run typecheck
npm test
npx expo install --check
npm run export:web
npx expo export --platform all
```

A exportação web exige um servidor com fallback de rotas para `index.html`. Não há necessidade de API, Docker ou `.env`.

### Roteiro de navegação e UX

1. Abrir o app e acessar Encontrar pets sem cidade: a seleção de cidade deve permanecer acessível.
2. Escolher São Paulo, abrir o catálogo, selecionar Adulto e Pequeno e conferir Nina como único resultado. Abrir detalhes e voltar; filtros e resultado devem permanecer.
3. Alternar pelo menu entre Início, catálogo e organização; conferir o marcador da seção atual. Mudar para Campinas e conferir reinício dos filtros.
4. No login, enviar campos vazios: conferir mensagens e foco no e-mail. Digitar um e-mail e verificar que o foco não salta para outro campo durante a correção.
5. Entrar com a conta de demonstração e verificar mensagem de sucesso e mudança do menu para Meu painel.
6. Abrir novo pet, preencher nome e tentar voltar ou usar o menu. Cancelar o descarte e conferir os dados preservados; depois confirmar e conferir saída do formulário.
7. Reabrir o formulário, preencher todos os campos válidos e salvar. O painel deve mostrar mensagem de sucesso e o novo card, sem solicitar descarte após salvar.
8. Sair da organização: primeiro cancelar, depois confirmar. Verificar mensagem no início e impedir acesso administrativo sem nova sessão.
9. Abrir cadastro de organização, preencher parcialmente e testar a confirmação de descarte. Finalizar um cadastro válido e retornar ao login.
10. Abrir um pet e solicitar WhatsApp. Conferir diálogo, cancelar por Escape/Continuar aqui e retornar ao mesmo botão. Não envie mensagens ao número fictício.
11. Abrir diretamente `/dashboard` e `/pets/new` sem sessão: esperar login. Abrir diretamente `/sign-up` e usar Voltar sem histórico interno: esperar login. Abrir um identificador inexistente: esperar mensagem de recuperação.
12. Conferir em 320/390 px e desktop: menu disponível, textos e botões sem recorte, rolagem dos formulários e alvos de toque separados.

### Roteiro de acessibilidade

- **Web com teclado:** usar Tab, Shift+Tab, Enter e Espaço sem mouse. Conferir foco visível, título ao mudar de tela e foco inicial/retorno dos diálogos. Verificar que o foco não escapa do diálogo com Tab.
- **VoiceOver em iPhone/iPad:** ativar o leitor manualmente, percorrer título, entradas, opções, cards e menu. Conferir nomes, estados, mensagem de erro, sucesso e isolamento do diálogo. Avaliar com texto ampliado e movimento reduzido.
- **TalkBack em Android:** ativar manualmente e repetir os fluxos. Conferir associação dos rótulos, leitura das opções selecionadas, contagem dos filtros e botão Voltar do sistema para formulário alterado e diálogo.
- **Web com leitor de tela:** repetir a navegação com VoiceOver/NVDA, conferir landmark Navegação principal, campos inválidos e regiões de status.

## Verificação realizada

A checagem TypeScript passou, assim como os oito testes automatizados de regras de busca, formulários, link WhatsApp, contraste, identificação de seção e destinos de retorno. A exportação de bundles web, Android e iOS foi concluída. A execução local utilizou Node.js 25.3; Node.js 24 LTS continua como runtime recomendado pela proposta.

No navegador foram conferidos: filtros e retorno dos detalhes, foco no título e no primeiro campo inválido, preservação de dados ao cancelar o descarte, remoção do rascunho ao confirmar, cadastro de pet com feedback, confirmação de saída, acesso direto protegido e retorno sem histórico. Escape cancelou o diálogo de WhatsApp, Tab permaneceu no diálogo de saída e o foco retornou ao controle de origem. A inspeção da árvore acessível identificou nomes dos controles, títulos e diálogos. O HTML exportado declarou `lang="pt-BR"`.

O layout foi inspecionado em 320, 390 e 1024 px, incluindo menu persistente, quebra de texto e controles. Em 390 px, os três alvos do menu tinham altura de 56 px e largura aproximada de 116 px. Não foi executado teste físico com VoiceOver/TalkBack nem certificação WCAG; os roteiros acima permitem complementar a avaliação.

## Limitações

Dados, sessão, cidade e filtros permanecem em memória e são descartados ao reiniciar. A proteção de acesso é uma simulação de navegação, não autorização de produção. WhatsApp é um serviço externo; a abertura depende do dispositivo e rede, e o aplicativo não envia mensagens automaticamente. Antes da apresentação, executar o roteiro em aparelho real com VoiceOver/TalkBack; uma árvore de acessibilidade inspecionada no navegador não substitui essa avaliação.

Os alertas moderados transitivos da stack Expo registrados na Etapa 2 continuam como item para atualização futura; não foi alterada a stack com downgrade automático.

## Identificação da entrega

O commit desta etapa será identificado pela tag anotada `etapa-03` no mesmo repositório das etapas anteriores. A documentação histórica da Etapa 2 e sua tag permanecem preservadas; o README aponta para esta evolução. A avaliação pode localizar os mecanismos diretamente nos componentes e hooks citados.
