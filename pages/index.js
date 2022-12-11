import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Head from 'next/head'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import * as Icons from '@mui/icons-material';
import { MULTI_STAT_CARDS } from '../utils/constants/multi_stat_cards';
import { getSortedData } from "../utils/sort_data"
import { getFilteredCards } from "../utils/filter_cards"
//#region drawer functions
const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));
//#endregion

const isNumeric = (val) => {
  return /^-?\d+$/.test(val);
}

export default function Home() {
  let debounce = false
  const [filters, setFilters] = React.useState([])
  const [filterStats, setFilterStats] = React.useState(false)
  const [filteredCards, setFilteredCards] = React.useState([])
  const [data, setData] = React.useState(getSortedData())
  const [stats, setStats] = React.useState({})
  const [search, setSearch] = React.useState("")
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

  //#region functions
  const getEmptyStats = () => {
    let newStats = {}
    data.attributes.map((attribute) => {
      newStats[attribute.name] = 0
    })
    data.elements.map((element) => {
      newStats[element.name] = 0
    })
    data.weapons.map((weapons) => {
      newStats[weapons.name] = 0
    })
    newStats.RemainingPoints = 327
    return newStats
  }
  const renderCards = (newData,newfilters,newSearch,newfilterStats,newStats) => {
    let currentData = newData == null ? data : newData
    let searchInfo = newSearch == null ? search : newSearch
    let currentFilterStats = newfilterStats == null ? filterStats : newfilterStats
    let currentStats = newStats == null ? stats : newStats
    let sortFilter = newfilters || filters
    if (newfilters == null) {
      if (debounce) {
        return
      }
      debounce = true
    }
    let filteredCards = getFilteredCards(currentData,sortFilter,searchInfo,currentFilterStats,currentStats)
    setFilteredCards(filteredCards)
  }
  const clickedOnCard = (e,card,index) => {
    if (!card.Selected && card.CanInput) {
      let statName = ""
      Object.keys(card.stats).forEach(function(stat) {
        statName = stat
      })
      handleClickOpen(statName,card.name) 
    }
    let newfilteredCards = [...filteredCards]
    newfilteredCards[index].Selected = !newfilteredCards[index].Selected 
    setFilteredCards(newfilteredCards)
    calculateStats(newfilteredCards)
    let newDataCards = [...data.cards]
    newDataCards.map((card2) => {
      if (card2.name == card.name) {
        card2.Selected = newfilteredCards[index].Selected
        return
      }
    })
    let newData = data
    newData.cards = newDataCards
    setData(newData)
  }
  const setCardData = (cardName, statInput) => {
    let newfilteredCards = [...filteredCards]
    newfilteredCards.map((card) => {
      if (card.name == cardName) {
        if (statInput < 0) {
          statInput = 0
        }
        Object.keys(card.stats).forEach(function(stat) {
          card.stats[stat] = statInput
        })
        return
      }
    })
    setFilteredCards(newfilteredCards)
    let newStats = calculateStats(newfilteredCards)
    renderCards(data,filters,search,filterStats,newStats)
  }
  const getCardColor = (card) => {
    if (card.Selected) {
      return 'Ivory'
    } else {
      return 'white'
    }
  }
  const getLabelColor = (label) => {
    for (let index = 0; index < filters.length; index++) {
      if (filters[index] == label.name) {
        return 'LightGreen'
      }
    }
    return 'white'
  }
  const getFilterStatsColor = () => {
    if (filterStats) {
      return 'LightBlue'
    }
    return 'white'
  }
  const calculateStats = (selectedCards) => {
    let newStats = getEmptyStats()
    //First do the normal card stuff, ignore neuro i guess
    data.cards.map((card) => {
      if (card.Selected) {
        if (!MULTI_STAT_CARDS[card.name]) {
          const addStat = (statName) => {
            if (card.stats[statName] && newStats[statName] < card.stats[statName]) {
              newStats[statName] = card.stats[statName]
            }
          }
          attribute_names.map(addStat)
          element_names.map(addStat)
          weapon_names.map(addStat)
        }
      }
    })
    data.cards.map((card) => {
      if (card.Selected) {
        if (MULTI_STAT_CARDS[card.name]) {
          let usingStats = []
          let cardStats = {...card.stats}
          let foundStat = null
          const findExisitngStat = (statName) => {
            if (cardStats[statName] && !foundStat && newStats[statName] >= cardStats[statName]) {
              foundStat = foundStat
            }
            if (cardStats[statName]) {
              usingStats.push(statName)
            }
          }
          let largestStatNum = 0
          let largestStatName = null
          const adjustStat = (statName) => {
            if (cardStats[statName]) {
              if (foundStat) {
                if (foundStat != statName) {
                  cardStats[statName] = 0
                } 
              } else {
                if (cardStats[statName] > 0 && newStats[statName] > largestStatNum) {
                  largestStatNum = newStats[statName]
                  largestStatName = statName
                }
              }
            }
          }
          let randomChoice = Math.floor(Math.random() * usingStats.length)
          const clearUnusedStat = (statName) => {
            if (largestStatName) {
              if (largestStatName != statName) {
                cardStats[statName] = 0
              }
            } else {
              if (statName != usingStats[randomChoice]) {
                cardStats[statName] = 0
              }
            }
          }
          const addStat = (statName) => {
            if (cardStats[statName] && newStats[statName] < cardStats[statName]) {
              newStats[statName] = cardStats[statName]
            }
          }
          //Find Stat
          attribute_names.map(findExisitngStat)
          element_names.map(findExisitngStat)
          weapon_names.map(findExisitngStat)
          //Adjust Stats
          attribute_names.map(adjustStat)
          element_names.map(adjustStat)
          weapon_names.map(adjustStat)
          //Clean Stats
          attribute_names.map(clearUnusedStat)
          element_names.map(clearUnusedStat)
          weapon_names.map(clearUnusedStat)
          //Add Stat
          attribute_names.map(addStat)
          element_names.map(addStat)
          weapon_names.map(addStat)
        }
      }
    })
    const calculateRemainder = (statName) => {
      newStats.RemainingPoints -= newStats[statName]
    }
    attribute_names.map(calculateRemainder)
    element_names.map(calculateRemainder)
    weapon_names.map(calculateRemainder)
    setStats(newStats)
    return newStats
  }
  const clickedOnFilter = (e,label) => {
    if (data.cards.length > 0) { //can only activate filters when there are cards
      let foundLabel = false
      let newfilters = [...filters]
      for (let index = 0; index < filters.length; index++) {
        if (filters[index] == label.name) {
          foundLabel = true
          newfilters.splice(index,1)
          break
        }
      }
      if (!foundLabel) { 
        newfilters.push(label.name)
      } 
      renderCards(data,newfilters)
      setFilters(newfilters)
    }
  }
  const clearSelectedCards = (e) => {
    let newfilteredCards = [...filteredCards]
    newfilteredCards.map((card) => {
      card.Selected = false
    })
    setFilteredCards(newfilteredCards)
    calculateStats(newfilteredCards)
    let newDataCards = [...data.cards]
    newDataCards.map((card) => {
      card.Selected = false
    })
    let newData = data
    newData.cards = newDataCards
    setData(newData)
  }
  const showAvailableCards = (e) => {
    let newFilterStats = !filterStats
    setFilterStats(newFilterStats)
    renderCards(data,filters,search,newFilterStats)
  }
  const getCardStats = (card) => {
    let statsString = ""
    const addStat = (statName) => {
      if (card.stats[statName]) {
        statsString = `${statsString} |\n ${statName}: ${card.stats[statName]}`
      }
    }
    attribute_names.map(addStat)
    element_names.map(addStat)
    weapon_names.map(addStat)
    if (statsString.length > 0) {
      statsString = statsString + " |"
    }
    return statsString
  }
  const loadingMessage = () => {
    if (data.Loaded == null) {
      return "Retrieving Data from Deepwoken Talent List..."
    } else {
      return
    }
  }
  const filterSearchCards = (newSearch,event) => {
    let searchText = newSearch
    if (!event.nativeEvent.data) {
      searchText = ""
    }
    setSearch(searchText)
    renderCards(data,filters,searchText)
    return
  }
  //#endregion

  //#region drawer
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [openCollapse, setOpenCollapse] = React.useState(false);
  const handleCollapse = () => {
    calculateStats(filteredCards)
    setOpenCollapse(!openCollapse);
  };
  //#endregion

  //#region prompt
  const [openPrompt, setOpenPrompt] = React.useState(false)
  const [promptText, setPromptText] = React.useState("")
  const [promptInput, setPromptInput] = React.useState(0)
  const [promptCard, setPromptCard] = React.useState("")
  const handleClickOpen = (statName, cardName) => {
    setPromptText(statName)
    setPromptCard(cardName)
    setOpenPrompt(true)
  }
  const handleClose = () => {
    setOpenPrompt(false)
    setCardData(promptCard, promptInput)
  }
  const handleInput = (inputValue) => {
    setPromptInput(inputValue)
  }
  //#endregion

  React.useEffect(()=> {
    getSortedData(setData,renderCards)
    setStats(getEmptyStats())
  }, [])

  return (
    <div>
      <Dialog open={openPrompt} onClose={setOpenPrompt}>
        <DialogTitle>{promptText}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter an amount for {promptText}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="stat"
            type="number"
            fullWidth
            variant="standard"
            value = {promptInput}
            onChange={(e)=>{handleInput(e.target.value,e)}}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Confirm</Button>
        </DialogActions>
      </Dialog>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        <AppBar position="fixed" open={open} color="success">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: 'none' }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Deepwoken Statmaker
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          {(loadingMessage()) && <CircularProgress sx={{ml: '43%'}} color="success" />}
          {(!loadingMessage()) &&
            <>
              <TextField
                required
                id="search"
                name="search"
                color="success"
                label="Search Talents"
                variant="standard"
                size='small'
                sx={{ml:"5%", width:'90%'}}
                onChange={(e)=>{filterSearchCards(e.target.value,e)}}
                value={search}
              />
              <ListItemButton onClick={handleCollapse}>
                <ListItemIcon>
                  <Icons.AlignVerticalBottom />
                </ListItemIcon>
                <ListItemText primary="Stats" />
                {openCollapse ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              {openCollapse && <Container sx={{px: 0, mx:0, width:'100%'}} style={{backgroundColor:'Ivory'}}>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {attribute_names.map((statName, index) => (
                  <Typography key={statName} sx={{fontWeight: 500}}>
                    {statName + ": " + stats[statName]}
                  </Typography>
                ))}
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {element_names.map((statName, index) => (
                  <Typography key={statName} sx={{fontWeight: 500}}>
                    {statName + ": " + stats[statName]}
                  </Typography>
                ))}
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {weapon_names.map((statName, index) => (
                  <Typography key={statName} sx={{fontWeight: 500}}>
                    {statName + ": " + stats[statName]}
                  </Typography>
                ))}
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                  <Typography key={"RemainingPoints"} sx={{fontWeight: 500}}>
                    {"Remaining Points: " + stats["RemainingPoints"]}
                  </Typography>
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{mx: 0}} component="div" disablePadding>
                  <Typography key={"Hint"} sx={{fontWeight: 500, fontStyle: 'oblique'}} variant="caption">
                    {"Note:"}
                    <br/>
                    {"-Total points: in-game(310), race(4), and starting(5)(8)"}
                    <br/>
                    {"-Remember to account for your weapon"}
                    <br/>
                    {"-Information may be outdated or incorrect, blame the trello"}
                  </Typography>
                </List>
              </Container>
              }
              <Divider />
              <List>
                <ListItemButton onClick={(e) => showAvailableCards(e)}  style={{backgroundColor: getFilterStatsColor()}}>
                  <ListItemIcon>
                    <Icons.BookmarkAdd/>
                  </ListItemIcon>
                  <ListItemText primary={"Available Cards"} />
                </ListItemButton>
              </List>
              <Divider />
              <List>
                {data.elements.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <label.icon/>
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {data.attributes.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <label.icon/>
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {data.rarity.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <label.icon/>
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {data.weapons.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <label.icon/>
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {data.misc.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <Icons.AlignVerticalBottom />
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {data.stats.map((label, index) => (
                  <ListItem key={label.name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e, label)} style={{backgroundColor: getLabelColor(label)}}>
                      <ListItemIcon>
                        <Icons.Add/>
                      </ListItemIcon>
                      <ListItemText primary={label.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                <ListItemButton onClick={(e) => clearSelectedCards(e)}  style={{backgroundColor: 'LightCoral'}}>
                  <ListItemIcon>
                    <Icons.Clear/>
                  </ListItemIcon>
                  <ListItemText primary={"Clear Selected"} />
                </ListItemButton>
              </List>
            </>
          }
        </Drawer>
        <Main open={open}>
          <DrawerHeader />
          <Head>
            <title>Deepwoken Statmaker</title>
            <meta name="description" content="The deep is calling" />
            <link rel="icon" href="/favicon.ico" />
            <link
              rel="stylesheet"
              href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
            />
          </Head>
          <main>
            {(loadingMessage()) &&
              <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h5.fontSize', fontStyle: 'oblique', pt: 5}} color="success.main" variant="0" component="div">
                <LinearProgress color="success" sx={{width: '100%'}} />
                {loadingMessage()}
              </Typography>
            }
            <Container maxWidth="xl">
              <Box
                  sx={{
                    bgcolor: 'background.paper',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    pt: 8,
                    pb: 6,
                  }}
                >
                {filteredCards.map((card, index) => {
                  return <Button key={index} onClick={(e) => clickedOnCard(e, card, index)} sx={{width: '20%'}} color="warning">
                    <Card sx={{width: '100%', height: '100%'}} style={{backgroundColor: getCardColor(card)}}>
                      <CardContent>
                        <Typography sx={{textTransform: 'none'}} variant="h6" component="div">
                          {card.name}
                        </Typography>
                        {card.Selected &&
                          <Typography sx={{ fontSize: 15, textTransform: 'none'}} color="text.secondary" gutterBottom>
                            <br/>
                            {card.desc}
                            <br/>
                            <br/>
                            {getCardStats(card)}
                          </Typography>
                        }
                      </CardContent>
                    </Card>
                  </Button> 
                })}
                {!loadingMessage() && filteredCards.length <= 0 && filters.length <= 0 && 
                  <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h3.fontSize', fontStyle: 'oblique', pt: 5}} color="success.main" variant="0" component="div">
                    {"Choose a Category from the Sidebar"}
                  </Typography>
                }
                {filteredCards.length <= 0 && filters.length > 0 && 
                  <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h3.fontSize', fontStyle: 'oblique', pt: 5}} color="error.main" variant="0" component="div">
                    {"Found Nothing from the Categories Chosen"}
                  </Typography>
                }
              </Box>
            </Container>
          </main>
        </Main>
      </Box>
    </div>
  )
}
