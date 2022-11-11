import { getTrelloData } from './trello_data.js'
import { hasWord } from './has_word.js';
import * as Icons from '@mui/icons-material';

const getSortedData = (setData,renderCards) => {
  let sortedData = {}
  const blacklist = ["format", "changelog","removed"]
  const validlists = ["common", "rare", "legendary"]
  const weaponCards = ["Light", "Medium", "Heavy"]
  const elementlist = {
    Flamecharm: Icons.LocalFireDepartment,
    Frostdraw: Icons.AcUnit,
    Galebreath: Icons.Air,
    Thundercall: Icons.ElectricBolt,
    Shadowcast: Icons.Nightlight,
  }
  const attributelist = {
    Strength: Icons.FitnessCenter,
    Agility: Icons.DirectionsRun,
    Intelligence: Icons.EmojiObjects,
    Fortitude: Icons.HealthAndSafety,
    Charisma: Icons.AddReaction,
    Willpower: Icons.Psychology,
  }
  const raritylist = {
    Common: Icons.StarOutlineOutlined,
    Rare: Icons.StarRate,
    Legendary: Icons.AutoAwesome,
  }
  const weaponlist = {
    ["Light Weapon"]: Icons.BarChart,
    ["Medium Weapon"]: Icons.BarChart,
    ["Heavy Weapon"]: Icons.BarChart,
  }
  const notBlacklisted = (str) => {
      let notBlacklist = true
      blacklist.map((blacklist_word) => {
          if (hasWord(str,blacklist_word)) {
              notBlacklist = false
          }
      })
      return notBlacklist
  }
  const getStats = (str) => {
    let str_array = str.substring(str.indexOf("Requirements"),str.length).toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(/\s+/);
    let stats_array = []
    let stats = {}
    sortedData.attributes.map((attribute) => {
      stats_array.push(attribute.name)
    })
    sortedData.elements.map((element) => {
      stats_array.push(element.name)
    })
    sortedData.weapons.map((weapons) => {
      stats_array.push(weapons.name)
    })
    for (let index = 0; index < stats_array.length; index++) {
      if (str_array[index] == "talent") {
        break
      }
      stats_array.map((statName) => {
        let statText = statName.toLowerCase().trim()
        let endPoint = statText.indexOf(" ")
        if (endPoint <= 0) {
          endPoint = statText.length
        }
        let compareText = statText.substring(0,endPoint)
        if (str_array[index] == compareText) {
          let num = parseInt(str_array[index - 1])
          if (!num) {
            num = parseInt(str_array[index + 1])
          }
          if (stats[statName] == null) {
              stats[statName] = num
          }
        }
      })
    }
    return stats
  }
  const cleanName = (str) => {
    return str.substring(0,str.indexOf("|")).trim()
  }
  const cleanDesc = (str) => {
    let start = str.indexOf("Description:") 
    let end = str.indexOf("What It Does In-Game:")
    if (end <= start) {
      end = str.length
    }
    let str2 = str.substring(start, end)
    let start2 = str.indexOf("---") 
    return str2.substring(start2, end)
  }
  sortedData.cards = []
  sortedData.labels = []
  sortedData.cardlists = []
  sortedData.elements = []
  sortedData.weapons = []
  sortedData.rarity = []
  sortedData.misc = []
  sortedData.attributes = []
  sortedData.stats = []
  getTrelloData().then(function(data){
    data.labels.map((label) => { //sort a-z
      if (elementlist[label.name]) { // its a element
        label.icon = elementlist[label.name]
        sortedData.elements.push(label)
      } else if (attributelist[label.name]) { // its an attribute
        label.icon = attributelist[label.name]
        sortedData.attributes.push(label)
      } else if (raritylist[label.name]) { // its rarity
        label.icon = raritylist[label.name]
        sortedData.rarity.push(label)  
      } else if (weaponlist[label.name]) { // its weapon
        label.icon = weaponlist[label.name]
        sortedData.weapons.push(label) 
      } else if (label.name.substring(0,1) == "+") { //its a stat
        sortedData.stats.push(label)
      } else { //its something else
        sortedData.misc.push(label)
      }
      sortedData.labels.push(label)
    })
    data.cards.map((card) => {
      if (hasWord(card.desc,"talent") && notBlacklisted(card.name)) {
        card.Selected = false
        card.stats = getStats(card.desc)
        card.name = cleanName(card.name)
        card.desc = cleanDesc(card.desc)
        if (card.name.length > 0) {
          sortedData.cards.push(card)
        }
      }
    })
    weaponCards.map((weaponName) => {
      for (let stat = 20; stat <= 100; stat += 20) {
        let card = {}
        card.Selected = false
        card.stats = {[`${weaponName} Weapon`]: stat}
        card.name = `${stat.toString()} ${weaponName} Weapon`
        card.desc = `Adds ${stat.toString()} to ${weaponName} Weapon, use this to account for your weapon.`
        card.idLabels = []
        data.labels.map((label) => {
          if (label.name == `${weaponName} Weapon`) {
            card.idLabels.push(label.id)
          }
        })
        data.cards.push(card)
        sortedData.cards.push(card)
      }
    })
    const sort = (a, b) => {
      if (a.name < b.name) {
        return -1
      }
      if (a.name > b.name) {
        return 1
      }
      return 0
    }
    sortedData.cards.sort(sort)
    sortedData.labels.sort(sort)
    sortedData.cardlists = []
    data.lists.map((list) => {
      validlists.map((listname) => {
        if (hasWord(list.name,listname)) {
          sortedData.cardlists.push(list)
        }
      })
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
