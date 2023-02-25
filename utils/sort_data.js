import { getTalentData } from './api/talent_data.js'

const sort = (a, b) => {
  if (a.name < b.name) {
    return -1
  }
  if (a.name > b.name) {
    return 1
  }
  return 0
}

const getSortedData = (setData) => {
  let sortedData = {}
  sortedData.Loaded = false
  sortedData.cards = []
  if (setData) {
    getTalentData().then(function(data){
      if (data) {
        for (let cardName in data.content) {
          let card = data.content[cardName]
          card.Selected = false
          card.Stats = {}
          card.Stats.Power = Number(card.reqs.power)
          for (let prop in card.reqs.base) {
            let statValue = card.reqs.base[prop]
            if (statValue <= 0) continue 
            card.Stats[prop] = statValue
          }
          for (let prop in card.reqs.weapon) {
            let statValue = card.reqs.weapon[prop]
            if (statValue <= 0) continue 
            card.Stats[prop.split(' ')[0]] = statValue
          }
          for (let prop in card.reqs.attunement) {
            let statValue = card.reqs.attunement[prop]
            if (statValue <= 0) continue 
            card.Stats[prop] = statValue
          }
          sortedData.cards.push(card)
        }
        sortedData.cards.sort(sort)
        if (sortedData.cards.length > 0) {
          sortedData.Loaded = true
          setData(sortedData)
          return sortedData
        }
      }
    })
  }
  return sortedData
}

export { getSortedData }
