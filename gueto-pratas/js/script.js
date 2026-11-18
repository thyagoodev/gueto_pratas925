/* =========================================================
   GUETO PRATAS — FUNCIONALIDADES
   ========================================================= */

const WHATSAPP = "5579999570973";
const STORAGE_KEY = "guetoPratasCarrinho";

// Imagem reserva caso alguma foto não carregue
const IMG_FALLBACK = "data:image/svg+xml;utf8," + encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400"><rect width="400" height="400" fill="#1a1a1a"/><circle cx="200" cy="190" r="70" fill="none" stroke="#c0c0c0" stroke-width="6"/><path d="M175 115 200 90l25 25" fill="none" stroke="#c0c0c0" stroke-width="6"/><text x="200" y="320" fill="#8a8a8a" font-family="Arial" font-size="22" text-anchor="middle" letter-spacing="4">PRATA 925</text></svg>`
);

const $ = (sel) => document.querySelector(sel);
const formatar = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const nomeCategoria = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).nome || id;
const buscarProduto = (id) => PRODUTOS.find((p) => p.id === id);
const imgTag = (src, alt) =>
  `<img src="${src}" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${IMG_FALLBACK}'">`;

// Estado
let categoriaAtiva = "todos";
let termoBusca = "";
let carrinho = carregarCarrinho();

/* ---------------- CATEGORIAS ---------------- */
function renderCategorias() {
  $("#categoriesGrid").innerHTML = CATEGORIAS.map((c) => `
    <button class="category reveal" data-cat="${c.id}">
      ${imgTag(c.imagem, c.nome)}
      <div class="category__info">
        <h3 class="category__name">${c.nome}</h3>
        <span class="category__btn">Ver produtos</span>
      </div>
    </button>`).join("");

  $("#categoriesGrid").addEventListener("click", (e) => {
    const card = e.target.closest(".category");
    if (!card) return;
    filtrarCategoria(card.dataset.cat);
    $("#produtos").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------------- FILTROS ---------------- */
function renderFiltros() {
  const botoes = [{ id: "todos", nome: "Todos" }, ...CATEGORIAS];
  $("#filters").innerHTML = botoes.map((c) =>
    `<button class="filter ${c.id === categoriaAtiva ? "active" : ""}" data-cat="${c.id}">${c.nome}</button>`
  ).join("");
}

$("#filters").addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (btn) filtrarCategoria(btn.dataset.cat);
});

function filtrarCategoria(cat) {
  categoriaAtiva = cat;
  renderFiltros();
  renderProdutos();
}

/* ---------------- PRODUTOS ---------------- */
function normalizar(txt) {
  return txt.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

function renderProdutos() {
  const termo = normalizar(termoBusca.trim());
  const lista = PRODUTOS.filter((p) =>
    (categoriaAtiva === "todos" || p.categoria === categoriaAtiva) &&
    (!termo || normalizar(p.nome).includes(termo))
  );

  let info = `${lista.length} produto${lista.length !== 1 ? "s" : ""}`;
  if (categoriaAtiva !== "todos") info += ` em ${nomeCategoria(categoriaAtiva)}`;
  if (termo) info += ` para "${termoBusca.trim()}"`;
  $("#resultsInfo").textContent = info;

  if (!lista.length) {
    $("#productsGrid").innerHTML = `<p class="empty">Nenhum produto encontrado. Tente outra pesquisa ou categoria.</p>`;
    return;
  }

  $("#productsGrid").innerHTML = lista.map((p, i) => `
    <article class="product" style="animation-delay:${i * 0.05}s">
      <div class="product__img" data-detalhes="${p.id}">
        ${imgTag(p.imagem, p.nome)}
        <span class="product__badge">Prata 925</span>
        <span class="product__view">VER DETALHES</span>
      </div>
      <div class="product__body">
        <span class="product__cat">${nomeCategoria(p.categoria)}</span>
        <h3 class="product__name">${p.nome}</h3>
        <p class="product__desc">${p.descricao}</p>
        <div class="product__price">${formatar(p.preco)}</div>
        <div class="product__actions">
          <button class="btn btn--light" data-add="${p.id}">ADICIONAR AO CARRINHO</button>
          <button class="btn-details" data-detalhes="${p.id}" aria-label="Ver detalhes">
            <svg viewBox="0 0 24 24"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>
          </button>
        </div>
      </div>
    </article>`).join("");
}

$("#productsGrid").addEventListener("click", (e) => {
  const add = e.target.closest("[data-add]");
  const det = e.target.closest("[data-detalhes]");
  if (add) adicionarAoCarrinho(Number(add.dataset.add));
  else if (det) abrirModal(Number(det.dataset.detalhes));
});

/* ---------------- PESQUISA ---------------- */
$("#btnBusca").addEventListener("click", () => {
  $("#searchBar").classList.toggle("open");
  if ($("#searchBar").classList.contains("open")) setTimeout(() => $("#searchInput").focus(), 300);
});
$("#searchClose").addEventListener("click", () => {
  $("#searchBar").classList.remove("open");
  $("#searchInput").value = "";
  termoBusca = "";
  renderProdutos();
});
$("#searchInput").addEventListener("input", (e) => {
  termoBusca = e.target.value;
  renderProdutos();
});
$("#searchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") $("#produtos").scrollIntoView({ behavior: "smooth" });
});

