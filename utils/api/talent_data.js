const getTalentData = () => {
    return fetch('http://localhost:3001/api/get?type=talent&name=all')
      .then(response => response.json())
      .catch(error => console.error(error));
}
  
export { getTalentData };