import { formatPokemonId, capitalizeFirstLetter } from '../../utils/formatUtils'
import { getTypeColor } from '../../utils/typeColors'
import TypeChips from '../TypeChips/TypeChips'
import './style.css'

function PokemonScreen({ pokemon, onNavigate, onFavorite, isFavorite, onAddToTeam, isInTeam }) {
    if (!pokemon) return null

    const backgroundColor = getTypeColor(pokemon.types)
    const formattedId = formatPokemonId(pokemon.id)

    return (
        <div
            className="pokemon-screen"
            style={{ '--pokemon-bg': backgroundColor }}
        >
            <div className="screen-header">
                <span className="pokemon-id">{formattedId}</span>
                <button
                    onClick={onFavorite}
                    className={`favorite-button ${isFavorite ? 'active' : ''}`}
                    aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                    {isFavorite ? '❤️' : '🤍'}
                </button>
            </div>

            <div className="pokemon-image-container">
                <img
                    src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-image"
                />
            </div>

            <h2 className="pokemon-name">{capitalizeFirstLetter(pokemon.name)}</h2>

            <TypeChips types={pokemon.types} />

            {!isInTeam(pokemon.id) && (
                <button
                    onClick={onAddToTeam}
                    className="add-to-team-button"
                    disabled={isInTeam(pokemon.id)}
                >
                    + Adicionar ao time
                </button>
            )}

            <div className="navigation-buttons">
                <button
                    onClick={() => onNavigate('prev')}
                    className="nav-button"
                    aria-label="Pokémon anterior"
                >
                    ← Anterior
                </button>
                <button
                    onClick={() => onNavigate('next')}
                    className="nav-button"
                    aria-label="Próximo Pokémon"
                >
                    Próximo →
                </button>
            </div>
        </div>
    )
}

export default PokemonScreen
