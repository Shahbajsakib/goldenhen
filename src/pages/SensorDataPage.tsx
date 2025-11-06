// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// type SensorRow = {
//   time: string;
//   temperature: number;
//   humidity: number;
//   food_level: number;
//   water_level: number;
//   water_pump_status: number | string;
//   fan_status: number | string;
//   fire_status: number | string;
//   gas_status: number | string;
//   food_time_status: number | string;
// };

// type PredictLast = {
//   label: string;
//   index: number;
//   probs: number[];
//   at?: string;   // present only for /predict/last; absent for /predict/image
// } | null;

// function SensorDataPage() {
//   const [data, setData] = useState<SensorRow[]>([]);
//   const [lastPred, setLastPred] = useState<PredictLast>(null);

//   // Upload state
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isPredicting, setIsPredicting] = useState(false);
//   const [predictError, setPredictError] = useState<string | null>(null);

//   // Load sensor table once
//   useEffect(() => {
//     axios.get<SensorRow[]>('http://127.0.0.1:8000/data/read/1')
//       .then(res => setData(res.data.reverse()))
//       .catch(err => console.error('Error fetching data:', err));
//   }, []);

//   // Poll latest disease prediction every 2 seconds (from ESP32 posts)
//   useEffect(() => {
//     let mounted = true;
//     const tick = async () => {
//       try {
//         const { data } = await axios.get<PredictLast>('http://127.0.0.1:8000/predict/last', {
//           headers: { 'Cache-Control': 'no-cache' }
//         });
//         if (mounted && data) setLastPred(data);
//       } catch {
//         /* ignore */
//       }
//     };
//     tick();
//     const id = setInterval(tick, 2000);
//     return () => { mounted = false; clearInterval(id); };
//   }, []);

//   // ----- Upload handlers -----
//   const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0] ?? null;
//     setFile(f);
//     setPredictError(null);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setPreviewUrl(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const onPredict = async () => {
//     if (!file) {
//       setPredictError('Please choose an image first.');
//       return;
//     }
//     setIsPredicting(true);
//     setPredictError(null);
//     try {
//       const form = new FormData();
//       form.append('file', file);
//       // FastAPI route: POST /predict/image  (returns {label,index,probs})
//       const { data } = await axios.post<PredictLast>(
//         'http://127.0.0.1:8000/predict/image',
//         form,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       // Merge into the same box (no timestamp from this route)
//       setLastPred(data);
//     } catch (err: any) {
//       const detail = err?.response?.data?.detail ?? 'Prediction failed';
//       setPredictError(typeof detail === 'string' ? detail : 'Prediction failed');
//     } finally {
//       setIsPredicting(false);
//     }
//   };

//   const labels = useMemo(
//     () => data.map(entry => new Date(entry.time).toLocaleTimeString()),
//     [data]
//   );

//   const getLineChartData = (label: string, key: keyof SensorRow) => ({
//     labels,
//     datasets: [
//       {
//         label,
//         data: data.map(entry => Number(entry[key] ?? 0)),
//         borderColor: 'rgb(59 130 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.3)',
//         tension: 0.3,
//         fill: true,
//       }
//     ]
//   });

//   const sensorKeys: { label: string; key: keyof SensorRow }[] = [
//     { label: "Temperature (°C)", key: "temperature" },
//     { label: "Humidity (%)", key: "humidity" },
//     { label: "Food Level", key: "food_level" },
//     { label: "Water Level", key: "water_level" },
//     { label: "Water Pump Status", key: "water_pump_status" },
//     { label: "Fan Status", key: "fan_status" },
//     { label: "Fire Status", key: "fire_status" },
//     { label: "Gas Status", key: "gas_status" },
//     { label: "Food Time Status", key: "food_time_status" }
//   ];

//   const confidence = useMemo(() => {
//     if (!lastPred?.probs?.length) return null;
//     const max = Math.max(...lastPred.probs);
//     return `${(max * 100).toFixed(1)}%`;
//   }, [lastPred]);

//   const lastTime = useMemo(() => {
//     if (!lastPred?.at) return null;
//     try {
//       return new Date(lastPred.at).toLocaleString();
//     } catch {
//       return lastPred.at;
//     }
//   }, [lastPred]);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-green-600 mb-3">
//         Golden Hen
//       </h1>
//       <p className="text-center text-gray-600 text-md mb-6">
//         Based on real-time sensor & vision data using FastAPI & React
//       </p>

//       {/* Upload & Live Disease Row */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Upload card */}
//         <div className="bg-white p-5 rounded-xl shadow-md">
//           <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
//           <input
//             type="file"
//             accept="image/*"
//             onChange={onSelectFile}
//             className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           />
//           {previewUrl && (
//             <div className="mt-4">
//               <img
//                 src={previewUrl}
//                 alt="preview"
//                 className="w-full max-h-64 object-contain border rounded-md"
//               />
//             </div>
//           )}
//           <button
//             onClick={onPredict}
//             disabled={isPredicting || !file}
//             className="mt-4 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isPredicting ? 'Predicting…' : 'Predict Disease'}
//           </button>
//           {predictError && (
//             <p className="mt-3 text-sm text-red-600">{predictError}</p>
//           )}
//         </div>

//         {/* Disease box */}
//         <div className="bg-white p-5 rounded-xl shadow-md lg:col-span-2 flex items-center justify-between">
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800 mb-1">Latest Disease</h2>
//             <div className="text-4xl font-extrabold tracking-wide">
//               {lastPred ? lastPred.label : '—'}
//             </div>
//             <div className="mt-2 text-sm text-gray-500">
//               {lastPred
//                 ? <>
//                     Confidence: <span className="font-semibold">{confidence ?? '—'}</span>
//                     {lastTime && (<><span className="mx-2">•</span>Updated: <span className="font-medium">{lastTime}</span></>)}
//                   </>
//                 : 'Waiting for ESP32-CAM or upload…'
//               }
//             </div>
//           </div>
//           <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
//             {lastPred ? `Index: ${lastPred.index}` : 'No data'}
//           </div>
//         </div>
//       </div>

//       {/* Sensor Data Visualization */}
//       <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
//         Sensor Data Visualization
//       </h2>

//       {/* Table */}
//       <div className="overflow-auto mb-10 shadow-lg rounded-lg bg-white">
//         <table className="table-auto w-full text-sm text-left border border-gray-200">
//           <thead className="bg-blue-500 text-white">
//             <tr>
//               <th className="p-2">Time</th>
//               {sensorKeys.map((sensor) => (
//                 <th key={sensor.key as string} className="p-2">{sensor.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((entry, i) => (
//               <tr key={i} className="border-t hover:bg-blue-50">
//                 <td className="p-2">{new Date(entry.time).toLocaleString()}</td>
//                 {sensorKeys.map(sensor => (
//                   <td key={sensor.key as string} className="p-2">
//                     {String(entry[sensor.key] ?? '')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Graphs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {sensorKeys.map(sensor => (
//           <div key={sensor.key as string} className="bg-white p-4 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">{sensor.label}</h3>
//             <Line
//               data={getLineChartData(sensor.label, sensor.key)}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                   x: { ticks: { maxRotation: 90, minRotation: 45 } }
//                 }
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SensorDataPage;

// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// // ====== API base (edit this as needed) ======
// const BASE_URL = 'http://192.168.83.105:8000';

// type SensorRow = {
//   time: string;
//   temperature: number;
//   humidity: number;
//   food_level: number;
//   water_level: number;
//   water_pump_status: number | string;
//   fan_status: number | string;
//   fire_status: number | string;
//   gas_status: number | string;
//   food_time_status: number | string;
// };

// type PredictLast = {
//   label: string;
//   index: number;
//   probs: number[];
//   at?: string;   // present only for /predict/last; absent for /predict/image
// } | null;

// // =============== Camera Box (inline component in SAME file) ===============
// function CameraBox({ defaultDeviceId = 'esp32cam-57DDC4' }: { defaultDeviceId?: string }) {
//   const [deviceId, setDeviceId] = useState<string>(defaultDeviceId);
//   const [imgSrc, setImgSrc] = useState<string>('');

