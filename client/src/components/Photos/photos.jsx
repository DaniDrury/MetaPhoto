import { useEffect, useRef, useState } from 'react';
import apiQuery from '../../utils/queries';
import PhotoCard from '../PhotoCard/photoCard';

function Photos(filters) {
  const data = useRef([]);

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getPhotos() {
      // console.log("State", filters.state);
      try {
        const photos = await apiQuery(filters.state);
        // console.log("I'm photos returned:  ", photos);
        return photos;
      } catch (err) {
        console.error("Error: ", err);
      }
    }

    getPhotos().then((response) => {
      // console.log(response);
      if (response !== "Not Found") {
        data.current = response;
        setPhotos(data.current);
      } else {
        setPhotos([]);
      }
    });
  }, [filters.state]);

  // console.log("I'm data.current: ", data.current);
  
  // check that data was returned and set conditional rendering
  let photoContent;
  if (photos.length > 0) {
    photoContent = photos.map((photo) => <PhotoCard key={photo.id} data={photo} />);
  } else {
    photoContent = <h3>No Photos Found</h3>
  }

  return (
    <div className='mt-8 flex flex-col'>
      <h2 className='text-2xl font-semibold mb-2'>Photos:</h2>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
        {photoContent};
      </div>
    </div>
  );
}

export default Photos;