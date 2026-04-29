// ===============================
// 📦 FILA E HISTÓRICO
// ===============================
let fila = [];
let historico = [];

// ===============================
// 🔄 ATUALIZAR FILA NA TELA
// ===============================
function atualizarFila() {
    const lista = document.getElementById("fila");
    lista.innerHTML = "";

    fila.forEach((pacote, index) => {
        const item = document.createElement("li");
        item.textContent = `${index + 1}. ${pacote.nome} - ${pacote.cidade}, ${pacote.pais}`;
        lista.appendChild(item);
    });
}

// ===============================
// 📜 ATUALIZAR HISTÓRICO
// ===============================
function atualizarHistorico() {
    const lista = document.getElementById("historico");
    lista.innerHTML = "";

    historico.forEach((pacote) => {
        const item = document.createElement("li");
        item.textContent = `Entregue para ${pacote.nome} - ${pacote.cidade}, ${pacote.pais}`;
        lista.appendChild(item);
    });
}

// ===============================
// 🌐 CONSUMO DA API
// ===============================
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

        fila.push(pacote); // FIFO (entra no final)
        atualizarFila();

    } catch (erro) {
        alert("Erro ao buscar dados da API");
        console.error(erro);
    }
}

// ===============================
// 🚚 ANIMAÇÃO DO CAMINHÃO
// ===============================
function animarEntrega() {
    const caminhao = document.getElementById("animacao");

    caminhao.style.transform = "translateX(300px)";

    setTimeout(() => {
        caminhao.style.transform = "translateX(0)";
    }, 500);
}

// ===============================
// 📦 ENTREGAR PACOTE (SIMULAÇÃO COMPLETA)
// ===============================
function entregarPacote() {
    if (fila.length === 0) {
        alert("Fila vazia!");
        return;
    }

    const pacote = fila.shift(); // FIFO (remove o primeiro)

    const statusTexto = document.getElementById("statusTexto");
    const tempoTexto = document.getElementById("tempoEstimado");
    const barra = document.getElementById("barraProgresso");

    let progresso = 0;

    // Tempo total (5 segundos)
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

        // Atualiza barra
        barra.style.width = progresso + "%";

        // Atualiza status
        statusTexto.textContent = etapas[etapaAtual - 1];

        // Atualiza tempo
        tempoRestante--;
        tempoTexto.textContent = `Tempo estimado: ${tempoRestante}s`;

        // Anima caminhão
        animarEntrega();

        if (progresso >= 100) {
            clearInterval(intervalo);

            historico.push(pacote);
            atualizarFila();
            atualizarHistorico();

            setTimeout(() => {
                alert(`Entrega finalizada para ${pacote.nome} (${pacote.cidade}, ${pacote.pais})`);

                // Reset visual
                statusTexto.textContent = "Aguardando próxima entrega...";
                tempoTexto.textContent = "";
                barra.style.width = "0%";
            }, 500);
        }
    }, 1000);
}
