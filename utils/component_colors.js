const getFilterStatsColor = (filterStats) => {
    if (filterStats) {
        return 'LightBlue'
    }
    return 'white'
}
const getCardColor = (card) => {
    if (card.Selected) {
        return 'Ivory'
    } else {
        return 'white'
    }
}
const getLabelColor = (filters,label) => {
    for (let index = 0; index < filters.length; index++) {
        if (filters[index] == label.Name) {
            return 'LightGreen'
        }
    }
    return 'white'
}
export { getFilterStatsColor, getCardColor, getLabelColor  }