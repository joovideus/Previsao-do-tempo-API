//0289081327e08b96ba6d37d491bb781b//
function obterPrevisao() {
    const chaveAPI = '0289081327e08b96ba6d37d491bb781b';
    const inputCidade = document.getElementById('cidadeInput');
    const infoClima = document.getElementById('infoClima');
    const nomeCidadeElemento = document.getElementById('nomeCidade');
    const temperaturaElemento = document.getElementById('temperatura');
    const descricaoElemento = document.getElementById('descricao');
    const iconeClima = document.getElementById('iconeClima');
    const erroElemento = document.getElementById('erro');
    const mensagemErroElemento = document.getElementById('mensagemErro');
    const mensagemCarregandoElemento = document.getElementById('mensagemCarregando');

    // Limpa os dados anteriores
    nomeCidadeElemento.textContent = '';
    temperaturaElemento.textContent = '';
    descricaoElemento.textContent = '';
    iconeClima.src = '';
    erroElemento.classList.add('escondido');
    infoClima.classList.add('escondido');

    // Limpa a mensagem de erro antes de uma nova pesquisa
    mensagemErroElemento.textContent = '';

    const cidade = inputCidade.value;

    // Exibe a mensagem de carregamento apenas durante a requisição à API
    mensagemCarregandoElemento.textContent = 'Carregando informações...';

    // Primeira chamada à API para obter dados básicos
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveAPI}&units=metric`)
        .then(resposta => {
            // Remove a mensagem de carregamento assim que a resposta da API for recebida
            mensagemCarregandoElemento.textContent = '';

            if (!resposta.ok) {
                if (resposta.status === 404) {
                    throw new Error('Cidade não encontrada.');
                } else {
                    throw new Error(`Erro na requisição da API: ${resposta.status} - ${resposta.statusText}`);
                }
            }
            return resposta.json();
        })
        .then(dados => {
            const temperatura = dados.main.temp;
            const descricao = dados.weather[0].description;
            const abreviacaoPais = dados.sys.country; // Código de país abreviado

            // Segunda chamada à API para obter o nome completo do país
            return fetch(`https://restcountries.com/v2/alpha/${abreviacaoPais}`)
                .then(resposta => {
                    if (!resposta.ok) {
                        throw new Error(`Erro na requisição da API de países: ${resposta.status} - ${resposta.statusText}`);
                    }
                    return resposta.json();
                })
                .then(dadosPais => {
                    const nomePais = dadosPais.name; // Nome completo do país

                    nomeCidadeElemento.textContent = `${cidade} (${nomePais})`;
                    temperaturaElemento.textContent = `${temperatura} °C`;
                    descricaoElemento.textContent = `Condição: ${descricao}`;
                    iconeClima.src = `http://openweathermap.org/img/w/${dados.weather[0].icon}.png`;

                    // Exibe a seção de informações meteorológicas
                    infoClima.classList.remove('escondido');
                    erroElemento.classList.add('escondido');
                });
        })
        .catch(erro => {
            console.error(erro);
            // Exibe a seção de erro com a especificação do erro e remove o ícone do tempo
            mostrarMensagemErro(`Erro na requisição da API: ${erro.message}`);
        });
}

function mostrarMensagemErro(mensagem) {
    const erroElemento = document.getElementById('erro');
    const mensagemErroElemento = document.getElementById('mensagemErro');
    const infoClima = document.getElementById('infoClima');
    const iconeClima = document.getElementById('iconeClima');

    mensagemErroElemento.textContent = mensagem;
    erroElemento.classList.remove('escondido');
    infoClima.classList.add('escondido');

    // Remove o ícone do tempo
    iconeClima.src = '';
}
