"use client";
import { useState, useEffect } from "react";
import "./globals.css";

export default function RootLayout({ children }) {
  const [currentRole, setCurrentRole] = useState("Guest");
  const [userName, setUserName] = useState("");
  const [authError, setAuthError] = useState("");

  // Modal toggle engines
  const [modalType, setModalType] = useState(null); 
  const [loading, setLoading] = useState(false);

  // Dynamic input form parameters
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Homeowner"); 

  useEffect(() => {
    setCurrentRole(localStorage.getItem("userRole") || "Guest");
    setUserName(localStorage.getItem("userName") || "");
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setLoading(true);

    const baseAuthUrl =process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000/api/auth";

    const endpoint =
      modalType === "signup"
        ? `${baseAuthUrl}/register`
        : `${baseAuthUrl}/login`;
    
        const payload =
      modalType === "signup"
        ? { name, email, password, role }
        : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userName", data.user.name);
        setModalType(null); // Close active overlays
        window.location.reload();
      } else {
        setAuthError(data.message || "Authentication processing rejected.");
      }
    } catch (err) {
      setAuthError("Failed contacting backend endpoints.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <html lang="en">
      {/* flex and flex-col ensure the page takes full height so the footer sits at the bottom */}
      <body className="bg-[#f4f5f9] min-h-screen text-gray-900 antialiased flex flex-col justify-between">
        <div>
          {/* Header Navbar */}
          <header className="bg-white border-b border-gray-200/60 sticky top-0 z-50 px-6 py-3.5 shadow-sm">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              {/* Left Logo block (Placeholder links removed) */}
              <div className="flex items-center">
                <span
                  onClick={() => (window.location.href = "/")}
                  className="font-black text-2xl tracking-tight text-[#0052cc] cursor-pointer select-none"
                >
                  GlobalTNA
                </span>
              </div>

              {/* Right Header Navigation controls */}
              <div className="flex items-center gap-4 text-sm font-bold">
                {currentRole === "Guest" ? (
                  <>
                    <button
                      onClick={() => {
                        setAuthError("");
                        setModalType("signup");
                      }}
                      className="text-gray-600 hover:text-[#0052cc] px-2 py-2 transition"
                    >
                      Sign up
                    </button>
                    <button
                      onClick={() => {
                        setAuthError("");
                        setModalType("login");
                      }}
                      className="text-gray-600 hover:text-[#0052cc] px-2 py-2 transition"
                    >
                      Log in
                    </button>
                    <button
                      onClick={() => {
                        setAuthError("");
                        setModalType("signup");
                        setRole("Tradesperson");
                      }}
                      className="bg-blue-50 text-[#0052cc] px-5 py-2.5 rounded-full hover:bg-blue-100 transition-all duration-200"
                    >
                      Become a Tasker
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full py-1.5 pl-4 pr-2 shadow-sm">
                    <span className="text-xs text-gray-500 font-medium">
                      Hello,{" "}
                      <strong className="text-[#0a1551] font-bold">
                        {userName}
                      </strong>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100/70 text-[#0052cc] px-2 py-0.5 rounded ml-1.5">
                        {currentRole}
                      </span>
                    </span>
                    <button
                      onClick={handleLogout}
                      className="bg-rose-50 text-rose-600 text-xs px-3 py-1 rounded-full border border-rose-200 hover:bg-rose-100 transition font-bold"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Core Content Area */}
          {children}
        </div>

        {/*  Interactive Unified Auth Overlay System Form Modal */}
        {modalType && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl max-w-sm w-full p-6 relative">
              <button
                onClick={() => setModalType(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>

              <h2 className="text-xl font-black text-[#0a1551] mb-1 capitalize">
                {modalType === "signup" ? "Create an account" : "Welcome back"}
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                {modalType === "signup"
                  ? "Join our marketplace community today."
                  : "Log in to manage or fulfill local service requests."}
              </p>

              {authError && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-2.5 rounded-xl text-xs font-semibold mb-3">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3">
                {modalType === "signup" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0052cc]"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0052cc]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-200 p-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#0052cc]"
                  />
                </div>

                {modalType === "signup" && (
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                      Marketplace Profile Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full border border-gray-200 bg-white p-2.5 rounded-xl text-sm outline-none font-medium text-gray-700 cursor-pointer"
                    >
                      <option value="Homeowner">
                        Homeowner (Post Requests)
                      </option>
                      <option value="Tradesperson">
                        Tradesperson / Tasker (Fulfill Jobs)
                      </option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0052cc] text-white font-bold p-3 rounded-xl text-sm mt-2 transition hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading
                    ? "Processing..."
                    : modalType === "signup"
                      ? "Register Account"
                      : "Log In"}
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-gray-500 pt-3 border-t border-gray-100">
                {modalType === "signup" ? (
                  <span>
                    Already have an account?{" "}
                    <strong
                      onClick={() => setModalType("login")}
                      className="text-[#0052cc] cursor-pointer hover:underline"
                    >
                      Log in
                    </strong>
                  </span>
                ) : (
                  <span>
                    New to the platform?{" "}
                    <strong
                      onClick={() => setModalType("signup")}
                      className="text-[#0052cc] cursor-pointer hover:underline"
                    >
                      Sign up now
                    </strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/*  Footer */}
        <footer className="w-full bg-white border-t border-gray-200/60 mt-12 py-5 px-6">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-medium">
            <div>
              © 2026{" "}
              <span className="font-bold text-[#0a1551]">
                GlobalTNA TaskBoard
              </span>
              . All rights reserved.
            </div>
            <div className="flex gap-4">
              <span className="hover:text-[#0052cc] cursor-pointer transition">
                Privacy Policy
              </span>
              <span className="hover:text-[#0052cc] cursor-pointer transition">
                Terms of Service
              </span>
              <span className="hover:text-[#0052cc] cursor-pointer transition">
                Support Helpdesk
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
