const router = require('express').Router();

const userApi = "https://jsonplaceholder.typicode.com/users";
const albumsApi = "https://jsonplaceholder.typicode.com/albums";
const photosApi = "https://jsonplaceholder.typicode.com/photos";

router.get('/', (req, res) => {
  const query = req.query;
  console.log(query);

  const limit = query.limit || 25;
  const offset = query.offset || 0;

  try {
    fetch(`${photosApi}?_start=${offset}&_limit=${limit}`).then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      res.json(data);
      // console.log(data[0].address.geo);
    })
  } catch (err) {
    console.error(err);
    res.json("No Photo data found.");
  }
});

module.exports = router;