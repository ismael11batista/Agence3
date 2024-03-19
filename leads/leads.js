let NomeDoContato = "";
let NomeDaEmpresa = "";
let EmailDoContato = "";
let TextoEspecial = ""; // Variável global para armazenar o texto especial
let TelefoneDoContato = '';
let EmailFormatado = '';
let InteresseDoLead = '';

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('inputText').addEventListener('input', function () {
        identificarInformacoesAutomaticamente(); // Função existente
        identificarInformacoesAdicionais();
        document.getElementById('copiarTextoEspecial').addEventListener('click', copiarTextoEspecial);
        // Nova função
    });
});

function formatarNome() {
    const texto = document.getElementById('inputText').value;
    const nomeRegex = /Nome: (.+)|Name: (.+)/i;
    const nomeMatch = texto.match(nomeRegex);
    if (nomeMatch) {
        const nome = nomeMatch[1] || nomeMatch[2];
        const nomeFormatado = nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
        NomeDoContato = nomeFormatado
        copiarParaClipboard(nomeFormatado);
    }
}

function formatarEmpresa() {
    const texto = document.getElementById('inputText').value;
    const empresaRegex = /Empresa: (.+)|Enterprise: (.+)/i;
    const empresaMatch = texto.match(empresaRegex);
    if (empresaMatch) {
        const empresa = empresaMatch[1] || empresaMatch[2];
        const empresaFormatada = empresa.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
        NomeDaEmpresa = empresaFormatada
        copiarParaClipboard(empresaFormatada);
    }
}

function formatarAssunto() {
    const texto = document.getElementById('inputText').value;
    const éChatbot = /ChatBot <agencechatbot76@gmail.com>/i.test(texto);

    if (éChatbot) {
        copiarParaClipboard("Nao ha campo de assunto nos leads do chatbot.");
        return;
    }

    const assuntoRegex = /Comentários:\s*([\s\S]*?)\s*Agence/;
    const assuntoMatch = texto.match(assuntoRegex);
    if (assuntoMatch) {
        let assunto = assuntoMatch[1].trim();
        assunto = assunto.toLowerCase();
        let assuntoFormatado = assunto.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());

        copiarParaClipboard(assuntoFormatado.charAt(0).toUpperCase() + assuntoFormatado.slice(1));
        mostrarPopUp("Assunto formatado e copiado para a área de transferência: " + assuntoFormatado);
    } else {
        mostrarPopUp("Campo de assunto não encontrado.");
    }
}


function copiarParaClipboard(texto) {
    navigator.clipboard.writeText(texto).then(() => {
        mostrarPopUp("Texto copiado: " + texto.substring(0, 30) + (texto.length > 30 ? "..." : ""));
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
    });
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

    setTimeout(() => {
        popUp.classList.remove('active');
    }, 1000);
}

function formatarEmail() {
    const texto = document.getElementById('inputText').value;
    const emailRegex = /E-mail: (.+)|Email: (.+)/i;
    const emailMatch = texto.match(emailRegex);
    if (emailMatch) {
        const email = (emailMatch[1] || emailMatch[2]).toLowerCase();
        EmailDoContato = email; // Atualiza a variável global corretamente
        EmailFormatado = email; // Mantém esta linha se precisar do email formatado em minúsculas em outra parte do código
        copiarParaClipboard(email);
    } else {
        mostrarPopUp("E-mail não encontrado.");
    }
}

