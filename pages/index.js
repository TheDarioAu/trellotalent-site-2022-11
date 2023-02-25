import * as React from 'react';
import * as Icons from '@mui/icons-material';
import { styled, useTheme } from '@mui/material/styles';
import Head from 'next/head'
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { MULTI_STAT_CARDS } from '../utils/constants/multi_stat_cards';
import { CATEGORIES } from '../utils/constants/categories';
import { getEmptyStats } from "../utils/empty_stats"
import { getSortedData } from "../utils/sort_data"
import { getFilteredCards } from "../utils/filtered_cards"
import { loadingMessage } from "../utils/loading_message"
import { getFilterStatsColor, getCardColor, getLabelColor  } from "../utils/component_colors"
import { clickedOnCard, getCardStats, clickedOnFilter } from "../utils/card_functions"
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

export default function Home() {
  //#region drawer
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };
  //stats
  const [openCollapse, setOpenCollapse] = React.useState(false);
  const handleCollapse = () => {
    setOpenCollapse(!openCollapse);
  };
  const [openCollapse2, setOpenCollapse2] = React.useState(false);
  const handleCollapse2 = () => {
    setOpenCollapse2(!openCollapse2);
  };
  //#endregion

  const [data, setData] = React.useState(getSortedData())
  const [filters, setfilters] = React.useState([])
  const [search, setSearch] = React.useState("")
  const renderData = (newData) => {
    setData(newData)
  }

  React.useEffect(()=> {
    getSortedData(setData)
  }, [])
  React.useEffect(()=> {
    renderData(data)
  }, [data])
  React.useEffect(()=> {
    setfilters(filters)
  }, [filters])

  

  return (
    <div>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline/>
        <AppBar position="fixed" open={openDrawer} color="success">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(openDrawer && { display: 'none' }) }}
            >
              <Icons.Menu />
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
          open={openDrawer}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'ltr' ? <Icons.ChevronLeft /> : <Icons.ChevronRight />}
            </IconButton>
          </DrawerHeader>
          {(loadingMessage(data)) && <CircularProgress sx={{ml: '43%'}} color="success" />}
          {(!loadingMessage(data)) &&
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
                  <Icons.Notes />
                </ListItemIcon>
                <ListItemText primary="Stats" />
                {openCollapse ? <Icons.ExpandLess /> : <Icons.ExpandMore />}
              </ListItemButton>
              {openCollapse && <Container sx={{px: 0, mx:0, width:'100%'}} style={{backgroundColor:'Ivory'}}>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {CATEGORIES.attributes.forEach(item => {
                  <Typography key={item.Name} sx={{fontWeight: 500}}>
                    {item.Name + ": " + stats[item.Name]}
                  </Typography>
                })}
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {CATEGORIES.elements.forEach(item => {
                  <Typography key={item.Name} sx={{fontWeight: 500}}>
                    {item.Name + ": " + stats[item.Name]}
                  </Typography>
                })}
                </List>
                <Divider sx={{my: 1}}/>
                <List sx={{ml: 0}} component="div" disablePadding>
                {CATEGORIES.weapons.forEach(item => {
                  <Typography key={item.Name} sx={{fontWeight: 500}}>
                    {item.Name + ": " + stats[item.Name]}
                  </Typography>
                })}
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
              </Container>}
              <Divider />
              <List>
                <ListItemButton onClick={(e) => showAvailableCards(e)}  style={{backgroundColor: getFilterStatsColor()}}>
                  <ListItemIcon>
                    <Icons.BookmarkAdd/>
                  </ListItemIcon>
                  <ListItemText primary={"Available Cards"} />
                </ListItemButton>
                <ListItemButton onClick={handleCollapse2}>
                  <ListItemIcon>
                    <Icons.Task />
                  </ListItemIcon>
                  <ListItemText primary="Talents" />
                  {openCollapse2 ? <Icons.ExpandLess /> : <Icons.ExpandMore />}
                </ListItemButton>
                {openCollapse2 && <Container sx={{px: 0, mx:0, width:'100%'}} style={{backgroundColor:'Ivory'}}>
                  <Divider sx={{my: 1}}/>
                  <List sx={{ml: 0}} component="div" disablePadding>
                  {getFilteredCards(data, filters, search).map((card, index) => (
                    <Typography key={card.name} sx={{fontWeight: 500}}>
                      {isSelectedCard(card) && card.name}
                    </Typography>
                  ))}
                  </List>
                  <Divider sx={{my: 1}}/>
                </Container>}
              </List>
              <Divider />
              <List>
                {CATEGORIES.elements.map(item => (
                  <ListItem key={item.Name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e,data.cards,item,filters,setfilters)} style={{backgroundColor: getLabelColor(item)}}>
                      <ListItemIcon>
                        <item.Icon/>
                      </ListItemIcon>
                      <ListItemText primary={item.Name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {CATEGORIES.attributes.map(item => (
                  <ListItem key={item.Name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e,data.cards,item,filters,setfilters)} style={{backgroundColor: getLabelColor(item)}}>
                      <ListItemIcon>
                        <item.Icon/>
                      </ListItemIcon>
                      <ListItemText primary={item.Name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {CATEGORIES.rarity.map(item => (
                  <ListItem key={item.Name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e,data.cards,item,filters,setfilters)} style={{backgroundColor: getLabelColor(item)}}>
                      <ListItemIcon>
                        <item.Icon/>
                      </ListItemIcon>
                      <ListItemText primary={item.Name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
              <Divider />
              <List>
                {CATEGORIES.weapons.map(item => (
                  <ListItem key={item.Name} disablePadding>
                    <ListItemButton onClick={(e) => clickedOnFilter(e,data.cards,item,filters,setfilters)} style={{backgroundColor: getLabelColor(item)}}>
                      <ListItemIcon>
                        <item.Icon/>
                      </ListItemIcon>
                      <ListItemText primary={item.Name} />
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
        <Main open={openDrawer}>
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
            {(loadingMessage(data)) &&
              <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h5.fontSize', fontStyle: 'oblique', pt: 5}} color="success.main" variant="0" component="div">
                <LinearProgress color="success" sx={{width: '100%'}} />
                {loadingMessage(data)}
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
                {getFilteredCards(data, filters, search).map((card, index) => (
                  <Button key={index} onClick={(e) => clickedOnCard(e, card.name, data, setData)} sx={{width: '20%'}} color="warning">
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
                            {getCardStats(card).map((stat) => (
                              {stat}
                            ))}
                          </Typography>
                        }
                      </CardContent>
                    </Card>
                  </Button> 
                ))}
                {!loadingMessage(data) && getFilteredCards(data, filters, search).length <= 0 && filters.length <= 0 && 
                  <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h3.fontSize', fontStyle: 'oblique', pt: 5}} color="success.main" variant="0" component="div">
                    {"Choose a Category from the Sidebar"}
                  </Typography>
                }
                {getFilteredCards(data, filters, search).length <= 0 && filters.length > 0 && 
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
