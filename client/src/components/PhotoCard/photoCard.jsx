function PhotoCard({ data }) {
  return (
    <div className="flex flex-col">
      <img src={data.url} alt={data.title} className="w-96" />
      <div className="w-64">
        <h3 className="text-wrap"><span className="font-semibold">Photo Title: </span>{data.title}</h3>
        <p><span className="font-semibold">Album: </span>{data.album.title}</p>
        <p><span className="font-semibold">Artist: </span>{data.album.user.name}</p>
        <p><span className="font-semibold">Artist Email: </span>{data.album.user.email}</p>
      </div>
    </div>
  )
}

export default PhotoCard;