const getTrelloData = () => {
    return fetch('./TrelloData.json').then((response)=> {
        return response.json()
    }).then((data)=> {
        return Promise.resolve(data)
    })    
}

export { getTrelloData }
