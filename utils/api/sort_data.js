import {getTrelloData} from './trello_data.js'

const getSortedData = (setCards,filters) => {
  const hasWord = (str, word) => 
    str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).includes(word);
  getTrelloData().then(function(data){
    console.log(data)
    let cards = []
    data.cards.map((card) => {
      if (hasWord(card.desc,"talent")){
        if (filters != null){
          let filterid = data.labels.map((label) => {
            return filters.map((filter) => {
              if (label.name == filter) {
                return label.id
              }
            })
          })
          card.idLabels.map((label) => {
            if (filterid == label) {
              cards.push(card)
              return
            }
          })
        } else {
          cards.push(card)
        }
      }
    })
    setCards(cards)
  })
}

export { getSortedData }
//<img src=${astronautData.profile_image_thumbnail} class="rounded float-start" alt=""">    
