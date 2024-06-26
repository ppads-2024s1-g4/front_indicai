const tabelaSeries = document.querySelector('#tabelaSeries');
const tabelaFormularioSeries = document.querySelector('#tabelaFormularioSeries');
const corpoTabelaSeries = document.querySelector('#corpoTabelaSeries');
const paragrafoMensagemSeries = document.querySelector('#paragrafoMensagemSeries');

const tabelaAvaliacaoSeries = document.querySelector('#tabelaAvaliacaoSeries');
const tabelaFormularioAvaliacao = document.querySelector('#tabelaFormularioAvaliacao');
const corpoTabelaAvaliacaoSerie = document.querySelector('#corpoTabelaAvaliacaoSerie');
const paragrafoMensagemAvaliacao = document.querySelector('#paragrafoMensagemAvaliacao');
const txtIdAvaliacao = document.querySelector('#txtIdAvaliacao');
const txtNotaSerieAvaliacao = document.querySelector('#txtNotaSerieAvaliacao');
const txtComentarioSerie = document.querySelector('#txtComentarioSerie');
const txtIdUsuarioA = document.querySelector('#txtIdUsuarioA');
const txtIdSerie = document.querySelector('#txtIdSerie');

const btnSalvarAvaliacao = document.querySelector('#btnSalvarAvaliacao');
var criandoNovaAvaliacao = false;

const btnNovoSerie = document.querySelector('#btnNovoSerie');
const btnSalvarSerie = document.querySelector('#btnSalvarSerie');
const btnApagarSerie = document.querySelector('#btnApagarSerie');
const btnCancelarSerie = document.querySelector('#btnCancelarSerie');
var criandoNovaSerie = false;

var token = localStorage.getItem("token");

inicializarSerie();

function inicializarSerie(){
    criandoNovaSerie = false;
    listarTodasSeries();
}

function listarTodasSeries(){
    asyncLerSeries(preencherTabelaSeries, errorHandler);
}

function preencherTabelaSeries(series){
    exibirSeries(series);
}

function errorHandler(error) {
    paragrafoMensagemSeries.textContent = "Erro ao listar Séries (código " + error.message + ")";
}

let serieClicadoId = null;
let serieClicadoUrl = null;
let serieClicadoTitulo = null;

function exibirSeries(series) {
    const seriesContainer = document.getElementById('series-container');
    seriesContainer.innerHTML = ""; 

    series.forEach(serie => {
        // Cria um elemento card para cada serie
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.idSerie = serie.id;

        // Adiciona a imagem do serie ao card
        const imagem = document.createElement('img');
        imagem.src = serie.urlCapa;
        imagem.alt = serie.titulo;
        card.appendChild(imagem);

        // Adiciona o título do serie ao card
        const linkTitulo = document.createElement('a');
        linkTitulo.textContent = serie.titulo;
        linkTitulo.href = `#`;
        linkTitulo.classList.add('linkTitulo');
        linkTitulo.addEventListener('click', function(event) {
            // Impede o comportamento padrão do link
            event.preventDefault();
            serieClicadoId = serie.id;
            serieClicadoUrl = serie.urlCapa;
            serieClicadoTitulo = serie.titulo;

            var generoSerie = serie.genero.name;
            exibirDetalhesRecomendacoesSerie(generoSerie);

            txtIdSerie.value = serieClicadoId;

            document.getElementById('recomendacoesSeries').style.display = 'none';
            document.getElementById('sectionAvaliação').style.display = 'block';
            exibirDetalhesSerieAvaliacao();

        });
        card.appendChild(linkTitulo);

        // Adiciona outrass informações do serie ao card
        const diretor = document.createElement('p');
        diretor.textContent = `Diretor: ${serie.diretor}`;
        card.appendChild(diretor);

        const ano = document.createElement('p');
        ano.textContent = `Ano: ${serie.anoLancamento}`;
        card.appendChild(ano);

        // Adiciona o card ao container de series
        seriesContainer.appendChild(card);
    });
}

function exibirDetalhesSerieAvaliacao() {
    
    document.getElementById('serieClicadoId').textContent = `ID da Série: ${serieClicadoId}`;
    document.getElementById('imagemSerieAvaliacao').src = serieClicadoUrl;
    document.getElementById('tituloSerieAvaliacao').textContent = serieClicadoTitulo;
    document.getElementById('serieClicadoId').value = serieClicadoId;
    document.getElementById('serieClicadoId').disabled = true;

    listarTodasAvaliacoes(serieClicadoId);

}

inicializarAvaliacao();

function inicializarAvaliacao() {
    paragrafoMensagemAvaliacao.textContent = 'Preencha as informações de avaliação:';
    txtIdAvaliacao.value = '';
    txtNotaSerieAvaliacao.value = '';
    txtComentarioSerie.value = '';
    txtIdUsuarioA.value = '';
    txtIdSerie.value = '';

    txtIdAvaliacao.disabled =true;
    txtNotaSerieAvaliacao.enabled = true;
    txtComentarioSerie.enabled = true;
    txtIdUsuarioA.disabled = true;
    txtIdSerie.disabled = true;

    btnSalvarAvaliacao.disabled = false;

    listarTodasAvaliacoes();
}

