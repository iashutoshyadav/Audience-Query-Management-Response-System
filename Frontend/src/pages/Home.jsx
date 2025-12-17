import React from "react";

export default function Home({ onLoginClick, onSignupClick }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <header className="w-full px-8 py-4 flex justify-between items-center bg-white shadow-sm sticky top-0 z-50">
        <h1 className="flex items-center gap-2 font-bold">
  <span className="text-3xl text-gray-800">
    Querio
  </span>
</h1>


        <div className="flex items-center gap-4">
          <button
            onClick={onLoginClick}
            className="text-gray-600 hover:text-gray-900 transition"
          >
            Login
          </button>
          <button
            onClick={onSignupClick}
            className="px-5 py-2 bg-teal-600 text-white rounded-lg shadow hover:bg-teal-700 transition"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 py-10 bg-gradient-to-b from-white via-[#f0fdfa] to-[#f8fafc]">
        <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Turn customer chaos <br /> into clarity.
        </h2>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mb-8">
          Centralize emails, WhatsApp, social messages, and support chats —
          all in one powerful AI-driven dashboard.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <button
            onClick={onSignupClick}
            className="px-8 py-3 bg-teal-600 text-white rounded-xl text-lg font-medium shadow-lg hover:bg-teal-700 transition"
          >
            Get Started Free
          </button>
          <button
            onClick={onLoginClick}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl text-lg hover:bg-gray-100 transition"
          >
            Live Demo
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          No credit card required • Setup in 5 minutes
        </p>
      </section>

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <h3 className="text-3xl font-bold text-center text-gray-900 mb-14">
          How It Works
        </h3>

        <div className="grid md:grid-cols-4 gap-6 text-center">
          {[
            {
              title: "Connect Channels",
              desc: "Email, WhatsApp, social & chat connect instantly."
            },
            {
              title: "Unified Inbox",
              desc: "View all conversations in one dashboard."
            },
            {
              title: "AI Auto-Tags",
              desc: "Automatically classify queries and complaints."
            },
            {
              title: "Priority Routing",
              desc: "Urgent issues reach the right team instantly."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
            >
              <span className="text-teal-600 font-bold text-lg">
                {i + 1}.
              </span>
              <h4 className="font-semibold text-xl mt-1 mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Unified Inbox",
                desc: "All channels in one clean, searchable view."
              },
              {
                title: "AI Auto-Tagging",
                desc: "Smart categorization with near-human accuracy."
              },
              {
                title: "Priority Detection",
                desc: "Never miss high-impact customer issues."
              }
            ].map((item, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <h3 className="font-semibold text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-3xl font-bold text-center mb-10">
          Why Choose QueryPilot?
        </h3>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "70% Faster Responses",
              desc: "Resolve customer queries at lightning speed."
            },
            {
              title: "Enterprise-Grade Security",
              desc: "End-to-end encryption & secure infrastructure."
            },
            {
              title: "Actionable Insights",
              desc: "Track performance & customer satisfaction."
            }
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <h4 className="font-semibold text-xl mb-2">
                {item.title}
              </h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold mb-12">
            What Our Users Say
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "QueryPilot reduced our support backlog by 60% in one week.",
                name: "Rahul S.",
                role: "Support Lead"
              },
              {
                quote:
                  "AI tagging is unbelievably accurate. Huge time saver.",
                name: "Priya K.",
                role: "Customer Success"
              },
              {
                quote:
                  "Our customer satisfaction scores improved instantly.",
                name: "Manish T.",
                role: "Operations Manager"
              }
            ].map((t, i) => (
              <div
                key={i}
                className="p-8 bg-white rounded-2xl shadow-sm hover:shadow-lg transition"
              >
                <p className="italic text-gray-700 mb-4">
                  “{t.quote}”
                </p>
                <h4 className="font-semibold text-gray-900">
                  {t.name}
                </h4>
                <p className="text-sm text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t py-8 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} AQMRS • Built with ❤️ in India
      </footer>
    </div>
  );
}
