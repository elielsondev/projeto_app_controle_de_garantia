# Solução: Erro de Rotas no Deploy (Vite + React + Vercel)

Se você realizou o deploy de uma aplicação Single Page Application (SPA) na Vercel e as rotas (ex: `/contato`, `/dashboard`) retornam erro 404 ao serem acessadas diretamente ou ao atualizar a página (F5), siga os passos abaixo.

## 🛠️ O Problema

Por padrão, a Vercel tenta localizar arquivos físicos para cada rota solicitada. Como em aplicações React as rotas são gerenciadas internamente pelo JavaScript, o servidor não encontra o arquivo e retorna erro.

## 🚀 Como Corrigir

Para resolver, precisamos criar uma regra de reescrita (*rewrite*) para que todas as requisições apontem para o arquivo principal.

1. Na **raiz do seu projeto** (mesmo local onde está o `package.json`), crie um arquivo chamado `vercel.json`.
2. Adicione o seguinte código:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
Use o código com cuidado.

Salve o arquivo.
Faça o commit e push das alterações para o seu repositório:
bash
git add vercel.json
git commit -m "fix: adiciona vercel.json para suporte a rotas SPA"
git push origin main
Use o código com cuidado.

📄 Explicação Técnica
O parâmetro rewrites instrui o servidor da Vercel a redirecionar qualquer caminho (/(.*)) para o index.html. A partir daí, o React Router assume o controle da URL e renderiza o componente correto no lado do cliente.
Para mais detalhes, consulte a Documentação Oficial da Vercel sobre Rewrites.
{content: }