function listarTodasAvaliacoes(idSerie) {
    asyncLerAvaliacoes(idSerie, preencherTabelaAvaliacoes, errorHandler);
}

document.addEventListener('DOMContentLoaded', function() {
    // Verifica se o usuário está logado
    const idUsuario = localStorage.getItem("idUsuario");
    if (idUsuario) {
        // Se estiver logado, defina o valor do campo txtIdUsuarioA como ID do usuário
        document.getElementById('txtIdUsuarioA').value = idUsuario;
    }
});

function preencherTabelaAvaliacoes(avaliacoes) {
    const corpoTabelaAvaliacaoSerie = document.getElementById('corpoTabelaAvaliacaoSerie');
    corpoTabelaAvaliacaoSerie.innerHTML = ""; // Limpa o conteúdo atual da tabela

    const nomeUsuario = localStorage.getItem("username");

    avaliacoes.forEach(avaliacao => {
        if (avaliacao.item.id === serieClicadoId) {
            // Cria um novo elemento <div> para representar a avaliação como um comentário
            const comentario = document.createElement('div');
            comentario.classList.add('avaliacao-comentario');

            const imagemSerie = document.createElement('img');
            imagemSerie.src = serieClicadoUrl;
            imagemSerie.alt = serieClicadoTitulo;
            comentario.appendChild(imagemSerie);

            const conteudo = document.createElement('div'); // Novo elemento para o conteúdo
            conteudo.classList.add('conteudo');

            const tituloSerie = document.createElement('h3');
            tituloSerie.textContent = `${serieClicadoTitulo}`;
            conteudo.appendChild(tituloSerie);

            // Adiciona a nota da avaliação ao conteúdo
            const nota = document.createElement('p');
            nota.textContent = `Nota: ${avaliacao.nota}`;
            conteudo.appendChild(nota);

            // Adiciona o comentário ao conteúdo
            const textoComentario = document.createElement('p');
            textoComentario.textContent = `Comentário: ${avaliacao.comentario}`;
            conteudo.appendChild(textoComentario);

            // Adiciona o nome do usuário ao conteúdo
            // const idUsuario = document.createElement('p');
            // idUsuario.textContent = `Avaliação feita por: ${avaliacao.usuario.id}`;
            // conteudo.appendChild(idUsuario);

            // Adiciona o nome do usuário ao conteúdo
            const nomeUsuarioTexto = document.createElement('p');
            nomeUsuarioTexto.textContent = `Avaliação feita por: ${avaliacao.usuario.username} (${avaliacao.usuario.id})`;
            conteudo.appendChild(nomeUsuarioTexto);

            // Adiciona o conteúdo ao comentário
            comentario.appendChild(conteudo);

            // Adiciona o comentário ao corpo da tabela
            corpoTabelaAvaliacaoSerie.appendChild(comentario);
        }
    });
}


function errorHandler(error) {
    paragrafoMensagemAvaliacao.textContent = "Erro ao listar Séries (código " + error.message + ")";
}

function salvarAvaliacao() {
    const dadosAvaliacao = { 
        'nota': txtNotaSerieAvaliacao.value, 
        'comentario': txtComentarioSerie.value,
        'usuario': {"id": txtIdUsuarioA.value},
        'item': {"id": serieClicadoId},
    };
    const errorHandler = function (error) {
        paragrafoMensagemAvaliacao.textContent = 'Erro ao criar nova Avaliação (código ' + error.message + ')';
    }
    asyncCriarAvaliacao(dadosAvaliacao, inicializarAvaliacao, errorHandler);
}