function formatarTelefone() {
    const texto = document.getElementById('inputText').value;
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const telefoneMatch = texto.match(telefoneRegex);
    if (telefoneMatch) {
        let numeros = telefoneMatch[1].replace(/\D/g, '');

        if (numeros.startsWith('55') && (numeros.length === 12 || numeros.length === 13)) {
            const formatado = '+' + numeros.substring(0, 2) + ' ' + numeros.substring(2, 4) + ' ' + numeros.substring(4);
            copiarParaClipboard(formatado);
            mostrarPopUp("Número de telefone formatado e copiado com sucesso!");
        } else if (numeros.length >= 10 && numeros.length <= 11) {
            numeros = '55' + numeros;
            const formatado = '+' + numeros.substring(0, 2) + ' ' + numeros.substring(2, 4) + ' ' + numeros.substring(4);
            copiarParaClipboard(formatado);
            mostrarPopUp("Número de telefone formatado e copiado com sucesso!");
        } else {
            mostrarPopUp("Número de telefone parece estar incompleto ou incorreto.");
        }
    } else {
        mostrarPopUp("Telefone não encontrado.");
    }
}

function identificarInformacoesAutomaticamente() {
    const texto = document.getElementById('inputText').value;
    let origem = "";
    let interesse = "";

    if (texto.includes("ChatBot") || texto.includes("Inbound Chatbot")) {
        origem = "Origem: Inbound Whatsapp";
    } else if (texto.includes("Fale Conosco") || texto.includes("Inbound E-mail")) {
        origem = "Origem: Inbound E-mail";
    }

    const necessidadeRegex = /Necessidade: (.+)/i;
    const interesseRegex = /Estou interessado em: (.+)/i;
    const necessidadeMatch = texto.match(necessidadeRegex);
    const interesseMatch = texto.match(interesseRegex);

    if (necessidadeMatch) {
        interesse = "Interesse: " + necessidadeMatch[1];
        InteresseDoLead = interesse;
    } else if (interesseMatch) {
        interesse = "Interesse: " + interesseMatch[1];
        InteresseDoLead = interesse;
    }

    document.getElementById('origemLead').textContent = origem;
    document.getElementById('interesseLead').textContent = interesse;
}

function formatarLead() {
    const texto = document.getElementById('inputText').value;
    const nomeRegex = /Nome: (.+)|Name: (.+)/i;
    const empresaRegex = /Empresa: (.+)|Enterprise: (.+)/i;
    const telefoneRegex = /Telefone:.*?(\d[\d\s().-]*)/i;
    const interesseRegex = /Necessidade: (.+)|Estou interessado em: (.+)/i;

    const nomeMatch = texto.match(nomeRegex);
    const empresaMatch = texto.match(empresaRegex);
    const telefoneMatch = texto.match(telefoneRegex);
    const interesseMatch = texto.match(interesseRegex);

    const nome = nomeMatch ? nomeMatch[1] || nomeMatch[2] : "Não informado";
    const nomeFormatado = nome.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
    NomeDoContato = nomeFormatado

    const empresa = empresaMatch ? empresaMatch[1] || empresaMatch[2] : "Não informado";
    const empresaFormatada = empresa.split(' ').map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase()).join(' ');
    NomeDaEmpresa = empresaFormatada

    let telefone = telefoneMatch ? telefoneMatch[1].replace(/\D/g, '') : "Não informado";

    const interesse = interesseMatch ? interesseMatch[1] || interesseMatch[2] : "Não informado";

    if (telefone.startsWith('55') && (telefone.length === 12 || telefone.length === 13)) {
        telefone = '+' + telefone.substring(0, 2) + ' ' + telefone.substring(2, 4) + ' ' + telefone.substring(4);
    } else if (telefone.length >= 10 && telefone.length <= 11) {
        telefone = '55' + telefone;
        telefone = '+' + telefone.substring(0, 2) + ' ' + telefone.substring(2, 4) + ' ' + telefone.substring(4);
        TelefoneDoContato = telefone

    }

    let informacoes = "";

    // Definindo as expressões regulares para cada tipo de informação
    const cnpjRegex = /CNPJ: (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const numeroFuncionariosRegex = /Quantidade de Funcionários(.*?)icone like/s;
    const faturamentoAnualRegex = /Faturamento Anual(.*?)icone like/s;

    // Procurando pelas informações no texto
    const cnpjMatch = texto.match(cnpjRegex);
    const porteMatch = texto.match(porteRegex);
    const numeroFuncionariosMatch = texto.match(numeroFuncionariosRegex);
    const faturamentoAnualMatch = texto.match(faturamentoAnualRegex);

    // Adicionando as informações encontradas na string de informacoes
    if (cnpjMatch) informacoes += `Dados da Empresa\nCNPJ: ${cnpjMatch[1]};\n`;
    if (porteMatch) {
        const porteTexto = porteMatch[1].replace("Porte", "").trim();
        informacoes += `Porte da Empresa: ${porteTexto};\n`;
    }
    if (numeroFuncionariosMatch) {
        // Removendo a frase indesejada e espaços extras
        let numeroFuncionariosTexto = numeroFuncionariosMatch[1].replace("Quantidade de Funcionários", "").trim();
        informacoes += `Número de Funcionários: ${numeroFuncionariosTexto};\n`;
    }
    if (faturamentoAnualMatch) {
        // Removendo a frase indesejada e espaços extras
        let faturamentoAnualTexto = faturamentoAnualMatch[1].replace("Faturamento Anual", "").trim();
        informacoes += `Faturamento Anual: ${faturamentoAnualTexto}.\n\n`;
    }

    const resultadoTexto = `Chegou lead na fila Brasil para o @\nNome da empresa: ${NomeDaEmpresa}\nWhatsapp: ${telefone}\nContato: ${NomeDoContato}\nInteresse: ${interesse}\n\n${informacoes}Perfil linkedin:\n\n--------------------------------------------------------
próximo da fila é o @`;
    document.getElementById('resultado').textContent = resultadoTexto;
}

