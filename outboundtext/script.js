document.getElementById('copyToClipboard').addEventListener('click', copiarTextoParaClipboard);

// Função para mostrar o pop-up com uma mensagem
function mostrarPopUp(mensagem) {
    let popUp = document.querySelector('.pop-up');
    if (!popUp) {
        popUp = document.createElement('div');
        popUp.className = 'pop-up';
        document.body.appendChild(popUp);
    }
    popUp.textContent = mensagem;

    popUp.classList.add('active');

    setTimeout(() => {
        popUp.classList.remove('active');
    }, 3000); // Aumentei para 3000ms para dar mais tempo de leitura
}

document.getElementById('copyToClipboard').addEventListener('click', copiarTextoParaClipboard);

function copiarTextoParaClipboard() {
    const textoAjustado = document.getElementById('adjustedText').innerText;
    navigator.clipboard.writeText(textoAjustado).then(() => {
        // Chamada da função mostrarPopUp com mensagem de sucesso
        mostrarPopUp('Texto copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        // Chamada da função mostrarPopUp com mensagem de erro
        mostrarPopUp('Erro ao copiar texto.');
    });
}

// O restante do seu código permanece inalterado


function ajustarTexto() {
    let texto = document.getElementById('inputText').value;

    // Remover dias da semana em CAIXA ALTA
    const diasSemana = ['SEGUNDA-FEIRA', 'TERÇA-FEIRA', 'QUARTA-FEIRA', 'QUINTA-FEIRA', 'SEXTA-FEIRA', 'SÁBADO', 'DOMINGO'];
    diasSemana.forEach(dia => {
        texto = texto.replace(new RegExp(dia + '\\n', 'g'), '');
    });

    // Remover Emojis (uma vez é suficiente)
    texto = texto.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}]+/gu, '');

    // Remover linhas que começam com "Ver perfil de"
    texto = texto.split('\n').filter(linha => !linha.startsWith('Ver perfil de')).join('\n');

    // Remover linhas que contêm "enviou as seguintes mensagens às"
    texto = texto.split('\n').filter(linha => !linha.match(/enviou as seguintes mensagens às \d{1,2}:\d{2}/)).join('\n');

    // Remover linhas que contêm "enviou a seguinte mensagem às"
    texto = texto.split('\n').filter(linha => !linha.match(/enviou a seguinte mensagem às \d{1,2}:\d{2}/)).join('\n');

    // Processar o texto para adicionar uma linha em branco antes de horários
    let linhas = texto.split('\n');
    texto = ''; // Reiniciar o texto para reconstruí-lo com as modificações
    for (let i = 0; i < linhas.length; i++) {
        // Adicionar uma linha em branco antes de horários, exceto se já precedida por uma linha em branco ou for a primeira linha
        if (linhas[i].match(/\b\d{1,2}:\d{2}\b/) && i > 0 && linhas[i - 1] !== '') {
            texto += '\n';
        }

        texto += linhas[i] + (i < linhas.length - 1 ? '\n' : ''); // Adicionar a linha atual e uma quebra de linha após, exceto após a última linha
    }

    // Remover linhas em branco extras consecutivas, mantendo a formatação correta
    texto = texto.replace(/\n\n+/g, '\n\n');

    document.getElementById('adjustedText').innerText = texto.trim();
}

function copiarTextoParaClipboard() {
    const textoAjustado = document.getElementById('adjustedText').innerText;
    navigator.clipboard.writeText(textoAjustado).then(() => {
        mostrarPopUp('Texto copiado para a área de transferência!');
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        mostrarPopUp('Erro ao copiar texto.');
    });
}

// Adicionando o listener para ajustar o texto automaticamente ao modificar o conteúdo do textarea
document.getElementById('inputText').addEventListener('input', ajustarTexto);

// Chame a função ajustarTexto ao carregar a página para ajustar qualquer texto que possa estar inicialmente no textarea (se aplicável).
window.onload = ajustarTexto;