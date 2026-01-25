import { db } from "./firebase.js";
import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("lista-produtos");

// BUSCAR PRODUTOS DO FIREBASE
async function carregarProdutosSite() {
  container.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(doc => {
    const p = doc.data();

    // MOSTRAR SÓ OS ATIVOS
    if (p.ativo) {
      container.innerHTML += `
        <div class="produto-card">
          <h3>${p.nome}</h3>
          <p>R$ ${p.preco.toFixed(2)}</p>
          <button onclick="adicionarCarrinho('${p.nome}', ${p.preco})">
            Adicionar
          </button>
        </div>
      `;
    }
  });
}

carregarProdutosSite();
