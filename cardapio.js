import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const container = document.getElementById("listaProdutos");

async function carregarCardapio() {
  container.innerHTML = "";

  // 🔥 BUSCAR ADICIONAIS
  const adicionaisSnap = await getDocs(collection(db, "adicionais"));

  const adicionaisMap = {};

  adicionaisSnap.forEach(doc => {
    adicionaisMap[doc.id] = doc.data();
  });

  // 🔥 BUSCAR PRODUTOS
  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(doc => {
    const p = doc.data();
    if (p.ativo === false) return;

    let acompanhamentosHTML = "";

    // ✅ SE TEM ADICIONAIS
    if (p.temAcompanhamentos && p.adicionais?.length) {
      acompanhamentosHTML += `<h4>Acompanhamentos</h4><div class="lista-check">`;

      p.adicionais.forEach(id => {
        const adicional = adicionaisMap[id];

        if (!adicional || adicional.ativo === false) return;

        acompanhamentosHTML += `
          <label onclick="event.stopPropagation()">
            <input type="checkbox" class="adicional" value="${id}">
            ${adicional.nome} - R$ ${adicional.preco.toFixed(2)}
          </label>
        `;
      });

      acompanhamentosHTML += `</div>`;
    }

    container.innerHTML += `
      <div class="card" onclick="toggleCard(this)">
        <img src="${p.imagem}" class="img-produto">
        <h3>${p.nome}</h3>
        <p>${p.descricao || ""}</p>
        <div class="price">R$ ${p.preco.toFixed(2)}</div>

        <div class="detalhes">
          ${acompanhamentosHTML}
          <button onclick="adicionarItem('${p.nome}', ${p.preco}, this); fecharCard(this)">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    `;
  });
}

carregarCardapio();