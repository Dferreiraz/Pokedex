export function formatPokemonId(id) {
    return `#${id.toString().padStart(3, '0')}`
}

export function formatHeight(heightInDecimeters) {
    return `${(heightInDecimeters / 10).toFixed(1)}m`
}

export function formatWeight(weightInHectograms) {
    return `${(weightInHectograms / 10).toFixed(1)}kg`
}

export function capitalizeFirstLetter(string) {
    if (!string) return ''
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getGenderRatio(genderRate) {
    if (genderRate === -1) return { male: '—', female: '—' }

    const malePercentage = ((8 - genderRate) / 8 * 100).toFixed(0)
    const femalePercentage = ((genderRate) / 8 * 100).toFixed(0)

    return {
        male: `${malePercentage}%`,
        female: `${femalePercentage}%`
    }
}
