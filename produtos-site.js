import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("lista-produtos");

// IMAGEM PADRÃO
const IMAGEM_PADRAO = "images.png";

async function carregarProdutosSite() {
  container.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(doc => {
    const p = doc.data();

    if (p.ativo) {

      const imagemProduto = p.imagem && p.imagem.trim() !== ""
        ? p.imagem
        : IMAGEM_PADRAO;

      container.innerHTML += `
        <div class="card">

          <div class="card-topo">
            <img src="${imagemProduto}" class="img-produto">
            <div>
              <h3>${p.nome}</h3>
              <div class="price">R$ ${p.preco.toFixed(2)}</div>
            </div>
          </div>

          <p>${p.descricao || ""}</p>

          <button onclick="adicionarCarrinho('${p.nome}', ${p.preco})">
            Adicionar
          </button>

        </div>
      `;
    }
  });
}


carregarProdutosSite();
