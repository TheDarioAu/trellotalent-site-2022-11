import { hasWord } from './has_word.js';
import { MULTI_STAT_CARDS } from './constants/multi_stat_cards';

const getFilteredCards = (data, filters, search) => {
    let filteredCards = []
    const addFilteredCard = (card) => {
        if (typeof search === "string") {
            if (hasWord(card.name,search)) {
                filteredCards.push(card) 
            } else if (hasWord(card.desc,search)) {
                filteredCards.push(card) 
            }
        } else {
            filteredCards.push(card) 
        }
    }
    if (filters != null && filters.length > 0){
        data.cards.forEach((card) => {    
            let filterCount = 0
            filters.forEach((filter) => {
                if (card.Stats[filter] > 0) {
                    filterCount++
                }
            }) 
            if (filterCount >= filters.length){
                addFilteredCard(card)
            }
        })  
    } else {
        if (typeof search === "string" && search.trim().length > 0) {
            data.cards.forEach((card) => {    
                addFilteredCard(card)
            })
        } else {  
            data.cards.forEach((card) => {    
                if (card.Selected == true) {
                    addFilteredCard(card)
                }
            })
        }
    }
    return filteredCards
}

export { getFilteredCards }