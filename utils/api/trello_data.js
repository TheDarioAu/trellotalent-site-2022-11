const getTrelloData = () => {
    return fetch(`https://trello.com/b/fRWhz9Ew.json`)
        .then((response)=> {
        return response.json()
        }).then((data)=> {
        return Promise.resolve(data)
    })    
}

export { getTrelloData }
