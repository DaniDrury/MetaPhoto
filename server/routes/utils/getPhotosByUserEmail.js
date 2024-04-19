const axios = require('axios');
const userApi = "https://jsonplaceholder.typicode.com/users";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

async function getPhotosByUserEmail(userEmail) {
  // find user with query email value, get albums with userId, return all photos from those albums
  const userResponse = await axios.get(`${userApi}?email=${userEmail}`);
  const user = userResponse.data;

  const userAlbumsResponse = await axios.get(`${userApi}/${user[0].id}/albums`);
  const userAlbums = userAlbumsResponse.data;
  const albumIdArr = userAlbums.map((e) => e.id);

  let queryString = '';
  for (let i = 0; i < albumIdArr.length; i++) {
    queryString += `albumId=${albumIdArr[i]}&`;
  }

  const photosResponse = await axios.get(`${photosApi}?${queryString}`);
  return photosResponse.data;
}

module.exports = { getPhotosByUserEmail };