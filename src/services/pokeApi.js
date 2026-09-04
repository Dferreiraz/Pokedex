const API_URL = 'https://pokeapi.co/api/v2'

async function fetchJSON(url) {
    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json()
}

export async function getPokemon(idOrName) {
    return fetchJSON(`${API_URL}/pokemon/${idOrName.toString().toLowerCase()}`)
}

export async function getPokemonSpecies(idOrName) {
    return fetchJSON(`${API_URL}/pokemon-species/${idOrName.toString().toLowerCase()}`)
}

export async function getEvolutionChain(url) {
    return fetchJSON(url)
}

export async function getPokemonType(typeName) {
    return fetchJSON(`${API_URL}/type/${typeName.toLowerCase()}`)
}

export async function getAbility(abilityName) {
    return fetchJSON(`${API_URL}/ability/${abilityName.toLowerCase()}`)
}
