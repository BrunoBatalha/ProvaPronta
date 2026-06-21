# AGENTS.md

## Projeto

O ProvaPronta e uma aplicacao web para professoras criarem atividades
escolares e baixarem um arquivo `.docx` editavel.

A fonte de verdade para escopo, regras de produto, UX e criterios de aceite e
`docs/ABOUT.md`. Consulte esse documento antes de implementar funcionalidades
ou tomar decisoes que alterem o comportamento do produto.

O fluxo principal deve permanecer simples:

```txt
Preencher dados -> adicionar atividades -> gerar Word
```

## Estado atual

- O projeto ainda esta proximo do template inicial do Vite.
- A stack instalada atualmente e React 19, TypeScript 6 e Vite 8.
- O gerenciador de pacotes do repositorio e `pnpm`.
- TailwindCSS, React Hook Form, Zod, `docx` e `file-saver` constam no
  planejamento, mas nao devem ser considerados instalados antes de verificar
  `package.json`.
- Nao presuma que a estrutura sugerida em `docs/ABOUT.md` ja existe. Crie
  pastas e abstracoes apenas quando forem necessarias para a tarefa.

## Regras de produto

- O MVP deve funcionar inteiramente no navegador.
- Nao adicionar backend, banco de dados, login, upload para servidor ou
  armazenamento remoto sem solicitacao explicita.
- O arquivo final deve ser um `.docx` real e editavel, nao PDF ou imagem.
- Textos do documento devem continuar editaveis em Word ou LibreOffice.
- Imagens devem manter a proporcao e caber na largura util da pagina.
- Nao transformar a aplicacao em um editor visual semelhante ao Word.
- Evitar configuracoes avancadas, menus extensos e opcoes fora do MVP.
- Antes de ampliar o escopo, confirmar que a mudanca ajuda a professora a
  gerar o documento mais rapidamente.

## Publico e UX

- Escrever toda a interface em portugues do Brasil.
- Usar textos curtos, claros e nao tecnicos.
- Priorizar usuarias com pouca familiaridade com tecnologia.
- Manter o fluxo guiado, com uma acao principal evidente por etapa.
- Exibir feedback visual para upload, validacao, carregamento, sucesso e erro.
- Nao usar apenas cor para comunicar estado ou erro.
- Todo campo deve possuir label associado.
- Garantir foco visivel e navegacao por teclado.
- Botoes e campos interativos devem ter area confortavel para toque.
- A interface deve funcionar primeiro em celular e continuar confortavel em
  tablet e desktop.
- No desktop, a previa pode ficar ao lado do formulario. Em telas menores,
  deve ser empilhada abaixo do conteudo principal.

## Diretrizes de implementacao

- Usar componentes funcionais e hooks do React.
- Manter TypeScript estrito; nao introduzir `any` sem justificativa concreta.
- Modelar os dados de formulario e atividades com tipos explicitos.
- Separar responsabilidades de interface, validacao, manipulacao de imagens e
  geracao do DOCX.
- Manter `App.tsx` como composicao da pagina, evitando concentrar nele toda a
  regra de negocio.
- Colocar componentes reutilizaveis em `src/components`, utilitarios puros em
  `src/lib`, tipos compartilhados em `src/types` e schemas em `src/schemas`
  quando essas areas passarem a existir.
- Preferir funcoes puras para transformacoes usadas na geracao do documento.
- Liberar URLs criadas com `URL.createObjectURL` quando previews forem
  substituidos, removidos ou desmontados.
- Validar tipo e tamanho de arquivos antes de processa-los.
- Nao adicionar dependencia sem verificar se a plataforma web ou uma
  dependencia existente ja resolve o problema.
- Preservar o React Compiler configurado em `vite.config.ts`; nao adicionar
  memoizacao manual sem necessidade medida ou comportamento comprovado.

## Regras do formulario

- Nome da escola e nome da professora sao obrigatorios.
- Deve existir pelo menos uma atividade.
- Cada atividade precisa de enunciado e imagem.
- Aceitar somente imagens PNG, JPG e JPEG.
- Considerar como referencia inicial: logo de ate 2 MB, imagem de atividade de
  ate 5 MB e ate 15 atividades.
- Campos opcionais devem permanecer opcionais no formulario e no documento.
- Mensagens de erro devem ficar proximas ao campo correspondente e explicar
  como corrigir o problema.

## Geracao de DOCX

A geracao do documento e a parte de maior risco tecnico. Mantenha a
implementacao separada por responsabilidades e preserve as regras descritas
neste documento e em `docs/ABOUT.md`.

## Estilos

- Reutilizar os tokens e a direcao visual descritos em `docs/ABOUT.md`.
- Manter aparencia limpa, moderna, leve e escolar sem ser infantil.
- Evitar cores em excesso, texto pequeno, campos apertados e botoes pequenos.
- Preferir CSS organizado por componente ou por responsabilidade.
- Nao manter estilos do template do Vite quando a tela correspondente for
  substituida.
- Nao adicionar suporte a tema escuro sem uma solicitacao de produto.

## Comandos

Execute os comandos a partir da raiz do projeto:

```bash
pnpm install
pnpm dev
pnpm lint
pnpm build
pnpm preview
```

Use `pnpm`, nao `npm` ou `yarn`, para manter `pnpm-lock.yaml` consistente.

## Validacao antes de concluir

- Executar `pnpm build`.
- O agente deve apenas desenvolver a alteracao solicitada e validar que o
  projeto compila com sucesso.
- Nao executar testes automatizados, testes manuais, `pnpm lint` ou validacoes
  adicionais, salvo solicitacao explicita da usuaria.

## Escopo e manutencao

- Fazer alteracoes pequenas e diretamente relacionadas a tarefa.
- Nao implementar itens da secao de melhorias futuras por antecipacao.
- Nao reformatar ou refatorar arquivos sem relacao com a mudanca.
- Atualizar `docs/ABOUT.md` apenas quando houver uma decisao explicita de
  produto que altere o escopo documentado.
- Ao encontrar divergencia entre o codigo e `docs/ABOUT.md`, sinalizar a
  divergencia e preservar a regra documentada, salvo instrucao contraria.

## Perguntas ao usuario

Quando uma pergunta mudar uma decisao de produto, implementacao, escopo ou UX,
o agente deve aguardar a resposta da usuaria. Nao usar auto-resolucao por tempo
nem assumir respostas padrao apos timeout.
