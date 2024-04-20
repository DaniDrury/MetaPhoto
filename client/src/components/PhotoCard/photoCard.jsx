function PhotoCard({ data }) {
  console.log(data);

  return (
    <div className="flex flex-col">
      <img src={data.thumbnailUrl} alt="image thumbnail" className="w-96" />
      <div className="w-64">
        <h3 className="text-wrap">Photo Title: {data.title}</h3>
        <p>Album: {data.album.title}</p>
        <p>Artist: {data.album.user.name}</p>
        <p>Artist Email: {data.album.user.email}</p>
      </div>
    </div>
  )
}

export default PhotoCard;