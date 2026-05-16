"use client";
import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "../../../config";

// time line
const getRelativeTimeString = (dateString) => {
  if (!dateString) return "just now";
  const now = new Date();
  const posted = new Date(dateString);
  const diffInSeconds = Math.floor((now - posted) / 1000);

  if (diffInSeconds < 60) return "just now";

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `posted ${diffInMinutes}m ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `posted ${diffInHours} hours ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "posted yesterday";
  return `posted ${diffInDays} days ago`;
};

// Format helper for fallback plain representation strings
const formatPlainDate = (dateString) => {
  if (!dateString) return "Flexible Execution";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

export default function JobDetail({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [error, setError] = useState("");
  const [role, setRole] = useState("Guest");

  useEffect(() => {
    setRole(localStorage.getItem("userRole") || "Guest");
    fetchJobDetails();
  }, [params.id]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${params.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error("Task configuration context not resolved");
      const data = await res.json();
      setJob(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${params.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setJob({ ...job, status: newStatus });
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (
      !confirm("Are you sure you want to permanently delete this task request?")
    )
      return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/${params.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        router.push("/");
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (error)
    return (
      <div className="text-center text-rose-500 mt-12 font-bold">
        {error}.{" "}
        <Link href="/" className="underline text-blue-500">
          Return home
        </Link>
      </div>
    );
  if (!job)
    return (
      <div className="text-center text-gray-400 mt-12 animate-pulse font-medium">
        Loading task data metrics...
      </div>
    );

  return (
    <main className="max-w-5xl mx-auto p-4 md:p-8 mt-4">
      {/*  Two-Column Main Layout Grid Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Left Side: Core Task Summary Profiles  */}
        <div className="md:col-span-2 space-y-6">
          {/*  Progress Bar Badges */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-gray-200/60 p-1 rounded-full text-[11px] font-black uppercase tracking-wider text-gray-500">
              <span
                className={`px-3 py-1 rounded-full ${job.status === "Open" ? "bg-[#0052cc] text-white shadow-sm" : ""}`}
              >
                Open
              </span>
              <span
                className={`px-3 py-1 rounded-full ${job.status === "In Progress" ? "bg-amber-500 text-white shadow-sm" : ""}`}
              >
                Assigned
              </span>
              <span
                className={`px-3 py-1 rounded-full ${job.status === "Closed" ? "bg-gray-600 text-white shadow-sm" : ""}`}
              >
                Completed
              </span>
            </div>

            <Link
              href="/"
              className="text-xs font-bold text-[#0052cc] hover:underline flex items-center gap-1"
            >
              ‹ Return to board
            </Link>
          </div>

          {/* Task Title */}
          <h1 className="text-3xl md:text-4xl font-black text-[#0a1551] tracking-tight leading-tight">
            {job.title}
          </h1>

          {/* Metadata Block Segment Mapping Layout Matrix */}
          <div className="space-y-4 pt-2 border-t border-gray-100">
            {/* Meta Row 1: Requester & Relative time stamp metric */}
            <div className="flex items-start gap-4 text-sm">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0052cc] flex items-center justify-center font-bold text-base shrink-0 border border-blue-200">
                {job.contactName?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Posted By
                </div>
                <div className="font-extrabold text-[#0a1551] text-base mt-0.5">
                  {job.contactName}
                </div>
                <div className="text-xs font-semibold text-gray-400 mt-0.5 lowercase">
                  {getRelativeTimeString(job.createdAt)}
                </div>
              </div>
            </div>

            {/*  Location Map Coordinates */}
            <div className="flex items-start gap-4 text-sm pt-2">
              <div className="text-lg text-gray-400 shrink-0 w-10 text-center">
                📍
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Location
                </div>
                <div className="font-bold text-gray-700 mt-0.5">
                  {job.location}
                </div>
              </div>
            </div>

            {/*  Target Finish Calendar Mark */}
            <div className="flex items-start gap-4 text-sm pt-2">
              <div className="text-lg text-gray-400 shrink-0 w-10 text-center">
                📅
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  To Be Done On
                </div>
                <div className="font-bold text-gray-700 mt-0.5">
                  {formatPlainDate(job.createdAt)}
                </div>
              </div>
            </div>
          </div>

          {/* Details Descriptions Display Segment Box */}
          <div className="pt-6 border-t border-gray-100">
            <h3 className="text-lg font-black text-[#0a1551] mb-3">Details</h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              {job.description}
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="space-y-4 md:sticky md:top-24">
          {/* Main Action Callout Widget Frame */}
          <div className="bg-white border border-gray-200/70 p-6 rounded-2xl shadow-md text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-1">
              Task Status
            </span>

            {/* Custom Status Pricing Badge Emulation Output Display */}
            <div className="text-2xl font-black text-[#0a1551] bg-gray-50 py-3 rounded-xl border border-gray-100 mb-6 uppercase tracking-wider">
              {job.status === "Open"
                ? "🟢 Open"
                : job.status === "In Progress"
                  ? "🟡 Assigned"
                  : "🔒 Closed"}
            </div>

            {/* INTERACTIVE COMPONENT */}
            {role === "Tradesperson" ? (
              <div className="space-y-2 text-left">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 pl-1">
                  Update Execution Status
                </label>
                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full border border-gray-300 bg-white p-3 rounded-xl text-sm font-bold text-gray-800 shadow-sm focus:ring-2 focus:ring-[#0052cc] focus:border-[#0052cc] outline-none appearance-none cursor-pointer"
                >
                  <option value="Open">Open (Available)</option>
                  <option value="In Progress">In Progress (Assign Me)</option>
                  <option value="Closed">Closed (Completed Task)</option>
                </select>
              </div>
            ) : role === "Homeowner" ? (
              /* delete */
              <button
                onClick={handleDelete}
                className="w-full bg-rose-50 text-rose-600 border border-rose-200 font-bold text-sm p-3.5 rounded-full hover:bg-rose-100 transition duration-150 shadow-sm"
              >
                Delete This Task Request
              </button>
            ) : (
              /*  Read-Only message banner for Guests */
              <p className="text-xs text-gray-400 bg-gray-50 rounded-xl p-3 border border-dashed leading-normal">
                Sign in using the choices above to update status configurations
                or manage requests.
              </p>
            )}
          </div>

          <div className="text-center text-xs text-gray-400 px-2 leading-relaxed">
            Case ID:{" "}
            <span className="font-mono text-[11px] font-bold select-all">
              {job._id}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
