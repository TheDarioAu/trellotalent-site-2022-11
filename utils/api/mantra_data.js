const getMantraData = () => {
    return fetch(`https://deepwoken.co/api/get?type=mantra&name=all`)
        .then((response)=> {
        return response.json()
    }).then((data)=> {
        return Promise.resolve(data)
    })
}

export { getMantraData }
