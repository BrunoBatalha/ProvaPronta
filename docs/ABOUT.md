# ProvaPronta — Gerador de Atividades Escolares em DOCX

## 1. Visão Geral

O **ProvaPronta** é um sistema web simples para gerar documentos `.docx` editáveis a partir de um template fixo de prova ou atividade escolar.

O objetivo principal é permitir que professoras criem rapidamente uma folha de atividade com:

* Cabeçalho horizontal do documento;
* Dados básicos da escola e da prova;
* Nome da diretora;
* Nome da professora;
* Nome do aluno;
* Turma/série;
* Data;
* Lista de atividades;
* Enunciado de cada atividade;
* Imagem da atividade abaixo do enunciado;
* Download final em `.docx` editável.

O sistema deve funcionar **100% localmente no navegador**, sem necessidade inicial de backend, banco de dados, login ou armazenamento de arquivos.

---

## 2. Objetivo do Produto

Criar uma ferramenta de uso único, simples e direta, voltada para professoras que desejam montar rapidamente atividades escolares em formato Word.

A usuária não deve precisar entender de tecnologia, edição avançada de documentos ou ferramentas complexas.

A experiência esperada é:

```txt
Preencher dados → adicionar atividades → enviar imagens → gerar documento Word
```

O arquivo final deve ser baixado como `.docx` e poderá ser editado posteriormente no Word, LibreOffice ou outro editor compatível.

---

## 3. Público-Alvo

O sistema é destinado principalmente a:

* Professoras da educação infantil;
* Professoras do ensino fundamental inicial;
* Coordenadoras pedagógicas;
* Escolas pequenas;
* Pessoas que criam atividades impressas para crianças;
* Usuárias com pouco domínio técnico.

### Características importantes do público

A interface deve considerar que muitas usuárias:

* Não têm familiaridade com sistemas complexos;
* Podem usar notebook simples;
* Podem usar celular;
* Preferem fluxos guiados;
* Precisam de botões claros;
* Precisam de confirmação visual ao enviar imagens;
* Podem se confundir com excesso de opções;
* Querem apenas montar e baixar o documento.

---

## 4. Princípio Central de UX

A usuária não deve sentir que está usando um editor de documentos.

Ela deve sentir que está usando um assistente simples para montar uma atividade escolar.

### Frase-guia do produto

> “Preencha os dados, adicione as atividades e baixe em Word.”

---

## 5. Escopo do MVP

A primeira versão deve conter apenas o necessário para gerar o documento `.docx`.

### Incluído no MVP

* Site em React;
* Funcionamento local no navegador;
* Upload do cabeçalho horizontal do documento;
* Campos de dados da escola;
* Campos de dados da prova;
* Lista dinâmica de atividades;
* Upload de imagem para cada atividade;
* Geração de arquivo `.docx`;
* Download do arquivo;
* Documento final editável;
* Imagens ocupando a largura útil da página;
* Interface simples, moderna e responsiva.

### Fora do MVP

Não implementar inicialmente:

* Login;
* Cadastro de usuários;
* Banco de dados;
* Histórico de documentos;
* Salvamento automático;
* Compartilhamento por link;
* Planos pagos;
* Controle de assinatura;
* Área administrativa;
* Editor visual estilo Word;
* Escolha avançada de fonte, margem ou cor;
* Controle manual de quebra de página;
* Biblioteca de imagens;
* Templates múltiplos;
* Upload para servidor.

---

## 6. Stack Recomendada

### Tecnologias principais

```txt
Vite
React
TypeScript
TailwindCSS
React Hook Form
Zod
docx
file-saver
```

### Responsabilidade de cada tecnologia

| Tecnologia      | Uso                                           |
| --------------- | --------------------------------------------- |
| Vite            | Criação e build do projeto React              |
| React           | Interface do usuário                          |
| TypeScript      | Tipagem dos dados e maior segurança no código |
| TailwindCSS     | Estilização rápida e consistente              |
| React Hook Form | Controle dos formulários                      |
| Zod             | Validação dos campos                          |
| docx            | Geração do arquivo `.docx`                    |
| file-saver      | Download do arquivo gerado                    |

