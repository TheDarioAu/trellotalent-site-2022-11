import { hasWord } from './has_word.js';


const getFilteredCards = (data, filters) => {
    let filteredCards = []
    if (filters != null && filters.length > 0){
      let filterid = ""
      data.labels.map((label) => {
        filters.map((filter) => {
          if (hasWord(label.name,filter)) {
            filterid = label.id
            return
          }
        })
      })
      data.cards.map((card) => {
        card.idLabels.map((label) => {
          if (filterid == label) {
            filteredCards.push(card)
            return
          }
        })
      })
    } else {
      filteredCards = [...data.cards]
    }
    return filteredCards
}

export { getFilteredCards }
