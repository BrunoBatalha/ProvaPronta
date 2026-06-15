# Recorte de Imagens das Atividades

## Objetivo

Permitir que a professora ajuste o enquadramento de cada imagem de atividade
antes de usá-la na prévia e no documento Word, mantendo uma experiência simples
e confortável no celular.

## Decisões de Produto

- Usar `react-easy-crop` para a interface interativa.
- Abrir o editor automaticamente após a seleção de uma imagem válida.
- Usar recorte de proporção livre.
- Permitir mover a imagem e alterar o zoom por gesto ou controle deslizante.
- Permitir reabrir o editor pelo botão `Editar recorte`.
- Preservar a imagem original enquanto ela permanecer vinculada à atividade.
- Usar a imagem recortada na prévia e na geração do DOCX.
- Manter todo o processamento local no navegador.
- Não incluir rotação, filtros, desenhos, textos ou compressão configurável.

Esta funcionalidade substitui, para imagens de atividades, a regra anterior de
não cortar imagens descrita em `docs/ABOUT.md`.

## Fluxo da Usuária

1. A professora seleciona uma imagem PNG, JPG ou JPEG.
2. A aplicação valida tipo e tamanho antes de processar o arquivo.
3. O editor de recorte abre automaticamente em uma sobreposição ampla.
4. A professora arrasta e amplia a imagem até obter o enquadramento desejado.
5. Ao escolher `Usar este recorte`, a aplicação gera uma nova imagem local.
6. A miniatura recortada aparece no cartão da atividade.
7. A professora pode editar o recorte, trocar ou remover a imagem.
8. A prévia e o DOCX usam a versão recortada.

Ao cancelar uma nova seleção, nenhuma imagem é adicionada. Ao cancelar a edição
de uma imagem já confirmada, o recorte anterior permanece inalterado.

## Arquitetura

### `ActivityImageUpload`

Responsável por selecionar o arquivo, mostrar a miniatura e expor as ações
`Editar recorte`, `Trocar imagem` e `Remover imagem`.

### `ImageCropEditor`

Responsável pela sobreposição de edição, integração com `react-easy-crop`,
estado temporário de posição e zoom, foco acessível e ações de cancelar ou
confirmar.

### `imageCropUtils`

Responsável por carregar a imagem original, aplicar no Canvas as coordenadas
produzidas pelo editor e gerar um `File` recortado. A saída deve limitar
dimensões excessivas para reduzir consumo de memória sem prejudicar a impressão.

### Modelo de atividade

Cada atividade poderá manter:

- o arquivo original;
- o arquivo recortado usado pelo restante da aplicação;
- a URL temporária da imagem original para o editor;
- a URL temporária da imagem recortada para a miniatura;
- os dados percentuais do último recorte para reabertura.

URLs criadas com `URL.createObjectURL` devem ser liberadas ao trocar ou remover
uma imagem e ao desmontar a aplicação.

## Comportamento no Celular

- A sobreposição deve ocupar a tela disponível.
- A área de edição deve permanecer grande o suficiente para gestos.
- Os botões devem ficar visíveis e ter área confortável para toque.
- O zoom deve funcionar por pinça e por controle deslizante.
- O conteúdo de fundo não deve rolar enquanto o editor estiver aberto.

## Acessibilidade

- A sobreposição deve ter título associado e comportamento de diálogo modal.
- O foco inicial deve ir para o editor ou seu primeiro controle.
- `Escape` e o botão `Cancelar` devem fechar sem salvar.
- O foco deve retornar ao controle que abriu o editor.
- Os botões devem ter textos claros e foco visível.
- Erros de processamento devem ser anunciados próximos ao upload.

## Erros e Limites

- Continuar aceitando somente PNG, JPG e JPEG.
- Continuar limitando a imagem original a 5 MB.
- Não abrir o editor para arquivos inválidos.
- Informar quando a imagem não puder ser carregada ou processada.
- Impedir a confirmação enquanto não houver coordenadas válidas de recorte.
- Preservar o recorte anterior quando uma reedição falhar ou for cancelada.

## Critérios de Aceite

- Selecionar uma imagem válida abre automaticamente o editor.
- A professora consegue mover e ampliar a imagem no celular.
- Confirmar cria e exibe a versão recortada.
- Cancelar não substitui uma imagem já confirmada.
- `Editar recorte` reabre a imagem original com o último enquadramento.
- `Trocar imagem` inicia o fluxo com um novo arquivo.
- `Remover imagem` limpa arquivos, dados do recorte e URLs temporárias.
- A prévia e o DOCX recebem o arquivo recortado.
- A interface continua em português do Brasil e navegável por teclado.
- O projeto compila com `pnpm build`.

## Fora do Escopo

- Recorte do cabeçalho do documento.
- Rotação e espelhamento.
- Filtros ou ajustes de cor.
- Texto, desenho ou marcações sobre a imagem.
- Histórico de edições.
- Processamento em servidor.
- Configuração manual de qualidade ou formato de saída.
