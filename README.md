# InstaComp

Um "Instagram de mentira" da Semana da Computação da UFJF, feito para o minicurso
*O que não te ensinaram sobre cloud*. A página mostra em qual serviço, revisão e
instância do Cloud Run ela está rodando e, embaixo, um celular com o feed do InstaComp:
15 posts, stories, curtidas e coração com dois cliques.

É um único HTML, servido por um servidor Node.js mínimo, sem dependências.

```
instacomp/
├── package.json      # "npm start" roda o servidor
├── server.js         # entrega a página e escuta na porta que o Cloud Run mandar (PORT)
└── public/
    └── index.html    # a página inteira: HTML, CSS, JS e os 15 posts
```

## Antes de começar

- Uma conta no Google Cloud com o free trial ativado.
- Um projeto criado e **selecionado no topo do console**.
- Nada para instalar: tudo roda no **Cloud Shell**, o terminal do Google Cloud no
  navegador (o ícone `>_` no topo do console).

## Passo 1 · Traga o código para o Cloud Shell

```bash
git clone https://github.com/feliperooke/instacomp
cd instacomp
```

Não precisa de conta no GitHub: o repositório é público.

## Passo 2 · Libere o build (uma vez por projeto)

Em projetos novos, a conta que monta o container nasce sem permissão. Sem este passo,
o deploy falha com `PERMISSION_DENIED`.

```bash
PROJECT_ID=$(gcloud config get-value project)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member=serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com \
  --role=roles/run.builder
```

| Parte | O que faz |
| --- | --- |
| `PROJECT_ID=$(…)` | Guarda numa variável o ID do projeto aberto no Cloud Shell. O `$( )` roda um comando e usa a resposta. |
| `PROJECT_NUMBER=$(…)` | Pergunta ao Google o número do projeto: é ele que forma o nome da conta do build. |
| `gcloud projects add-iam-policy-binding` | Adiciona uma regra de permissão (IAM) ao projeto: quem pode fazer o quê. |
| `--member=serviceAccount:…` | **Quem:** a conta de serviço padrão do Compute Engine, que o Cloud Build usa para montar o container. |
| `--role=roles/run.builder` | **O quê:** o papel Cloud Run Builder, para ler o código enviado, gravar a imagem e escrever os logs. |

Depois, **espere uns 2 minutos**: a permissão demora um pouco para valer.

<details>
<summary>Prefere clicar? O mesmo passo pelo console</summary>

1. No menu ☰, abra **IAM e administrador → IAM**.
2. Clique em **Conceder acesso**.
3. Em **Novos principais**, cole `NÚMERO-compute@developer.gserviceaccount.com`
   (o número do projeto está na página inicial do console).
4. Em **Selecionar um papel**, escolha **Cloud Run Builder**.
5. Clique em **Salvar**.

</details>

## Passo 3 · Publique no Cloud Run

```bash
gcloud run deploy instacomp --source . --region us-east1 --allow-unauthenticated
```

| Parte | O que faz |
| --- | --- |
| `gcloud run deploy` | Publica (ou atualiza) um serviço no Cloud Run. |
| `instacomp` | O nome do serviço. Aparece na URL e no cartão da página. |
| `--source .` | Manda o código desta pasta. O Cloud Build reconhece o `package.json` e monta o container, sem Dockerfile. |
| `--region us-east1` | Onde roda: Carolina do Sul, EUA, uma das regiões mais baratas. |
| `--allow-unauthenticated` | Deixa a URL aberta: qualquer pessoa com o link acessa. |

No primeiro deploy, o `gcloud` pergunta se pode criar o repositório de imagens e
habilitar a API do Cloud Build: responda **Y** para tudo. Em uns 2 minutos aparece a
**Service URL**: abra no navegador (vale testar pelo celular, no 4G).

No topo da página, o cartão mostra o serviço, a revisão e um código da instância.
Recarregue algumas vezes: se o código mudar, outra instância atendeu.

Mudou alguma coisa no código? Rode o mesmo `gcloud run deploy` de novo: ele cria uma
revisão nova e passa o tráfego para ela.

## Se der erro

| Mensagem | O que fazer |
| --- | --- |
| `PERMISSION_DENIED` ... `missing required IAM permissions` | Faça o passo 2. Se já fez, espere mais um ou dois minutos e rode o deploy de novo. |
| `API [...] not enabled` | Responda **Y** para habilitar e continuar. |
| `403 Forbidden` ao abrir a URL | O serviço não ficou público: rode o deploy de novo com `--allow-unauthenticated`. |
| `The required property [project] is not currently set` | Nenhum projeto selecionado: rode `gcloud config set project SEU_PROJETO`. |

## Rodar no seu computador (opcional)

Precisa do Node.js 18 ou mais novo.

```bash
npm start
# abra http://localhost:8080
```

## Depois da aula

Para não deixar nada ligado: Cloud Run → Services → `instacomp` → Delete.
Sem acessos, ele escala até zero e não cobra pela execução, mas apagar é mais limpo.

## Créditos

As fotos vêm do portal de notícias da UFJF ([www2.ufjf.br/noticias](https://www2.ufjf.br/noticias/))
e são carregadas direto de lá. Perfis e legendas são fictícios, só para a aula.
