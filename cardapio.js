import { db } from "./firebase.js";
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaProdutos");

async function carregarCardapio() {
  lista.innerHTML = "";

  const snap = await getDocs(collection(db, "produtos"));

  snap.forEach(doc => {
    const p = doc.data();

    if (!p.ativo) return; // só mostra produtos ativos

    if (p.tipo === "simples") {
      lista.innerHTML += `
        <div class="card">
          <h3>${p.nome}</h3>
          <div class="price">R$ ${p.preco}</div>
          <button onclick="adicionarItem('${p.nome}', ${p.preco})">Adicionar</button>
        </div>
      `;
    }

    if (p.tipo === "complementos") {
      lista.innerHTML += `
        <div class="card" onclick="toggleCard(this)">
          <h3>${p.nome}</h3>
          <p>Até ${p.limite} adicionais</p>
          <div class="price">R$ ${p.preco}</div>

          <div class="detalhes">
            <h4>Adicionais</h4>
            <div class="lista-check">
              <label onclick="event.stopPropagation()"><input type="checkbox" class="adicional" value="Granola"> Granola</label>
              <label onclick="event.stopPropagation()"><input type="checkbox" class="adicional" value="Paçoca"> Paçoca</label>
              <label onclick="event.stopPropagation()"><input type="checkbox" class="adicional" value="Banana"> Banana</label>
            </div>

            <button onclick="adicionarItem('${p.nome}', ${p.preco}, this, ${p.limite}); fecharCard(this)">Adicionar ao carrinho</button>
          </div>
        </div>
      `;
    }
  });
}

carregarCardapio();
