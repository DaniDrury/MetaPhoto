/* eslint-disable react/prop-types */
import { useState } from "react";

const Filter = (props) => {
  const [formData, setFormData] = useState({ photoTitle: "", albumTitle: "", email: "" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.setPhotoFilters({
      ...props.state,
      photoTitle: formData.photoTitle,
      albumTitle: formData.albumTitle,
      email: formData.email,
      offset: 0
    });
  };

  return (
    <div>
      <h2 className="text-xl my-3 text-black font-semibold">Use the below filters to select which photos to view.</h2>
      <form type="submit" onSubmit={handleSubmit}>
        <div className="flex flex-row flex-wrap">
          <div className="mb-2">
            <label htmlFor="photoTitle">Photo Title Contains: </label>
            <input type="text" id="photoTitle" name="photoTitle" className="border rounded me-4 w-56"
              value={formData.photoTitle} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="albumTitle">Album Title Contains: </label>
            <input type="text" id="albumTitle" name="albumTitle" className="border rounded me-4 w-56"
              value={formData.albumTitle} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="email">Search by User Email: </label>
            <input type="email" id="email" name="email" autoComplete="off" className="border rounded me-4  w-56"
              value={formData.email} onChange={handleChange} />
          </div>
        </div>
        <button type="submit" className="bg-blue-400 font-semibold rounded-md mt-2 px-2 text-lg w-24">
          Search
        </button>
      </form>
    </div>
  );
}

export default Filter;