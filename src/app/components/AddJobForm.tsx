"use client";

import { useState } from "react";

interface JobFormProps {
  onAddJob: (job: any) => void;
}

export default function AddJobForm({ onAddJob }: JobFormProps) {
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobId: "",
    category: "Intern/Co-op",
    opportunity: "Apply",
    location: "",
    flexibility: "On-site",
    status: "Apply",
    dateApply: "",
    inTouch: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddJob(formData);
    setFormData({
      company: "",
      role: "",
      jobId: "",
      category: "Intern/Co-op",
      opportunity: "Apply",
      location: "",
      flexibility: "On-site",
      status: "Apply",
      dateApply: "",
      inTouch: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ marginBottom: "2rem" }}>
      <h2>Add New Job</h2>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <input required name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
        <input required name="role" value={formData.role} onChange={handleChange} placeholder="Role" />
        <input name="jobId" value={formData.jobId} onChange={handleChange} placeholder="Job ID" />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option>Intern/Co-op</option>
          <option>Part Time</option>
          <option>Full Time</option>
          <option>Contact</option>
        </select>

        <select name="opportunity" value={formData.opportunity} onChange={handleChange}>
          <option>Apply</option>
          <option>Offer</option>
        </select>

        <input name="location" value={formData.location} onChange={handleChange} placeholder="Location" />

        <select name="flexibility" value={formData.flexibility} onChange={handleChange}>
          <option>On-site</option>
          <option>Hybrid</option>
          <option>Remote</option>
        </select>

        <select name="status" value={formData.status} onChange={handleChange}>
          <option>Apply</option>
          <option>Review</option>
          <option>Interviewing</option>
          <option>Technical-Test</option>
          <option>Accepted</option>
          <option>Refer-to-friend</option>
          <option>Ghosting</option>
          <option>Pass</option>
          <option>Rejected</option>
          <option>Cancel</option>
        </select>

        <input
          type="date"
          name="dateApply"
          value={formData.dateApply}
          onChange={handleChange}
          placeholder="Date Apply"
        />
        <input name="inTouch" value={formData.inTouch} onChange={handleChange} placeholder="In-touch Person" />
      </div>

      <button
        type="submit"
        style={{
          marginTop: "1rem",
          padding: "0.7rem 1.5rem",
          background: "#4ade80",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Add Job
      </button>
    </form>
  );
}
