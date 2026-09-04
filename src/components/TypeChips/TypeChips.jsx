import { getTypeColor, getTypeTranslation } from '../../utils/typeColors'
import { formatPokemonId, capitalizeFirstLetter } from '../../utils/formatUtils'
import './style.css'

function TypeChips({ types }) {
    if (!types || types.length === 0) return null

    return (
        <div className="type-chips">
            {types.map((typeInfo) => {
                const typeName = typeInfo.type.name
                const translatedName = getTypeTranslation(typeName)
                const color = getTypeColor(types)

                return (
                    <span
                        key={typeName}
                        className="type-chip"
                        style={{ backgroundColor: color }}
                    >
                        {translatedName}
                    </span>
                )
            })}
        </div>
    )
}

export default TypeChips
