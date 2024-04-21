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
  const limit = Number(query.limit) || 25;
  const offset = Number(query.offset) || 0;
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
      const filteredPhotos = allPhotos.filter((photo) => photo.title.includes(title));

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (!title && albumTitle && !userEmail) {
      const filteredPhotos = await getPhotosByAlbumTitle(albumTitle);

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (!title && !albumTitle && userEmail) {
      const filteredPhotos = await getPhotosByUserEmail(userEmail);

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (title && albumTitle && !userEmail) {
      // find albums by albumTitle, then find photos within that set w/ title
      const albumPhotos = await getPhotosByAlbumTitle(albumTitle);

      const filteredPhotos = albumPhotos.filter((photo) => photo.title.includes(title));

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (title && !albumTitle && userEmail) {
      // find photos by user email, then find photos within that set w/ title
      const userPhotos = await getPhotosByUserEmail(userEmail);
      const filteredPhotos = userPhotos.filter((photo) => photo.title.includes(title));

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (!title && albumTitle && userEmail) {
      // find photos by userEmail, get albumIds by albumtitle, then filter photos by albumIds
      const userPhotos = await getPhotosByUserEmail(userEmail);
      const albumIds = await getAlbumIdsByTitle(albumTitle);
      const filteredPhotos = userPhotos.filter((photo) => {
        for (let i = 0; i < albumIds.length; i++) {
          if (photo.albumId === albumIds[i]) {
            return true;
          } else {
            return false;
          }
        }
      });

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else if (title && albumTitle && userEmail) {
      // find photos by userEmail, then get albumIds by albumTitle, then filter photos by albumIds and title
      const userPhotos = await getPhotosByUserEmail(userEmail);
      const albumIds = await getAlbumIdsByTitle(albumTitle);

      const filteredPhotos = userPhotos.filter((photo) => {
        for (let i = 0; i < albumIds.length; i++) {
          if (photo.albumId === albumIds[i] && photo.title.includes(title)) {
            return true;
          } else {
            return false;
          }
        }
      });

      // pagination
      for (let i = offset; i < (offset + limit) && i < (offset + (filteredPhotos.length - offset)); i++) {
        photoData.push(filteredPhotos[i]);
      }
    } else {
      // return all photos with pagination built in to the call since no filtering required
      const allPhotosResponse = await axios.get(`${photosApi}?_start=${offset}&_limit=${limit}`);
      photoData = allPhotosResponse.data;
    }

    // call enrichPhotoData function to add album and user info to selected photos (photoData)
    if (photoData.length > 0) {
      const photoDataEnriched = await enrichPhotoData(photoData);

      console.log("Return Length: " + photoDataEnriched.length);

      res.json(photoDataEnriched);
    } else {
      res.status(404).json("Not Found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
});

module.exports = router;