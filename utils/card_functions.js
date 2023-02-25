const clickedOnCard = (e,name, data, setData) => {
    const updatedData = {
        ...data,
        cards: data.cards.map((card) => {
            if (card.name === name) {
                return {
                    ...card,
                    Selected: !card.Selected,
                };
            }
            return card;
        }),
    };
    setData(updatedData)
}

const getCardStats = (card) => {
    let statsStrings = []
    Object.keys(card.Stats).forEach(function(statName) {
        if (card.Stats[statName] > 0) {
            statsStrings.push(`${statName}: ${card.Stats[statName]}`)
        }
    })
    return statsStrings
}

const clickedOnFilter = (e,cards,label,filters,setFilters) => {
    if (cards.length > 0) { //can only activate filters when there are cards
        let foundLabel = false
        let newfilters = [...filters]
        for (let index = 0; index < filters.length; index++) {
            if (filters[index] == label.Name) {
                foundLabel = true
                newfilters.splice(index,1)
                break
            }
        }
        if (!foundLabel) { 
            newfilters.push(label.Name)
        } 
        setFilters(newfilters)
    }
}

export { clickedOnCard, getCardStats, clickedOnFilter}