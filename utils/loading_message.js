const loadingMessage = (data) => {
    if (!data.Loaded) {
        return "Retrieving Data from Deepwoken Talent List..."
    } else {
        return
    }
}
export { loadingMessage }