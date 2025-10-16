"use client";

import React, { useState } from "react";

export default function ScraperPage() {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || "Failed to run scraper.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">LinkedIn Scraper</h1>
      <button
        onClick={handleScrape}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Scraping..." : "Start Scraper"}
      </button>

      {error && (
        <div className="mt-4 text-red-600 bg-red-50 p-3 rounded border border-red-300">
          Error: {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Results</h2>
          <ul className="space-y-2">
            {results.map((job, idx) => (
              <li
                key={idx}
                className="border rounded p-3 bg-gray-50 hover:bg-gray-100 transition"
              >
                <p>
                  <strong>Company:</strong> {job.company}
                </p>
                <p>
                  <strong>Position:</strong> {job.title}
                </p>
                <p>
                  <strong>Posted:</strong> {job.timeAgo || "Unknown"}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <p className="mt-4 text-gray-600">No results yet. Click “Start Scraper”.</p>
      )}
    </div>
  );
}
