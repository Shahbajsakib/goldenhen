// import Navbar from '../components/Navbar';

// function Home() {
//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <h1>Welcome to the Home Page</h1>
//         <p>This is your main project landing page.</p>
//       </div>
//     </>
//   );
// }

// export default Home;


import Navbar from '../components/Navbar';

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-yellow-200 via-yellow-400 to-orange-300 text-center">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-4">
          🐔 Welcome to <span className="text-red-700">Golden Hen</span> 🐣
        </h1>
        <p className="text-lg text-gray-800 bg-white/70 px-6 py-3 rounded-xl shadow-md max-w-xl">
          Our Main Project— Smart Poultry Farm System. 
          Explore features, monitor farm conditions, deseases detection and discover the future of 
          smart farming with <span className="font-semibold">Golden Hen</span>.
        </p>
        <button className="mt-8 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition transform hover:scale-105">
          Farming Pultry Independently
        </button>
      </div>
    </>
  );
}

export default Home;
