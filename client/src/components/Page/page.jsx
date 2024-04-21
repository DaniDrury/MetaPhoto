import { useState } from "react";
import Filter from "../Filter/filter";
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
    <section className="my-4 flex flex-col items-stretch w-[90%]">
      <Filter state={photoFilters} setPhotoFilters={setPhotoFilters} />
      <Photos state={photoFilters} setPhotoFilters={setPhotoFilters} />
    </section>
  );
}

export default Page;