function copiarTexto() {
    const textoParaCopiar = document.getElementById('resultado').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Texto copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar texto: ', err);
        mostrarPopUp('Falha ao copiar texto.');
    });
}

document.getElementById('inputText').addEventListener('input', formatarLead);

// Garante que a formatação seja feita automaticamente ao carregar a página, se houver texto preenchido.
document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('inputText').value) {
        formatarLead();
    }
});



function identificarInformacoesAdicionais() {
    const texto = document.getElementById('inputText').value;
    let informacoes = "";

    // Definindo as expressões regulares para cada tipo de informação
    const cnpjRegex = /CNPJ: (\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2})/i;
    const porteRegex = /icone Porte(.*?)icone Quantidade de Funcionários/s;
    const numeroFuncionariosRegex = /Quantidade de Funcionários(.*?)icone like/s;
    const faturamentoAnualRegex = /Faturamento Anual(.*?)icone like/s;

    // Procurando pelas informações no texto
    const cnpjMatch = texto.match(cnpjRegex);
    const porteMatch = texto.match(porteRegex);
    const numeroFuncionariosMatch = texto.match(numeroFuncionariosRegex);
    const faturamentoAnualMatch = texto.match(faturamentoAnualRegex);

    // Adicionando as informações encontradas na string de informacoes
    if (cnpjMatch) informacoes += `Dados da Empresa\nCNPJ: ${cnpjMatch[1]};\n`;
    if (porteMatch) {
        const porteTexto = porteMatch[1].replace("Porte", "").trim();
        informacoes += `Porte da Empresa: ${porteTexto};\n`;
    }
    if (numeroFuncionariosMatch) {
        // Removendo a frase indesejada e espaços extras
        let numeroFuncionariosTexto = numeroFuncionariosMatch[1].replace("Quantidade de Funcionários", "").trim();
        informacoes += `Número de Funcionários: ${numeroFuncionariosTexto};\n`;
    }
    if (faturamentoAnualMatch) {
        // Removendo a frase indesejada e espaços extras
        let faturamentoAnualTexto = faturamentoAnualMatch[1].replace("Faturamento Anual", "").trim();
        informacoes += `Faturamento Anual: ${faturamentoAnualTexto}.\n\n`;
    }

    // Exibindo as informações
    document.getElementById('informacoesAdicionais').textContent = informacoes;
}

