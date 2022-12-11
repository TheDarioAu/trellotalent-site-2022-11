import { hasWord } from './has_word.js';
import { MULTI_STAT_CARDS } from './constants/multi_stat_cards';

const getFilteredCards = (data, filters, search, filterStats, stats) => {
  let filteredCards = []
  let attribute_names = []
  let element_names = []
  let weapon_names = []
  data.attributes.map((attribute) => {
    attribute_names.push(attribute.name)
  })
  data.elements.map((element) => {
    element_names.push(element.name)
  })
  data.weapons.map((weapons) => {
    weapon_names.push(weapons.name)
  })
  const addFilteredCard = (card, cardList) => {
    if (hasWord(card.name,search)) {
      cardList.push(card) 
    } else if (hasWord(card.desc,search)) {
      cardList.push(card) 
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
            addFilteredCard(card, filteredCards)
          }
          return
        }
      })
    })  
  } else {
    if (typeof search === "string" && search.trim().length > 0) {
      data.cards.map((card) => {
        addFilteredCard(card, filteredCards)
      })
    } else {
      data.cards.map((card) => {
        if (card.Selected) {
          addFilteredCard(card, filteredCards)
        }
      })
    }
  }
  if (filterStats) {
    let filteredStatsCards = []
    let cardsList = data.cards
    if (filters != null && filters.length > 0) {
      cardsList = filteredCards
    }
    cardsList.map((card) => {
      let addCard = !MULTI_STAT_CARDS[card.name]
      const addStat = (statName) => {
        if (MULTI_STAT_CARDS[card.name]) {
          if (card.stats[statName] && stats[statName] >= card.stats[statName]) {
            addCard = true
          }
        } else {
          if (card.stats[statName] && stats[statName] < card.stats[statName]) {
            addCard = false
          }
        }
      }
      attribute_names.map(addStat)
      element_names.map(addStat)
      weapon_names.map(addStat)
      if (card.CanInput && !(filters != null && filters.length > 0)) {
        addCard = false
      }
      if (addCard) {
        addFilteredCard(card, filteredStatsCards)
      }
    })
    filteredCards = filteredStatsCards
  }
  return filteredCards
}

export { getFilteredCards }