//   useEffect(() => {
//     let mounted = true;
//     const makeUrl = () =>
//       deviceId.trim()
//         ? `${BASE_URL}/predict/frame.jpg?device_id=${encodeURIComponent(deviceId.trim())}&t=${Date.now()}`
//         : `${BASE_URL}/predict/last_frame.jpg?t=${Date.now()}`;

//     const tick = () => {
//       if (!mounted) return;
//       setImgSrc(makeUrl());
//     };

//     tick();
//     const id = setInterval(tick, 1000);
//     return () => { mounted = false; clearInterval(id); };
//   }, [deviceId]);

//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md">
//       <div className="flex items-center justify-between mb-3 gap-3">
//         <h2 className="text-xl font-semibold text-gray-800">Live Camera</h2>
//         <div className="flex items-center gap-2">
//           <label className="text-sm text-gray-600">Device ID:</label>
//           <input
//             type="text"
//             value={deviceId}
//             onChange={(e) => setDeviceId(e.target.value)}
//             placeholder="e.g., esp32cam-57DDC4"
//             className="w-32 rounded-md border px-2 py-1 text-sm"
//           />
//         </div>
//       </div>

//       <div className="relative w-full aspect-video bg-gray-100 rounded-md overflow-hidden border">
//         {imgSrc ? (
//           <img
//             src={imgSrc}
//             alt="ESP32-CAM live"
//             className="w-full h-full object-contain"
//             onError={() => {
//               // If no frame yet, keep retrying silently; the interval refreshes src
//             }}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             Waiting for frames…
//           </div>
//         )}
//       </div>

//       <p className="mt-2 text-xs text-gray-500">
//         ESP32‑CAM should be POSTing JPEGs to <code>/predict/bytes</code>. This view auto‑refreshes every 1s.
//       </p>
//     </div>
//   );
// }

// // ============================== Page ==============================
// function SensorDataPage() {
//   const [data, setData] = useState<SensorRow[]>([]);
//   const [lastPred, setLastPred] = useState<PredictLast>(null);

//   // Upload state
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isPredicting, setIsPredicting] = useState(false);
//   const [predictError, setPredictError] = useState<string | null>(null);

//   // Load sensor table once
//   useEffect(() => {
//     axios.get<SensorRow[]>(`${BASE_URL}/data/read/1`)
//       .then(res => setData(res.data.reverse()))
//       .catch(err => console.error('Error fetching data:', err));
//   }, []);

//   // Poll latest disease prediction every 2 seconds (from ESP32 posts)
//   useEffect(() => {
//     let mounted = true;
//     const tick = async () => {
//       try {
//         const { data } = await axios.get<PredictLast>(`${BASE_URL}/predict/last`, {
//           headers: { 'Cache-Control': 'no-cache' }
//         });
//         if (mounted && data) setLastPred(data);
//       } catch {
//         /* ignore */
//       }
//     };
//     tick();
//     const id = setInterval(tick, 2000);
//     return () => { mounted = false; clearInterval(id); };
//   }, []);

//   // ----- Upload handlers -----
//   const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0] ?? null;
//     setFile(f);
//     setPredictError(null);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setPreviewUrl(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const onPredict = async () => {
//     if (!file) {
//       setPredictError('Please choose an image first.');
//       return;
//     }
//     setIsPredicting(true);
//     setPredictError(null);
//     try {
//       const form = new FormData();
//       form.append('file', file);
//       const { data } = await axios.post<PredictLast>(
//         `${BASE_URL}/predict/image`,
//         form,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setLastPred(data);
//     } catch (err: any) {
//       const detail = err?.response?.data?.detail ?? 'Prediction failed';
//       setPredictError(typeof detail === 'string' ? detail : 'Prediction failed');
//     } finally {
//       setIsPredicting(false);
//     }
//   };

//   const labels = useMemo(
//     () => data.map(entry => new Date(entry.time).toLocaleTimeString()),
//     [data]
//   );

//   const getLineChartData = (label: string, key: keyof SensorRow) => ({
//     labels,
//     datasets: [
//       {
//         label,
//         data: data.map(entry => Number(entry[key] ?? 0)),
//         borderColor: 'rgb(59 130 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.3)',
//         tension: 0.3,
//         fill: true,
//       }
//     ]
//   });

//   const sensorKeys: { label: string; key: keyof SensorRow }[] = [
//     { label: "Temperature (°C)", key: "temperature" },
//     { label: "Humidity (%)", key: "humidity" },
//     { label: "Food Level", key: "food_level" },
//     { label: "Water Level", key: "water_level" },
//     { label: "Water Pump Status", key: "water_pump_status" },
//     { label: "Fan Status", key: "fan_status" },
//     { label: "Fire Status", key: "fire_status" },
//     { label: "Gas Status", key: "gas_status" },
//     { label: "Food Time Status", key: "food_time_status" }
//   ];

//   const confidence = useMemo(() => {
//     if (!lastPred?.probs?.length) return null;
//     const max = Math.max(...lastPred.probs);
//     return `${(max * 100).toFixed(1)}%`;
//   }, [lastPred]);

//   const lastTime = useMemo(() => {
//     if (!lastPred?.at) return null;
//     try {
//       return new Date(lastPred.at).toLocaleString();
//     } catch {
//       return lastPred.at;
//     }
//   }, [lastPred]);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-green-600 mb-3">
//         Golden Hen
//       </h1>
//       <p className="text-center text-gray-600 text-md mb-6">
//         Based on real-time sensor & vision data using FastAPI & React
//       </p>

//       {/* Row: Camera + (Upload & Live Disease) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Live Camera */}
//         <CameraBox defaultDeviceId="esp32cam-57DDC4" />

//         {/* Upload + Latest Disease (2 columns) */}
//         <div className="lg:col-span-2 grid grid-cols-1 gap-6">
//           {/* Upload card */}
//           <div className="bg-white p-5 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={onSelectFile}
//               className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {previewUrl && (
//               <div className="mt-4">
//                 <img
//                   src={previewUrl}
//                   alt="preview"
//                   className="w-full max-h-64 object-contain border rounded-md"
//                 />
//               </div>
//             )}
//             <button
//               onClick={onPredict}
//               disabled={isPredicting || !file}
//               className="mt-4 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isPredicting ? 'Predicting…' : 'Predict Disease'}
//             </button>
//             {predictError && (
//               <p className="mt-3 text-sm text-red-600">{predictError}</p>
//             )}
//           </div>

//           {/* Disease box */}
//           <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-1">Latest Disease</h2>
//               <div className="text-4xl font-extrabold tracking-wide">
//                 {lastPred ? lastPred.label : '—'}
//               </div>
//               <div className="mt-2 text-sm text-gray-500">
//                 {lastPred
//                   ? <>
//                       Confidence: <span className="font-semibold">{confidence ?? '—'}</span>
//                       {lastTime && (<><span className="mx-2">•</span>Updated: <span className="font-medium">{lastTime}</span></>)}
//                     </>
//                   : 'Waiting for ESP32-CAM or upload…'
//                 }
//               </div>
//             </div>
//             <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
//               {lastPred ? `Index: ${lastPred.index}` : 'No data'}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sensor Data Visualization */}
//       <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
//         Sensor Data Visualization
//       </h2>

//       {/* Table */}
//       <div className="overflow-auto mb-10 shadow-lg rounded-lg bg-white">
//         <table className="table-auto w-full text-sm text-left border border-gray-200">
//           <thead className="bg-blue-500 text-white">
//             <tr>
//               <th className="p-2">Time</th>
//               {sensorKeys.map((sensor) => (
//                 <th key={sensor.key as string} className="p-2">{sensor.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((entry, i) => (
//               <tr key={i} className="border-t hover:bg-blue-50">
//                 <td className="p-2">{new Date(entry.time).toLocaleString()}</td>
//                 {sensorKeys.map(sensor => (
//                   <td key={sensor.key as string} className="p-2">
//                     {String(entry[sensor.key] ?? '')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Graphs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {sensorKeys.map(sensor => (
//           <div key={sensor.key as string} className="bg-white p-4 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">{sensor.label}</h3>
//             <Line
//               data={getLineChartData(sensor.label, sensor.key)}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                   x: { ticks: { maxRotation: 90, minRotation: 45 } }
//                 }
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SensorDataPage;





















// 'use client';

// import { useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);
// <CameraBox defaultDeviceId="droidcam1" />

