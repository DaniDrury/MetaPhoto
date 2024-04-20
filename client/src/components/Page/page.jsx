import Filter from "../Filter/filter";
import { useState } from "react";
import Photos from "../Photos/photos";

const Page = () => {

  const [photoFilters, setPhotoFilters] = useState({
    photoTitle:"",
    albumTitle:"",
    email:"",
    limit:25,
    offset:0
  });

  return (
    <section className="m-4">
      <h2 className="text-xl text-black my-3">Use the below filters to select which photos to view.</h2>
      <Filter state={photoFilters} setPhotoFilters={setPhotoFilters} />
      <Photos state={photoFilters} />
    </section>
  );
}

export default Page;