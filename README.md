# Controle Financeiro Pessoal

Aplicação web para registrar receitas e despesas, acompanhar o saldo e manter uma visão simples da vida financeira. Todo o processamento acontece localmente no navegador — nenhum dado é enviado para servidores externos.

**Demonstração:** [abrir aplicação](https://matheusriccih.github.io/controle-financeiro-pessoal/)

## Funcionalidades

- Definição de saldo inicial
- Registro de receitas e despesas com data, categoria, descrição e valor
- Cálculo automático de saldo, total de receitas e total de despesas
- Histórico ordenado por data e remoção de lançamentos individuais
- Armazenamento local com `localStorage`
- Migração dos dados da versão anterior, quando existentes no mesmo navegador
- Layout responsivo, sem bibliotecas ou dependências externas

## Tecnologias

- HTML5 semântico
- CSS3 responsivo
- JavaScript moderno (ES2022)
- GitHub Pages para publicação

## Executar localmente

Não há dependências para instalar. Clone o repositório e abra `index.html` no navegador:

```bash
git clone https://github.com/matheusriccih/controle-financeiro-pessoal.git
cd controle-financeiro-pessoal
```

Para melhor experiência de desenvolvimento, use uma extensão de servidor local, como Live Server, no seu editor.

## Privacidade dos dados

Os dados são salvos somente no `localStorage` do navegador utilizado. Limpar os dados do navegador ou trocar de dispositivo remove o histórico local. Esta aplicação é um projeto de portfólio e não substitui orientação financeira profissional.

## Estrutura

```text
assets/
├── css/styles.css    Estilos e responsividade
└── js/app.js         Estado, persistência e interface
index.html            Estrutura semântica da aplicação
```

## Autor

Desenvolvido por [Matheus Ricci Hamada](https://github.com/matheusriccih).
