import { useState } from 'react';

function Pagination(props) {
  const { photoState, filterState, setFilterState } = props;

  const [formData, setFormData] = useState({ limit: filterState.limit, offset: 0 });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((state) => ({ ...state, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFilterState({
      ...filterState,
      limit: formData.limit,
      offset: formData.offset
    });
  };

  const handlePrev = (event) => {
    event.preventDefault();
    const newOffset = Number(filterState.offset) - Number(filterState.limit);
    setFilterState({
      ...filterState,
      offset: newOffset
    })
  }

  const handleNext = (event) => {
    event.preventDefault();
    const newOffset = Number(filterState.offset) + Number(filterState.limit);
    setFilterState({
      ...filterState,
      offset: newOffset
    })
  }

  // set conditionals for prev and next button rendering
  let prev = false;
  if (filterState.offset > 0) {
    prev = true;
  }
  let next = true;
  if (photoState.length < filterState.limit) {
    next = false;
  }

  return (
    <div className='flex flex-row gap-1 items-center'>
      <form type="submit" onSubmit={handleSubmit} className='flex flex-row gap-1 items-center'>
        <label htmlFor="limit" className='me-2'>Photos per Page:</label>
        <input type="text" id="limit" name="limit" value={formData.limit} onChange={handleChange}
          className='border rounded-md w-10 h-7 text-center me-5'
        />
      </form>
      {prev && <button type="button" onClick={handlePrev} className='me-3'>Prev</button>}
      {next && <button type="button" name="next" onClick={handleNext} className='me-1' >Next</button>}
    </div>
  );
}

export default Pagination;