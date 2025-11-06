// import Navbar from '../components/Navbar';

// function Contact() {
//   return (
//     <>
//       <Navbar />
//       <div style={{ padding: '20px' }}>
//         <h1>Welcome to the Contact Page</h1>
//         <p>Contact INFO.</p>
//       </div>
//     </>
//   );
// }

// export default Contact;



import React from 'react';
import Navbar from '../components/Navbar';

const Contact: React.FC = () => {
  return (
    <>
      <Navbar />

      {/* Background */}
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-amber-200">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-yellow-300" />
          <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full blur-3xl opacity-40 bg-orange-300" />

          <div className="max-w-6xl mx-auto px-6 pt-16 pb-10 text-center">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-900">
              📬 Contact <span className="text-red-600">Golden Hen</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-amber-800/90">
              Questions, feedback, or collaboration? We’d love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Cards */}
        <section className="max-w-6xl mx-auto px-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              title="General Inquiries"
              desc="Reach out for any questions about the project, features, or demo."
              badge="Golden Hen"
              emoji="🐔"
            />
            <InfoCard
              title="Support"
              desc="Having trouble or found a bug? Let us know and we’ll fix it."
              badge="Help Desk"
              emoji="🛠️"
            />
            <InfoCard
              title="Collaboration"
              desc="Interested in research or integration? We’re open to ideas."
              badge="R&D"
              emoji="🤝"
            />
          </div>
        </section>

        {/* Team Emails */}
        <section className="max-w-6xl mx-auto px-6 py-10">
          <div className="rounded-2xl bg-white/85 backdrop-blur border border-amber-200 shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-amber-900">Our Team</h2>
            <p className="mt-2 text-amber-800">
              Contact the team directly via email. Click an address to open your mail app.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TeamCard
                name="Shahbaj Ahmed Sakib"
                role="Project Member"
                email="2001035@iot.bdu.ac.bd"
              />
              <TeamCard
                name="Mursalin Hossain MIsat"
                role="Project Member"
                email="2001049@iot.bdu.ac.bd"
              />
            </div>
          </div>
        </section>

        {/* Quick Message (non-functional UI; wire to backend if needed) */}
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="rounded-2xl bg-white/85 backdrop-blur border border-amber-200 shadow-lg p-6 sm:p-8">
            <h3 className="text-xl font-semibold text-amber-900">Send a Quick Message</h3>
            <p className="mt-1 text-sm text-amber-800">
              This is a front-end form. Hook it to your API to receive messages.
            </p>

            <form className="mt-6 grid gap-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-amber-900 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-amber-900 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  required
                />
              </div>
              <textarea
                placeholder="Your Message"
                rows={4}
                className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-amber-900 placeholder-amber-500/70 focus:outline-none focus:ring-2 focus:ring-amber-400"
                required
              />
              <button
                type="submit"
                onClick={(e) => e.preventDefault()}
                className="w-full sm:w-auto rounded-full bg-red-600 text-white px-6 py-3 font-semibold shadow hover:bg-red-700 transition-transform hover:scale-105"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

/* -------- Subcomponents -------- */

type InfoCardProps = {
  title: string;
  desc: string;
  badge: string;
  emoji?: string;
};
const InfoCard: React.FC<InfoCardProps> = ({ title, desc, badge, emoji }) => (
  <div className="rounded-2xl bg-white/80 backdrop-blur border border-amber-200 p-6 shadow hover:shadow-md transition">
    <div className="flex items-center gap-3">
      <span className="text-3xl">{emoji}</span>
      <h3 className="text-xl font-bold text-amber-900">{title}</h3>
    </div>
    <p className="mt-2 text-amber-800">{desc}</p>
    <span className="inline-block mt-4 text-xs rounded-full bg-amber-100 text-amber-900 border border-amber-300 px-2 py-1">
      {badge}
    </span>
  </div>
);

type TeamCardProps = {
  name: string;
  role: string;
  email: string;
};
const TeamCard: React.FC<TeamCardProps> = ({ name, role, email }) => (
  <div className="rounded-xl border border-amber-200 bg-white/80 p-5 shadow-sm hover:shadow transition">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h4 className="text-lg font-semibold text-amber-900">{name}</h4>
        <p className="text-sm text-amber-700">{role}</p>
      </div>
      <span className="text-2xl">📧</span>
    </div>
    <a
      href={`mailto:${email}`}
      className="mt-3 inline-block text-red-700 hover:text-red-800 font-medium underline underline-offset-4"
    >
      {email}
    </a>
  </div>
);

export default Contact;
