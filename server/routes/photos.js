const router = require('express').Router();
const axios = require('axios');

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

router.get('/', async (req, res) => {
  const query = req.query;
  console.log(query);

  const limit = query.limit || 25;
  const offset = query.offset || 0;

  try {
    const photoResponse = await axios.get(`${photosApi}?_start=${offset}&_limit=${limit}`);
    const photoData = photoResponse.data;

    const photoDataEnriched = [];

    for (let i = 0; i < photoData.length; i++) {
      const albumResponse = await axios.get(`${albumsApi}/${photoData[i].albumId}`);
      const albumData = albumResponse.data;
  
      const userResponse = await axios.get(`${userApi}/${albumData.userId}`);
      const userData = userResponse.data;

      // removed userId key from albumData
      const { userId, ...album } = albumData
      // save album and userData values within photo object
      photoData[i].album = album;
      photoData[i].album.user = userData;

      // remove albumId key from photo object
      const { albumId, ...photo } = photoData[i];

      photoDataEnriched.push(photo);
    }

    res.json(photoDataEnriched);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;