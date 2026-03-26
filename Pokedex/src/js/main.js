const botao = document.getElementById('search-btn');

botao.addEventListener('click', async function () {

    const input = document.getElementById('pokemon-input').value;
    const nomePokemon = input.toLowerCase();

    const nome = document.getElementById('pokemon-name');
    const imagem = document.getElementById('pokemon-image');
    const id = document.getElementById('pokemon-id');

    try {

        const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nomePokemon}`);

        const dados = await resposta.json();

        nome.textContent = dados.name;

        imagem.src = dados.sprites.front_default;

        id.textContent = 'ID: ' + dados.id;



    } catch (erro) {
        nome.textContent = 'Não encontrado';
        imagem.src = '';
        id.textContent = 'ID ---';
    }

});