---

## 7. Instalação Inicial

Criar o projeto com Vite:

```bash
npm create vite@latest prova-pronta
```

Selecionar:

```txt
React
TypeScript
```

Instalar dependências principais:

```bash
npm install docx file-saver react-hook-form zod @hookform/resolvers
```

Instalar TailwindCSS:

```bash
npm install tailwindcss @tailwindcss/vite
```

---

## 8. Estrutura Sugerida do Projeto

```txt
src/
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── FileUpload.tsx
│   │   ├── FormSection.tsx
│   │   └── Card.tsx
│   │
│   ├── school/
│   │   └── SchoolInfoForm.tsx
│   │
│   ├── exam/
│   │   └── ExamInfoForm.tsx
│   │
│   ├── activities/
│   │   ├── ActivityList.tsx
│   │   └── ActivityCard.tsx
│   │
│   ├── preview/
│   │   └── DocumentPreview.tsx
│   │
│   └── layout/
│       ├── AppHeader.tsx
│       └── AppShell.tsx
│
├── lib/
│   ├── generateDocx.ts
│   ├── imageUtils.ts
│   └── fileUtils.ts
│
├── schemas/
│   └── documentSchema.ts
│
├── types/
│   └── document.ts
│
├── styles/
│   └── tokens.css
│
├── App.tsx
└── main.tsx
```

---

## 9. Modelo de Dados

### Dados principais do formulário

```ts
export type Activity = {
  id: string;
  statement: string;
  image?: File;
  imagePreviewUrl?: string;
};

export type DocumentFormData = {
  schoolName: string;
  directorName?: string;
  teacherName: string;
  studentName?: string;
  className?: string;
  documentTitle?: string;
  date?: string;
  headerImage?: File;
  headerImagePreviewUrl?: string;
  activities: Activity[];
};
```

---

## 10. Campos do Formulário

### Dados da escola

| Campo              | Obrigatório | Observação                        |
| ------------------ | ----------: | --------------------------------- |
| Cabeçalho do documento |      Não | Faixa horizontal em PNG, JPG ou JPEG |
| Nome da escola     |         Sim | Campo principal do cabeçalho      |
| Nome da diretora   |         Não | Campo opcional                    |
| Nome da professora |         Sim | Campo importante para o documento |

### Dados da prova/atividade

| Campo               | Obrigatório | Observação                                         |
| ------------------- | ----------: | -------------------------------------------------- |
| Título da atividade |         Não | Exemplo: Atividade de Matemática                   |
| Nome do aluno       |         Não | Pode ficar em branco para preencher depois no Word |
| Turma/Série         |         Não | Exemplo: 1º Ano A                                  |
| Data                |         Não | Pode usar a data atual como sugestão               |

### Atividades

Cada atividade deve conter:

| Campo     | Obrigatório | Observação                          |
| --------- | ----------: | ----------------------------------- |
| Enunciado |         Sim | Texto que a criança deve seguir     |
| Imagem    |         Sim | Imagem da atividade a ser realizada |

Deve existir pelo menos **uma atividade** para gerar o documento.

---

## 11. Regras de Validação

### Validações mínimas

* Nome da escola é obrigatório;
* Nome da professora é obrigatório;
* Pelo menos uma atividade deve existir;
* Cada atividade precisa ter enunciado;
* Cada atividade precisa ter imagem;
* Imagens devem aceitar apenas `.png`, `.jpg` e `.jpeg`;
* Cabeçalho deve aceitar apenas `.png`, `.jpg` e `.jpeg`.

### Limites sugeridos para o MVP

Para evitar travamentos em dispositivos fracos:

```txt
Cabeçalho: até 2 MB
Imagem de atividade: até 5 MB
Quantidade inicial sugerida: até 15 atividades
```

