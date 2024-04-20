/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import apiQuery from '../../utils/queries';
import PhotoCard from '../PhotoCard/photoCard';

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
    <div className='mt-8 flex flex-col'>
      <h2 className='text-2xl font-semibold mb-2'>Photos:</h2>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
        {photos.map((photo) => <PhotoCard key={photo.id} data={photo} />)}
      </div>
    </div>
  );
}

export default Photos;