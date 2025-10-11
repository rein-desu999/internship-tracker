"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

interface Job {
  id: number;
  term: string;
  company: string;
  role: string;
  location: string;
  status: string;
  dateApply: string;
}

export default function Dashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [selectedTerm, setSelectedTerm] = useState("");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "company">("date");
  const [showModal, setShowModal] = useState(false);
  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    fetchTerms();
  }, []);

  useEffect(() => {
    if (selectedTerm) fetchJobs();
  }, [selectedTerm]);

  async function fetchTerms() {
    try {
      const res = await axios.get("http://localhost:4000/terms");
      setTerms(res.data.map((t: any) => (typeof t === "string" ? t : t.name)));
      if (res.data.length > 0)
        setSelectedTerm(
          typeof res.data[0] === "string" ? res.data[0] : res.data[0].name
        );
    } catch (err) {
      console.error("Failed to fetch terms:", err);
    }
  }

  async function fetchJobs() {
    try {
      const res = await axios.get("http://localhost:4000/jobs");
      setJobs(res.data.filter((j: Job) => j.term === selectedTerm));
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  }

  async function addTerm() {
    if (!newTerm.trim()) return;
    try {
      await axios.post("http://localhost:4000/terms", { name: newTerm });
      setNewTerm("");
      setShowModal(false);
      fetchTerms();
    } catch (err) {
      console.error("Failed to add term:", err);
    }
  }

  const filteredJobs = jobs
    .filter(
      (job) =>
        job.company.toLowerCase().includes(search.toLowerCase()) ||
        job.role.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.status.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "date") {
        return (
          new Date(b.dateApply).getTime() - new Date(a.dateApply).getTime()
        );
      }
      return a.company.localeCompare(b.company);
    });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "interviewing":
        return "bg-yellow-200 text-yellow-800";
      case "offer":
        return "bg-green-200 text-green-800";
      case "rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Internship Dashboard</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="font-medium">Term:</label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            {terms.map((term) => (
              <option key={term}>{term}</option>
            ))}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="border px-3 py-2 rounded-md hover:bg-gray-100"
          >
            + Add Term
          </button>
        </div>

        <div className="flex gap-2">
          <input
            placeholder="Search jobs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-2 rounded-md"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "company")}
            className="border px-3 py-2 rounded-md"
          >
            <option value="date">Sort by Date</option>
            <option value="company">Sort by Company</option>
          </select>
          <Link
            href={`/add-job?term=${selectedTerm}`}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            + Add Job
          </Link>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {filteredJobs.length > 0 ? (
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Edit</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map((job) => (
                <tr key={job.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{job.company}</td>
                  <td className="p-3">{job.role}</td>
                  <td className="p-3">{job.location}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-md ${getStatusColor(
                        job.status
                      )}`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="p-3">{job.dateApply}</td>
                  <td className="p-3">
                    <Link
                      href={`/edit-job/${job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-600">
            No jobs found for <b>{selectedTerm}</b>.
          </p>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Add New Term</h3>
            <input
              type="text"
              placeholder="e.g. Fall 2025"
              value={newTerm}
              onChange={(e) => setNewTerm(e.target.value)}
              className="border px-3 py-2 w-full rounded-md mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
                onClick={addTerm}
              >
                Add
              </button>
              <button
                className="border px-4 py-2 rounded-md"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
