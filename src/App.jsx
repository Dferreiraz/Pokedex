import { useState } from 'react'
import { usePokemon } from './hooks/usePokemon'
import { useFavorites } from './hooks/useFavorites'
import Header from './components/Header/Header'
import SearchBar from './components/SearchBar/SearchBar'
import PokemonScreen from './components/PokemonScreen/PokemonScreen'
import Sidebar from './components/Sidebar/Sidebar'
import Loading from './components/Loading/Loading'
import ErrorMessage from './components/ErrorMessage/ErrorMessage'
import './App.css'

function App() {
  const [currentId, setCurrentId] = useState(1)
  const { pokemon, loading, error, loadPokemon } = usePokemon(currentId)
  const { 
    favorites, 
    team, 
    toggleFavorite, 
    isFavorite, 
    addToTeam, 
    isInTeam, 
    clearTeam 
  } = useFavorites()

  const handleSearch = (searchTerm) => {
    loadPokemon(searchTerm)
  }

  const handleNavigate = (direction) => {
    if (!pokemon) return
    const newId = direction === 'next' ? pokemon.id + 1 : pokemon.id - 1
    if (newId > 0) {
      setCurrentId(newId)
    }
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={() => loadPokemon(currentId)} />

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <SearchBar onSearch={handleSearch} currentId={currentId} />
        <PokemonScreen 
          pokemon={pokemon}
          onNavigate={handleNavigate}
          onFavorite={() => toggleFavorite(pokemon.id)}
          isFavorite={isFavorite(pokemon.id)}
          onAddToTeam={() => addToTeam(pokemon)}
          isInTeam={isInTeam}
        />
      </main>
      <Sidebar 
        favorites={favorites} 
        team={team} 
        onClearTeam={clearTeam} 
      />
    </div>
  )
}

export default App