function ajustarValor(valor) {
    valor = valor.replace("R$ ", "").replace(".", "").replace(",", ".");
    return parseFloat(valor) || 0; // Retorna 0 se o valor não for um número
}

function calcularTotais() {
    const BRSoftware = ajustarValor(document.getElementById('BRSoftware').value);
    const BRComplementares = ajustarValor(document.getElementById('BRComplementares').value);
    const BRPMax = ajustarValor(document.getElementById('BRPMax').value);
    const BRTelefone = ajustarValor(document.getElementById('BRTelefone').value);
    const BRRS = ajustarValor(document.getElementById('BRRS').value);
    const BRHuntingOutsourcing = ajustarValor(document.getElementById('BRHuntingOutsourcing').value);
    const BRAlcance = ajustarValor(document.getElementById('BRAlcance').value);
    const Ajuste = ajustarValor(document.getElementById('Ajuste').value); // Campo de ajuste

    // Calcula os totais, agora incluindo o "Ajuste" no total de "Total [BR] Fábrica"
    const BRDisplay = BRAlcance;
    const BR_Fábrica = BRSoftware + BRComplementares + BRPMax + BRTelefone + Ajuste; // Ajuste adicionado aqui
    const BR_RS = BRHuntingOutsourcing + BRRS;

    // Exibindo os resultados com vírgula como separador decimal
    document.getElementById('resultados').innerHTML = `
        <p id="totalBRFabrica" class="clicavel">Total [BR] Fábrica: R$ <span>${BR_Fábrica.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        <p id="totalBRHuntingOutsourcing" class="clicavel">Total [BR] Hunting e Outsourcing: R$ <span>${BR_RS.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
        <p id="totalBRDisplay" class="clicavel">Total [BR] Display: R$ <span>${BRDisplay.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></p>
    `;

    adicionarOuvintesDeCliqueParaTotais();
}

function adicionarOuvintesDeCliqueParaTotais() {
    document.querySelectorAll('.clicavel').forEach(elemento => {
        elemento.addEventListener('click', function () {
            const textoParaCopiar = this.querySelector('span').textContent.trim();
            copiarParaClipboard(textoParaCopiar);
        });
    });
}

function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto)
        .then(() => {
            console.log('Texto copiado com sucesso!');
            mostrarPopUp('Valor copiado para a área de transferência!');
        })
        .catch(err => console.error('Falha ao copiar texto:', err));
}

function mostrarPopUp(mensagem) {
    let popUp = document.querySelector('.pop-up');
    if (!popUp) {
        popUp = document.createElement('div');
        popUp.className = 'pop-up';
        document.body.appendChild(popUp);
    }
    popUp.textContent = mensagem;
    popUp.classList.add('active');

    // Desativa e remove o pop-up após 2 segundos
    setTimeout(() => {
        popUp.classList.remove('active');
    }, 2000);
}

// Certifique-se de chamar calcularTotais() em algum ponto para inicializar os valores e os ouvintes
// Por exemplo, você pode chamar calcularTotais() quando a página é carregada
document.addEventListener('DOMContentLoaded', () => {
    calcularTotais();
});