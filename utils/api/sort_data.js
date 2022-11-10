import { getTrelloData } from './trello_data.js'
import { hasWord} from './has_word.js';
import { getFilteredCards } from "./filter_cards"

const getSortedData = (setData,renderCards) => {
  const blacklist = ["format", "changelog","removed"]
  const notBlacklisted = (str) => {
      let notBlacklist = true
      blacklist.map((blacklist_word) => {
          if (hasWord(str,blacklist_word)) {
              notBlacklist = false
          }
      })
      return notBlacklist
  }
  const cleanName = (str) => {
    return str.substring(0,str.indexOf("|"))
  }
  const cleanDesc = (str) => {
    let start = str.indexOf("Description") 
    let end = str.indexOf("What It Does In-Game:")
    if (end <= start) {
      end = str.length
    }
    let offset = 4
    let str2 = str.substring(start, end)
    start = str2.indexOf("---")
    let str3 = str2.substring(start, end)
    start = str3.indexOf("---")
    return str3.substring(start + offset, end)
  }
  let sortedData = {}
  sortedData.cards = []
  sortedData.labels = []
  getTrelloData().then(function(data){
    data.cards.map((card) => {
      if (hasWord(card.desc,"talent") && notBlacklisted(card.name)) {
        card.Selected = false
        card.name = cleanName(card.name)
        card.desc = cleanDesc(card.desc)
        if (card.name.length > 0) {
          sortedData.cards.push(card)
        }
      }
    })
    data.labels.map((label) => { //sort a-z
      sortedData.labels.push(label)
    })
    data.cards.sort(function (a, b) {
      return a.length - b.length;
    })
    if (sortedData.cards.length > 0 && sortedData.labels.length > 0 ) {
      if (setData) {
        sortedData.Loaded = true
        setData(sortedData)
        renderCards(sortedData)
      }
      return
    }
  })
  return sortedData
}

export { getSortedData }
