// Fila FIFO
let fila = [];
let historico = [];

// Atualiza a tela
function atualizarFila() {
    const lista = document.getElementById("fila");
    lista.innerHTML = "";

    fila.forEach((pacote, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${pacote.nome} - ${pacote.cidade}, ${pacote.pais}`;
        lista.appendChild(item);
    });
}

// Atualiza histórico
function atualizarHistorico() {
    const lista = document.getElementById("historico");
    lista.innerHTML = "";

    historico.forEach((pacote) => {
        const item = document.createElement("li");
        item.textContent = `Entregue para ${pacote.nome} - ${pacote.cidade}, ${pacote.pais}`;
        lista.appendChild(item);
    });
}

// Consumindo API
async function adicionarPacote() {
    try {
        const resposta = await fetch("https://randomuser.me/api/");
        const dados = await resposta.json();

        const usuario = dados.results[0];

        const pacote = {
            nome: `${usuario.name.first} ${usuario.name.last}`,
            cidade: usuario.location.city,
            pais: usuario.location.country
        };

        fila.push(pacote); // FIFO
        atualizarFila();

    } catch (erro) {
        alert("Erro ao buscar dados da API");
        console.error(erro);
    }
}

// Entregar pacote
function entregarPacote() {
    if (fila.length === 0) {
        alert("Fila vazia!");
        return;
    }

    const pacote = fila.shift(); // Remove o primeiro (FIFO)

    // Simula tempo de entrega
    animarEntrega();

    setTimeout(() => {
        historico.push(pacote);
        atualizarFila();
        atualizarHistorico();

        alert(`Entregue para ${pacote.nome} em ${pacote.cidade}, ${pacote.pais}`);
    }, 2000);
}

// Animação simples
function animarEntrega() {
    const caminhao = document.getElementById("animacao");

    caminhao.style.transform = "translateX(200px)";

    setTimeout(() => {
        caminhao.style.transform = "translateX(0)";
    }, 1000);
}