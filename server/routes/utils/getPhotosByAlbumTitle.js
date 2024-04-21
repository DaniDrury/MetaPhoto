const axios = require('axios');
const { getAlbumIdsByTitle } = require('./getAlbumIdsByTitle');
const photosApi = "https://jsonplaceholder.typicode.com/photos";

async function getPhotosByAlbumTitle(albumTitle) {
  // get all album Ids
  const albumIdArr = await getAlbumIdsByTitle(albumTitle);

  let queryString = '';
  // create query string based on album Ids if we find corresponding albums
  if (albumIdArr.length > 0) {
    for (let i = 0; i < albumIdArr.length; i++) {
      queryString += `albumId=${albumIdArr[i]}&`;
    }

    const photosResponse = await axios.get(`${photosApi}?${queryString}`);
    return photosResponse.data;
  } else {
    return [];
  }
}

module.exports = { getPhotosByAlbumTitle };