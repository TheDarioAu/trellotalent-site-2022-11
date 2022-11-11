import { hasWord } from './has_word.js';

const getFilteredCards = (data, filters, search) => {
  let filteredCards = []
  const addFilteredCard = (card) => {
    if (hasWord(card.name,search)) {
      filteredCards.push(card) 
    }
  }
  if (filters != null && filters.length > 0){
    let matchingFilters = []
    data.labels.map((label) => {
      filters.map((filter) => {
        if (label.name == filter) {
          matchingFilters.push(label.id)
        }
      })
    })
    let listAdjust = 0
    let listState = 1
    filters.map((filter) => {
      if (listState == 2)
        listState = 3
      data.cardlists.map((list) => {
        if (hasWord(list.name,filter)) {
          listAdjust++
          matchingFilters.push(list.id)
          switch (listState) {
            case 1:
              listState = 2
              break;
            case 3:
              listState = 4
              break;
          }
        }
      })
    })
    data.cards.map((card) => {
      let filterCount = 0
      matchingFilters.map((filterid) => {
        if (card.idLabels.includes(filterid) || card.idList == filterid) {
          filterCount++
          if (filterCount + listAdjust >= matchingFilters.length && listState < 4){
            addFilteredCard(card)
          }
          return
        }
      })
    })  
  } else {
    if (typeof search === "string" && search.trim().length > 0) {
      data.cards.map((card) => {
        addFilteredCard(card)
      })
    }
  }
  return filteredCards
}

export { getFilteredCards }
