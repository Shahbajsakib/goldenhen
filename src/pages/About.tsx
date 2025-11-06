// import Navbar from '../components/Navbar';

// function About() {
//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <h1>Welcome to the About Page</h1>
//         <p>About INFO.</p>
//       </div>
//     </>
//   );
// }

// export default About;




import React from 'react';
import Navbar from '../components/Navbar';

const About: React.FC = () => {
  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-20 -right-24 h-72 w-72 rounded-full blur-3xl opacity-40 bg-yellow-300" />
          <div className="absolute -bottom-16 -left-24 h-72 w-72 rounded-full blur-3xl opacity-40 bg-orange-300" />

          <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-900 drop-shadow">
              🐔 About <span className="text-red-600">Golden Hen</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-amber-800/90">
              A smart poultry farm system that automates care, monitors health, and keeps your flock happy.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 shadow">
              <span className="text-sm font-medium text-amber-900">Capstone Project</span>
              <span className="text-xs rounded-full bg-red-600 text-white px-2 py-0.5">Golden Hen</span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="max-w-6xl mx-auto px-6 py-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard label="Real‑time Monitoring" value="24/7" emoji="⏱️" />
            <StatCard label="Sensors Integrated" value="Temp • Water • Feed" emoji="🛠️" />
            <StatCard label="Alerts & Logs" value="SMS/Email/App" emoji="📨" />
          </div>
        </section>

        {/* What we do */}
        <section className="max-w-6xl mx-auto px-6 py-8">
          <div className="rounded-2xl bg-white/80 backdrop-blur border border-amber-200 shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-amber-900">Our Mission</h2>
            <p className="mt-3 text-amber-800">
              Golden Hen reduces manual effort in poultry farming by automating feeding & watering, controlling
              temperature, and detecting diseases with AI—so you get healthier flocks and higher yields.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Feature
                icon="🍽️"
                title="Auto Feeding & Watering"
                desc="Precise scheduling and sensors to keep feed & water optimal."
              />
              <Feature
                icon="🌡️"
                title="Smart Climate Control"
                desc="Fans & heat lamps automatically balance coop temperature."
              />
              <Feature
                icon="🧠"
                title="AI Disease Detection"
                desc="ESP32‑CAM + ML models to flag early signs of illness."
              />
              <Feature
                icon="📊"
                title="Live Dashboard"
                desc="See stats, history, and alerts in one simple interface."
              />
              <Feature
                icon="🔔"
                title="Real‑time Alerts"
                desc="Get notified instantly when anything needs your attention."
              />
              <Feature
                icon="⚙️"
                title="Easy Integration"
                desc="Works with Arduino/ESP32; flexible for your setup."
              />
            </div>
          </div>
        </section>

        {/* Roadmap / Timeline */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <h3 className="text-xl font-bold text-amber-900 mb-4">Project Roadmap</h3>
          <ol className="relative border-l-2 border-amber-300 pl-6 space-y-6">
            <TimelineItem
              title="Hardware Setup"
              tag="Done"
              desc="ESP32, sensors (ultrasonic, water level, DHT), fan, pump, heat lamp wired & tested."
            />
            <TimelineItem
              title="Backend & Control"
              tag="In Progress"
              desc="Microcontroller logic, thresholds, and actuator control tuning."
            />
            <TimelineItem
              title="AI & Dashboard"
              tag="Next"
              desc="Train disease detection model, build web dashboard & alert system."
            />
          </ol>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#get-started"
              className="rounded-full bg-red-600 text-white px-6 py-3 font-semibold shadow hover:bg-red-700 transition-transform hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="#docs"
              className="rounded-full bg-white/80 text-amber-900 px-6 py-3 font-semibold border border-amber-300 shadow hover:bg-white"
            >
              View Docs
            </a>
          </div>
        </section>
      </div>
    </>
  );
};

/* --------- Small UI subcomponents (TSX) ---------- */

type StatProps = { label: string; value: string; emoji?: string };
const StatCard: React.FC<StatProps> = ({ label, value, emoji }) => (
  <div className="rounded-2xl bg-white/80 backdrop-blur border border-amber-200 p-5 shadow hover:shadow-md transition">
    <div className="text-3xl">{emoji}</div>
    <div className="mt-2 text-sm text-amber-700">{label}</div>
    <div className="text-xl font-bold text-amber-900">{value}</div>
  </div>
);

type FeatureProps = { icon: string; title: string; desc: string };
const Feature: React.FC<FeatureProps> = ({ icon, title, desc }) => (
  <div className="rounded-xl border border-amber-200 bg-white/80 p-4 shadow-sm hover:shadow transition">
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <h4 className="text-lg font-semibold text-amber-900">{title}</h4>
    </div>
    <p className="mt-2 text-sm text-amber-800">{desc}</p>
  </div>
);

type TimelineProps = { title: string; desc: string; tag: 'Done' | 'In Progress' | 'Next' };
const TimelineItem: React.FC<TimelineProps> = ({ title, desc, tag }) => {
  const tagStyles =
    tag === 'Done'
      ? 'bg-green-600'
      : tag === 'In Progress'
      ? 'bg-amber-600'
      : 'bg-blue-600';

  return (
    <li className="relative">
      <span className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-amber-400 border-2 border-white shadow" />
      <div className="rounded-xl bg-white/80 border border-amber-200 p-4 shadow">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-semibold text-amber-900">{title}</h4>
          <span className={`text-xs text-white px-2 py-1 rounded-full ${tagStyles}`}>{tag}</span>
        </div>
        <p className="mt-1 text-sm text-amber-800">{desc}</p>
      </div>
    </li>
  );
};

export default About;
