# 🌽 Império do Milho

Jogo idle/clicker em HTML + CSS + JS puro (sem build, sem dependências). Comece vendendo pamonha e curau num carrinho na rua e construa um império global do milho.

## Como jogar

1. Clique no milho para vender.
2. Compre ajudantes, carrinhos, cozinheiras e barracas para render sozinho.
3. Industrialize: debulhadoras, fábrica e centro de distribuição.
4. Expanda ppáíses, um de cada vez (veja a regra abaixo).
5. Novos produtos entram no cardápio conforme você fatura: suco, pão, bolo, milho no pote, sorvete e pipoca gourmet.
6. Cuidado com eventos: praga, greve, milho em alta e fiscalização. Pague para resolver, ou aproveite as festas e os influencers.
7. Ao passar de R$ 10M, faça uma Nova Safra (prestígio) e ganhe Espigas Douradas, com bônus permanente de produção.

O jogo salva sozinho no navegador (localStorage) e rende 50% do ganho enquanto você está offline (até 8h).

## Países: regra dos 85%

A ordem é Brasil → Argentina → Portugal → EUA → Japão → Mercado Global. Cada país só abre quando o anterior chega a 85% de desenvolvimento. A aba Países mostra a barra de progresso de cada um, com a marca dos 85%.

- Brasil: média dos 9 negócios (ajudante até franquia Brasil), cada um com meta de 20 unidades.
- Demais países: meta de 25 franquias no país.
- Os valores ficam em `COUNTRIES` (`target`) e `UNLOCK_AT` no `game.js`, fáceis de balancear.

## Sons e animações

- Sons sintetizados com Web Audio (sem arquivos de áudio): clique, compra, melhoria, evento bom/ruim, conquista, nova fase, país desbloqueado e Nova Safra. Botão 🔊/🔇 no topo.
- Animações: milho respirando e pulando no clique, grãos voando, números flutuantes, brilho nas compras, banners de fase, confete ao desbloquear país, flash dourado na Nova Safra. Respeita `prefers-reduced-motion`.

## Dificuldade progressiva

- O custo dos negócios cresce mais rápido a cada fase (1.15x até 1.19x por unidade).
- Eventos negativos ficam mais frequentes e o custo de resolver acompanha sua produção.

## Rodar localmente

Abra o `index.html` no navegador. Para publicar: Settings > Pages > branch `main` / root.

## Roadmap

- [x] Sons e animações
- [x] Países desbloqueados por progresso
- [ ] Mais eventos e mercados por país
- [ ] Árvore de habilidades
- [ ] Balanceamento fino
- [ ] Anúncios/monetização (por enquanto, nada)

## Licença

MIT
