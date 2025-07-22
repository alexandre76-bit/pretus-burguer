let carrinho = [];

function adicionarAoCarrinho(botao) {
  const item = botao.parentElement;
  const nome = item.dataset.nome;
  const preco = parseFloat(item.dataset.preco);
  const observacao = item.querySelector("textarea").value;

  const existente = carrinho.find(p => p.nome === nome && p.observacao === observacao);
  if (existente) {
    existente.qtd += 1;
  } else {
    carrinho.push({ nome, preco, qtd: 1, observacao });
  }

  atualizarCarrinho();
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

function alterarQuantidade(index, operacao) {
  if (operacao === 'mais') {
    carrinho[index].qtd += 1;
  } else if (operacao === 'menos' && carrinho[index].qtd > 1) {
    carrinho[index].qtd -= 1;
  } else {
    removerItem(index);
  }
  atualizarCarrinho();
}

function atualizarCarrinho() {
  const lista = document.getElementById("lista-carrinho");
  const totalSpan = document.getElementById("total");
  lista.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${item.nome}</strong> (${item.qtd}) - R$${(item.preco * item.qtd).toFixed(2)}
      <br><em>${item.observacao || ''}</em><br>
      <button onclick="alterarQuantidade(${index}, 'menos')">-</button>
      <button onclick="alterarQuantidade(${index}, 'mais')">+</button>
      <button onclick="removerItem(${index})">Remover</button>
    `;
    lista.appendChild(li);
    total += item.preco * item.qtd;
  });

  totalSpan.textContent = total.toFixed(2);
}

function enviarPedidoWhatsApp() {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  let mensagem = "*Pedido Pretu's Burguer:*\n\n";

  carrinho.forEach(item => {
    mensagem += `🍔 ${item.nome} x${item.qtd}\n`;
    if (item.observacao) {
      mensagem += `  🔸Obs: ${item.observacao}\n`;
    }
  });

  const total = carrinho.reduce((soma, item) => soma + item.qtd * item.preco, 0);
  mensagem += `\n💰 Total: R$ ${total.toFixed(2)}\n`;
  mensagem += `\n👉 Entregar no endereço: (informe aqui)\n`;

  const numero = "5551991805823"; // Coloque aqui o número da hamburgueria (com DDD e sem espaços)
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

  window.open(url, "_blank");
}
