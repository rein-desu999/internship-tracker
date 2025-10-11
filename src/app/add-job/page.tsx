"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function AddJob() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTerm = searchParams.get("term") || "";

  const [form, setForm] = useState({
    term: currentTerm,
    company: "",
    role: "",
    jobId: "",
    category: "Intern/Co-op",
    opportunity: "Apply",
    location: "",
    flexibility: "On-site",
    status: "Apply",
    dateApply: "",
    contact: "",
    jobDescription: "",
    skills: "",
  });

  const categories = ["Intern/Co-op", "Part Time", "Full Time", "Contract"];
  const flexOptions = ["On-site", "Hybrid", "Remote"];
  const statusOptions = [
    "Apply",
    "Review",
    "Interviewing",
    "Technical-Test",
    "Accepted",
    "Refer-to-friend",
    "Ghosting",
    "Pass",
    "Rejected",
    "Cancel",
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/jobs", form);
    router.push("/");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        Add New Job – {currentTerm}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="company"
            placeholder="Company Name"
            value={form.company}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            name="role"
            placeholder="Role / Position"
            value={form.role}
            onChange={handleChange}
            required
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full"
          />
          <input
            name="jobId"
            placeholder="Job ID"
            value={form.jobId}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md w-full"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
          >
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            name="flexibility"
            value={form.flexibility}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
          >
            {flexOptions.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <input
            type="date"
            name="dateApply"
            value={form.dateApply}
            onChange={handleChange}
            className="border px-3 py-2 rounded-md"
          />
        </div>

        <input
          name="contact"
          placeholder="In-touch Person"
          value={form.contact}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md w-full"
        />

        <textarea
          name="jobDescription"
          placeholder="Job Description"
          rows={3}
          value={form.jobDescription}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md w-full"
        />

        <textarea
          name="skills"
          placeholder="Skills Sought"
          rows={2}
          value={form.skills}
          onChange={handleChange}
          className="border px-3 py-2 rounded-md w-full"
        />

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="border px-4 py-2 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Job
          </button>
        </div>
      </form>
    </div>
  );
}