Esses limites podem ser ajustados depois.

---

## 12. Fluxo Principal da Usuária

```txt
1. Usuária abre o site
2. Clica em "Começar agora"
3. Envia o cabeçalho do documento, se quiser
4. Preenche nome da escola
5. Preenche nome da diretora, se quiser
6. Preenche nome da professora
7. Preenche título, aluno, turma e data
8. Adiciona a primeira atividade
9. Escreve o enunciado
10. Envia a imagem da atividade
11. Adiciona novas atividades, se necessário
12. Confere a prévia simples
13. Clica em "Gerar documento Word"
14. O arquivo `.docx` é baixado
15. A usuária pode editar o arquivo no computador
```

---

## 13. Estrutura da Interface

A interface deve ser uma página simples, com seções organizadas.

### Estrutura geral

```txt
Header do sistema

Hero inicial curto

Etapa 1 — Dados da escola
Etapa 2 — Dados da atividade/prova
Etapa 3 — Atividades
Etapa 4 — Gerar documento

Prévia simples do documento
```

---

## 14. Tela Inicial

A tela inicial deve ser curta e objetiva.

### Título sugerido

```txt
Crie atividades escolares em Word em poucos minutos
```

### Subtítulo sugerido

```txt
Preencha os dados, adicione imagens das atividades e baixe um arquivo .docx editável.
```

### Botão principal

```txt
Começar agora
```

### Explicação em três passos

```txt
1. Preencha os dados da escola
2. Adicione as atividades
3. Baixe o documento em Word
```

---

## 15. Layout Desktop

No desktop, usar layout com formulário principal e prévia lateral.

```txt
-----------------------------------------------------
| Header                                             |
-----------------------------------------------------
| Formulário principal                  | Prévia     |
|                                       | do DOCX    |
| Dados da escola                       |            |
| Dados da prova                        |            |
| Atividades                            |            |
| Botão gerar                           |            |
-----------------------------------------------------
```

A prévia lateral não precisa simular perfeitamente o Word. Ela serve apenas para mostrar a ordem dos dados e atividades.

---

## 16. Layout Mobile

No mobile, usar uma única coluna:

```txt
Header
Hero
Dados da escola
Dados da prova
Atividades
Prévia
Gerar documento
```

A prévia pode aparecer abaixo do formulário.

Botões devem ter altura confortável para toque.

---

## 17. Prévia do Documento

A prévia deve mostrar:

* Cabeçalho horizontal, se enviado;
* Nome da escola;
* Nome da diretora;
* Nome da professora;
* Nome do aluno;
* Turma;
* Data;
* Título da atividade;
* Lista de atividades;
* Enunciado;
* Miniatura da imagem.

### Exemplo visual

```txt
[Cabeçalho horizontal]

Escola: Escola Exemplo
Diretora: Maria Silva
Professora: Ana Souza
Aluno: João Pedro
Turma: 1º Ano A
Data: 14/06/2026

Atividade de Matemática

1. Pinte as casas de azul.
[Imagem]

2. Faça estrelinhas.
[Imagem]
```

---

## 18. Comportamento dos Uploads

Uploads devem ser claros, visuais e fáceis.

### Estado inicial

```txt
Clique para enviar uma imagem
ou arraste aqui
```

### Após enviar imagem

Mostrar:

* Miniatura da imagem;
* Nome do arquivo;
* Botão “Trocar imagem”;
* Botão “Remover imagem”.

### Não fazer

Evitar mostrar apenas o input padrão do navegador.

Input de arquivo puro pode parecer técnico e pouco amigável.

---

## 19. Geração do DOCX

A geração deve acontecer localmente no navegador.

### Regras do documento

O documento `.docx` deve seguir sempre o mesmo template:

```txt
Cabeçalho horizontal do documento

Nome da escola
Diretora
Professora
Aluno
Turma
Data

Título da atividade

1. Enunciado da atividade
[Imagem ocupando largura útil da página]

2. Enunciado da atividade
[Imagem ocupando largura útil da página]
```

