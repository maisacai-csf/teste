import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("lista-produtos");

// IMAGEM PADRÃO
const IMAGEM_PADRAO = "images.png";

// BUSCAR PRODUTOS DO FIREBASE
async function carregarProdutosSite() {
  container.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(doc => {
    const p = doc.data();

    // MOSTRAR SÓ OS ATIVOS
    if (p.ativo) {

      const imagemProduto = p.imagem && p.imagem.trim() !== ""
        ? p.imagem
        : IMAGEM_PADRAO;

      container.innerHTML += `
        <div class="card">
          <img src="${imagemProduto}" class="img-produto">

          <h3>${p.nome}</h3>
          <p>${p.descricao || ""}</p>
          <div class="price">R$ ${p.preco.toFixed(2)}</div>

          <button onclick="adicionarCarrinho('${p.nome}', ${p.preco})">
            Adicionar
          </button>
        </div>
      `;
    }
  });
}

carregarProdutosSite();
