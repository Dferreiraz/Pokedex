const botao = document.getElementById("search-btn");
const botaoAnterior = document.getElementById("prev-btn");
const botaoProximo = document.getElementById("next-btn");

let pokemonAtual = 1;


botao.addEventListener("click", () => {

    const input = document.getElementById("pokemon-input").value.toLowerCase();

    if(input === ""){
        return;
    }

    buscarPokemon(input);

});


botaoAnterior.addEventListener("click", () => {

    if(pokemonAtual > 1){

        pokemonAtual--;

        buscarPokemon(pokemonAtual);

    }

});


botaoProximo.addEventListener("click", () => {

    pokemonAtual++;

    buscarPokemon(pokemonAtual);

});


window.addEventListener("DOMContentLoaded", () => {

    buscarPokemon(pokemonAtual);

});



async function buscarPokemon(pokemon){

    try {

        const resposta = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${pokemon}`
        );

        const dados = await resposta.json();

        pokemonAtual = dados.id;

        mostrarPokemon(dados);

        buscarDescricao(dados.id);


    } catch(erro){

        limparTela();

        document.getElementById("pokemon-name").textContent = "Não encontrado";

    }

}



function mostrarPokemon(dados){

    document.getElementById("pokemon-image").src = dados.sprites.front_default;

    document.getElementById("pokemon-name").textContent = dados.name;

    document.getElementById("pokemon-id").textContent = "ID: " + dados.id;

    document.getElementById("pokemon-input").value = dados.name;


    mostrarTipos(dados.types);


    document.getElementById("pokemon-height").textContent =
        "Altura: " + dados.height / 10 + " m";


    document.getElementById("pokemon-weight").textContent =
        "Peso: " + dados.weight / 10 + " kg";


    mostrarHabilidades(dados.abilities);

    mostrarStats(dados.stats);

}



function mostrarTipos(tipos){

    const area = document.getElementById("pokemon-types");

    area.innerHTML = "";


    tipos.forEach(tipo => {

        const span = document.createElement("span");

        span.textContent = tipo.type.name.toUpperCase();

        area.appendChild(span);

    });

}



function mostrarHabilidades(habilidades){

    const lista = document.getElementById("pokemon-abilities");

    lista.innerHTML = "";


    habilidades.forEach(item => {

        const li = document.createElement("li");

        li.textContent = item.ability.name;

        lista.appendChild(li);

    });

}



function mostrarStats(stats){

    document.getElementById("hp").textContent =
        "HP: " + stats[0].base_stat;


    document.getElementById("attack").textContent =
        "Ataque: " + stats[1].base_stat;


    document.getElementById("defense").textContent =
        "Defesa: " + stats[2].base_stat;


    document.getElementById("speed").textContent =
        "Velocidade: " + stats[5].base_stat;

}



async function buscarDescricao(id){

    const resposta = await fetch(
        `https://pokeapi.co/api/v2/pokemon-species/${id}`
    );

    const dados = await resposta.json();


    const descricao = dados.flavor_text_entries.find(
        texto => texto.language.name === "en"
    );


    document.getElementById("pokemon-description").textContent =
        descricao
        ? descricao.flavor_text.replace(/\n|\f/g," ")
        : "Sem descrição";

}



function limparTela(){

    document.getElementById("pokemon-image").src = "";

    document.getElementById("pokemon-types").innerHTML = "";

    document.getElementById("pokemon-abilities").innerHTML = "";

}