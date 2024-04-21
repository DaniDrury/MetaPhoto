import { useEffect, useState } from 'react';
import Header from './components/Header/header';
import Page from './components/Page/page';
import Footer from './components/Footer/footer';

function App() {
  return (
    <>
      <Header />
      <main className='grow flex justify-center'>
        <Page />
      </main>
      <Footer />      
    </>
  );
}

export default App;
