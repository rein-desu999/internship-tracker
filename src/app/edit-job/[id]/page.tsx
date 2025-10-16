"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

// Define the shape of your job data for better type safety
type Job = {
  id?: number; // Assuming ID is present after fetch
  company: string;
  role: string;
  jobId: string;
  category: string;
  opportunity: string;
  location: string;
  flexibility: string;
  status: string;
  dateApply: string; // Will be YYYY-MM-DD format for input[type="date"]
  inTouchPerson: string;
};

// Assuming your backend uses a plural endpoint for a single job fetch by ID
const API = "http://localhost:4000";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  // Ensure 'id' is treated as a string or null/undefined
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Use a partial job type for initial state, as we fetch the rest
  const [job, setJob] = useState<Partial<Job> | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch the specific job
  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchJob = async () => {
      try {
        const response = await fetch(`${API}/jobs/${id}`);

        if (!response.ok) {
          // If the status is not 2xx (e.g., 404 Not Found),
          // we'll throw an error to trigger the catch block.
          throw new Error("Job not found or API error");
        }

        const jobData: Job = await response.json();

        // 1. Convert dateApply from ISO string to YYYY-MM-DD format for input[type="date"]
        // 2. Ensure all properties are available, or default to an empty string.
        setJob({
          ...jobData,
          dateApply: jobData.dateApply
            ? jobData.dateApply.slice(0, 10)
            : "",
        });
      } catch (error) {
        console.error("Error fetching job:", error);
        // Set job to null to display "Job not found" message
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]); // Depend only on the 'id' parameter

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setJob({ ...job, [e.target.name]: e.target.value });
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!job || !id) return;

    // Convert dateApply back to ISO string or null before sending to the backend
    const payload = {
      ...job,
      dateApply: job.dateApply ? new Date(job.dateApply).toISOString() : null,
    };

    try {
      const response = await fetch(`${API}/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Only redirect on successful update
        router.push("/");
      } else {
        // Handle server-side errors on update
        console.error("Failed to update job:", await response.text());
        alert("Failed to save changes. Please check the server.");
      }
    } catch (error) {
      console.error("Network error during update:", error);
      alert("A network error occurred. Could not save changes.");
    }
  }

  // --- Rendering Logic ---
  if (loading) return <div className="container"><div className="card">Loading...</div></div>;
  if (!job) return <div className="container"><div className="card">Job not found</div></div>;

  return (
    <div className="container">
      <h1>Edit Job: {job.company} - {job.role}</h1>
      <form className="card" onSubmit={submit}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Use the non-null assertion operator (!) since we checked !job above */}
          <input name="company" placeholder="Company" value={job.company ?? ""} onChange={handleChange} required />
          <input name="role" placeholder="Role" value={job.role ?? ""} onChange={handleChange} required />
          <input name="jobId" placeholder="Job ID (Optional)" value={job.jobId ?? ""} onChange={handleChange} />
          <select name="category" value={job.category ?? "Intern/Co-op"} onChange={handleChange}>
            <option>Intern/Co-op</option><option>Part Time</option><option>Full Time</option><option>Contact</option>
          </select>
          <select name="opportunity" value={job.opportunity ?? "Apply"} onChange={handleChange}>
            <option>Apply</option><option>Offer</option>
          </select>
          <input name="location" placeholder="Location" value={job.location ?? ""} onChange={handleChange} />
          <select name="flexibility" value={job.flexibility ?? "On-site"} onChange={handleChange}>
            <option>On-site</option><option>Hybrid</option><option>Remote</option>
          </select>
          <select name="status" value={job.status ?? "Apply"} onChange={handleChange}>
            <option>Apply</option><option>Review</option><option>Interviewing</option><option>Technical-Test</option>
            <option>Accepted</option><option>Refer-to-friend</option><option>Ghosting</option><option>Pass</option>
            <option>Rejected</option><option>Cancel</option>
          </select>
          <input type="date" name="dateApply" value={job.dateApply ?? ""} onChange={handleChange} />
          <input name="inTouchPerson" placeholder="In-Touch Person" value={job.inTouchPerson ?? ""} onChange={handleChange} />
        </div>

        <div style={{ marginTop: 12 }}>
          <button type="submit">Save Changes</button>
          <button type="button" style={{ marginLeft: 8 }} onClick={() => router.push("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
