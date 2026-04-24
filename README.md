# 🚀 TrafegoOS — Sistema de Gestão de Tráfego Pago

Sistema completo para gestores de tráfego pago gerenciarem clientes, pagamentos, métricas e relatórios profissionais.

![TrafegoOS](https://img.shields.io/badge/TrafegoOS-v1.0-4f7cff?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Funcionalidades

- **Dashboard** — Visão geral com métricas, gráfico de faturamento e clientes ativos
- **Gestão de Clientes** — Cadastro completo com métricas de performance por cliente
- **Financeiro** — Registro de pagamentos, histórico e vencimentos
- **Relatórios** — Gerador de relatório profissional por cliente (PDF)
- **Meta Ads BM** — Integração com a Business Manager do Meta
- **Configurações** — Personalização da agência e marca nos relatórios

## 🛠️ Tecnologias

- HTML5 + CSS3 + JavaScript puro (sem frameworks)
- Chart.js para gráficos
- LocalStorage para persistência de dados
- 100% responsivo

## 🚀 Como usar

### Opção 1 — Direto no navegador
1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/trafegoOS.git
```
2. Abra o arquivo `index.html` no navegador

### Opção 2 — GitHub Pages (recomendado)
1. Faça o fork deste repositório
2. Vá em **Settings → Pages**
3. Em **Source**, selecione `main` e pasta `/ (root)`
4. Acesse via `https://seu-usuario.github.io/trafegoOS`

### Opção 3 — Servidor local
```bash
# Com Python
python -m http.server 8080

# Com Node.js
npx serve .
```

## 📁 Estrutura do Projeto

```
trafegoOS/
├── index.html          # Entrada principal
├── README.md           # Este arquivo
├── css/
│   └── style.css       # Estilos globais
└── js/
    ├── db.js           # Camada de dados (LocalStorage)
    ├── app.js          # Lógica principal e navegação
    ├── dashboard.js    # Renderização do dashboard
    ├── clients.js      # Gestão de clientes
    ├── finance.js      # Módulo financeiro
    ├── reports.js      # Gerador de relatórios
    ├── meta.js         # Integração Meta Ads
    └── config.js       # Configurações
```

## 🔗 Integração com Meta Ads

Para conectar sua BM do Meta Ads:

1. Acesse [developers.facebook.com](https://developers.facebook.com)
2. Crie um App com permissão `ads_read` e `business_management`
3. No **Graph API Explorer**, gere seu Access Token
4. Cole o token e o BM ID no menu **Meta Ads BM** do sistema

> ⚠️ A sincronização automática de métricas em tempo real requer um servidor backend (por restrições de CORS da API do Meta). O sistema está preparado para essa integração.

## 📊 Dados de Exemplo

O sistema inicia com 4 clientes de exemplo para demonstração. Você pode limpá-los em **Configurações → Limpar Todos os Dados**.

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças maiores, abra uma issue primeiro.

## 📄 Licença

MIT — use à vontade!

---

Feito com 💙 para gestores de tráfego pago brasileiros
