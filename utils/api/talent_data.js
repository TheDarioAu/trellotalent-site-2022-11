const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : process.env.VERCEL_URL;

const getTalentData = () => {
    return fetch(`${baseUrl}/api/get?type=talent&name=all`)
      .then(response => response.json())
      .catch(error => console.error(error));
}
  
export { getTalentData };