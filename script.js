let carrinho = [];
let total = 0;

function adicionarItem(nome, preco, botao = null) {

  let extras = "";
  let adicionais = [];
  let precoAdicionais = 0;

  if (botao) {
    const card = botao.closest('.card');

    const checks = card.querySelectorAll('input[type="checkbox"]');
    const selecionados = card.querySelectorAll('input[type="checkbox"]:checked');

    const temAdicionais = checks.length > 0;

    if (temAdicionais && selecionados.length === 0) {
      alert("Escolha pelo menos 1 adicional 😅");
      return;
    }

    selecionados.forEach(c => {
      const texto = c.parentElement.textContent.trim();

      adicionais.push(texto);

      // 🔥 pega o preço do adicional (do texto)
      const match = texto.match(/R\$\s?([\d,.]+)/);

      if (match) {
        const valor = parseFloat(match[1].replace(",", "."));
        precoAdicionais += valor;
      }
    });

    if (adicionais.length) {
      extras += `\n+ ${adicionais.join("\n+ ")}`;
    }
  }

  const nomeFinal = nome + extras;

  carrinho.push({
    nome: nomeFinal,
    preco: preco + precoAdicionais,
    qtd: 1,
    adicionais
  });

  atualizarCarrinho();
  atualizarTotal();
  atualizarContador();
  animarCarrinho();

  alert("Adicionado ao carrinho ✅");

  if (botao) {
    const card = botao.closest('.card');
    card.querySelectorAll('input[type="checkbox"]').forEach(el => el.checked = false);
    toggleCard(card);
  }
}

function atualizarCarrinho() {
  const lista = document.getElementById("listaCarrinho");
  lista.innerHTML = "";

  if (carrinho.length === 0) {
    lista.innerHTML = "<p>🛒 Carrinho vazio</p>";
    return;
  }

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.nome.replace(/\n/g, "<br>")}</strong><br>
      Quantidade: ${item.qtd}<br>
      Subtotal: R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}<br>

      <button onclick="diminuirQtd(${index})">➖</button>
      <button onclick="aumentarQtd(${index})">➕</button>
      <button onclick="removerItem(${index})">❌</button>
    `;

    lista.appendChild(li);
  });
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
  atualizarTotal();
  atualizarContador();
}

function aumentarQtd(index) {
  carrinho[index].qtd++;
  atualizarCarrinho();
  atualizarTotal();
  atualizarContador();
}

function diminuirQtd(index) {
  carrinho[index].qtd--;

  if (carrinho[index].qtd <= 0) {
    carrinho.splice(index, 1);
  }

  atualizarCarrinho();
  atualizarTotal();
  atualizarContador();
}

function atualizarTotal() {
  total = 0;

  carrinho.forEach(item => {
    total += item.preco * item.qtd;
  });

  document.getElementById("total").innerText =
    `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
}

function atualizarContador() {
  let totalItens = 0;

  carrinho.forEach(item => {
    totalItens += item.qtd;
  });

  document.getElementById("contadorCarrinho").innerText = totalItens;
}

function toggleCarrinho() {
  document.getElementById("carrinho").classList.toggle("aberto");
}

function animarCarrinho() {
  const carrinhoBtn = document.getElementById("abrirCarrinho");
  carrinhoBtn.classList.add("animar");
  setTimeout(() => carrinhoBtn.classList.remove("animar"), 400);
}

function toggleCard(card) {
  const isExpanded = card.classList.contains('expanded');

  document.querySelectorAll('.card').forEach(c => {
    c.classList.remove('expanded');
    c.style.display = 'block';
  });

  if (!isExpanded) {
    card.classList.add('expanded');
    document.querySelectorAll('.card').forEach(c => {
      if (c !== card) c.style.display = 'none';
    });
  }
}

function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio 🛒");
    return;
  }

  document.getElementById("finalizacao").style.display = "flex";
}

function enviarPedido() {
  const nome = document.getElementById("nomeCliente").value;
  const tel = document.getElementById("telefoneCliente").value;
  const rua = document.getElementById("rua").value;
  const bairro = document.getElementById("bairro").value;
  const obs = document.getElementById("obsEntrega").value;

  if (!nome || !rua || !bairro) {
    alert("Preencha nome e endereço 😅");
    return;
  }

  let texto = "🍧 *NOVO PEDIDO*\n\n";

  carrinho.forEach(item => {
    texto += `• ${item.nome} (x${item.qtd})\n`;
    texto += `Valor: R$ ${(item.preco * item.qtd).toFixed(2).replace('.', ',')}\n\n`;
  });

  texto += `💰 Total: R$ ${total.toFixed(2).replace('.', ',')}\n\n`;
  texto += `👤 Nome: ${nome}\n📞 Tel: ${tel}\n🏠 Rua: ${rua}\n📍 Bairro: ${bairro}\n📝 Obs: ${obs}`;

  const numero = "5579999161157";
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
  window.open(url, "_blank");
}

function fecharModal(event) {
  const box = document.querySelector(".box-final");

  if (!box.contains(event.target)) {
    document.getElementById("finalizacao").style.display = "none";
  }
}

// 🔥 impede fechar card ao clicar nos adicionais
document.addEventListener("click", function (e) {
  if (e.target.closest(".lista-check")) {
    e.stopPropagation();
  }
});

atualizarCarrinho();