### Imagens

Para o MVP:

* Imagens das atividades devem ocupar a largura útil da página;
* Não se preocupar inicialmente com quebra de página;
* Se a imagem for grande e pular para outra página, aceitar esse comportamento;
* Não cortar a imagem;
* Manter proporção da imagem;
* Redimensionar apenas para caber na largura útil.

---

## 20. Regras de Documento Editável

O arquivo final deve ser um `.docx` real, não um PDF.

O conteúdo textual deve ser editável:

* Nome da escola;
* Nome da diretora;
* Nome da professora;
* Nome do aluno;
* Data;
* Título;
* Enunciados.

As imagens podem ser editadas como imagens dentro do Word.

---

## 21. Biblioteca de Geração

Usar a biblioteca:

```txt
docx
```

Motivo:

* Permite gerar documentos Word por código;
* Funciona em TypeScript/JavaScript;
* Permite inserir texto, parágrafos e imagens;
* Não depende de backend;
* Não exige template Word externo;
* Oferece flexibilidade para controlar a estrutura do documento.

---

## 22. Design System

A interface deve parecer:

```txt
limpa
moderna
simples
confiável
leve
escolar sem ser infantil
```

Evitar:

* Cores demais;
* Botões pequenos;
* Interface com cara de sistema antigo;
* Campos apertados;
* Muitos menus;
* Muitas opções avançadas;
* Layout parecido com planilha ou sistema legado.

---

## 23. Tokens de Cores

### Cores base

```css
:root {
  --color-background: #F8FAFC;
  --color-surface: #FFFFFF;
  --color-surface-soft: #EFF6FF;

  --color-border: #E2E8F0;
  --color-border-strong: #CBD5E1;

  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #64748B;
  --color-text-disabled: #94A3B8;

  --color-primary: #2563EB;
  --color-primary-hover: #1D4ED8;
  --color-primary-active: #1E40AF;
  --color-primary-soft: #DBEAFE;
  --color-primary-subtle: #EFF6FF;

  --color-success: #16A34A;
  --color-success-soft: #DCFCE7;

  --color-warning: #D97706;
  --color-warning-soft: #FEF3C7;

  --color-danger: #DC2626;
  --color-danger-soft: #FEE2E2;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;

  --shadow-card: 0 1px 3px rgba(15, 23, 42, 0.08);
  --shadow-floating: 0 8px 24px rgba(15, 23, 42, 0.12);
}
```

---

## 24. Paleta de Cores

| Uso              | Token            | Cor       |
| ---------------- | ---------------- | --------- |
| Fundo geral      | `background`     | `#F8FAFC` |
| Cards            | `surface`        | `#FFFFFF` |
| Fundo suave      | `surface-soft`   | `#EFF6FF` |
| Borda padrão     | `border`         | `#E2E8F0` |
| Borda forte      | `border-strong`  | `#CBD5E1` |
| Texto principal  | `text-primary`   | `#0F172A` |
| Texto secundário | `text-secondary` | `#475569` |
| Texto de ajuda   | `text-muted`     | `#64748B` |
| Cor principal    | `primary`        | `#2563EB` |
| Hover do botão   | `primary-hover`  | `#1D4ED8` |
| Erro             | `danger`         | `#DC2626` |
| Sucesso          | `success`        | `#16A34A` |
| Aviso            | `warning`        | `#D97706` |

---

## 25. Tipografia

### Fonte recomendada

