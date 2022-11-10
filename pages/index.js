import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Card from '@mui/material/Card';
import Hidden from '@mui/material/Hidden';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
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
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import {getSortedData} from "../utils/api/sort_data"
import {getFilteredCards} from "../utils/api/filter_cards"
import { maxWidth } from '@mui/system';

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
  const renderCards = (data,newfilters) => {
    let sortFilter = newfilters || filters
    if (newfilters == null) {
      if (debounce) {
        return
      }
      debounce = true
    }
    setFilteredCards(getFilteredCards(data,sortFilter))
  }
  const getCards = () => {
    console.log("Pressed Button")
    if (data.cards.length > 0) { //can only activate filters when there are cards
      console.log("Filtered Button")
      let newfilters = ["flamecharm"]
      renderCards(data,newfilters)
      setFilters(newfilters)
    }
  }
  const clickedOnCard = (e,card,index) => {
    let newfilteredCards = [...filteredCards]
    newfilteredCards[index].Selected = !newfilteredCards[index].Selected 
    setFilteredCards(newfilteredCards)
  }
  const getCardColor = (card) => {
    if (card.Selected) {
      return 'Ivory'
    } else {
      return 'white'
    }
  }
  const loadingMessage = () => {
    if (data.Loaded == null) {
      return "Retrieving Data from Trello..."
    } else {
      return
    }
  }

  React.useEffect(()=> {
    getSortedData(setData,renderCards)
  }, [])
  React.useEffect(()=> {

  }, [filteredCards])

  //#region drawer
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  //#endregion

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
          <Divider />
          <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
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
              <Typography sx={{textTransform: 'none', mx:'auto', fontWeight: 'bold' , fontSize: 'h5.fontSize', fontStyle: 'oblique' }} color="success.main" variant="0" component="div">
                <LinearProgress color="success" sx={{width: '100%'}} />
                {loadingMessage()}
              </Typography>
            }
            <Container maxWidth="xl">
              <Button
                variant="contained"
                onClick={getCards}
                >
                Gets the good
              </Button>
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
                {filteredCards.map((card, index)=> {
                  return <Button key={index} onClick={(e) => clickedOnCard(e, card, index)} sx={{width: '13%', m:1}}>
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
              </Box>
            </Container>
          </main>
        </Main>
      </Box>
    </div>
  )
}
