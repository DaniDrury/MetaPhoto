const axios = require('axios');

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";

async function enrichPhotoData(photos) {
  const photoDataEnriched = [];

  // for each photo, embed album and user info
  for (let i = 0; i < photos.length; i++) {
    const albumResponse = await axios.get(`${albumsApi}/${photos[i].albumId}`);
    const albumData = albumResponse.data;

    const userResponse = await axios.get(`${userApi}/${albumData.userId}`);
    const userData = userResponse.data;

    // removed userId key from albumData
    const { userId, ...album } = albumData

    // save album and userData values within photo object
    photos[i].album = album;
    photos[i].album.user = userData;

    // remove albumId key from photo object
    const { albumId, ...photo } = photos[i];

    photoDataEnriched.push(photo);
  }

  return photoDataEnriched;
};

module.exports = { enrichPhotoData };