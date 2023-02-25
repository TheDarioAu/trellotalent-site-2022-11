const getTrelloData = () => {
    return fetch('https://deepwokenstatmaker.vercel.app/data.json').then((response)=> {
        return response.json()
    }).then((data)=> {
        return Promise.resolve(data)
    })    
}

export { getTrelloData }
