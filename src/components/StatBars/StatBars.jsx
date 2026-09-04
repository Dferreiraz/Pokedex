import './style.css'

const statNames = {
    hp: 'HP',
    attack: 'Ataque',
    defense: 'Defesa',
    'special-attack': 'Sp. Atk',
    'special-defense': 'Sp. Def',
    speed: 'Velocidade'
}

const maxStat = 255

function StatBars({ stats }) {
    if (!stats) return null

    return (
        <div className="stat-bars">
            {stats.map((stat) => {
                const statName = statNames[stat.stat.name] || stat.stat.name
                const percentage = (stat.base_stat / maxStat) * 100

                return (
                    <div key={stat.stat.name} className="stat-row">
                        <span className="stat-name">{statName}</span>
                        <span className="stat-value">{stat.base_stat}</span>
                        <div className="stat-bar-container">
                            <div
                                className="stat-bar"
                                style={{ 
                                    width: `${percentage}%`,
                                    backgroundColor: getStatColor(stat.base_stat)
                                }}
                            />
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function getStatColor(value) {
    if (value >= 100) return '#4ade80'
    if (value >= 70) return '#facc15'
    if (value >= 40) return '#fb923c'
    return '#f87171'
}

export default StatBars
