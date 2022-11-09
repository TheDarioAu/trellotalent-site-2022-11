import {getTrelloData} from './trello_data.js'

const getSortedData = (setCards,filters) => {
  const hasWord = (str, word) => 
    str.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/).includes(word);
  getTrelloData().then(function(data){
    let cards = []
    data.cards.map((card) => {
      if (hasWord(card.desc,"talent")){
        if (filters != null && filters.length > 0){
          let filterid = ""
          data.labels.map((label) => {
            filters.map((filter) => {
              if (hasWord(label.name,filter)) {
                filterid = label.id
              }
            })
          })
          console.log(filterid)
          card.idLabels.map((label) => {
            console.log(label)
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
