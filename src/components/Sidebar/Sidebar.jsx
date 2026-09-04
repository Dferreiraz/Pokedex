import './style.css'

function Sidebar({ favorites, team, onClearTeam }) {
    return (
        <aside className="sidebar">
            <div className="sidebar-section">
                <h3 className="sidebar-title">Favoritos ({favorites.length})</h3>
                <div className="favorites-list">
                    {favorites.length === 0 ? (
                        <p className="empty-message">Nenhum favorito</p>
                    ) : (
                        <ul className="favorite-items">
                            {favorites.slice(0, 10).map((id) => (
                                <li key={id} className="favorite-item">
                                    <img
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                                        alt={`Pokémon ${id}`}
                                        width="24"
                                        height="24"
                                    />
                                    <span>#{id.toString().padStart(3, '0')}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="sidebar-section">
                <h3 className="sidebar-title">Time ({team.length}/6)</h3>
                <div className="team-list">
                    {team.length === 0 ? (
                        <p className="empty-message">Time vazio</p>
                    ) : (
                        <>
                            <ul className="team-items">
                                {team.map((pokemon) => (
                                    <li key={pokemon.id} className="team-item">
                                        <img
                                            src={pokemon.sprites.front_default}
                                            alt={pokemon.name}
                                            width="24"
                                            height="24"
                                        />
                                        <span>{pokemon.name}</span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={onClearTeam}
                                className="clear-team-button"
                            >
                                Limpar time
                            </button>
                        </>
                    )}
                </div>
            </div>
        </aside>
    )
}

export default Sidebar
