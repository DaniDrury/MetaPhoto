/* eslint-disable react/prop-types */
import { useState } from "react";

const Filter = (props) => {
  const [formData, setFormData] = useState({ photoTitle:"", albumTitle:"", email:"" });

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
      email: formData.email });
    setFormData({ photoTitle:"", albumTitle:"", email:"" });
  };

  return (
    <div>
      <form type="submit" onSubmit={handleSubmit}>
        <label htmlFor="photoTitle">Photo Title Contains: </label>
        <input type="text" id="photoTitle" name="photoTitle" className="border rounded me-4" 
          value={formData.photoTitle} onChange={handleChange} />
        <label htmlFor="albumTitle">Album Title Contains: </label>
        <input type="text" id="albumTitle" name="albumTitle" className="border rounded me-4"
          value={formData.albumTitle} onChange={handleChange} />
        <label htmlFor="email">Search by Email: </label>
        <input type="email" id="email" name="email" autoComplete="off" className="border rounded me-4"
          value={formData.email} onChange={handleChange} />
        <button type="submit" className="bg-blue-400 font-semibold rounded-md px-2 ms-5 text-lg">
          Search
        </button>
      </form>
    </div>
  );
}

export default Filter;