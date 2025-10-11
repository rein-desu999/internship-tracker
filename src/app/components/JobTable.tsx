"use client";

interface Job {
  company: string;
  role: string;
  jobId: string;
  category: string;
  opportunity: string;
  location: string;
  flexibility: string;
  status: string;
  dateApply: string;
  inTouch: string;
}

interface JobTableProps {
  jobs: Job[];
}

export default function JobTable({ jobs }: JobTableProps) {
  const recentJobs = [...jobs].reverse().slice(0, 5); // Show most recent 5 jobs

  return (
    <div className="card">
      <h2>Recent Applications</h2>
      <table>
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Category</th>
            <th>Location</th>
            <th>Status</th>
            <th>Date Apply</th>
          </tr>
        </thead>
        <tbody>
          {recentJobs.length > 0 ? (
            recentJobs.map((job, i) => (
              <tr key={i}>
                <td>{job.company}</td>
                <td>{job.role}</td>
                <td>{job.category}</td>
                <td>{job.location}</td>
                <td>
                  <span className={`status ${job.status.toLowerCase()}`}>{job.status}</span>
                </td>
                <td>{job.dateApply}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ textAlign: "center", padding: "1rem" }}>
                No jobs added yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
