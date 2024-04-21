const Header = () => {
  return (
  <header className="flex flex-col lg:flex-row p-5 justify-center bg-green-300">
    <h1 className="text-4xl text-black font-bold mb-2 lg:mb-0 lg:me-4">MetaPhoto</h1>
    <div className="flex items-end lg:ms-5">
      <p className="text-xl">Your one-stop-shop for online photo management!</p>
    </div>
  </header>
  );
}

export default Header;