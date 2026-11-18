/* =========================================================
   GUETO PRATAS — CATÁLOGO DE PRODUTOS
   ---------------------------------------------------------
   Para ADICIONAR um produto: copie um bloco { ... }, cole no
   final da lista e altere os dados. O "id" deve ser único.
   Para REMOVER: apague o bloco inteiro do produto.
   Para EDITAR: altere nome, preço, descrição ou imagem.

   "categoria" deve ser UMA destas chaves:
   correntes-masculinas | colares-femininos | brincos-femininos
   brincos-masculinos  | dedeiras | aliancas | limpeza

   "imagem": pode ser um link da internet ou um arquivo local,
   ex.: "img/corrente-grumet.jpg" (coloque a foto na pasta img).
   "preco": use ponto para centavos (ex.: 149.90).
   ========================================================= */

const CATEGORIAS = [
  { id: "correntes-masculinas", nome: "Correntes Masculinas", imagem: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80" },
  { id: "colares-femininos",    nome: "Colares Femininos",    imagem: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80" },
  { id: "brincos-femininos",    nome: "Brincos Femininos",    imagem: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80" },
  { id: "brincos-masculinos",   nome: "Brincos Masculinos",   imagem: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80" },
  { id: "dedeiras",             nome: "Dedeiras",             imagem: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80" },
  { id: "aliancas",             nome: "Alianças",             imagem: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80" },
  { id: "limpeza",              nome: "Limpeza",              imagem: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80" }
];

const PRODUTOS = [
  // ---------- CORRENTES MASCULINAS ----------
  { id: 1,  nome: "Corrente Grumet 3mm",       categoria: "correntes-masculinas", preco: 189.90, imagem: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80", descricao: "Corrente grumet em prata 925 italiana, 60cm, fecho lagosta reforçado." },
  { id: 2,  nome: "Corrente Cartier 4mm",      categoria: "correntes-masculinas", preco: 249.90, imagem: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=600&q=80", descricao: "Elos cartier com acabamento polido, 70cm. Presença e estilo." },
  { id: 3,  nome: "Corrente Cadeado 5mm",      categoria: "correntes-masculinas", preco: 299.90, imagem: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=600&q=80", descricao: "Modelo cadeado robusto em prata 925, 65cm, brilho intenso." },

  // ---------- COLARES FEMININOS ----------
  { id: 4,  nome: "Colar Ponto de Luz",        categoria: "colares-femininos", preco: 129.90, imagem: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80", descricao: "Delicado colar com zircônia cravejada, corrente veneziana 45cm." },
  { id: 5,  nome: "Colar Coração",             categoria: "colares-femininos", preco: 149.90, imagem: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", descricao: "Pingente de coração em prata 925 italiana. Ideal para presentear." },
  { id: 6,  nome: "Choker Elos Finos",         categoria: "colares-femininos", preco: 119.90, imagem: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", descricao: "Choker minimalista com elos finos e extensor regulável." },

  // ---------- BRINCOS FEMININOS ----------
  { id: 7,  nome: "Argola Clássica 3cm",       categoria: "brincos-femininos", preco: 99.90,  imagem: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", descricao: "Argola lisa polida em prata 925, leve e confortável." },
  { id: 8,  nome: "Brinco Gota Zircônia",      categoria: "brincos-femininos", preco: 89.90,  imagem: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80", descricao: "Brinco em gota com zircônia branca, brilho elegante." },
  { id: 9,  nome: "Ear Cuff Cravejado",        categoria: "brincos-femininos", preco: 79.90,  imagem: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=600&q=80", descricao: "Ear cuff moderno sem necessidade de furo." },

  // ---------- BRINCOS MASCULINOS ----------
  { id: 10, nome: "Argolinha Masculina 8mm",   categoria: "brincos-masculinos", preco: 69.90, imagem: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=600&q=80", descricao: "Argolinha discreta em prata 925, fecho click (par)." },
  { id: 11, nome: "Brinco Ponto de Luz",       categoria: "brincos-masculinos", preco: 59.90, imagem: "https://images.unsplash.com/photo-1588444837495-c6cfeb53f32d?w=600&q=80", descricao: "Ponto de luz 5mm com zircônia, tarraxa de pressão (par)." },
  { id: 12, nome: "Argola Cravejada 10mm",     categoria: "brincos-masculinos", preco: 89.90, imagem: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80", descricao: "Argola cravejada com zircônias, estilo marcante (par)." },

  // ---------- DEDEIRAS ----------
  { id: 13, nome: "Dedeira Lisa Polida",       categoria: "dedeiras", preco: 119.90, imagem: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", descricao: "Dedeira lisa em prata 925 italiana, acabamento espelhado." },
  { id: 14, nome: "Dedeira Cravejada",         categoria: "dedeiras", preco: 159.90, imagem: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80", descricao: "Dedeira com fileira de zircônias, sofisticação no detalhe." },
  { id: 15, nome: "Dedeira Elos Cartier",      categoria: "dedeiras", preco: 139.90, imagem: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?w=600&q=80", descricao: "Design inspirado nos elos cartier, moderna e versátil." },

  // ---------- ALIANÇAS ----------
  { id: 16, nome: "Par de Alianças Lisas 4mm", categoria: "aliancas", preco: 259.90, imagem: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&q=80", descricao: "Par de alianças anatômicas em prata 925, gravação inclusa." },
  { id: 17, nome: "Par de Alianças com Pedra", categoria: "aliancas", preco: 299.90, imagem: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80", descricao: "Alianças 5mm, a feminina com zircônia central." },
  { id: 18, nome: "Par de Alianças Fosca",     categoria: "aliancas", preco: 279.90, imagem: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=600&q=80", descricao: "Acabamento fosco com filete polido, elegância discreta." },

  // ---------- LIMPEZA ----------
  { id: 19, nome: "Flanela Mágica",            categoria: "limpeza", preco: 24.90, imagem: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", descricao: "Flanela própria para prata, devolve o brilho em segundos." },
  { id: 20, nome: "Kit Limpeza Completo",      categoria: "limpeza", preco: 59.90, imagem: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=600&q=80", descricao: "Líquido limpa-prata 100ml + flanela + escovinha." }
];
