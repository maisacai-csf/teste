import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("lista-produtos");

const IMAGEM_PADRAO = "images.png";

// ===============================
// CARREGAR PRODUTOS
// ===============================
async function carregarProdutosSite() {
  container.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));
  const adicionaisSnap = await getDocs(collection(db, "adicionais"));

  const adicionaisMap = {};

  adicionaisSnap.forEach(doc => {
    adicionaisMap[doc.id] = doc.data();
  });

  snap.forEach(doc => {
    const p = doc.data();

    if (!p.ativo) return;

    const imagemProduto = p.imagem && p.imagem.trim() !== ""
      ? p.imagem
      : IMAGEM_PADRAO;

    let html = `
      <div class="card">

        <div class="card-topo">
          <img src="${imagemProduto}" class="img-produto">
          <div>
            <h3>${p.nome}</h3>
            <div class="price" id="preco-${doc.id}">
              R$ ${p.preco.toFixed(2)}
            </div>
          </div>
        </div>

        <p>${p.descricao || ""}</p>
    `;

    // 🔥 ADICIONAIS
    if (p.adicionais && p.adicionais.length > 0) {

      html += `<div class="adicionais">`;

      p.adicionais.forEach(id => {
        const adicional = adicionaisMap[id];
        if (!adicional) return;

        html += `
          <label>
            <input type="checkbox"
              class="check-adicional"
              data-preco="${adicional.preco}"
              onchange="atualizarPreco('${doc.id}', ${p.preco}, this)">
            ${adicional.nome} - R$ ${Number(adicional.preco).toFixed(2)}
          </label>
        `;
      });

      html += `</div>`;
    }

    html += `
      <button onclick="adicionarCarrinho(this, '${doc.id}', '${p.nome}', ${p.preco})">
        Adicionar
      </button>

      </div>
    `;

    container.innerHTML += html;
  });
}

// ===============================
// ATUALIZAR PREÇO
// ===============================
window.atualizarPreco = function(produtoId, precoBase, checkbox) {

  const card = checkbox.closest(".card");
  const checks = card.querySelectorAll(".check-adicional:checked");

  let total = precoBase;

  checks.forEach(el => {
    total += Number(el.dataset.preco);
  });

  document.getElementById(`preco-${produtoId}`).innerText =
    "R$ " + total.toFixed(2);
};

// ===============================
// ADICIONAR AO CARRINHO
// ===============================
window.adicionarCarrinho = function(botao, produtoId, nome, precoBase) {

  const card = botao.closest(".card");

  const checks = card.querySelectorAll(".check-adicional");
  const checksMarcados = card.querySelectorAll(".check-adicional:checked");

  const temAdicionais = checks.length > 0;

  // 🔥 REGRA
  if (temAdicionais && checksMarcados.length === 0) {
    alert("Escolha pelo menos um adicional!");
    return;
  }

  let total = precoBase;
  const adicionaisSelecionados = [];

  checksMarcados.forEach(el => {
    total += Number(el.dataset.preco);
    adicionaisSelecionados.push(el.parentElement.innerText.trim());
  });

  const item = {
    produtoId,
    nome,
    preco: total,
    adicionais: adicionaisSelecionados
  };

  // 🔥 SALVA NO LOCALSTORAGE
  let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

  carrinho.push(item);

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  alert("Adicionado ao carrinho!");
};

// INICIAR
carregarProdutosSite();