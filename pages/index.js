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
import * as Icons from '@mui/icons-material';
import {getSortedData} from "../utils/api/sort_data"
import {getFilteredCards} from "../utils/api/filter_cards"
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

export default function Home() {
  let debounce = false
  const [filters, setFilters] = React.useState([])
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
    newStats.RemainingPoints = 323
    return newStats
  }
  const renderCards = (data,newfilters,newSearch) => {
    let searchInfo = newSearch == null ? search : newSearch
    let sortFilter = newfilters || filters
    if (newfilters == null) {
      if (debounce) {
        return
      }
      debounce = true
    }
    let filteredCards = getFilteredCards(data,sortFilter,searchInfo)
    setFilteredCards(filteredCards)
  }
  const clickedOnCard = (e,card,index) => {
    let newfilteredCards = [...filteredCards]
    newfilteredCards[index].Selected = !newfilteredCards[index].Selected 
    setFilteredCards(newfilteredCards)
    calculateStats(newfilteredCards)
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
  const calculateStats = (selectedCards) => {
    let newStats = getEmptyStats()
    selectedCards.map((card) => {
      if (card.Selected) {
        const addStat = (statName) => {
          if (card.stats[statName] && newStats[statName] < card.stats[statName]) {
            newStats[statName] = card.stats[statName]
          }
        }
        attribute_names.map(addStat)
        element_names.map(addStat)
        weapon_names.map(addStat)
      }
    })
    const calculateRemainder = (statName) => {
      newStats.RemainingPoints -= newStats[statName]
    }
    attribute_names.map(calculateRemainder)
    element_names.map(calculateRemainder)
    weapon_names.map(calculateRemainder)
    setStats(newStats)
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
  const loadingMessage = () => {
    if (data.Loaded == null) {
      return "Retrieving Data from Deepwoken Talent List..."
    } else {
      return
    }
  }
  React.useEffect(()=> {
    getSortedData(setData,renderCards)
    setStats(getEmptyStats())
  }, [])

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

  function filterSearchCards(newSearch,event){
    let searchText = newSearch
    if (!event.nativeEvent.data) {
      searchText = ""
    }
    setSearch(searchText)
    renderCards(data,filters,searchText)
    return
  }

  return (
    <div>
      {/* Box is drawer */}
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
                label="Search Talent"
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
                    {"-Consider points for weapon"}
                    <br/>
                    {"-Consider points from race"}
                    <br/>
                    {"-Information may be outdated"}
                  </Typography>
                </List>
              </Container>
              }
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
