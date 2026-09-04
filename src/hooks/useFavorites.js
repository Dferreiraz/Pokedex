import { useState, useEffect } from 'react'

const FAVORITES_KEY = 'pokedex_favorites'
const TEAM_KEY = 'pokedex_team'

export function useFavorites() {
    const [favorites, setFavorites] = useState(() => {
        const stored = localStorage.getItem(FAVORITES_KEY)
        return stored ? JSON.parse(stored) : []
    })

    const [team, setTeam] = useState(() => {
        const stored = localStorage.getItem(TEAM_KEY)
        return stored ? JSON.parse(stored) : []
    })

    useEffect(() => {
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
    }, [favorites])

    useEffect(() => {
        localStorage.setItem(TEAM_KEY, JSON.stringify(team))
    }, [team])

    const toggleFavorite = (pokemonId) => {
        setFavorites(prev => {
            if (prev.includes(pokemonId)) {
                return prev.filter(id => id !== pokemonId)
            }
            return [...prev, pokemonId]
        })
    }

    const isFavorite = (pokemonId) => {
        return favorites.includes(pokemonId)
    }

    const addToTeam = (pokemon) => {
        setTeam(prev => {
            if (prev.length >= 6) {
                return prev
            }
            if (prev.some(p => p.id === pokemon.id)) {
                return prev
            }
            return [...prev, pokemon]
        })
    }

    const removeFromTeam = (pokemonId) => {
        setTeam(prev => prev.filter(p => p.id !== pokemonId))
    }

    const isInTeam = (pokemonId) => {
        return team.some(p => p.id === pokemonId)
    }

    const clearTeam = () => {
        setTeam([])
    }

    return {
        favorites,
        team,
        toggleFavorite,
        isFavorite,
        addToTeam,
        removeFromTeam,
        isInTeam,
        clearTeam
    }
}