```css
font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

### Escala sugerida

| Uso              |      Tamanho |
| ---------------- | -----------: |
| Título principal |         32px |
| Subtítulo        |         18px |
| Título de seção  |         20px |
| Texto normal     |         16px |
| Label            |         14px |
| Texto auxiliar   |         13px |
| Botão            | 15px ou 16px |

### Regras

* Não usar textos muito pequenos;
* Manter boa leitura em notebook e celular;
* Usar peso 600 para títulos de seção;
* Usar peso 400 ou 500 para textos normais;
* Usar texto auxiliar em cinza, nunca muito claro.

---

## 26. Botões

### Botão primário

Usar para ações principais:

* Começar agora;
* Adicionar atividade;
* Gerar documento Word.

Estilo:

```css
background: #2563EB;
color: #FFFFFF;
border-radius: 12px;
font-weight: 600;
height: 48px;
```

Hover:

```css
background: #1D4ED8;
```

### Botão secundário

Usar para ações de apoio:

* Voltar;
* Trocar imagem;
* Remover cabeçalho.

Estilo:

```css
background: #FFFFFF;
color: #2563EB;
border: 1px solid #CBD5E1;
border-radius: 12px;
height: 44px;
```

### Botão destrutivo

Usar para remover atividade ou imagem.

Estilo:

```css
background: #FFFFFF;
color: #DC2626;
border: 1px solid #FECACA;
border-radius: 12px;
height: 40px;
```

Hover:

```css
background: #FEE2E2;
```

Evitar botão vermelho preenchido, pois pode assustar a usuária.

---

## 27. Inputs

### Estilo padrão

```css
height: 48px;
border: 1px solid #CBD5E1;
border-radius: 10px;
background: #FFFFFF;
color: #0F172A;
padding: 0 14px;
font-size: 16px;
```

### Estado de foco

```css
border-color: #2563EB;
box-shadow: 0 0 0 3px #DBEAFE;
outline: none;
```

### Textarea

Para enunciados:

```css
min-height: 96px;
resize: vertical;
```

---

## 28. Espaçamento

Usar respiro visual para evitar aparência antiga.

### Regras sugeridas

```txt
Padding dos cards: 24px
Espaço entre seções: 24px a 32px
Espaço entre label e input: 6px
Espaço entre campos: 16px
Altura mínima de input: 48px
Altura mínima de botão: 44px a 48px
```

---

## 29. Cards

Todas as grandes áreas devem usar cards.

### Estilo recomendado

```css
background: #FFFFFF;
border: 1px solid #E2E8F0;
border-radius: 16px;
box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
padding: 24px;
```

### Cards principais

* Dados da escola;
* Dados da prova;
* Atividades;
* Prévia;
* Finalização.

---

## 30. Microcopy

Usar textos simples e claros.

### Exemplos

```txt
A imagem será inserida abaixo do enunciado.
```

```txt
O arquivo final será editável no Word.
```

```txt
As imagens ficarão na largura da página.
```

```txt
Você poderá ajustar o documento depois no computador.
```

```txt
Envie uma imagem em PNG, JPG ou JPEG.
```

```txt
Adicione quantas atividades quiser.
```

---

## 31. Mensagens de Erro

As mensagens devem ser humanas e diretas.

### Exemplos

```txt
Informe o nome da escola.
```

```txt
Informe o nome da professora.
```

```txt
Adicione pelo menos uma atividade.
```

```txt
Escreva o enunciado da atividade.
```

```txt
Envie uma imagem para esta atividade.
```

```txt
Use uma imagem em PNG, JPG ou JPEG.
```

```txt
Essa imagem é muito grande. Envie uma imagem menor.
```

---

## 32. Estados da Interface

### Estado inicial

* Nenhuma atividade cadastrada;
* Mostrar botão grande para adicionar primeira atividade.

Texto sugerido:

```txt
Nenhuma atividade adicionada ainda.
Comece adicionando o primeiro enunciado e uma imagem.
```

Botão:

```txt
Adicionar primeira atividade
```

### Estado carregando

Ao gerar documento:

```txt
Gerando seu documento...
```

O botão deve ficar desabilitado enquanto gera.

### Estado de sucesso

Após download:

```txt
Documento criado com sucesso.
O arquivo foi baixado e pode ser editado no Word.
```

### Estado de erro

Se falhar:

```txt
Não foi possível gerar o documento.
Verifique as imagens e tente novamente.
```

---

## 33. Acessibilidade

Cuidados mínimos:

* Todos os inputs devem ter label;
* Botões devem ter texto claro;
* Não depender apenas de cor para indicar erro;
* Mensagens de erro devem aparecer próximas ao campo;
* Contraste adequado entre texto e fundo;
* Foco visível em inputs e botões;
* Upload deve funcionar por clique, não apenas arrastar;
* Botões precisam ter área de clique confortável.

---

## 34. Responsividade

### Desktop

* Formulário à esquerda;
* Prévia à direita;
* Largura confortável;
* Cards com bom espaçamento.

### Tablet

* Formulário e prévia podem empilhar;
* Manter botões grandes.

### Celular

* Uma coluna;
* Inputs com largura total;
* Botão de gerar bem visível;
* Evitar elementos lado a lado;
* Prévia abaixo das atividades.

---

## 35. Componentes Principais

### `AppHeader`

Responsável por mostrar:

* Nome do sistema;
* Subtítulo curto;
* Possível logo do produto.

### `SchoolInfoForm`

Campos:

* Cabeçalho do documento;
* Nome da escola;
* Nome da diretora;
* Nome da professora.

### `ExamInfoForm`

Campos:

* Título da atividade;
* Nome do aluno;
* Turma;
* Data.

### `ActivityList`

Responsável por:

* Renderizar lista de atividades;
* Adicionar nova atividade;
* Remover atividade;
* Reordenar atividade futuramente, se necessário.

### `ActivityCard`

Campos:

* Número da atividade;
* Enunciado;
* Upload da imagem;
* Miniatura da imagem;
* Botão remover.

### `DocumentPreview`

Mostra uma prévia simplificada do documento.

### `GenerateButton`

Responsável por:

* Validar formulário;
* Chamar geração do `.docx`;
* Mostrar estado de carregamento;
* Disparar download.

---

## 36. Critérios de Aceite do MVP

O MVP será considerado pronto quando:

* A usuária conseguir preencher os dados da escola;
* A usuária conseguir enviar um cabeçalho;
* A usuária conseguir preencher os dados da prova;
* A usuária conseguir adicionar uma atividade;
* A usuária conseguir adicionar múltiplas atividades;
* Cada atividade aceitar enunciado e imagem;
* A usuária conseguir remover atividades;
* A usuária conseguir trocar imagens;
* A prévia mostrar os dados principais;
* O botão gerar criar um arquivo `.docx`;
* O arquivo `.docx` abrir no Word;
* Os textos do arquivo forem editáveis;
* As imagens aparecerem abaixo dos enunciados;
* As imagens ocuparem a largura útil da página;
* O sistema funcionar sem backend;
* O sistema funcionar após build estático.

---

## 37. Limitações Aceitas no MVP

As seguintes limitações são aceitas na primeira versão:

* Não controlar quebra de página;
* Não salvar dados após atualizar a página;
* Não ter login;
* Não ter histórico;
* Não permitir múltiplos templates;
* Não permitir edição avançada de layout;
* Não permitir arrastar para reordenar atividades;
* Não comprimir imagens automaticamente;
* Não gerar PDF;
* Não fazer upload para servidor.

---

## 38. Melhorias Futuras

Após validação do MVP, considerar:

* Salvar dados no navegador usando `localStorage`;
* Criar histórico local de documentos;
* Permitir reordenar atividades;
* Permitir duplicar atividade;
* Permitir escolher tamanho da fonte;
* Permitir escolher orientação retrato/paisagem;
* Permitir salvar dados da escola;
* Permitir múltiplos modelos;
* Criar login;
* Criar backend;
* Criar banco de dados;
* Salvar provas anteriores;
* Criar biblioteca de imagens;
* Cobrar assinatura;
* Gerar PDF além de DOCX;
* Ajustar quebra de página automaticamente;
* Compressão automática de imagens;
* Prévia mais fiel ao documento final.

---

## 39. Nome do Produto

Nome recomendado para o MVP:

```txt
ProvaPronta
```

Outras opções possíveis:

```txt
AtiviDoc
EduFolha
MontaProva
FolhaFácil
```

O nome pode ser alterado futuramente.

---

## 40. Regra de Produto Mais Importante

Não transformar o sistema em um editor complexo.

O produto deve continuar simples:

```txt
Preencher → adicionar atividades → gerar Word
```

Sempre que uma nova funcionalidade for considerada, perguntar:

```txt
Isso ajuda a professora a gerar o documento mais rápido ou só adiciona complexidade?
```

Se a resposta for “adiciona complexidade”, deixar para depois.

---

## 41. Prompt Base para IA Codar

Este prompt pode ser usado para orientar uma IA programadora:

```txt
Crie um projeto React com Vite e TypeScript chamado ProvaPronta.

