/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from 'react';
import apiQuery from '../../utils/queries';
import PhotoCard from '../PhotoCard/photoCard';
import Pagination from '../Pagination/pagination';

function Photos(props) {
  // initializing ref variables to be used in useEffect
  const data = useRef([]);
  const isOk = useRef(true);

  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getPhotos() {
      // console.log("State", filters.state);
      try {
        const photos = await apiQuery(props.state);
        // console.log("I'm photos returned:  ", photos);
        return photos;
      } catch (err) {
        console.error("Error: ", err);
      }
    }

    getPhotos().then((response) => {
      console.log(response);
      if (response !== "Not Found") {
        data.current = response;
        setPhotos(data.current);
        isOk.current = true;
      } else {
        setPhotos([]);
        isOk.current = false;
      }
    });
  }, [props.state]);

  // check that data was returned and set conditional rendering
  let photoContent;
  if (isOk.current) {
    photoContent = photos.map((photo) => <PhotoCard key={photo.id} data={photo} />);
  } else {
    photoContent = <h3>No Photos Found</h3>
  }

  return (
    <div className='mt-8 flex flex-col'>
      <div className='flex flex-row justify-between'>
        <h2 className='text-2xl font-semibold mb-2'>Photos:</h2>
        <Pagination photoState={photos} filterState={props.state} setFilterState={props.setPhotoFilters} />
      </div>
      <div className='grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2'>
        {photoContent}
      </div>
    </div>
  );
}

export default Photos;