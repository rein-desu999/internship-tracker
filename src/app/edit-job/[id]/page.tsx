"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const API = "http://localhost:4000";

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${API}/jobs/${id}`);
        const data = await res.json();

        // Fix for non-array responses
        const found = Array.isArray(data)
          ? data.find((x: any) => String(x.id) === String(id))
          : data;

        if (found)
          setJob({
            ...found,
            dateApply: found.dateApply
              ? found.dateApply.slice(0, 10)
              : "",
          });
      } catch (err) {
        console.error("Error fetching job:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function submit(e: any) {
    e.preventDefault();
    await fetch(`${API}/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    });
    router.push("/");
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!job) return <div className="p-8 text-center">Job not found</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6 text-center">Edit Job</h1>
      <form
        onSubmit={submit}
        className="bg-white shadow-md rounded-lg p-6 space-y-4"
      >
        <input
          name="company"
          value={job.company || ""}
          onChange={(e) => setJob({ ...job, company: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />
        <input
          name="role"
          value={job.role || ""}
          onChange={(e) => setJob({ ...job, role: e.target.value })}
          className="border px-3 py-2 rounded-md w-full"
        />
        <input
          type="date"
          name="dateApply"
          value={job.dateApply || ""}
          onChange={(e) => setJob({ ...job, dateApply: e.target.value })}
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
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
