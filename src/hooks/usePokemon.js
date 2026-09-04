import { useState, useEffect, useCallback } from 'react'
import { getPokemon, getPokemonSpecies, getEvolutionChain } from '../services/pokeApi'

export function usePokemon(initialId = 1) {
    const [pokemon, setPokemon] = useState(null)
    const [species, setSpecies] = useState(null)
    const [evolutionChain, setEvolutionChain] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const loadPokemon = useCallback(async (idOrName) => {
        if (!idOrName) return

        setLoading(true)
        setError(null)

        try {
            const pokemonData = await getPokemon(idOrName)
            const speciesData = await getPokemonSpecies(pokemonData.id)

            setPokemon(pokemonData)
            setSpecies(speciesData)

            if (speciesData.evolution_chain?.url) {
                const evolutionData = await getEvolutionChain(speciesData.evolution_chain.url)
                setEvolutionChain(evolutionData)
            }
        } catch (err) {
            setError(err.message || 'Erro ao carregar Pokémon')
            setPokemon(null)
            setSpecies(null)
            setEvolutionChain(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        loadPokemon(initialId)
    }, [initialId, loadPokemon])

    return {
        pokemon,
        species,
        evolutionChain,
        loading,
        error,
        loadPokemon
    }
}