O sistema deve gerar um arquivo .docx editável localmente no navegador, sem backend.

Use as seguintes tecnologias:
- React
- TypeScript
- Vite
- TailwindCSS
- React Hook Form
- Zod
- docx
- file-saver

O sistema deve permitir que a usuária:
- envie o cabeçalho horizontal do documento;
- preencha o nome da escola;
- preencha o nome da diretora;
- preencha o nome da professora;
- preencha o título da atividade;
- preencha o nome do aluno;
- preencha a turma;
- preencha a data;
- adicione múltiplas atividades;
- escreva um enunciado para cada atividade;
- envie uma imagem para cada atividade;
- veja uma prévia simples;
- gere e baixe um arquivo .docx editável.

Regras:
- Tudo deve funcionar no navegador.
- Não usar backend.
- Não usar banco de dados.
- O documento final deve ser .docx editável.
- As imagens das atividades devem aparecer abaixo dos enunciados.
- As imagens devem ocupar a largura útil da página.
- Não precisa controlar quebra de página no MVP.
- A interface deve ser simples, moderna, acessível e voltada para professoras com pouco conhecimento técnico.
```

---

## 42. Observação Técnica Importante

A parte mais crítica do projeto é a geração do `.docx` com imagens.

Antes de criar toda a interface, validar tecnicamente:

```txt
1. Gerar um .docx simples com texto;
2. Gerar um .docx com uma imagem enviada pelo usuário;
3. Ajustar a imagem para largura útil da página;
4. Gerar várias atividades com texto + imagem;
5. Só depois finalizar a interface completa.
```

Isso reduz o risco de construir uma interface bonita antes de validar a parte mais importante.

---

## 43. Ordem Recomendada de Desenvolvimento

### Etapa 1

Criar projeto com Vite, React e TypeScript.

### Etapa 2

Configurar TailwindCSS.

### Etapa 3

Criar layout base da aplicação.

### Etapa 4

Criar formulário de dados da escola.

### Etapa 5

Criar formulário de dados da prova.

### Etapa 6

Criar lista dinâmica de atividades.

### Etapa 7

Implementar upload e prévia de imagens.

### Etapa 8

Gerar `.docx` simples com textos.

### Etapa 9

Gerar `.docx` com cabeçalho horizontal.

### Etapa 10

Gerar `.docx` com atividades e imagens.

### Etapa 11

Ajustar layout do documento.

### Etapa 12

Adicionar validações.

### Etapa 13

Melhorar mensagens de erro e sucesso.

### Etapa 14

Testar em desktop e celular.

### Etapa 15

Gerar build final.

---

## 44. Resultado Esperado

Ao final do MVP, a usuária deve conseguir criar uma atividade escolar em poucos minutos, sem cadastro e sem dificuldade técnica.

O sistema deve entregar um arquivo Word editável, organizado, com aparência limpa e pronto para impressão ou ajustes finais.

O foco não é criar o editor mais poderoso.

O foco é criar o caminho mais fácil para gerar uma atividade escolar pronta.