/* ---------------- CARRINHO ---------------- */
function carregarCarrinho() {
  try {
    const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    // descarta itens de produtos que foram removidos do catálogo
    return salvo.filter((i) => buscarProduto(i.id) && i.qtd > 0);
  } catch {
    return [];
  }
}

function salvarCarrinho() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(carrinho)); } catch { /* sem armazenamento */ }
}

function adicionarAoCarrinho(id, qtd = 1) {
  const item = carrinho.find((i) => i.id === id);
  if (item) item.qtd += qtd;
  else carrinho.push({ id, qtd });
  salvarCarrinho();
  atualizarCarrinho();
  const contador = $("#cartCount");
  contador.classList.remove("bump");
  void contador.offsetWidth;
  contador.classList.add("bump");
  mostrarToast(`✓ ${buscarProduto(id).nome} adicionado ao carrinho`);
}

function alterarQtd(id, delta) {
  const item = carrinho.find((i) => i.id === id);
  if (!item) return;
  item.qtd += delta;
  if (item.qtd <= 0) carrinho = carrinho.filter((i) => i.id !== id);
  salvarCarrinho();
  atualizarCarrinho();
}

function removerItem(id) {
  carrinho = carrinho.filter((i) => i.id !== id);
  salvarCarrinho();
  atualizarCarrinho();
}

const totalItens = () => carrinho.reduce((s, i) => s + i.qtd, 0);
const totalValor = () => carrinho.reduce((s, i) => s + buscarProduto(i.id).preco * i.qtd, 0);

function atualizarCarrinho() {
  $("#cartCount").textContent = totalItens();
  $("#cartQty").textContent = totalItens();
  $("#cartTotal").textContent = formatar(totalValor());

  if (!carrinho.length) {
    $("#cartItems").innerHTML = `
      <div class="cart__empty">
        <svg viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>
        <p>Seu carrinho está vazio.</p>
      </div>`;
    return;
  }

  $("#cartItems").innerHTML = carrinho.map((i) => {
    const p = buscarProduto(i.id);
    return `
      <div class="cart-item">
        ${imgTag(p.imagem, p.nome)}
        <div>
          <div class="cart-item__name">${p.nome}</div>
          <div class="cart-item__price">${formatar(p.preco)} cada</div>
          <div class="qty">
            <button data-menos="${p.id}" aria-label="Diminuir">−</button>
            <span>${i.qtd}</span>
            <button data-mais="${p.id}" aria-label="Aumentar">+</button>
          </div>
        </div>
        <div class="cart-item__right">
          <span class="cart-item__sub">${formatar(p.preco * i.qtd)}</span>
          <button class="cart-item__remove" data-remover="${p.id}" aria-label="Remover">
            <svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>
          </button>
        </div>
      </div>`;
  }).join("");
}

$("#cartItems").addEventListener("click", (e) => {
  const t = e.target.closest("button");
  if (!t) return;
  if (t.dataset.mais) alterarQtd(Number(t.dataset.mais), 1);
  if (t.dataset.menos) alterarQtd(Number(t.dataset.menos), -1);
  if (t.dataset.remover) removerItem(Number(t.dataset.remover));
});

function abrirCarrinho() {
  $("#cart").classList.add("open");
  $("#overlay").classList.add("show");
  document.body.classList.add("no-scroll");
}
function fecharCarrinho() {
  $("#cart").classList.remove("open");
  $("#overlay").classList.remove("show");
  document.body.classList.remove("no-scroll");
}

$("#btnCarrinho").addEventListener("click", abrirCarrinho);
$("#cartClose").addEventListener("click", fecharCarrinho);
$("#overlay").addEventListener("click", fecharCarrinho);
$("#btnContinuar").addEventListener("click", () => {
  fecharCarrinho();
  $("#produtos").scrollIntoView({ behavior: "smooth" });
});
$("#btnLimpar").addEventListener("click", () => {
  if (carrinho.length && confirm("Deseja esvaziar o carrinho?")) {
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
  }
});

