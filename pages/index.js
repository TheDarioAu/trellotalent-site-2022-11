import {useState} from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';

import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import {getSortedData} from "../utils/api/sort_data"

export default function Home() {
  const [cards, setCards] = useState([])
  getSortedData(setCards)

  return (
    <div>
      <Head>
        <title>Deepwoken Statmaker</title>
        <meta name="description" content="The deep is calling" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
      </Head>
      <AppBar position="relative">
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Deepwoken Statmaker
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        <Container maxWidth="sm">
          <Box
              sx={{
                bgcolor: 'background.paper',
                pt: 8,
                pb: 6,
              }}
            >
            {cards.map((card, index)=> {
              return <Button key={index} variant="contained" href="#contained-buttons">
                {card.name}
              </Button>
            })}
          </Box>
        </Container>
      </main>
    </div>
  )
}