function copiarInformacoesAdicionais() {
    const textoParaCopiar = document.getElementById('informacoesAdicionais').textContent;
    navigator.clipboard.writeText(textoParaCopiar).then(() => {
        mostrarPopUp('Informações adicionais copiadas com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar informações adicionais: ', err);
        mostrarPopUp('Falha ao copiar informações adicionais.');
    });
}


function PesquisarLinkedin() {
    // Garante que os nomes estejam formatados antes da pesquisa
    formatarNome();
    formatarEmpresa();

    if (NomeDoContato && NomeDaEmpresa) {
        const query = `${NomeDoContato} ${NomeDaEmpresa} Linkedin`;
        const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        window.open(url, '_blank');
    } else {
        mostrarPopUp("Nome do contato e/ou nome da empresa não identificados.");
    }
}

function SiteDaEmpresa() {
    formatarEmail(); // Isso garantirá que EmailDoContato esteja atualizado

    if (EmailDoContato) {
        const dominio = EmailDoContato.split('@')[1];
        const dominiosPessoais = ['gmail.com', 'hotmail.com', 'yahoo.com', 'outlook.com'];

        if (!dominiosPessoais.includes(dominio.toLowerCase())) {
            const url = `http://${dominio}`;
            window.open(url, '_blank');
        } else {
            mostrarPopUp("O e-mail fornecido é pessoal.");
        }
    } else {
        mostrarPopUp("E-mail do contato não identificado.");
    }
}


function formatarTextoEspecial() {
    const texto = document.getElementById('inputText').value;
    // Suponha que você queira incluir informações similares, mas com um formato diferente
    const emailRegex = /E-mail: (.+)|Email: (.+)/i;
    const emailMatch = texto.match(emailRegex);

    /* const interesseRegex = /Necessidade: (.+)|Estou interessado em: (.+)/i;
     const interesseMatch = texto.match(interesseRegex); */



    let EmailFormatado = "";
    if (emailMatch) {
        // Captura o e-mail do match encontrado e converte para minúsculas
        EmailFormatado = (emailMatch[1] || emailMatch[2]).toLowerCase();
    } else {
        console.log("E-mail não encontrado.");
        EmailFormatado = "E-mail não encontrado.";
    }


    // Identificação e formatação do assunto
    const éChatbot = /ChatBot <agencechatbot76@gmail.com>/i.test(texto);
    let assuntoFormatado = "";

    if (éChatbot) {
        assuntoFormatado = "Não há campo de assunto nos leads do chatbot.";
    } else {
        const assuntoRegex = /Comentários:\s*([\s\S]*?)\s*Agence/;
        const assuntoMatch = texto.match(assuntoRegex);
        if (assuntoMatch) {
            let assunto = assuntoMatch[1].trim();
            assunto = assunto.toLowerCase();
            assuntoFormatado = assunto.replace(/([.!?]\s*)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
            assuntoFormatado = assuntoFormatado.charAt(0).toUpperCase() + assuntoFormatado.slice(1);
        } else {
            console.log("Campo de assunto não encontrado.");
            assuntoFormatado = "Campo de assunto não encontrado.";
        }
    }


    TextoEspecial = `Chegou lead para você por fora da fila. \n\nInformações do lead:\n\nNome do Contato: ${NomeDoContato}\nEmpresa: ${NomeDaEmpresa}\nE-mail: ${EmailFormatado}\nTelefone: ${TelefoneDoContato}\n${InteresseDoLead}\nAssunto: ${assuntoFormatado}`;
}


function copiarTextoEspecial() {
    formatarTextoEspecial(); // Garante que o texto especial esteja atualizado
    navigator.clipboard.writeText(TextoEspecial).then(() => {
        mostrarPopUp('Texto especial copiado com sucesso!');
    }).catch(err => {
        console.error('Erro ao copiar o texto especial: ', err);
        mostrarPopUp('Falha ao copiar o texto especial.');
    });
}
