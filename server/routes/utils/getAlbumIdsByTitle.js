const axios = require('axios');
const albumsApi = "https://jsonplaceholder.typicode.com/albums";

async function getAlbumIdsByTitle(albumTitle) {
  // get all albums
  const allAlbumsResponse = await axios.get(`${albumsApi}`);
  const allAlbums = allAlbumsResponse.data;
  // separate out only those albums with title containing query title value
  if (allAlbums.length > 0) {
    const albumMatches = allAlbums.filter((album) => album.title.includes(albumTitle));
    return albumMatches.map((e) => e.id);
  } else {
    return [];
  }
}

module.exports = { getAlbumIdsByTitle };