// // ====== API base (edit if your backend host/port differs) ======
// const BASE_URL = 'http://192.168.83.105:8000';

// type SensorRow = {
//   time: string;
//   temperature: number;
//   humidity: number;
//   food_level: number;
//   water_level: number;
//   water_pump_status: number | string;
//   fan_status: number | string;
//   fire_status: number | string;
//   gas_status: number | string;
//   food_time_status: number | string;
// };

// type PredictLast = {
//   label: string;
//   index: number;
//   probs: number[];
//   at?: string;   // present for /predict/last; absent for /predict/image
// } | null;

// // =========================== CameraBox (inline) ===========================
// function CameraBox({ defaultDeviceId = 'esp32cam-F7C630' }: { defaultDeviceId?: string }) {
//   const [deviceId, setDeviceId] = useState<string>(defaultDeviceId);
//   const [imgSrc, setImgSrc] = useState<string>('');

//   useEffect(() => {
//     let mounted = true;
//     const makeUrl = () =>
//       deviceId.trim()
//         ? `${BASE_URL}/predict/frame.jpg?device_id=${encodeURIComponent(deviceId.trim())}&t=${Date.now()}`
//         : `${BASE_URL}/predict/last_frame.jpg?t=${Date.now()}`;

//     const tick = () => {
//       if (!mounted) return;
//       setImgSrc(makeUrl());
//     };

//     tick();
//     const id = setInterval(tick, 1000); // refresh every 1s
//     return () => { mounted = false; clearInterval(id); };
//   }, [deviceId]);

//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md">
//       <div className="flex items-center justify-between mb-3 gap-3">
//         <h2 className="text-xl font-semibold text-gray-800">📷 Live Camera</h2>
//         <div className="flex items-center gap-2">
//           <label className="text-sm text-gray-600">Device ID:</label>
//           <input
//             type="text"
//             value={deviceId}
//             onChange={(e) => setDeviceId(e.target.value)}
//             placeholder="e.g., coop1"
//             className="w-40 rounded-md border px-2 py-1 text-sm"
//           />
//         </div>
//       </div>

//       {/* Fixed height so it’s always visible even without aspect plugin */}
//       <div className="relative w-full h-64 bg-gray-100 rounded-md overflow-hidden border">
//         {imgSrc ? (
//           <img
//             src={imgSrc}
//             alt="ESP32-CAM live"
//             className="w-full h-full object-contain"
//             onError={() => console.log('Camera image failed to load:', imgSrc)}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-gray-400">
//             Waiting for frames…
//           </div>
//         )}
//       </div>

//       <p className="mt-2 text-xs text-gray-500">
//         This view auto‑refreshes every 1s. Ensure your ESP32‑CAM is POSTing to <code>/predict/bytes</code>.
//       </p>
//     </div>
//   );
// }

// // ============================== Page ==============================
// function SensorDataPage() {
//   const [data, setData] = useState<SensorRow[]>([]);
//   const [lastPred, setLastPred] = useState<PredictLast>(null);

//   // Upload state
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isPredicting, setIsPredicting] = useState(false);
//   const [predictError, setPredictError] = useState<string | null>(null);

//   // Load sensor table once
//   useEffect(() => {
//     axios.get<SensorRow[]>(`${BASE_URL}/data/read/1`)
//       .then(res => setData(res.data.reverse()))
//       .catch(err => console.error('Error fetching data:', err));
//   }, []);

//   // Poll latest disease prediction every 2 seconds (from ESP32 posts)
//   useEffect(() => {
//     let mounted = true;
//     const tick = async () => {
//       try {
//         const { data } = await axios.get<PredictLast>(`${BASE_URL}/predict/last`, {
//           headers: { 'Cache-Control': 'no-cache' }
//         });
//         if (mounted && data) setLastPred(data);
//       } catch {
//         /* ignore */
//       }
//     };
//     tick();
//     const id = setInterval(tick, 2000);
//     return () => { mounted = false; clearInterval(id); };
//   }, []);

