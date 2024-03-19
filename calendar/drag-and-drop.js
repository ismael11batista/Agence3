let elementoArrastado = null;
let cloneElemento = null; // Vamos criar um clone do elemento para o arrasto
let offsetX = 0, offsetY = 0;

document.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('tarefa-arrastavel')) {
        elementoArrastado = e.target;

        // Cria um clone do elemento para ser arrastado
        cloneElemento = elementoArrastado.cloneNode(true);
        cloneElemento.classList.add('arrastando'); // Podemos adicionar uma classe para estilizar o clone durante o arrasto
        document.body.appendChild(cloneElemento);

        // Calcula o offset do mouse relativo ao elemento arrastado
        offsetX = e.clientX - elementoArrastado.getBoundingClientRect().left;
        offsetY = e.clientY - elementoArrastado.getBoundingClientRect().top; // Ajuste feito aqui

        // Posiciona o clone no mesmo lugar que o elemento original
        cloneElemento.style.position = 'absolute';
        cloneElemento.style.left = elementoArrastado.getBoundingClientRect().left + 'px';
        cloneElemento.style.top = elementoArrastado.getBoundingClientRect().top + 'px';
        cloneElemento.style.width = elementoArrastado.offsetWidth + 'px'; // Garante que o clone tenha a mesma largura do original

        document.addEventListener('mousemove', eventoMouseMove);
        document.addEventListener('mouseup', eventoMouseUp);
    }
});

function eventoMouseMove(e) {
    if (!cloneElemento) return;

    cloneElemento.style.left = e.clientX - offsetX + 'px';
    cloneElemento.style.top = e.clientY - offsetY + 'px';
}

function eventoMouseUp(e) {
    if (!cloneElemento) return;

    document.removeEventListener('mousemove', eventoMouseMove);
    document.removeEventListener('mouseup', eventoMouseUp);

    let elementoAlvo = document.elementFromPoint(e.clientX, e.clientY);

    // Remove o clone após o arrasto
    document.body.removeChild(cloneElemento);
    cloneElemento = null;

    // Verifica se o elemento alvo é uma tarefa válida e diferente do elemento arrastado
    if (elementoAlvo && elementoAlvo !== elementoArrastado && elementoAlvo.classList.contains('tarefa-arrastavel')) {
        trocaElementos(elementoArrastado, elementoAlvo);
    }

    elementoArrastado = null;
}

function trocaElementos(elem1, elem2) {
    const parent1 = elem1.parentNode;
    const parent2 = elem2.parentNode;

    // Troca os elementos de lugar
    if (parent1.isSameNode(parent2)) {
        parent1.insertBefore(elem1, elem2);
    } else {
        parent1.insertBefore(elem2, elem1.nextSibling);
        parent2.insertBefore(elem1, elem2.nextSibling);
    }
}