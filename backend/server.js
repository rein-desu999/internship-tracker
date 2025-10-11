import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const app = express();
const prisma = new PrismaClient();
app.use(cors());
app.use(express.json());

// ✅ Ensure database file exists (persistence)
const dbDir = path.join(process.cwd(), "../database");
const dbFile = path.join(dbDir, "dev.db");
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
if (!fs.existsSync(dbFile)) {
  console.log("🧱 No database found. Running migration...");
  const { execSync } = await import("child_process");
  execSync("npx prisma migrate deploy", { stdio: "inherit" });
}

// ✅ Health check
app.get("/", (_, res) => res.send("✅ Job Tracker API running"));

// ✅ Get all jobs
app.get("/jobs", async (_, res) => {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { dateApply: "desc" },
    });
    res.json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
});

// ✅ Get job by ID
app.get("/jobs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("Error fetching job:", err);
    res.status(500).json({ error: "Failed to fetch job" });
  }
});

// ✅ Create new job
app.post("/jobs", async (req, res) => {
  try {
    const job = await prisma.job.create({ data: req.body });
    res.json(job);
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: "Failed to create job" });
  }
});

// ✅ Update job
app.put("/jobs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const job = await prisma.job.update({ where: { id }, data: req.body });
    res.json(job);
  } catch (err) {
    console.error("Error updating job:", err);
    res.status(500).json({ error: "Failed to update job" });
  }
});

// ✅ Delete job
app.delete("/jobs/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.job.delete({ where: { id } });
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: "Failed to delete job" });
  }
});

// ✅ Get all unique terms — safe even if empty DB
app.get("/terms", async (_, res) => {
  try {
    const jobs = await prisma.job.findMany({
      select: { term: true },
      orderBy: { term: "asc" },
    });
    if (!jobs || jobs.length === 0) {
      return res.json([]); // ✅ no crash
    }

    const uniqueTerms = [...new Set(jobs.map((j) => j.term).filter(Boolean))];
    res.json(uniqueTerms);
  } catch (err) {
    console.error("Error fetching terms:", err);
    res.status(500).json({ error: "Failed to fetch terms" });
  }
});
// ✅ Create a new term (if it doesn’t already exist)
app.post("/terms", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: "Term name is required" });
    }

    // Check if the term already exists
    const jobsWithTerm = await prisma.job.findMany({
      where: { term: name },
    });

    if (jobsWithTerm.length === 0) {
      // Create a placeholder entry so the term exists in the database
      await prisma.job.create({
        data: {
          term: name,
          company: "Placeholder",
          role: "Placeholder",
          location: "N/A",
          status: "N/A",
          dateApply: new Date().toISOString(),
        },
      });
    }

    res.json({ message: `Term '${name}' added successfully.` });
  } catch (err) {
    console.error("Error creating term:", err);
    res.status(500).json({ error: "Failed to create term" });
  }
});


const PORT = 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
