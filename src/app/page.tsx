"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

// --- Type Definitions ---

type Job = {
    id?: number;
    term: string;
    company: string;
    role: string;
    jobId?: string;
    category?: string;
    opportunity?: string;
    location?: string;
    flexibility?: string;
    status?: "Apply" | "Interviewing" | "Accepted" | "Offer" | "Rejected" | string;
    dateApply?: string;
    contact?: string;
};

type ActiveTab = 'Dashboard' | 'Scraper';

// Simulated API endpoint for development.
const API = "http://localhost:4000";

// --- Utility Functions ---

// Function to handle navigation for the single-file environment
const handleNavPlaceholder = (action: string, jobId?: number) => {
    // NOTE: Using console.log instead of alert() or window.confirm()
    const msg = jobId ? `${action} job with ID ${jobId}` : `Open the ${action} screen (Routing not available in this single file)`;
    console.log(`Action: ${msg}`);
};

// Tailwind helper for status colors
const getStatusColor = (status?: string) => {
    switch (status) {
        case "Apply":
            return "bg-green-100 text-green-800";
        case "Interviewing":
            return "bg-yellow-100 text-yellow-800";
        case "Accepted":
        case "Offer":
            return "bg-blue-100 text-blue-800";
        case "Rejected":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

// --- Component 1: Dashboard Content (Restored) ---

const DashboardContent: React.FC = () => {
    const [terms, setTerms] = useState<string[]>([]);
    const [selectedTerm, setSelectedTerm] = useState<string>("");
    const [jobs, setJobs] = useState<Job[]>([]);
    const [query, setQuery] = useState("");
    const [sortKey, setSortKey] = useState<"date" | "company" | "status">("date");

    const fetchTerms = useCallback(async () => {
        try {
            const res = await fetch(`${API}/terms`);
            if (!res.ok) throw new Error("Failed to fetch terms");
            const data: string[] = await res.json();
            setTerms(data);
            if (data.length > 0 && !selectedTerm) setSelectedTerm(data[0]);
        } catch (error) {
            console.error("Error fetching terms:", error);
        }
    }, [selectedTerm]);

    const fetchJobs = useCallback(async (term: string) => {
        try {
            const res = await fetch(`${API}/jobs?term=${encodeURIComponent(term)}`);
            if (!res.ok) throw new Error("Failed to fetch jobs");
            const data: Job[] = await res.json();
            if (!Array.isArray(data)) {
                console.error("Invalid jobs response:", data);
                setJobs([]);
                return;
            }
            setJobs(
                data.map((j) => ({
                    ...j,
                    dateApply: j.dateApply
                        ? new Date(j.dateApply).toISOString().slice(0, 10)
                        : "",
                }))
            );
        } catch (error) {
            console.error("Error fetching jobs:", error);
        }
    }, []);

    useEffect(() => {
        fetchTerms();
    }, [fetchTerms]);

    useEffect(() => {
        if (selectedTerm) fetchJobs(selectedTerm);
    }, [selectedTerm, fetchJobs]);

    const createTerm = async () => {
        const name = window.prompt("New term name (e.g. Summer 2026 Internship):");
        if (!name) return;
        try {
            await fetch(`${API}/terms`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });
            fetchTerms();
            setSelectedTerm(name);
        } catch (error) {
            console.error("Error creating term:", error);
        }
    };

    const deleteJob = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Delete this job? (Custom modal required)")) return;

        try {
            await fetch(`${API}/jobs/${id}`, { method: "DELETE" });
            if (selectedTerm) fetchJobs(selectedTerm);
        } catch (error) {
            console.error("Error deleting job:", error);
        }
    };

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = jobs.filter(
            (j) =>
                !q ||
                j.company.toLowerCase().includes(q) ||
                j.role.toLowerCase().includes(q) ||
                (j.location || "").toLowerCase().includes(q) ||
                (j.jobId || "").toLowerCase().includes(q)
        );
        if (sortKey === "date") {
            list = list.sort((a, b) =>
                (b.dateApply || "").localeCompare(a.dateApply || "")
            );
        } else if (sortKey === "company") {
            list = list.sort((a, b) => a.company.localeCompare(b.company));
        } else if (sortKey === "status") {
             list = list.sort((a, b) => (a.status || "").localeCompare(b.status || ""));
        }
        return list;
    }, [jobs, query, sortKey]);

    const chartData = useMemo(() => ([
        { name: "Apply", value: jobs.filter((j) => j.status === "Apply").length },
        {
            name: "Interviewing",
            value: jobs.filter((j) => j.status === "Interviewing").length,
        },
        {
            name: "Accepted/Offer",
            value: jobs.filter(
                (j) => j.status === "Accepted" || j.status === "Offer"
            ).length,
        },
        { name: "Rejected", value: jobs.filter((j) => j.status === "Rejected").length },
    ]), [jobs]);

    const COLORS = ["#4ade80", "#facc15", "#60a5fa", "#f87171"];

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-extrabold text-gray-800">Internship Tracker</h1>
                <div className="flex space-x-3">
                    <button
                        onClick={createTerm}
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                        + New Term
                    </button>
                    {/* Using button with placeholder for the original Link href="/add-job" */}
                    <button
                        onClick={() => handleNavPlaceholder("Add Job")}
                        className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition text-sm"
                    >
                        Add Job
                    </button>
                </div>
            </header>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white p-4 rounded-xl shadow-md">
                <label className="flex items-center text-gray-700 font-medium whitespace-nowrap">
                    Term:
                    <select
                        value={selectedTerm}
                        onChange={(e) => setSelectedTerm(e.target.value)}
                        className="ml-2 p-1 border border-gray-300 rounded-lg shadow-sm text-sm"
                    >
                        {terms.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </label>

                <input
                    placeholder="Search company, role, location, job id..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg shadow-sm text-sm"
                />

                <label className="flex items-center text-gray-700 font-medium whitespace-nowrap">
                    Sort:
                    <select
                        value={sortKey}
                        onChange={(e) => setSortKey(e.target.value as any)}
                        className="ml-2 p-1 border border-gray-300 rounded-lg shadow-sm text-sm"
                    >
                        <option value="date">Date Apply (new→old)</option>
                        <option value="company">Company (A→Z)</option>
                        <option value="status">Status</option>
                    </select>
                </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 overflow-x-auto">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                        Applications — {selectedTerm || "No term selected"}
                    </h2>

                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Location</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Date Apply</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                                        No jobs
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((j) => (
                                    <tr key={j.id} className="hover:bg-gray-50 transition duration-100">
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{j.company}</td>
                                        <td className="px-4 py-4 text-sm text-gray-700">{j.role}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">{j.category}</td>
                                        <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">{j.location}</td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(j.status)}`}>
                                                {j.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{j.dateApply}</td>
                                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Restored button look/functionality */}
                                            <button
                                                onClick={() => handleNavPlaceholder("Edit Job", j.id)}
                                                className="text-blue-600 hover:text-blue-800 mr-2 text-xs"
                                            >
                                                Edit
                                            </button>
                                            <button onClick={() => deleteJob(j.id)} className="text-red-600 hover:text-red-800 text-xs">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-3">Recent Applications</h2>
                        <div className="space-y-2">
                            {jobs.slice().reverse().slice(0, 6).map((j, i) => (
                                <div
                                    key={i}
                                    className="p-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition rounded"
                                >
                                    <div className="font-medium text-gray-800 text-sm">
                                        <strong>{j.company}</strong> — {j.role}
                                    </div>
                                    <div className="text-xs text-gray-500">{j.dateApply}</div>
                                </div>
                            ))}
                            {jobs.length === 0 && (
                                <div className="text-gray-500 text-sm p-2">No recent applications</div>
                            )}
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Status Overview</h3>
                        <div className="flex justify-center">
                            {/* PIE CHART RESTORED TO ORIGINAL DIMENSIONS AND TYPING FIXED */}
                            <PieChart width={300} height={250}>
                                <Pie
                                    data={chartData}
                                    cx={150}
                                    cy={100}
                                    outerRadius={80}
                                    dataKey="value"
                                    labelLine={false}
                                    // FIXED: Explicitly define types for name and percent to resolve TypeScript error
                                    label={({ name, percent }: { name?: string; percent?: number }) =>
                                        `${name} (${((percent ?? 0) * 100).toFixed(0)}%)`
                                    }
                                >
                                    {chartData.map((_, i) => (
                                        <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value, name) => [value, name]} />
                            </PieChart>
                        </div>
                        <div className="text-sm mt-4 text-center">
                            {chartData.map((item, index) => (
                                <span key={item.name} className="inline-flex items-center mx-2 my-1">
                                    <span
                                        className="inline-block w-3 h-3 rounded-full mr-1"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></span>
                                    {item.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Component 2: Scraper Content (Original app/scraper/page.tsx logic) ---

const ScraperContent: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleScrape = async () => {
        setLoading(true);
        setError(null);
        setResults([]);

        try {
            const response = await fetch("http://localhost:4000/api/scrape/linkedin");
            if (!response.ok) {
                 // Simulate data if the local server isn't running
                if (response.status === 404 || response.status === 500) {
                    console.warn(`Scraper API returned ${response.status}. Showing simulated data.`);
                    setResults(simulateScrapeData());
                } else {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            } else {
                const data = await response.json();
                setResults(Array.isArray(data.results) ? data.results : []);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to run scraper. Check your backend connection.");
        } finally {
            setLoading(false);
        }
    };

    const simulateScrapeData = () => {
        return [
            { company: "Acme Corp", title: "Senior Software Engineer", timeAgo: "2 hours ago" },
            { company: "Globex Systems", title: "Data Analyst Internship", timeAgo: "1 day ago" },
            { company: "Hooli Inc.", title: "Product Manager", timeAgo: "5 days ago" },
        ];
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-4">LinkedIn Scraper</h1>

            <button
                onClick={handleScrape}
                disabled={loading}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.01]"
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Scraping...
                    </span>
                ) : (
                    "Start Scraper"
                )}
            </button>

            {error && (
                <div className="mt-6 text-red-700 bg-red-100 p-4 rounded-xl border border-red-300 shadow-sm">
                    <strong className="font-bold">Scraper Error:</strong> {error}
                </div>
            )}

            {results.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-700">Found Results ({results.length})</h2>
                    <ul className="space-y-3">
                        {results.map((job, idx) => (
                            <li
                                key={idx}
                                className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-white transition duration-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center"
                            >
                                <div className="space-y-1">
                                    <p className="font-bold text-lg text-blue-600">{job.title}</p>
                                    <p className="text-gray-700">
                                        <strong className="font-semibold text-gray-800">Company:</strong> {job.company}
                                    </p>
                                    <p className="text-gray-600 text-sm">
                                        <strong className="font-semibold text-gray-800">Posted:</strong> {job.timeAgo || "Unknown"}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {!loading && !error && results.length === 0 && (
                <p className="mt-6 text-gray-500 text-center p-4 border border-dashed rounded-xl">
                    No results yet. Click **“Start Scraper”**.
                </p>
            )}
        </div>
    );
};

// --- Main Application Component (Exports Default) ---

export default function UnifiedApp() {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Dashboard');

    // Button styling for the tabs
    const tabClass = (tabName: ActiveTab) =>
        `py-3 px-6 text-sm font-medium transition-all duration-300
        ${activeTab === tabName
            ? 'border-b-4 border-blue-600 text-blue-700 bg-white'
            : 'border-b-2 border-transparent text-gray-500 hover:text-blue-500 hover:bg-gray-50'
        }`;

    return (
        <div className="min-h-screen bg-gray-100 font-sans">
            <header className="bg-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-start h-16">
                        <div className="flex space-x-1">
                            <button
                                onClick={() => setActiveTab('Dashboard')}
                                className={tabClass('Dashboard')}
                            >
                                Internship Tracker (Dashboard)
                            </button>
                            <button
                                onClick={() => setActiveTab('Scraper')}
                                className={tabClass('Scraper')}
                            >
                                LinkedIn Scraper
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto pb-12 pt-6">
                {activeTab === 'Dashboard' && <DashboardContent />}
                {activeTab === 'Scraper' && <ScraperContent />}
            </main>
        </div>
    );
}
