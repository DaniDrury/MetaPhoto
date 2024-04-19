const axios = require('axios');
const albumsApi = "https://jsonplaceholder.typicode.com/albums";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

async function getPhotosByAlbumTitle(albumTitle) {
  // get all albums
  const allAlbumsResponse = await axios.get(`${albumsApi}`);
  const allAlbums = allAlbumsResponse.data;
  // separate out only those albums with title containing query title value
  const albumMatches = allAlbums.filter((album) => album.title.includes(albumTitle));
  const albumIdArr = albumMatches.map((e) => e.id);

  let queryString = '';
  // create query string based on album Ids
  for (let i = 0; i < albumIdArr.length; i++) {
    queryString += `albumId=${albumIdArr[i]}&`;
  }

  const photosResponse = await axios.get(`${photosApi}?${queryString}`);
  return photosResponse.data;
}

module.exports = { getPhotosByAlbumTitle };