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

function entregarPacote() {
    if (fila.length === 0) {
        alert("Fila vazia!");
        return;
    }

    const pacote = fila.shift();

    const statusTexto = document.getElementById("statusTexto");
    const tempoTexto = document.getElementById("tempoEstimado");
    const barra = document.getElementById("barraProgresso");

    let progresso = 0;

    // Tempo total simulado (5 segundos)
    let tempoTotal = 5000;
    let tempoRestante = tempoTotal / 1000;

    tempoTexto.textContent = `Tempo estimado: ${tempoRestante}s`;

    const etapas = [
        "📦 Pacote coletado",
        "🚚 Saiu para entrega",
        "🛣️ Em rota...",
        "📍 Chegando ao destino",
        "✅ Entregue"
    ];

    let etapaAtual = 0;

    const intervalo = setInterval(() => {
        progresso += 20;
        etapaAtual++;

        barra.style.width = progresso + "%";
        statusTexto.textContent = etapas[etapaAtual - 1];

        tempoRestante--;
        tempoTexto.textContent = `Tempo estimado: ${tempoRestante}s`;

        animarEntrega();

        if (progresso >= 100) {
            clearInterval(intervalo);

            historico.push(pacote);
            atualizarFila();
            atualizarHistorico();

            setTimeout(() => {
                alert(`Entrega finalizada para ${pacote.nome} (${pacote.cidade}, ${pacote.pais})`);
                statusTexto.textContent = "Aguardando próxima entrega...";
                tempoTexto.textContent = "";
                barra.style.width = "0%";
            }, 500);
        }
    }, 1000);
}

function animarEntrega() {
    const caminhao = document.getElementById("animacao");

    caminhao.style.transform = "translateX(300px)";

    setTimeout(() => {
        caminhao.style.transform = "translateX(0)";
    }, 500);
}