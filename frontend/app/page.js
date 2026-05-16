"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "../config";

// Helper Function 
const getRelativeTimeString = (dateString) => {
  if (!dateString) return "just now";
  const now = new Date();
  const posted = new Date(dateString);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `posted ${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `posted ${diffInHours}h ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "posted yesterday";
  return `posted ${diffInDays} days ago`;
};

export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("Guest");

  useEffect(() => {
    // Read the active persona profile flag from the layout session storage
    setRole(localStorage.getItem("userRole") || "Guest");
    fetchJobs();
  }, [category, status]);

  const fetchJobs = async () => {
    let url = `${API_URL}?`;
    if (category) url += `category=${category}&`;
    if (status) url += `status=${status}`;

    try {
      const token = localStorage.getItem("token");
      // Pass the JWT securely inside your standard headers wrapper mapping
      const res = await fetch(url, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed syncing tracking data profiles:", err);
    }
  };

  // Client-side Keyword filtration matching text content strings over titles and descriptions
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">
      {/* 🟦  Hero Banner Area */}
      <div className="bg-[#0a1551] rounded-2xl p-8 md:p-12 text-white shadow-xl mb-10 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="z-10 text-center md:text-left max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3 uppercase">
            GET ANYTHING DONE
          </h1>
          <p className="text-gray-300 text-sm md:text-base font-medium leading-relaxed">
            Plenty to do around the house but not enough time? From window
            cleaning to garden maintenance - find a trusted tasker to help.
          </p>
        </div>

        {/* Show submission CTA button ONLY when logged in as a Homeowner */}
        {role === "Homeowner" ? (
          <Link
            href="/new"
            className="bg-[#0052cc] text-white px-8 py-4 rounded-full font-bold shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-0.5 text-sm tracking-wide shrink-0 z-10"
          >
            Post your task for free
          </Link>
        ) : (
          <div className="text-xs bg-white/10 backdrop-blur-md text-amber-300 border border-amber-500/30 p-4 rounded-xl max-w-xs z-10 text-center font-medium leading-normal shadow-sm">
            🔒 <strong>Want to post a task?</strong> Sign up or Log in with a{" "}
            <strong className="text-white">Homeowner</strong> account to manage
            and post service requests.
          </div>
        )}
      </div>

      {/* Multi-parameter Search Inputs & Category Filters */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200/60 flex flex-col md:flex-row gap-4 items-center mb-10">
        <div className="w-full md:flex-1">
          <input
            type="text"
            placeholder="Search tasks by keywords (e.g., tap, leak, bedroom)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50/50 p-3 rounded-xl text-sm text-gray-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#0052cc] focus:border-[#0052cc] transition-all"
          />
        </div>
        <div className="w-full md:w-52">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50/50 p-3 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#0052cc] focus:border-[#0052cc] outline-none cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrical">Electrical</option>
            <option value="Painting">Painting</option>
            <option value="Joinery">Joinery</option>
          </select>
        </div>
        <div className="w-full md:w-52">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 bg-gray-50/50 p-3 rounded-xl text-sm text-gray-700 focus:bg-white focus:ring-2 focus:ring-[#0052cc] focus:border-[#0052cc] outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
      </div>

      {/*  Task Request Feed Grid Container */}
      <div>
        <h2 className="text-xl font-black text-[#0a1551] mb-6 px-1 uppercase tracking-tight">
          Available Tasks
        </h2>

        {filteredJobs.length === 0 ? (
          <div className="text-center bg-white border border-gray-200/60 rounded-2xl py-20 shadow-sm text-gray-400 font-bold text-sm tracking-wide uppercase">
            No active tasks match your current configuration filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="border border-gray-200/60 bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-blue-300"
              >
                {/* Content Body Block */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[10px] font-black tracking-wider text-[#0052cc] uppercase bg-blue-50 inline-block px-2.5 py-1 rounded-md">
                      📍 {job.location}
                    </div>

                    {/* 🕒 DYNAMIC RELATIVE TIMELINE ENTRY MOUNTED HERE */}
                    <span className="text-[11px] font-bold text-gray-400">
                      {getRelativeTimeString(job.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#0a1551] group-hover:text-[#0052cc] transition line-clamp-2 min-h-[3rem] leading-snug mb-2">
                    {job.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed">
                    {job.description}
                  </p>
                </div>

                {/* Custom Card Footer displaying state pill and CTA redirection actions */}
                <div className="bg-gray-50/70 border-t border-gray-100 px-6 py-4 flex justify-between items-center text-xs">
                  <span
                    className={`px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-wider ${
                      job.status === "Open"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : job.status === "In Progress"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                    }`}
                  >
                    {job.status === "In Progress" ? "Assigned" : job.status}
                  </span>

                  <Link
                    href={`/jobs/${job._id}`}
                    className="text-[#0052cc] font-black text-xs uppercase tracking-wider hover:underline group-hover:translate-x-0.5 transition-transform duration-150"
                  >
                    View Task →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
