const axios = require('axios');

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";

async function enrichPhotoData(photos) {
  const photoDataEnriched = [];

  // for each photo, identify unique albumIds, for each unique AlbumId, get album and user details
  const uniqueAlbumIds = {};
  for (let i = 0; i < photos.length; i++) {
    if (!((photos[i].albumId) in uniqueAlbumIds)) {
      const albumResponse = await axios.get(`${albumsApi}/${photos[i].albumId}`);
      const albumData = albumResponse.data;

      const userResponse = await axios.get(`${userApi}/${albumData.userId}`);
      const userData = userResponse.data;

      // remove userId key from albumData
      const { userId, ...album } = albumData;

      uniqueAlbumIds[photos[i].albumId] = [album, userData];
    }
  }

  // assign album and user data to each photo
  for (let i = 0; i < photos.length; i++) {
    photos[i].album = uniqueAlbumIds[`${photos[i].albumId}`][0];
    photos[i].album.user = uniqueAlbumIds[photos[i].albumId][1];

    // remove albumId key from photo object
    const { albumId, ...photo } = photos[i];

    photoDataEnriched.push(photo);
  }

  return photoDataEnriched;
};

module.exports = { enrichPhotoData };