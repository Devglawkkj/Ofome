# OHFOME

MVP front-end de descoberta de comida e vitrines digitais para pequenos negócios de Teresina. React, Vite, JavaScript, Tailwind CSS, Lucide React e Leaflet. Sem back-end ou autenticação real.

## Executar

Requer Node.js 20.19+ ou 22.12+.

```sh
npm install
npm run dev
```

Abra a URL indicada pelo Vite. Para compilar: `npm run build`. Para visualizar a compilação: `npm run preview`.

## Demonstração de cinco minutos

1. Na abertura, escolha Criar minha conta. Use nome e e-mail fictícios e uma senha de demonstração com 6 ou mais caracteres. Após preencher os dados, escolha Cliente ou Vendedor.
2. Como cliente, use Busca, Mapa e Perfil. Pesquise `capote até R$ 30` ou combine categoria e preço máximo. Abra uma vitrine por um cartão.
3. Em Perfil, troque para Vendedor. Cadastre o estabelecimento com nome, categoria, horário e WhatsApp com DDD. Endereço e localização são opcionais: escolha um ponto no mapa ou preencha latitude e longitude.
4. Como vendedor, edite os pratos em Cardápio e confira as alterações na Vitrine e no Mapa.
5. Saia pelo Perfil e entre novamente usando o e-mail criado. Após o login, escolha o perfil. Recarregar mantém a sessão de demonstração.

## Contas e perfis simulados

O cadastro inicial é compartilhado pelos dois perfis e coleta nome, e-mail, WhatsApp opcional e senha de demonstração. A etapa seguinte pergunta se a pessoa é cliente ou vendedora. O vendedor segue para o cadastro do estabelecimento; o cliente segue para Busca. O Perfil permite editar nome e telefone, trocar de papel e sair. As telas de edição de estabelecimento/cardápio não são exibidas para o perfil cliente.

**Não existe autenticação real:** a senha não é salva, transmitida, comparada ou usada para proteger dados. Qualquer senha com 6 ou mais caracteres funciona no login de uma conta de demonstração já cadastrada neste navegador. Não use senhas reais. O e-mail é somente um identificador local. O controle de perfil é uma simulação de interface, não uma barreira de segurança.

Contas (`ohfome.accounts.v1`) e sessão (`ohfome.session.v1`) ficam no LocalStorage, assim como o estabelecimento e cardápio de demonstração compartilhados neste navegador. Não há envio de dados de conta a servidor. Limpe as chaves para reiniciar a demonstração.

## Mapa de estabelecimentos

Leaflet 1.9.4 com ruas do OpenStreetMap, zoom, movimento, marcadores selecionáveis, busca por nome/categoria, seleção pela lista e abertura de vitrines. Requer internet para carregar as ruas; se houver falha, a lista permanece disponível. Os pontos dos três negócios de exemplo são sintéticos, identificados como fictícios, e não representam endereços reais nem devem orientar deslocamentos.

No cadastro do estabelecimento, o vendedor pode tocar no mapa para escolher coordenadas ou digitá-las. As coordenadas salvas atualizam o marcador e ficam identificadas como informadas no cadastro, sem verificação. Sem coordenadas, o negócio de demonstração usa o ponto sintético padrão. Como chegar só abre direções externas quando o vendedor informa um endereço; sem endereço, exibe uma mensagem de demonstração.

A atribuição do OpenStreetMap permanece visível. O provedor de ruas pode ser configurado via `VITE_MAP_TILE_URL`; ao trocar de provedor, ajuste também a atribuição no componente. Consulte [Leaflet](https://leafletjs.com/reference-1.9.4.html) e a [política de tiles do OpenStreetMap](https://operations.osmfoundation.org/policies/tiles/).

## Organização

- `src/pages`: as quatro telas.
- `src/components`: cartões, imagens com fallback, modal e estado vazio.
- `src/data`: dados fictícios e imagens ilustrativas.
- `src/utils`: formatação, validação e persistência.

Estado compartilhado no componente principal; navegação por hash permite voltar e avançar no navegador sem recarregar. As chaves `ohfome.business.v1` e `ohfome.menu.v1` armazenam estabelecimento e cardápio. A persistência pode ser substituída por um serviço REST no futuro. `Auth.jsx`, `Profile.jsx` e `Map.jsx` concentram os novos fluxos; `RestaurantMap.jsx` é reutilizado no mapa geral e no seletor de localização do estabelecimento.

Dados, distâncias e status de funcionamento são fictícios; não há consulta de disponibilidade em tempo real. Imagens e fontes são servidas localmente. As imagens regionais foram geradas com imagegen e a foto do lanche é do Unsplash; todas são ilustrativas. Origem e prompt estão em `public/images/README.md`. Imagens possuem fallback.

As quatro referências visuais recebidas estão em `references/`. A direção combina fotos grandes e painéis arredondados, hierarquia compacta, categorias em destaque, cartões em duas colunas no celular e uma abertura acolhedora no cadastro, adaptadas à identidade laranja e branca do OHFOME.

O layout prioriza celulares de 390 px e se adapta a 320 px. Em telas grandes, a interface mantém um formato de aplicativo centralizado de até 480 px. Busca com filtro de preço expansível, categorias circulares, imagens regionais consistentes, vitrine com abas de categoria e cadastro dividido em boas-vindas, formulário e confirmação. Na edição de pratos é possível escolher uma das imagens ilustrativas disponíveis. Dados já salvos continuam funcionando; as imagens genéricas antigas são atualizadas na apresentação.

WhatsApp abre `wa.me` apenas com número válido cadastrado, com mensagem pré-preenchida. Não há envio automático. Nenhum endereço foi inventado. Contas e dados locais não são publicados; apenas as ruas do mapa são buscadas no provedor externo.