/* ---------------- FINALIZAR PELO WHATSAPP ---------------- */
$("#btnFinalizar").addEventListener("click", () => {
  if (!carrinho.length) {
    mostrarToast("Adicione produtos ao carrinho antes de finalizar.");
    return;
  }

  const linhas = carrinho.map((i) => {
    const p = buscarProduto(i.id);
    const preco = i.qtd > 1 ? `${formatar(p.preco)} cada` : formatar(p.preco);
    return `• ${p.nome} — Quantidade: ${i.qtd} — ${preco}`;
  });

  const mensagem =
    "Olá! Vim pelo site da GUETO PRATAS e gostaria de realizar o seguinte pedido:\n\n" +
    linhas.join("\n") +
    `\n\n*Total: ${formatar(totalValor())}*\n\n` +
    "Gostaria de combinar a forma de pagamento e a entrega.";

  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`, "_blank");
});

/* ---------------- MODAL DE DETALHES ---------------- */
let qtdModal = 1;

function abrirModal(id) {
  const p = buscarProduto(id);
  qtdModal = 1;
  $("#modalContent").innerHTML = `
    ${imgTag(p.imagem, p.nome)}
    <div class="modal__info">
      <span class="product__cat">${nomeCategoria(p.categoria)}</span>
      <h3>${p.nome}</h3>
      <div class="price">${formatar(p.preco)}</div>
      <p>${p.descricao}</p>
      <ul>
        <li>Prata 925 italiana legítima</li>
        <li>Garantia vitalícia na cor</li>
        <li>Entrega para todo o Brasil</li>
        <li>Embalagem para presente</li>
      </ul>
      <div class="modal__qty">
        <div class="qty">
          <button id="mMenos" aria-label="Diminuir">−</button>
          <span id="mQtd">1</span>
          <button id="mMais" aria-label="Aumentar">+</button>
        </div>
        <button class="btn btn--dark" id="mAdd">ADICIONAR AO CARRINHO</button>
      </div>
    </div>`;

  $("#mMenos").onclick = () => { qtdModal = Math.max(1, qtdModal - 1); $("#mQtd").textContent = qtdModal; };
  $("#mMais").onclick = () => { qtdModal++; $("#mQtd").textContent = qtdModal; };
  $("#mAdd").onclick = () => { adicionarAoCarrinho(p.id, qtdModal); fecharModal(); };

  $("#modal").classList.add("open");
  document.body.classList.add("no-scroll");
}

function fecharModal() {
  $("#modal").classList.remove("open");
  document.body.classList.remove("no-scroll");
}

$("#modalClose").addEventListener("click", fecharModal);
$("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") fecharModal(); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { fecharModal(); fecharCarrinho(); }
});

/* ---------------- TOAST ---------------- */
let toastTimer;
function mostrarToast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
}

/* ---------------- MENU RESPONSIVO ---------------- */
$("#menuToggle").addEventListener("click", () => {
  $("#menuToggle").classList.toggle("open");
  $("#nav").classList.toggle("open");
});
document.querySelectorAll(".nav__link").forEach((link) =>
  link.addEventListener("click", () => {
    $("#menuToggle").classList.remove("open");
    $("#nav").classList.remove("open");
  })
);

/* ---------------- ROLAGEM: header, topo, menu ativo ---------------- */
const secoes = ["inicio", "produtos", "categorias", "sobre", "contato"].map((id) => document.getElementById(id));

function aoRolar() {
  const y = window.scrollY;
  $("#header").classList.toggle("scrolled", y > 40);
  $("#backTop").classList.toggle("show", y > 600);

  let atual = "inicio";
  secoes.forEach((s) => { if (s && y + 120 >= s.offsetTop) atual = s.id; });
  document.querySelectorAll(".nav__link").forEach((l) =>
    l.classList.toggle("active", l.getAttribute("href") === `#${atual}`)
  );
}
window.addEventListener("scroll", aoRolar, { passive: true });
$("#backTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------------- ANIMAÇÃO AO APARECER ---------------- */
function ativarReveal() {
  document.querySelectorAll(".section__head, .about__img, .about__text, .instagram__inner")
    .forEach((el) => el.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("visible"); obs.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}

/* ---------------- INICIALIZAÇÃO ---------------- */
renderCategorias();
renderFiltros();
renderProdutos();
atualizarCarrinho();
ativarReveal();
aoRolar();
