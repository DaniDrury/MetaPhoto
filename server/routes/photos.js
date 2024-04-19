const router = require('express').Router();
const axios = require('axios');

const { enrichPhotoData } = require('./utils/enrichPhotoData');
const { getPhotosByAlbumTitle } = require('./utils/getPhotosByAlbumTitle');
const { getPhotosByUserEmail } = require('./utils/getPhotosByUserEmail');
const { getAlbumIdsByTitle } = require('./utils/getAlbumIdsByTitle');

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

router.get('/', async (req, res) => {
  const query = req.query;
  const limit = query.limit || 25;
  const offset = query.offset || 0;
  const title = query.title;
  const albumTitle = query['album.title'];
  const userEmail = query['album.user.email'];

  try {
    let photoData = [];

    // begin checking filtering conditions
    if (title && !albumTitle && !userEmail) {
      // due to inability to send api query specifying a "contains" filter, instead get all data
      // from internal API and filter responses here on server before returning to client
      const allPhotosResponse = await axios.get(`${photosApi}`);
      const allPhotos = allPhotosResponse.data;

      // separate out only those photos with title containing query title value
      photoData = allPhotos.filter((photo) => photo.title.includes(title));
    } else if (!title && albumTitle && !userEmail) {
      photoData = await getPhotosByAlbumTitle(albumTitle);
    } else if (!title && !albumTitle && userEmail) {
      photoData = await getPhotosByUserEmail(userEmail);
    } else if (title && albumTitle && !userEmail) {
      // find albums by albumTitle, then find photos within that set w/ title
      const albumPhotos = await getPhotosByAlbumTitle(albumTitle);
      photoData = albumPhotos.filter((photo) => photo.title.includes(title));
    } else if (title && !albumTitle && userEmail) {
      // find photos by user email, then find photos within that set w/ title
      const userPhotos = await getPhotosByUserEmail(userEmail);
      photoData = userPhotos.filter((photo) => photo.title.includes(title));
    } else if (!title && albumTitle && userEmail) {
      // find photos by userEmail, get albumIds by albumtitle, then filter photos by albumIds
      const userPhotos = await getPhotosByUserEmail(userEmail);
      const albumIds = await getAlbumIdsByTitle(albumTitle);
      photoData = userPhotos.filter((photo) => {
        for (let i = 0; i < albumIds.length; i++) {
          if (photo.albumId === albumIds[i]) {
            return true;
          } else {
            return false;
          }
        }
      });
    } else if (title && albumTitle && userEmail) {
      // find photos by userEmail, then get albumIds by albumTitle, then filter photos by albumIds and title
      const userPhotos = await getPhotosByUserEmail(userEmail);
      const albumIds = await getAlbumIdsByTitle(albumTitle);
      console.log(albumIds);
      photoData = userPhotos.filter((photo) => {
        for (let i = 0; i < albumIds.length; i++) {
          if (photo.albumId === albumIds[i] && photo.title.includes(title)) {
            return true;
          } else {
            return false;
          }
        }
      });
    } else {
      // return all photos with limit and offset
      const allPhotosResponse = await axios.get(`${photosApi}?_start=${offset}&_limit=${limit}`);
      photoData = allPhotosResponse.data;
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