//   // ----- Upload handlers -----
//   const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0] ?? null;
//     setFile(f);
//     setPredictError(null);
//     if (f) {
//       const url = URL.createObjectURL(f);
//       setPreviewUrl(url);
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const onPredict = async () => {
//     if (!file) {
//       setPredictError('Please choose an image first.');
//       return;
//     }
//     setIsPredicting(true);
//     setPredictError(null);
//     try {
//       const form = new FormData();
//       form.append('file', file);
//       const { data } = await axios.post<PredictLast>(
//         `${BASE_URL}/predict/image`,
//         form,
//         { headers: { 'Content-Type': 'multipart/form-data' } }
//       );
//       setLastPred(data);
//     } catch (err: any) {
//       const detail = err?.response?.data?.detail ?? 'Prediction failed';
//       setPredictError(typeof detail === 'string' ? detail : 'Prediction failed');
//     } finally {
//       setIsPredicting(false);
//     }
//   };

//   const labels = useMemo(
//     () => data.map(entry => new Date(entry.time).toLocaleTimeString()),
//     [data]
//   );

//   const getLineChartData = (label: string, key: keyof SensorRow) => ({
//     labels,
//     datasets: [
//       {
//         label,
//         data: data.map(entry => Number(entry[key] ?? 0)),
//         borderColor: 'rgb(59 130 246)',
//         backgroundColor: 'rgba(59, 130, 246, 0.3)',
//         tension: 0.3,
//         fill: true,
//       }
//     ]
//   });

//   const sensorKeys: { label: string; key: keyof SensorRow }[] = [
//     { label: "Temperature (°C)", key: "temperature" },
//     { label: "Humidity (%)", key: "humidity" },
//     { label: "Food Level", key: "food_level" },
//     { label: "Water Level", key: "water_level" },
//     { label: "Water Pump Status", key: "water_pump_status" },
//     { label: "Fan Status", key: "fan_status" },
//     { label: "Fire Status", key: "fire_status" },
//     { label: "Gas Status", key: "gas_status" },
//     { label: "Food Time Status", key: "food_time_status" }
//   ];

//   const confidence = useMemo(() => {
//     if (!lastPred?.probs?.length) return null;
//     const max = Math.max(...lastPred.probs);
//     return `${(max * 100).toFixed(1)}%`;
//   }, [lastPred]);

//   const lastTime = useMemo(() => {
//     if (!lastPred?.at) return null;
//     try {
//       return new Date(lastPred.at).toLocaleString();
//     } catch {
//       return lastPred.at;
//     }
//   }, [lastPred]);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       {/* Title */}
//       <h1 className="text-4xl font-bold text-center text-green-600 mb-3">
//         Golden Hen
//       </h1>
//       <p className="text-center text-gray-600 text-md mb-6">
//         Based on real-time sensor & vision data using FastAPI & React
//       </p>

//       {/* Row: Camera + (Upload & Live Disease) */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
//         {/* Live Camera (defaults to your ESP32 device id) */}
//         <CameraBox defaultDeviceId="esp32cam-F7C630" />

//         {/* Upload + Latest Disease (2 columns) */}
//         <div className="lg:col-span-2 grid grid-cols-1 gap-6">
//           {/* Upload card */}
//           <div className="bg-white p-5 rounded-xl shadow-md">
//             <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Image</h2>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={onSelectFile}
//               className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//             />
//             {previewUrl && (
//               <div className="mt-4">
//                 <img
//                   src={previewUrl}
//                   alt="preview"
//                   className="w-full max-h-64 object-contain border rounded-md"
//                 />
//               </div>
//             )}
//             <button
//               onClick={onPredict}
//               disabled={isPredicting || !file}
//               className="mt-4 w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isPredicting ? 'Predicting…' : 'Predict Disease'}
//             </button>
//             {predictError && (
//               <p className="mt-3 text-sm text-red-600">{predictError}</p>
//             )}
//           </div>

//           {/* Disease box */}
//           <div className="bg-white p-5 rounded-xl shadow-md flex items-center justify-between">
//             <div>
//               <h2 className="text-xl font-semibold text-gray-800 mb-1">Latest Disease</h2>
//               <div className="text-4xl font-extrabold tracking-wide">
//                 {lastPred ? lastPred.label : '—'}
//               </div>
//               <div className="mt-2 text-sm text-gray-500">
//                 {lastPred
//                   ? <>
//                       Confidence: <span className="font-semibold">{confidence ?? '—'}</span>
//                       {lastTime && (<><span className="mx-2">•</span>Updated: <span className="font-medium">{lastTime}</span></>)}
//                     </>
//                   : 'Waiting for ESP32-CAM or upload…'
//                 }
//               </div>
//             </div>
//             <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold">
//               {lastPred ? `Index: ${lastPred.index}` : 'No data'}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Sensor Data Visualization */}
//       <h2 className="text-3xl font-bold text-center mb-8 text-blue-600">
//         Sensor Data Visualization
//       </h2>

//       {/* Table */}
//       <div className="overflow-auto mb-10 shadow-lg rounded-lg bg-white">
//         <table className="table-auto w-full text-sm text-left border border-gray-200">
//           <thead className="bg-blue-500 text-white">
//             <tr>
//               <th className="p-2">Time</th>
//               {sensorKeys.map((sensor) => (
//                 <th key={sensor.key as string} className="p-2">{sensor.label}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((entry, i) => (
//               <tr key={i} className="border-t hover:bg-blue-50">
//                 <td className="p-2">{new Date(entry.time).toLocaleString()}</td>
//                 {sensorKeys.map(sensor => (
//                   <td key={sensor.key as string} className="p-2">
//                     {String(entry[sensor.key] ?? '')}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Graphs */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {sensorKeys.map(sensor => (
//           <div key={sensor.key as string} className="bg-white p-4 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-2 text-gray-700">{sensor.label}</h3>
//             <Line
//               data={getLineChartData(sensor.label, sensor.key)}
//               options={{
//                 responsive: true,
//                 plugins: { legend: { display: false } },
//                 scales: {
//                   x: { ticks: { maxRotation: 90, minRotation: 45 } }
//                 }
//               }}
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default SensorDataPage;











'use client';

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { CgLayoutGrid } from 'react-icons/cg';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// ====== API base (edit if your backend host/port differs) ======
const BASE_URL = 'http://localhost:8000';

type SensorRow = {
  time: string;
  temperature: number;
  humidity: number;
  food_level: number;
  water_level: number;
  water_pump_status: number | string;
  fan_status: number | string;
  fire_status: number | string;
  gas_status: number | string;
  food_time_status: number | string;
};

type PredictLast = {
  label: string;
  index: number;
  probs: number[];
  at?: string; // present for /predict/last; absent for /predict/image
} | null;

/* ======================= Utility helpers ======================= */

const asNumber = (v: any): number => {
  if (typeof v === 'number') return v;
  if (typeof v === 'string') {
    const m = v.trim().toLowerCase();
    if (m === 'on' || m === 'true') return 1;
    if (m === 'off' || m === 'false') return 0;
    const n = Number(m);
    return isNaN(n) ? 0 : n;
  }
  return 0;
};

const formatTS = (t?: string) => {
  if (!t) return '—';
  try {
    return new Date(t).toLocaleString();
  } catch {
    return t;
  }
};

/* =========================== CameraBox =========================== */
function CameraBox({ defaultDeviceId = 'espcam-F7C630' }: { defaultDeviceId?: string }) {
  const [deviceId, setDeviceId] = useState<string>(defaultDeviceId);
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const makeUrl = () =>
      deviceId.trim()
        ? `${BASE_URL}/predict/frame.jpg?device_id=${encodeURIComponent(deviceId.trim())}&t=${Date.now()}`
        : `${BASE_URL}/predict/last_frame.jpg?t=${Date.now()}`;

    const tick = () => {
      if (!mounted) return;
      setImgSrc(makeUrl());
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [deviceId]);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
      <div className="flex items-center justify-between mb-3 gap-3">
        <h2 className="text-xl font-semibold text-amber-900">📷 Live Camera</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-amber-800">Device ID:</label>
          <input
            type="text"
            value={deviceId}
            onChange={(e) => setDeviceId(e.target.value)}
            placeholder="esp32cam-1"
            className="w-44 rounded-md border border-amber-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>
      </div>

      <div className="relative w-full h-64 bg-amber-50 rounded-lg overflow-hidden border border-amber-200">
        {imgSrc ? (
          <img
            src={imgSrc}
            alt="ESP32-CAM live"
            className="w-full h-full object-contain"
            onError={() => console.log('Camera image failed to load:', imgSrc)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-amber-400">
            Waiting for frames…
          </div>
        )}
      </div>

      <p className="mt-2 text-xs text-amber-700">
        Auto‑refreshes every 1s. Ensure ESP32‑CAM is POSTing frames to <code>/predict/bytes</code>.
      </p>
    </div>
  );
}

/* ============================== Dashboard ============================== */

function SensorDataPage() {
  const navigate = useNavigate();

  // Data state
  const [rows, setRows] = useState<SensorRow[]>([]);
  const [lastPred, setLastPred] = useState<PredictLast>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // Upload state
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictError, setPredictError] = useState<string | null>(null);

  // UI toggles
  const [showCharts, setShowCharts] = useState<boolean>(true);
  const [showTable, setShowTable] = useState<boolean>(false);

  // Load sensor table on mount and then poll
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        const res = await axios.get<SensorRow[]>(`${BASE_URL}/data/read/1`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (!mounted) return;
        // reverse to chronological
        const data = (res.data || []).reverse();
        setRows(data);
        setLastUpdated(new Date().toISOString());
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
    const id = setInterval(fetchData, 4000); // refresh every 4s
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // Poll latest disease prediction every 2 seconds
  useEffect(() => {
    let mounted = true;
    const tick = async () => {
      try {
        const { data } = await axios.get<PredictLast>(`${BASE_URL}/predict/last`, {
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (mounted && data) setLastPred(data);
      } catch {
        /* ignore */
      }
    };
    tick();
    const id = setInterval(tick, 2000);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, []);

  // ----- Upload handlers -----
  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPredictError(null);
    if (f) setPreviewUrl(URL.createObjectURL(f));
    else setPreviewUrl(null);
  };

  const onPredict = async () => {
    if (!file) {
      setPredictError('Please choose an image first.');
      return;
    }
    setIsPredicting(true);
    setPredictError(null);
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post<PredictLast>(`${BASE_URL}/predict/image`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLastPred(data);
      
    } catch (err: any) {
      const detail = err?.response?.data?.detail ?? 'Prediction failed';
      setPredictError(typeof detail === 'string' ? detail : 'Prediction failed');
    } finally {
      setIsPredicting(false);
    }
  };

  // Latest row (most recent)
  const latest = rows.length ? rows[rows.length - 1] : undefined;

  // KPIs
  const kpis = useMemo(() => {
    const temp = latest ? Number(latest.temperature ?? 0) : 0;
    const hum = latest ? Number(latest.humidity ?? 0) : 0;
    const food = latest ? Number(latest.food_level ?? 0) : 0;
    const water = latest ? Number(latest.water_level ?? 0) : 0;
    return { temp, hum, food, water };
  }, [latest]);

  // Alerts (simple thresholds — tweak as needed)
  const alerts = useMemo(() => {
    if (!latest) return [];
    const a: { type: 'danger' | 'warn'; msg: string }[] = [];
    const t = Number(latest.temperature ?? 0);
    const h = Number(latest.humidity ?? 0);
    const food = Number(latest.food_level ?? 0);
    const water = Number(latest.water_level ?? 0);
    const fire = asNumber(latest.fire_status);
    const gas = asNumber(latest.gas_status);

    if (t < 18 || t > 35) a.push({ type: 'warn', msg: `Temperature out of comfort range: ${t}°C.` });
    if (h < 30 || h > 85) a.push({ type: 'warn', msg: `Humidity out of range: ${h}%.` });
    if (food < 30) a.push({ type: 'warn', msg: `Low food level: ${food}.` });
    if (water < 30) a.push({ type: 'warn', msg: `Low water level: ${water}.` });
    if (fire) a.push({ type: 'danger', msg: `🔥 Fire detected! Check immediately.` });
    if (gas) a.push({ type: 'danger', msg: `🛑 Gas detected! Ventilate and inspect.` });

    return a;
  }, [latest]);

  // Charts: only for numeric continuous sensors
  const labels = useMemo(() => rows.map((r) => new Date(r.time).toLocaleTimeString()), [rows]);

  const lineData = (label: string, key: keyof SensorRow, color: string) => ({
    labels,
    datasets: [
      {
        label,
        data: rows.map((r) => Number(r[key] ?? 0)),
        borderColor: color,
        backgroundColor: `${color}4D`, // add alpha
        tension: 0.3,
        fill: true,
        pointRadius: 0
      }
    ]
  });

  const statusPill = (name: string, value: number | string) => {
    const v = asNumber(value);
    const on = v === 1;
    return (
      <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${on
          ? 'bg-green-50 text-green-700 border-green-200'
          : 'bg-amber-50 text-amber-700 border-amber-200'
        }`}>
        {name}: {on ? 'ON' : 'OFF'}
      </div>
    );
  };

  const logout = () => {
    sessionStorage.clear();
    localStorage.removeItem('remember_email');
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200">
        {/* Header / Toolbar */}
        <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-amber-900">🐔 Golden Hen Dashboard</h1>
              <p className="text-amber-800/90">
                Real‑time monitoring & AI disease detection
                {lastUpdated && (
                  <span className="ml-2 text-sm text-amber-700">• Last updated: {formatTS(lastUpdated)}</span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.location.reload()}
                className="rounded-full bg-white/80 border border-amber-300 text-amber-900 px-4 py-2 font-medium hover:bg-white"
              >
                Refresh
              </button>
              <button
                onClick={logout}
                className="rounded-full bg-red-600 text-white px-5 py-2 font-semibold shadow hover:bg-red-700 transition-transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        {alerts.length > 0 && (
          <div className="max-w-7xl mx-auto px-6">
            <div className="rounded-2xl overflow-hidden border border-amber-200 shadow">
              {alerts.map((a, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 text-sm ${a.type === 'danger'
                    ? 'bg-red-50 text-red-700 border-b border-red-100'
                    : 'bg-amber-50 text-amber-900 border-b border-amber-100'
                    }`}
                >
                  {a.msg}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <section className="max-w-7xl mx-auto px-6 mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard title="Temperature" value={`${kpis.temp || '—'}°C`} sub="Target: 20–32°C" emoji="🌡️" />
            <KpiCard title="Humidity" value={`${kpis.hum || '—'}%`} sub="Target: 40–70%" emoji="💧" />
            <KpiCard title="Food Level" value={`${kpis.food || '—'}`} sub="Refill if &lt; 30" emoji="🍽️" />
            <KpiCard title="Water Level" value={`${kpis.water || '—'}`} sub="Refill if &lt; 30" emoji="🚰" />
          </div>
        </section>

        {/* Status row */}
        <section className="max-w-7xl mx-auto px-6 mt-4">
          <div className="flex flex-wrap gap-3">
            {statusPill('Pump', latest?.water_pump_status ?? 0)}
            {statusPill('Fan', latest?.fan_status ?? 0)}
            {statusPill('Feeding Time', latest?.food_time_status ?? 0)}
            <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${asNumber(latest?.fire_status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              Fire: {asNumber(latest?.fire_status) ? 'DETECTED' : 'OK'}
            </div>
            <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${asNumber(latest?.gas_status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
              Gas: {asNumber(latest?.gas_status) ? 'DETECTED' : 'OK'}
            </div>
          </div>
        </section>

        {/* Camera + Disease prediction + Upload */}
        <section className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <CameraBox defaultDeviceId="espcam-F7C630" />

          {/* Disease card */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-6">
            <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-amber-900 mb-1">🧠 Latest Disease Prediction</h2>
                <div className="text-4xl font-extrabold tracking-wide text-amber-900">
                  {lastPred ? lastPred.label : '—'}
                </div>
                <div className="mt-2 text-sm text-amber-800">
                  {lastPred ? (
                    <>
                      Confidence:{' '}
                      <span className="font-semibold">
                        {lastPred?.probs?.length ? `${(Math.max(...lastPred.probs) * 100).toFixed(1)}%` : '—'}
                      </span>
                      {lastPred?.at && (
                        <>
                          <span className="mx-2">•</span>Updated:{' '}
                          <span className="font-medium">{formatTS(lastPred.at)}</span>
                        </>
                      )}
                    </>
                  ) : (
                    'Waiting for ESP32‑CAM or upload…'
                  )}
                </div>
              </div>
              <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                {lastPred ? `Index: ${lastPred.index}` : 'No data'}
              </div>
            </div>

            {/* Upload */}
            <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
              <h2 className="text-xl font-semibold text-amber-900 mb-4">Upload Image for Prediction</h2>
              <input
                type="file"
                accept="image/*"
                onChange={onSelectFile}
                className="block w-full text-sm text-amber-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100"
              />
              {previewUrl && (
                <div className="mt-4">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-full max-h-64 object-contain border border-amber-200 rounded-md"
                  />
                </div>
              )}
              <button
                onClick={onPredict}
                disabled={isPredicting || !file}
                className="mt-4 w-full py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPredicting ? 'Predicting…' : 'Predict Disease'}
              </button>
              {predictError && <p className="mt-3 text-sm text-red-600">{predictError}</p>}
            </div>
          </div>
        </section>

        {/* Toggles */}
        <section className="max-w-7xl mx-auto px-6 mt-6 mb-2">
          <div className="flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showCharts}
                onChange={(e) => setShowCharts(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
              />
              <span className="text-amber-900">Show Charts</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                checked={showTable}
                onChange={(e) => setShowTable(e.target.checked)}
                className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
              />
              <span className="text-amber-900">Show Raw Table</span>
            </label>
          </div>
        </section>

        {/* Charts (only if toggled) */}
        {showCharts && (
          <section className="max-w-7xl mx-auto px-6 mt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ChartCard title="Temperature (°C)">
                <Line
                  data={lineData('Temperature', 'temperature', 'rgba(244,63,94,1)')} // rose-500
                  options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }}
                />
              </ChartCard>
              <ChartCard title="Humidity (%)">
                <Line
                  data={lineData('Humidity', 'humidity', 'rgba(59,130,246,1)')} // blue-500
                  options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }}
                />
              </ChartCard>
            </div>
          </section>
        )}

        {/* Table (only if toggled) */}
        {showTable && (
          <section className="max-w-7xl mx-auto px-6 my-8">
            <div className="overflow-auto shadow-lg rounded-2xl bg-white border border-amber-200">
              <table className="table-auto w-full text-sm text-left">
                <thead className="bg-amber-500 text-white">
                  <tr>
                    <th className="p-2">Time</th>
                    <th className="p-2">Temp (°C)</th>
                    <th className="p-2">Humidity (%)</th>
                    <th className="p-2">Food</th>
                    <th className="p-2">Water</th>
                    <th className="p-2">Pump</th>
                    <th className="p-2">Fan</th>
                    <th className="p-2">Fire</th>
                    <th className="p-2">Gas</th>
                    <th className="p-2">Feeding & Water Time</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t hover:bg-amber-50">
                      <td className="p-2">{new Date(r.time).toLocaleString()}</td>
                      <td className="p-2">{r.temperature}</td>
                      <td className="p-2">{r.humidity}</td>
                      <td className="p-2">{r.food_level}</td>
                      <td className="p-2">{r.water_level}</td>
                      <td className="p-2">{asNumber(r.water_pump_status) ? 'ON' : 'OFF'}</td>
                      <td className="p-2">{asNumber(r.fan_status) ? 'ON' : 'OFF'}</td>
                      <td className="p-2">{asNumber(r.fire_status) ? 'DETECTED' : 'OK'}</td>
                      <td className="p-2">{asNumber(r.gas_status) ? 'DETECTED' : 'OK'}</td>
                      <td className="p-2">{asNumber(r.food_time_status) ? 'YES' : 'NO'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer spacing */}
        <div className="h-8" />
      </div>
    </>
  );
}

/* -------------------- Small UI subcomponents -------------------- */

const KpiCard: React.FC<{ title: string; value: string; sub?: string; emoji?: string }> = ({ title, value, sub, emoji }) => (
  <div className="rounded-2xl bg-white/85 backdrop-blur border border-amber-200 shadow p-5">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm text-amber-700">{title}</div>
        <div className="text-3xl font-extrabold text-amber-900">{value}</div>
        {sub && <div className="text-xs text-amber-700/80 mt-1">{sub}</div>}
      </div>
      <div className="text-3xl">{emoji}</div>
    </div>
  </div>
);

const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
    <h3 className="text-lg font-semibold mb-2 text-amber-900">{title}</h3>
    {children}
  </div>
);

export default SensorDataPage;










































// 'use client';

// import React, { useEffect, useMemo, useRef, useState } from 'react';
// import axios from 'axios';
// import Navbar from '../components/Navbar';
// import { useNavigate } from 'react-router-dom';

// import { Line } from 'react-chartjs-2';
// import {
//   Chart as ChartJS,
//   LineElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

// // ====== API base (edit if your backend host/port differs) ======
// const BASE_URL = 'http://192.168.152.105:8000';

// type SensorRow = {
//   time: string;
//   temperature: number;
//   humidity: number;
//   food_level: number;
//   water_level: number;
//   water_pump_status: number | string;
//   fan_status: number | string;
//   fire_status: number | string;
//   gas_status: number | string;
//   food_time_status: number | string;

//   // NEW (already in your DB/backend responses):
//   feeding_food_status?: number | string;   // 1 = feeding now, 0 = idle
//   feeding_water_status?: number | string;  // 1 = watering now, 0 = idle
//   next_food_eta_ms?: number | string;      // ms until next feeding (server view)
//   next_water_eta_ms?: number | string;     // ms until next watering (server view)
//   gas_ppm?: number | string;               // optional, if your backend fills it
// };

// type PredictLast = {
//   label: string;
//   index: number;
//   probs: number[];
//   at?: string; // present for /predict/last; absent for /predict/image
// } | null;

// /* ======================= Utility helpers ======================= */

// const asNumber = (v: any): number => {
//   if (typeof v === 'number') return v;
//   if (typeof v === 'string') {
//     const m = v.trim().toLowerCase();
//     if (m === 'on' || m === 'true') return 1;
//     if (m === 'off' || m === 'false') return 0;
//     const n = Number(m);
//     return isNaN(n) ? 0 : n;
//   }
//   return 0;
// };

// const asMs = (v: any): number => {
//   const n = asNumber(v);
//   return n < 0 ? 0 : n;
// };

// const formatTS = (t?: string) => {
//   if (!t) return '—';
//   try {
//     return new Date(t).toLocaleString();
//   } catch {
//     return t;
//   }
// };

// const fmtHMS = (ms: number) => {
//   const s = Math.max(0, Math.floor(ms / 1000));
//   const hh = Math.floor(s / 3600);
//   const mm = Math.floor((s % 3600) / 60);
//   const ss = s % 60;
//   const pad = (x: number) => String(x).padStart(2, '0');
//   return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`;
// };

// /* =========================== CameraBox =========================== */
// function CameraBox({ defaultDeviceId = 'espcam-F7C630' }: { defaultDeviceId?: string }) {
//   const [deviceId, setDeviceId] = useState<string>(defaultDeviceId);
//   const [imgSrc, setImgSrc] = useState<string>('');

//   useEffect(() => {
//     let mounted = true;
//     const makeUrl = () =>
//       deviceId.trim()
//         ? `${BASE_URL}/predict/frame.jpg?device_id=${encodeURIComponent(deviceId.trim())}&t=${Date.now()}`
//         : `${BASE_URL}/predict/last_frame.jpg?t=${Date.now()}`;

//     const tick = () => {
//       if (!mounted) return;
//       setImgSrc(makeUrl());
//     };

//     tick();
//     const id = setInterval(tick, 1000);
//     return () => {
//       mounted = false;
//       clearInterval(id);
//     };
//   }, [deviceId]);

//   return (
//     <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
//       <div className="flex items-center justify-between mb-3 gap-3">
//         <h2 className="text-xl font-semibold text-amber-900">📷 Live Camera</h2>
//         <div className="flex items-center gap-2">
//           <label className="text-sm text-amber-800">Device ID:</label>
//           <input
//             type="text"
//             value={deviceId}
//             onChange={(e) => setDeviceId(e.target.value)}
//             placeholder="esp32cam-1"
//             className="w-44 rounded-md border border-amber-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
//           />
//         </div>
//       </div>

//       <div className="relative w-full h-64 bg-amber-50 rounded-lg overflow-hidden border border-amber-200">
//         {imgSrc ? (
//           <img
//             src={imgSrc}
//             alt="ESP32-CAM live"
//             className="w-full h-full object-contain"
//             onError={() => console.log('Camera image failed to load:', imgSrc)}
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center text-amber-400">
//             Waiting for frames…
//           </div>
//         )}
//       </div>

//       <p className="mt-2 text-xs text-amber-700">
//         Auto‑refreshes every 1s. Ensure ESP32‑CAM is POSTing frames to <code>/predict/bytes</code>.
//       </p>
//     </div>
//   );
// }

// /* ============================== Dashboard ============================== */

// function SensorDataPage() {
//   const navigate = useNavigate();

//   // Data state
//   const [rows, setRows] = useState<SensorRow[]>([]);
//   const [lastPred, setLastPred] = useState<PredictLast>(null);
//   const [lastUpdated, setLastUpdated] = useState<string>('');

//   // Upload state
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isPredicting, setIsPredicting] = useState(false);
//   const [predictError, setPredictError] = useState<string | null>(null);

//   // UI toggles
//   const [showCharts, setShowCharts] = useState<boolean>(true);
//   const [showTable, setShowTable] = useState<boolean>(false);

//   // Live countdown ticker (1s)
//   const [now, setNow] = useState<number>(Date.now());
//   useEffect(() => {
//     const id = setInterval(() => setNow(Date.now()), 1000);
//     return () => clearInterval(id);
//   }, []);

//   // Load sensor table on mount and then poll
//   const lastFetchAtRef = useRef<number>(Date.now());
//   useEffect(() => {
//     let mounted = true;

//     const fetchData = async () => {
//       try {
//         const res = await axios.get<SensorRow[]>(`${BASE_URL}/data/read/1`, {
//           headers: { 'Cache-Control': 'no-cache' }
//         });
//         if (!mounted) return;
//         const data = (res.data || []).reverse(); // chronological
//         setRows(data);
//         const ts = Date.now();
//         lastFetchAtRef.current = ts;
//         setLastUpdated(new Date(ts).toISOString());
//       } catch (err) {
//         console.error('Error fetching data:', err);
//       }
//     };

//     fetchData();
//     const id = setInterval(fetchData, 4000); // refresh every 4s
//     return () => {
//       mounted = false;
//       clearInterval(id);
//     };
//   }, []);

//   // Poll latest disease prediction every 2 seconds
//   useEffect(() => {
//     let mounted = true;
//     const tick = async () => {
//       try {
//         const { data } = await axios.get<PredictLast>(`${BASE_URL}/predict/last`, {
//           headers: { 'Cache-Control': 'no-cache' }
//         });
//         if (mounted && data) setLastPred(data);
//       } catch {
//         /* ignore */
//       }
//     };
//     tick();
//     const id = setInterval(tick, 2000);
//     return () => {
//       mounted = false;
//       clearInterval(id);
//     };
//   }, []);

//   // ----- Upload handlers -----
//   const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const f = e.target.files?.[0] ?? null;
//     setFile(f);
//     setPredictError(null);
//     if (f) setPreviewUrl(URL.createObjectURL(f));
//     else setPreviewUrl(null);
//   };

//   const onPredict = async () => {
//     if (!file) {
//       setPredictError('Please choose an image first.');
//       return;
//     }
//     setIsPredicting(true);
//     setPredictError(null);
//     try {
//       const form = new FormData();
//       form.append('file', file);
//       const { data } = await axios.post<PredictLast>(`${BASE_URL}/predict/image`, form, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });
//       setLastPred(data);
//     } catch (err: any) {
//       const detail = err?.response?.data?.detail ?? 'Prediction failed';
//       setPredictError(typeof detail === 'string' ? detail : 'Prediction failed');
//     } finally {
//       setIsPredicting(false);
//     }
//   };

//   // Latest row (most recent)
//   const latest = rows.length ? rows[rows.length - 1] : undefined;

//   // KPIs
//   const kpis = useMemo(() => {
//     const temp = latest ? Number(latest.temperature ?? 0) : 0;
//     const hum = latest ? Number(latest.humidity ?? 0) : 0;
//     const food = latest ? Number(latest.food_level ?? 0) : 0;
//     const water = latest ? Number(latest.water_level ?? 0) : 0;
//     return { temp, hum, food, water };
//   }, [latest]);

//   // Alerts (simple thresholds — tweak as needed)
//   const alerts = useMemo(() => {
//     if (!latest) return [];
//     const a: { type: 'danger' | 'warn'; msg: string }[] = [];
//     const t = Number(latest.temperature ?? 0);
//     const h = Number(latest.humidity ?? 0);
//     const food = Number(latest.food_level ?? 0);
//     const water = Number(latest.water_level ?? 0);
//     const fire = asNumber(latest.fire_status);
//     const gas = asNumber(latest.gas_status);

//     if (t < 18 || t > 35) a.push({ type: 'warn', msg: `Temperature out of comfort range: ${t}°C.` });
//     if (h < 30 || h > 85) a.push({ type: 'warn', msg: `Humidity out of range: ${h}%.` });
//     if (food < 30) a.push({ type: 'warn', msg: `Low food level: ${food}.` });
//     if (water < 30) a.push({ type: 'warn', msg: `Low water level: ${water}.` });
//     if (fire) a.push({ type: 'danger', msg: `🔥 Fire detected! Check immediately.` });
//     if (gas) a.push({ type: 'danger', msg: `🛑 Gas detected! Ventilate and inspect.` });

//     return a;
//   }, [latest]);

//   // Charts
//   const labels = useMemo(() => rows.map((r) => new Date(r.time).toLocaleTimeString()), [rows]);
//   const lineData = (label: string, key: keyof SensorRow, color: string) => ({
//     labels,
//     datasets: [
//       {
//         label,
//         data: rows.map((r) => Number(r[key] ?? 0)),
//         borderColor: color,
//         backgroundColor: `${color}4D`,
//         tension: 0.3,
//         fill: true,
//         pointRadius: 0
//       }
//     ]
//   });

//   // Status pills
//   const statusPill = (name: string, value: number | string, onLabel = 'ON', offLabel = 'OFF') => {
//     const v = asNumber(value);
//     const on = v === 1;
//     return (
//       <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${on
//           ? 'bg-green-50 text-green-700 border-green-200'
//           : 'bg-amber-50 text-amber-700 border-amber-200'
//         }`}>
//         {name}: {on ? onLabel : offLabel}
//       </div>
//     );
//   };

//   // ---------- Feeding / Watering countdowns ----------
//   // Compute remaining ms using server-provided ETA minus time passed since last fetch
//   const elapsedSinceFetch = now - (lastFetchAtRef.current || now);
//   const foodEtaRaw = asMs(latest?.next_food_eta_ms ?? 0);
//   const waterEtaRaw = asMs(latest?.next_water_eta_ms ?? 0);
//   const foodRemaining = Math.max(0, foodEtaRaw - elapsedSinceFetch);
//   const waterRemaining = Math.max(0, waterEtaRaw - elapsedSinceFetch);
//   const foodNextAt = new Date(Date.now() + foodRemaining);
//   const waterNextAt = new Date(Date.now() + waterRemaining);

//   const feedingNow = asNumber(latest?.feeding_food_status) === 1;
//   const wateringNow = asNumber(latest?.feeding_water_status) === 1;

//   const logout = () => {
//     sessionStorage.clear();
//     localStorage.removeItem('remember_email');
//     navigate('/login');
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200">
//         {/* Header / Toolbar */}
//         <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
//           <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//             <div>
//               <h1 className="text-3xl font-extrabold text-amber-900">🐔 Golden Hen Dashboard</h1>
//               <p className="text-amber-800/90">
//                 Real‑time monitoring & AI disease detection
//                 {lastUpdated && (
//                   <span className="ml-2 text-sm text-amber-700">• Last updated: {formatTS(lastUpdated)}</span>
//                 )}
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <button
//                 onClick={() => window.location.reload()}
//                 className="rounded-full bg-white/80 border border-amber-300 text-amber-900 px-4 py-2 font-medium hover:bg-white"
//               >
//                 Refresh
//               </button>
//               <button
//                 onClick={logout}
//                 className="rounded-full bg-red-600 text-white px-5 py-2 font-semibold shadow hover:bg-red-700 transition-transform hover:scale-105"
//               >
//                 Logout
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Alerts */}
//         {alerts.length > 0 && (
//           <div className="max-w-7xl mx-auto px-6">
//             <div className="rounded-2xl overflow-hidden border border-amber-200 shadow">
//               {alerts.map((a, i) => (
//                 <div
//                   key={i}
//                   className={`px-4 py-3 text-sm ${a.type === 'danger'
//                     ? 'bg-red-50 text-red-700 border-b border-red-100'
//                     : 'bg-amber-50 text-amber-900 border-b border-amber-100'
//                     }`}
//                 >
//                   {a.msg}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* KPI Cards */}
//         <section className="max-w-7xl mx-auto px-6 mt-6">
//           <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//             <KpiCard title="Temperature" value={`${kpis.temp || '—'}°C`} sub="Target: 20–32°C" emoji="🌡️" />
//             <KpiCard title="Humidity" value={`${kpis.hum || '—'}%`} sub="Target: 40–70%" emoji="💧" />
//             <KpiCard title="Food Level" value={`${kpis.food || '—'}`} sub="Refill if < 30" emoji="🍽️" />
//             <KpiCard title="Water Level" value={`${kpis.water || '—'}`} sub="Refill if < 30" emoji="🚰" />
//           </div>
//         </section>

//         {/* Status row */}
//         <section className="max-w-7xl mx-auto px-6 mt-4">
//           <div className="flex flex-wrap gap-3">
//             {statusPill('Pump', latest?.water_pump_status ?? 0)}
//             {statusPill('Fan', latest?.fan_status ?? 0)}
//             {statusPill('Feeding Time', latest?.food_time_status ?? 0, 'YES', 'NO')}
//             <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${asNumber(latest?.fire_status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
//               Fire: {asNumber(latest?.fire_status) ? 'DETECTED' : 'OK'}
//             </div>
//             <div className={`px-3 py-2 rounded-full text-sm font-medium border shadow-sm ${asNumber(latest?.gas_status) ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
//               Gas: {asNumber(latest?.gas_status) ? 'DETECTED' : 'OK'}
//             </div>
//           </div>
//         </section>

//         {/* Camera + Disease prediction + Upload */}
//         <section className="max-w-7xl mx-auto px-6 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <CameraBox defaultDeviceId="espcam-F7C630" />

//           {/* Disease + Feeding/Watering cards */}
//           <div className="lg:col-span-2 grid grid-cols-1 gap-6">
//             {/* Disease card */}
//             <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60 flex items-center justify-between">
//               <div>
//                 <h2 className="text-xl font-semibold text-amber-900 mb-1">🧠 Latest Disease Prediction</h2>
//                 <div className="text-4xl font-extrabold tracking-wide text-amber-900">
//                   {lastPred ? lastPred.label : '—'}
//                 </div>
//                 <div className="mt-2 text-sm text-amber-800">
//                   {lastPred ? (
//                     <>
//                       Confidence:{' '}
//                       <span className="font-semibold">
//                         {lastPred?.probs?.length ? `${(Math.max(...lastPred.probs) * 100).toFixed(1)}%` : '—'}
//                       </span>
//                       {lastPred?.at && (
//                         <>
//                           <span className="mx-2">•</span>Updated:{' '}
//                           <span className="font-medium">{formatTS(lastPred.at)}</span>
//                         </>
//                       )}
//                     </>
//                   ) : (
//                     'Waiting for ESP32‑CAM or upload…'
//                   )}
//                 </div>
//               </div>
//               <div className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
//                 {lastPred ? `Index: ${lastPred.index}` : 'No data'}
//               </div>
//             </div>

//             {/* NEW: Feeding & Watering schedule card */}
//             <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
//               <h2 className="text-xl font-semibold text-amber-900 mb-4">⏱️ Feeding & Watering Schedule</h2>
//               <div className="grid gap-4 md:grid-cols-2">
//                 <ScheduleTile
//                   title="Feeding"
//                   nowActive={feedingNow}
//                   remainingMs={foodRemaining}
//                   nextAt={foodNextAt}
//                   levelLabel={`Food level: ${kpis.food || '—'}`}
//                   activeLabel="Feeding now"
//                   idlePrefix="Next feeding in"
//                 />
//                 <ScheduleTile
//                   title="Watering"
//                   nowActive={wateringNow}
//                   remainingMs={waterRemaining}
//                   nextAt={waterNextAt}
//                   levelLabel={`Water level: ${kpis.water || '—'}`}
//                   activeLabel="Watering now"
//                   idlePrefix="Next watering in"
//                 />
//               </div>
//               <p className="mt-3 text-xs text-amber-700">
//                 Countdown is live; times are estimated from the latest sensor row.
//               </p>
//             </div>

//             {/* Upload */}
//             <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
//               <h2 className="text-xl font-semibold text-amber-900 mb-4">Upload Image for Prediction</h2>
//               <input
//                 type="file"
//                 accept="image/*"
//                 onChange={onSelectFile}
//                 className="block w-full text-sm text-amber-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-800 hover:file:bg-amber-100"
//               />
//               {previewUrl && (
//                 <div className="mt-4">
//                   <img
//                     src={previewUrl}
//                     alt="preview"
//                     className="w-full max-h-64 object-contain border border-amber-200 rounded-md"
//                   />
//                 </div>
//               )}
//               <button
//                 onClick={onPredict}
//                 disabled={isPredicting || !file}
//                 className="mt-4 w-full py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow hover:from-orange-500 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isPredicting ? 'Predicting…' : 'Predict Disease'}
//               </button>
//               {predictError && <p className="mt-3 text-sm text-red-600">{predictError}</p>}
//             </div>
//           </div>
//         </section>

//         {/* Toggles */}
//         <section className="max-w-7xl mx-auto px-6 mt-6 mb-2">
//           <div className="flex flex-wrap items-center gap-3">
//             <label className="inline-flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={showCharts}
//                 onChange={(e) => setShowCharts(e.target.checked)}
//                 className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
//               />
//               <span className="text-amber-900">Show Charts</span>
//             </label>
//             <label className="inline-flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={showTable}
//                 onChange={(e) => setShowTable(e.target.checked)}
//                 className="rounded border-amber-300 text-amber-600 focus:ring-amber-400"
//               />
//               <span className="text-amber-900">Show Raw Table</span>
//             </label>
//           </div>
//         </section>

//         {/* Charts (only if toggled) */}
//         {showCharts && (
//           <section className="max-w-7xl mx-auto px-6 mt-2">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <ChartCard title="Temperature (°C)">
//                 <Line
//                   data={lineData('Temperature', 'temperature', 'rgba(244,63,94,1)')}
//                   options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }}
//                 />
//               </ChartCard>
//               <ChartCard title="Humidity (%)">
//                 <Line
//                   data={lineData('Humidity', 'humidity', 'rgba(59,130,246,1)')}
//                   options={{ responsive: true, plugins: { legend: { display: false } }, scales: { x: { ticks: { maxRotation: 90, minRotation: 45 } } } }}
//                 />
//               </ChartCard>
//             </div>
//           </section>
//         )}

//         {/* Table (only if toggled) */}
//         {showTable && (
//           <section className="max-w-7xl mx-auto px-6 my-8">
//             <div className="overflow-auto shadow-lg rounded-2xl bg-white border border-amber-200">
//               <table className="table-auto w-full text-sm text-left">
//                 <thead className="bg-amber-500 text-white">
//                   <tr>
//                     <th className="p-2">Time</th>
//                     <th className="p-2">Temp (°C)</th>
//                     <th className="p-2">Humidity (%)</th>
//                     <th className="p-2">Food</th>
//                     <th className="p-2">Water</th>
//                     <th className="p-2">Pump</th>
//                     <th className="p-2">Fan</th>
//                     <th className="p-2">Fire</th>
//                     <th className="p-2">Gas</th>
//                     <th className="p-2">Feeding-Time</th>
//                     {/* NEW columns (raw view) */}
//                     <th className="p-2">Feeding Now</th>
//                     <th className="p-2">Watering Now</th>
//                     <th className="p-2">Next Feed ETA (ms)</th>
//                     <th className="p-2">Next Water ETA (ms)</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {rows.map((r, i) => (
//                     <tr key={i} className="border-t hover:bg-amber-50">
//                       <td className="p-2">{new Date(r.time).toLocaleString()}</td>
//                       <td className="p-2">{r.temperature}</td>
//                       <td className="p-2">{r.humidity}</td>
//                       <td className="p-2">{r.food_level}</td>
//                       <td className="p-2">{r.water_level}</td>
//                       <td className="p-2">{asNumber(r.water_pump_status) ? 'ON' : 'OFF'}</td>
//                       <td className="p-2">{asNumber(r.fan_status) ? 'ON' : 'OFF'}</td>
//                       <td className="p-2">{asNumber(r.fire_status) ? 'DETECTED' : 'OK'}</td>
//                       <td className="p-2">{asNumber(r.gas_status) ? 'DETECTED' : 'OK'}</td>
//                       <td className="p-2">{asNumber(r.food_time_status) ? 'YES' : 'NO'}</td>
//                       <td className="p-2">{asNumber(r.feeding_food_status) ? 'YES' : 'NO'}</td>
//                       <td className="p-2">{asNumber(r.feeding_water_status) ? 'YES' : 'NO'}</td>
//                       <td className="p-2">{asMs(r.next_food_eta_ms)}</td>
//                       <td className="p-2">{asMs(r.next_water_eta_ms)}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>
//         )}

//         {/* Footer spacing */}
//         <div className="h-8" />
//       </div>
//     </>
//   );
// }

// /* -------------------- Small UI subcomponents -------------------- */

// const KpiCard: React.FC<{ title: string; value: string; sub?: string; emoji?: string }> = ({ title, value, sub, emoji }) => (
//   <div className="rounded-2xl bg-white/85 backdrop-blur border border-amber-200 shadow p-5">
//     <div className="flex items-center justify-between">
//       <div>
//         <div className="text-sm text-amber-700">{title}</div>
//         <div className="text-3xl font-extrabold text-amber-900">{value}</div>
//         {sub && <div className="text-xs text-amber-700/80 mt-1">{sub}</div>}
//       </div>
//       <div className="text-3xl">{emoji}</div>
//     </div>
//   </div>
// );

// const ChartCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
//   <div className="bg-white p-5 rounded-2xl shadow-md border border-amber-200/60">
//     <h3 className="text-lg font-semibold mb-2 text-amber-900">{title}</h3>
//     {children}
//   </div>
// );

// /** NEW: Compact tile for feeding/watering with live countdown */
// const ScheduleTile: React.FC<{
//   title: 'Feeding' | 'Watering';
//   nowActive: boolean;
//   remainingMs: number;
//   nextAt: Date;
//   levelLabel: string;
//   activeLabel: string;
//   idlePrefix: string;
// }> = ({ title, nowActive, remainingMs, nextAt, levelLabel, activeLabel, idlePrefix }) => {
//   const pillBase = 'inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border';
//   const pillStyle = nowActive
//     ? 'bg-green-50 text-green-700 border-green-200'
//     : 'bg-amber-50 text-amber-700 border-amber-200';

//   return (
//     <div className="rounded-xl border border-amber-200 p-4 flex flex-col gap-2">
//       <div className="flex items-center justify-between">
//         <h3 className="text-lg font-semibold text-amber-900">{title}</h3>
//         <span className={`${pillBase} ${pillStyle}`}>
//           {nowActive ? activeLabel : 'Idle'}
//         </span>
//       </div>

//       <div className="text-amber-800 text-sm">{levelLabel}</div>

//       {nowActive ? (
//         <div className="text-sm text-green-700">
//           • Running… next cycle will update when this finishes.
//         </div>
//       ) : (
//         <div className="text-sm text-amber-800">
//           • {idlePrefix}{' '}
//           <span className="font-semibold">{fmtHMS(remainingMs)}</span>{' '}
//           (<span className="font-medium">{nextAt.toLocaleTimeString()}</span>)
//         </div>
//       )}
//     </div>
//   );
// };

// export default SensorDataPage;






























