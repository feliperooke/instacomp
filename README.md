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

No topo, o servidor preenche o nome do serviço, a revisão e um código da instância.
Recarregue algumas vezes: se o código mudar, outra instância atendeu.

## Rodar no seu computador (opcional)

Precisa do Node.js 18 ou mais novo.

```bash
npm start
# abra http://localhost:8080
```

## Publicar no Cloud Run (só com o navegador)

1. No console do Google Cloud, abra o **Cloud Shell** (o ícone `>_` no topo).
2. Traga o código:

```bash
git clone https://github.com/feliperooke/instacomp && cd instacomp
```

3. Publique:

```bash
gcloud run deploy instacomp --source . --region us-east1 --allow-unauthenticated
```

Responda **Y** para as perguntas (habilitar APIs e criar o repositório de imagens).
Em uns 2 minutos aparece a **Service URL**: abra no navegador.

Não precisa de Dockerfile: o `--source .` manda o código para o Cloud Build, que
reconhece o `package.json` e monta o container sozinho.

## Depois da aula

Para não deixar nada ligado: Cloud Run → Services → `instacomp` → Delete.
Sem acessos, ele escala até zero e não cobra pela execução, mas apagar é mais limpo.

## Créditos

As fotos vêm do portal de notícias da UFJF ([www2.ufjf.br/noticias](https://www2.ufjf.br/noticias/))
e são carregadas direto de lá. Perfis e legendas são fictícios, só para a aula.
