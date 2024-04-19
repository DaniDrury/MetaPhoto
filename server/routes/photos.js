const router = require('express').Router();
const axios = require('axios');

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

router.get('/', async (req, res) => {
  const query = req.query;
  // console.log(query);
  const limit = query.limit || 25;
  const offset = query.offset || 0;
  const title = query.title;
  const albumTitle = query['album.title'];
  const userEmail = query['album.user.email'];

  // console.log("Title is " + title);

  try {
    // get all photos
    const allPhotosResponse = await axios.get(`${photosApi}`);
    const allPhotos = allPhotosResponse.data;

    let photoData = [];

    if (title) {
      // separate out only those with title containing query title
      photoData = allPhotos.filter((photo) => photo.title.includes(title));
    }

    if (albumTitle) {
      const allAlbumsResponse = await axios.get(`${albumsApi}`);
      const allAlbums = allAlbumsResponse.data;

      const albumMatches = allAlbums.filter((album) => album.title.includes(albumTitle));

      // console.log(albumMatches);

      // builds a new array of photos with albumId equal to albumMatches.id -- O(n^2) time complexity :(  Not ideal
      for (let i=0; i < allPhotos.length; i++) {
        for (let j = 0; j < albumMatches.length; j++) {
          if (allPhotos[i].albumId === albumMatches[j].id) {
            photoData.push(allPhotos[i]);
          }
        }
      }
    }
    
    const photoDataEnriched = [];

    // for each photo that meets the filter specifications, embed album and user info
    for (let i = 0; i < photoData.length; i++) {
      const albumResponse = await axios.get(`${albumsApi}/${photoData[i].albumId}`);
      const albumData = albumResponse.data;
      // console.log("got album from jsonplaceholder");
  
      const userResponse = await axios.get(`${userApi}/${albumData.userId}`);
      const userData = userResponse.data;
      // console.log("got user from jsonplaceholder");

      // removed userId key from albumData
      const { userId, ...album } = albumData
      // save album and userData values within photo object
      photoData[i].album = album;
      photoData[i].album.user = userData;

      // remove albumId key from photo object
      const { albumId, ...photo } = photoData[i];

      photoDataEnriched.push(photo);
    }
    console.log("Return Length: " + photoDataEnriched.length);

    res.json(photoDataEnriched);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

router.get('/:ID', async (req, res) => {
  const id = req.params.ID;

  try {
    const photoResponse = await axios.get(`${photosApi}/${id}`);
    const photoData = photoResponse.data;

    const albumResponse = await axios.get(`${albumsApi}/${photoData.albumId}`);
    const albumData = albumResponse.data;
  
    const userResponse = await axios.get(`${userApi}/${albumData.userId}`);
    const userData = userResponse.data;

      // removed userId key from albumData
    const { userId, ...album } = albumData
      // save album and userData values within photo object
    photoData.album = album;
    photoData.album.user = userData;

      // remove albumId key from photo object
    const { albumId, ...photo } = photoData;

    res.json(photo);
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;