document.addEventListener('DOMContentLoaded', function () {
    // Verifica se o usuário está logado
    const idUsuario = localStorage.getItem("idUsuario");
    if (idUsuario) {
        // Define o valor do campo txtIdUsuarioA como ID do usuário
        document.getElementById('txtIdUsuarioA').value = idUsuario;

        // Verifica o tipo de usuário
        fetch(`https://indicai.onrender.com/api/usuarios/${idUsuario}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                return response.json();
            })
            .then(data => {
                const roleUsuario = data.role;
                const painelNavBtn = document.getElementById('painel-nav-btn');

                if (painelNavBtn) {
                    if (roleUsuario === 'ADMIN') {
                        painelNavBtn.style.display = 'block';
                    } else {
                        painelNavBtn.style.display = 'none';
                    }
                }
            })
            .catch(error => {
                console.error('Failed to fetch user information:', error);
            });
    }
});
//Funcoes Rest

async function asyncLerSeries(proxsucesso, proxerro) {
    const URL = `https://indicai.onrender.com/api/series`;
    fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
        .then(resposta => resposta.json())
        .then(jsonResponse => proxsucesso(jsonResponse))
        .catch(proxerro)
}

async function asyncLerSerieById(id, proxsucesso, proxerro) {
    const URL = `https://indicai.onrender.com/api/series/${id}`;
    fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
        .then(resposta => resposta.json())
        .then(jsonResponse => proxsucesso(jsonResponse))
        .catch(proxerro);
}


async function asyncCriarAvaliacao(dadosAvaliacao, proxsucesso, proxerro) {
    const URL = `https://indicai.onrender.com/api/avaliacoes`;
    const postRequest = {
        method: 'POST',
        body: JSON.stringify(dadosAvaliacao),
        headers: { 
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    fetch(URL, postRequest)
        .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
        .then(resposta => resposta.json())
        .then(jsonResponse => proxsucesso())
        .catch(proxerro);
}

async function asyncLerAvaliacoes(idSerie, proxsucesso, proxerro) {
    const URL = `https://indicai.onrender.com/api/avaliacoes?item=${idSerie}`;
    fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
        .then(resposta => resposta.json())
        .then(jsonResponse => proxsucesso(jsonResponse))
        .catch(proxerro);
}

// async function asyncLerSeries(proxsucesso, proxerro) {
//     const URL = `https://indicai.onrender.com/api/series`;
//     fetch(URL)
//         .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
//         .then(resposta => resposta.json())
//         .then(jsonResponse => proxsucesso(jsonResponse))
//         .catch(proxerro)
// }

// async function asyncLerSerieById(id, proxsucesso, proxerro) {
//     const URL = `https://indicai.onrender.com/api/series/${id}`;
//     fetch(URL)
//         .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
//         .then(resposta => resposta.json())
//         .then(jsonResponse => proxsucesso(jsonResponse))
//         .catch(proxerro);
// }


// async function asyncCriarAvaliacao(dadosAvaliacao, proxsucesso, proxerro) {
//     const URL = `https://indicai.onrender.com/api/avaliacoes`;
//     const postRequest = {
//         method: 'POST',
//         body: JSON.stringify(dadosAvaliacao),
//         headers: { 'Content-type': 'application/json' }
//     };
//     fetch(URL, postRequest)
//         .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
//         .then(resposta => resposta.json())
//         .then(jsonResponse => proxsucesso())
//         .catch(proxerro);
// }

// async function asyncLerAvaliacoes(idSerie, proxsucesso, proxerro) {
//     const URL = `https://indicai.onrender.com/api/avaliacoes?item=${idSerie}`;
//     fetch(URL)
//         .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
//         .then(resposta => resposta.json())
//         .then(jsonResponse => proxsucesso(jsonResponse))
//         .catch(proxerro);
// }

function exibirDetalhesRecomendacoesSerie(generoSerie) {
    listarTodasRecomendacoesSerie(generoSerie);
}

function listarTodasRecomendacoesSerie(generoSerie) {
    asyncLerRecomendacoesSeries(generoSerie, preencherTabelaRecomendacoesSerie, errorHandler);
}

function preencherTabelaRecomendacoesSerie(recomendacao) {
    const corpoTabelaRecomendacoesSeries = document.getElementById('corpoTabelaRecomendacoesSeries');
    corpoTabelaRecomendacoesSeries.innerHTML = ""; // Limpa o conteúdo atual da tabela

    recomendacao.forEach(Serie => {
        // Cria um novo elemento <div> para representar o Serie
        const recomendacaoDiv = document.createElement('div');
        recomendacaoDiv.classList.add('card');

        // Cria um contêiner para a imagem e o título
        const conteudoRecomendacao = document.createElement('div');
        conteudoRecomendacao.classList.add('Series-container');

        // Adiciona o título do Serie ao contêiner
        const tituloSerie = document.createElement('h3');
        tituloSerie.textContent = Serie.titulo; // Supondo que o título do Serie esteja no campo titulo
        conteudoRecomendacao.appendChild(tituloSerie);

        // Adiciona a imagem do Serie ao contêiner
        const imagemSerie = document.createElement('img');
        imagemSerie.src = Serie.urlCapa; // Supondo que a URL da imagem esteja no campo urlImagem
        imagemSerie.alt = Serie.titulo; // Supondo que o título do Serie esteja no campo titulo
        conteudoRecomendacao.appendChild(imagemSerie);

        // Adiciona o contêiner ao div principal da recomendação
        recomendacaoDiv.appendChild(conteudoRecomendacao);

        // Adiciona o div de recomendação ao corpo da tabela
        corpoTabelaRecomendacoesSeries.appendChild(recomendacaoDiv);
    });
}

function errorHandler(error) {
    paragrafoMensagemAvaliacao.textContent = "Erro ao listar recomendacao (código " + error.message + ")";
}

async function asyncLerRecomendacoesSeries(generoSerie, proxsucesso, proxerro) {
    const URL = `https://indicai.onrender.com/api/series?genero=${generoSerie}`;
    fetch(URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(resposta => { if (!resposta.ok) throw Error(resposta.status); return resposta; })
        .then(resposta => resposta.json())
        .then(jsonResponse => proxsucesso(jsonResponse))
        .catch(proxerro);
}
