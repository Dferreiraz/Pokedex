import { useState } from 'react'
import './style.css'

function SearchBar({ onSearch, currentId }) {
    const [searchTerm, setSearchTerm] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (searchTerm.trim()) {
            onSearch(searchTerm.trim())
            setSearchTerm('')
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e)
        }
    }

    return (
        <form className="search-bar" onSubmit={handleSubmit}>
            <input
                type="text"
                className="search-input"
                placeholder="Buscar Pokémon (nome ou nº)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                aria-label="Buscar Pokémon"
            />
            <button
                type="submit"
                className="search-button"
                aria-label="Pesquisar"
            >
                🔍
            </button>
        </form>
    )
}

export default SearchBar
