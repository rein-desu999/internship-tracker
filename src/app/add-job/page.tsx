"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

export default function AddJob() {
  const router = useRouter();
  // ⭐️ ACCESS THE URL SEARCH PARAMS
  const searchParams = useSearchParams();
  const initialTerm = searchParams.get("term") || "";


  const [form, setForm] = useState({
    term: initialTerm,
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

  const categories = ["Intern/Co-op", "Part Time", "Full Time", "Contact"];
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await axios.post("http://localhost:4000/jobs", form);
    router.push("/");
  };

  return (
    <div className="container">
      <h1>Add a New Job</h1>
      <form className="job-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Term</label>
          <input name="term" value={form.term} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Company</label>
          <input name="company" value={form.company} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Role</label>
          <input name="role" value={form.role} onChange={handleChange} required />
        </div>
        <div className="form-row">
          <label>Job ID</label>
          <input name="jobId" value={form.jobId} onChange={handleChange} />
        </div>

        <div className="form-grid">
          <div>
            <label>Category</label>
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Opportunity</label>
            <input name="opportunity" value={form.opportunity} onChange={handleChange} />
          </div>
          <div>
            <label>Location</label>
            <input name="location" value={form.location} onChange={handleChange} />
          </div>
          <div>
            <label>Flexibility</label>
            <select name="flexibility" value={form.flexibility} onChange={handleChange}>
              {flexOptions.map((f) => (
                <option key={f}>{f}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Date Applied</label>
            <input type="date" name="dateApply" value={form.dateApply} onChange={handleChange} />
          </div>
          <div>
            <label>In-touch Person</label>
            <input name="contact" value={form.contact} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <label>Job Description</label>
          <textarea name="jobDescription" value={form.jobDescription} onChange={handleChange} rows={4} />
        </div>
        <div className="form-row">
          <label>Skills Sought</label>
          <textarea name="skills" value={form.skills} onChange={handleChange} rows={3} />
        </div>

        <button type="submit" className="btn-primary">Add Job</button>
      </form>
    </div>
  );
}

