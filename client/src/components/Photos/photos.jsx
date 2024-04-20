/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import apiQuery from '../../utils/queries';

function Photos(filters) {
  // console.log(state)
  const data = useRef([]);

  const [photos, setPhotos] = useState([]);
  
  useEffect(() => {
    async function getPhotos() {
      console.log("State", filters.state);
      // const { photoTitle, albumTitle, email, limit, offset } = filters.state;
      try {
        const photos = await apiQuery(filters.state);
        // const photos = await photosResponse.json();
        // console.log(photos);
        return photos;
      } catch (err) {
        console.error(err);
      }
    }  
    
    getPhotos().then((response) => {
      data.current = response;
      setPhotos(data.current);
    });
  },[filters.state]);

  console.log("I'm data.current: ", data.current);

  return (
    <div className='mt-8'>
      <h4>This is where the photos will show up</h4>
      <p className='text-xl'>Title: {photos[0]?.title}</p>
      <p className='text-xl'>AlbumTitle: {photos[0]?.album.title}</p>
      <p className='text-xl'>User: {photos[0]?.album.user.name}</p>
    </div>
  );
}

export default Photos;