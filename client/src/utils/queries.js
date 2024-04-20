async function apiQuery({ photoTitle, albumTitle, email, limit, offset }) {
  let photos = [];

  if (photoTitle && !albumTitle && !email) {    
    try {
      const response = await fetch(`/api/photos?title=${photoTitle}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else {
    try {
      const response = await fetch(`/api/photos?limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err) {
      console.error(err);
    }
  }
}

export default apiQuery;