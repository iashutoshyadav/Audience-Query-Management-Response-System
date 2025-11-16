import React from "react";
import { Link } from "react-router-dom";

export default function Home({ onLoginClick, onSignupClick }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">

            {/* Navbar */}
            <header className="w-full py-4 px-8 flex justify-between items-center bg-white shadow">
                <h1 className="text-2xl font-bold text-gray-800">QueryPilot</h1>
                <div>
                    <button
                        onClick={onLoginClick}
                        className="text-gray-700 hover:text-gray-900 mr-4"
                    >
                        Login
                    </button>
                    {/* <Link to="/login" className="text-gray-700 hover:text-gray-900 mr-4">
            Login
          </Link> */}

                    <button
                        onClick={onSignupClick}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                        Get Started
                    </button>

                    {/* <Link
            to="/signup"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            Get Started
          </Link> */}
                </div>
            </header>

            {/* Hero */}
            <section className="flex flex-col items-center justify-center text-center px-4 py-10">
                <h2 className="text-5xl font-bold text-gray-900 mb-6">
                    Turn chaos into clarity.
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mb-8">
                    Centralize emails, social messages, chats and support requests — all in
                    one powerful dashboard.
                </p>

                <div className="flex gap-4">
                    {/* <Link
                        to="/signup"
                        className="px-6 py-3 bg-teal-600 text-white rounded-lg text-lg hover:bg-teal-700"
                    >
                        Get Started
                    </Link> */}

                    <button
                        onClick={onSignupClick}
                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                        Get Started
                    </button>


                    <button
                        onClick={onLoginClick}
                        className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg text-lg hover:bg-gray-100"
                    >
                        Live Demo
                    </button>

                    {/* <Link
            to="/login"
            className="px-6 py-3 border border-gray-400 text-gray-700 rounded-lg text-lg hover:bg-gray-100"
          >
            Live Demo
          </Link> */}
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="px-0 py-0 max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-10">
                    How It Works
                </h3>

                <div className="grid md:grid-cols-4 gap-8 text-center">

                    <div className="p-6 bg-white shadow rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">1. Connect Channels</h4>
                        <p className="text-gray-600">Email, WhatsApp, Social, Chat — everything connects instantly.</p>
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">2. Unified Inbox</h4>
                        <p className="text-gray-600">All conversations appear in one simple dashboard.</p>
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">3. AI Auto-Tags</h4>
                        <p className="text-gray-600">Smart categorization into queries, complaints, and requests.</p>
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                        <h4 className="font-semibold text-xl mb-2">4. Priority Routing</h4>
                        <p className="text-gray-600">Critical issues automatically reach the right team.</p>
                    </div>

                </div>
            </section>

            {/* Features */}
            <section className="grid md:grid-cols-3 gap-6 px-8 py-16 max-w-6xl mx-auto">
                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-xl mb-2">Unified Inbox</h3>
                    <p className="text-gray-600">
                        Bring emails, social messages, WhatsApp, and chat into a single dashboard.
                    </p>
                </div>

                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-xl mb-2">AI Auto-Tagging</h3>
                    <p className="text-gray-600">
                        Automatically categorize messages as queries, complaints, or requests.
                    </p>
                </div>

                <div className="p-6 bg-white shadow rounded-lg">
                    <h3 className="font-semibold text-xl mb-2">Priority Detection</h3>
                    <p className="text-gray-600">
                        Detect urgent issues instantly and auto-route them to the right team.
                    </p>
                </div>
            </section>

            {/* --- WHY CHOOSE US --- */}
            <section className="px-8 py-16 bg-white max-w-6xl mx-auto">
                <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
                    Why Choose QueryPilot?
                </h3>

                <div className="grid md:grid-cols-3 gap-8">
                    <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-semibold text-xl mb-2">⚡ Faster Responses</h4>
                        <p className="text-gray-600">Teams reply up to 70% faster with unified workflows.</p>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-semibold text-xl mb-2">🔒 Secure & Reliable</h4>
                        <p className="text-gray-600">Your data is encrypted end-to-end with enterprise-grade security.</p>
                    </div>

                    <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
                        <h4 className="font-semibold text-xl mb-2">📊 Deep Insights</h4>
                        <p className="text-gray-600">Analytics help you track performance and customer satisfaction.</p>
                    </div>
                </div>
            </section>

            {/* --- TESTIMONIALS --- */}
            <section className="px-8 py-20 max-w-6xl mx-auto text-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-10">What Our Users Say</h3>

                <div className="grid md:grid-cols-3 gap-8">

                    <div className="p-6 bg-white shadow rounded-lg">
                        <p className="text-gray-700 italic">
                            "QueryPilot reduced our support backlog by 60% in one week!"
                        </p>
                        <h4 className="mt-4 font-semibold text-gray-900">— Rahul S.</h4>
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                        <p className="text-gray-700 italic">
                            "The AI tagging is unbelievably accurate. Huge time saver."
                        </p>
                        <h4 className="mt-4 font-semibold text-gray-900">— Priya K.</h4>
                    </div>

                    <div className="p-6 bg-white shadow rounded-lg">
                        <p className="text-gray-700 italic">
                            "Our customer satisfaction scores improved instantly."
                        </p>
                        <h4 className="mt-4 font-semibold text-gray-900">— Manish T.</h4>
                    </div>

                </div>
            </section>

            {/* Footer */}
            <footer className="text-center py-6 text-gray-900">
                © {new Date().getFullYear()} AQMRS — All rights reserved.
            </footer>
        </div>
    );
}
