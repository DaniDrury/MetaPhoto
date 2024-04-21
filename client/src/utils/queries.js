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
  } else if (photoTitle && albumTitle && !email) {
    try {
      const response = await fetch(`/api/photos?title=${photoTitle}&album.title=${albumTitle}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else if (photoTitle && !albumTitle && email) {
    try {
      const response = await fetch(`/api/photos?title=${photoTitle}&album.user.email=${email}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else if (photoTitle && albumTitle && email) {
    try {
      const response = await fetch(`/api/photos?title=${photoTitle}&album.title=${albumTitle}&album.user.email=${email}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else if (!photoTitle && albumTitle && !email) {
    try {
      const response = await fetch(`/api/photos?album.title=${albumTitle}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else if (!photoTitle && albumTitle && email) {
    try {
      const response = await fetch(`/api/photos?album.title=${albumTitle}&album.user.email=${email}&limit=${limit}&offset=${offset}`);
      photos = await response.json();
      return photos;
    } catch (err){
      console.error(err);
    }
  } else if (!photoTitle && !albumTitle && email) {
    try {
      const response = await fetch(`/api/photos?album.user.email=${email}&limit=${limit}&offset=${offset}`);
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