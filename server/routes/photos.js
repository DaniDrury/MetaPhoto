const router = require('express').Router();
const axios = require('axios');
const { enrichPhotoData } = require('../utils/enrichPhotoData');

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
    // due to inability to send api query specifying a "contains" filter, 
    // instead get all data from internal API and filter responses here
    const allPhotosResponse = await axios.get(`${photosApi}`);
    const allPhotos = allPhotosResponse.data;

    const photoData = [];

    // begin checking filtering conditions
    if (title) {
      // separate out only those photos with title containing query title value
      photoData = allPhotos.filter((photo) => photo.title.includes(title));
    }

    if (albumTitle) {
      // get all albums
      const allAlbumsResponse = await axios.get(`${albumsApi}`);
      const allAlbums = allAlbumsResponse.data;
      // separate out only those albums with title containing query title value
      const albumMatches = allAlbums.filter((album) => album.title.includes(albumTitle));

      // set albumMatches ids to keys of new object
      let albumIdObj = {};
      for (let i=0; i < albumMatches.length; i++) {
        // arbitrarily set value to boolean
        albumIdObj[albumMatches[i].id] = true;
      }

      // compare each photo in AllPhotos albumId value to the id keys in albumIdObj -- O(n) time complexity
      for (let i = 0; i < allPhotos.length; i++) {
        if (allPhotos[i].albumId in albumIdObj) {
          photoData.push(allPhotos[i]);
        }
      }
    }

    // call enrichPhotoData function to add album and user info to selected photos
    const photoDataEnriched = await enrichPhotoData(photoData);

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