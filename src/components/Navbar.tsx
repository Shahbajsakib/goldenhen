// import { Link, useNavigate } from 'react-router-dom';

// function Navbar() {
//   const navigate = useNavigate();

//   return (
//     <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 20px', background: '#eee' }}>
//       <div style={{ display: 'flex', gap: '15px' }}>
//         <Link to="/">Home</Link>
//         <Link to="/about">About</Link>
//         <Link to="/contact">Contact Us</Link>
//       </div>
//       <button onClick={() => navigate('/login')}>Login</button>
//     </nav>
//   );
// }

// export default Navbar;



import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="text-2xl">🐔</span>
          <h1 className="text-xl font-extrabold text-amber-900 tracking-wide">
            Golden Hen
          </h1>
        </div>

        {/* Links */}
        <div className="hidden md:flex gap-6 text-amber-900 font-medium">
          <Link 
            to="/" 
            className="hover:text-red-700 transition-colors"
          >
            Home
          </Link>
          <Link 
            to="/about" 
            className="hover:text-red-700 transition-colors"
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="hover:text-red-700 transition-colors"
          >
            Contact Us
          </Link>
        </div>

        {/* Login Button */}
        <button
          onClick={() => navigate('/login')}
          className="px-5 py-2 rounded-full bg-red-600 text-white font-semibold shadow hover:bg-red-700 transition-transform hover:scale-105"
        >
          Login
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
