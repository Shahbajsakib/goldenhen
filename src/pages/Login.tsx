// import { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // <-- for redirect
// import Navbar from '../components/Navbar';
// import axios from 'axios';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const navigate = useNavigate(); // <-- initialize router navigation

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:8000/login', {
//         email,
//         password
//       });
//       sessionStorage.setItem("email", email);
//       if (res.data === 'incorrect') {
//         alert('Wrong credentials!');
//       } 
      
//       else if(res.data === "not_activated"){
//         navigate('/active')
//       }

//       else {
//         console.log('Login success. User ID:', res.data);
//         // ✅ Redirect to sensor-data page
//         navigate('/sensor-data');
//       }
//     } catch (error) {
//       console.error('Login failed:', error.response?.data || error.message);
//       alert('Login request failed. Please try again later.');
//     }
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
//         <form 
//           onSubmit={handleSubmit}
//           className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
//         >
//           <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Login</h2>

//           {/* Email */}
//           <div className="mb-4">
//             <label htmlFor="email" className="block mb-1 font-medium text-gray-700">Email</label>
//             <input 
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your email"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div className="mb-4 relative">
//             <label htmlFor="password" className="block mb-1 font-medium text-gray-700">Password</label>
//             <input 
//               type={showPassword ? 'text' : 'password'}
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               placeholder="Enter your password"
//               required
//             />
//             <div 
//               className="absolute right-3 top-9 cursor-pointer text-gray-600 hover:text-black"
//               onClick={() => setShowPassword(!showPassword)}
//             >
//               {showPassword ? <FaEyeSlash /> : <FaEye />}
//             </div>
//           </div>

//           {/* Submit */}
//           <button 
//             type="submit"
//             className="w-full py-2 mt-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-purple-500 hover:to-blue-500 transition-all duration-300 cursor-pointer"
//           >
//             Log In
//           </button>
//         </form>
//       </div>
//     </>
//   );
// }

// export default Login;




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/login', { email, password });
      sessionStorage.setItem('email', email);

      if (res.data === 'incorrect') {
        setErrorMsg('Wrong credentials. Please check your email or password.');
      } else if (res.data === 'not_activated') {
        navigate('/active');
      } else {
        // Success: redirect
        navigate('/sensor-data');
      }
    } catch (error: any) {
      console.error('Login failed:', error?.response?.data || error?.message);
      setErrorMsg('Login request failed. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200 overflow-hidden">
        {/* soft floating blobs */}
        <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-yellow-300 blur-3xl opacity-40" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-orange-300 blur-3xl opacity-40" />

        {/* Card */}
        <div className="relative w-full max-w-md mx-4">
          <div className="rounded-3xl border border-amber-200/60 bg-white/80 backdrop-blur-xl shadow-xl p-8">
            {/* Brand / Header */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow">
                <span className="text-2xl">🐔</span>
              </div>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-amber-900">
                Golden Hen
              </h1>
              <p className="mt-1 text-amber-800/90">Welcome back! Please sign in.</p>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mt-5 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                {errorMsg}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block mb-1 font-medium text-amber-900">
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FiMail className="text-amber-600" />
                  </span>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-amber-300 bg-white text-amber-900 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block mb-1 font-medium text-amber-900">
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">
                    <FiLock className="text-amber-600" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 rounded-xl border border-amber-300 bg-white text-amber-900 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-amber-700/80 hover:text-amber-900"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <label className="inline-flex items-center gap-2 text-amber-800">
                    <input
                      type="checkbox"
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
                      onChange={(e) => {
                        // optional: persist email locally if checked
                        if (e.target.checked) localStorage.setItem('remember_email', email);
                        else localStorage.removeItem('remember_email');
                      }}
                    />
                    Remember me
                  </label>
                  <a href="#" className="text-red-700 hover:text-red-800 font-medium">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-amber-500 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'Logging in…' : 'Log In'}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="h-px bg-amber-200 flex-1" />
                <span className="text-xs text-amber-700/80">or</span>
                <div className="h-px bg-amber-200 flex-1" />
              </div>

              {/* Secondary actions (optional) */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* <button
                  type="button"
                  onClick={() => navigate('/register')}
                  className="w-full rounded-full border border-amber-300 bg-white text-amber-900 px-4 py-3 font-medium hover:bg-white/80"
                >
                  Create an Account
                </button> */}
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full rounded-full bg-white/70 border border-amber-300 text-amber-900 px-4 py-3 font-medium hover:bg-white"
                >
                  Back to Home
                </button>
              </div>
            </form>

            {/* Footer note */}
            <p className="mt-6 text-center text-xs text-amber-700/80">
              By continuing, you agree to our Terms & Privacy Policy.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
