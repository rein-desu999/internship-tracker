// backend/scraper/linkedinScraper.js
import * as cheerio from "cheerio";
import fs from "fs";
import fetch from "node-fetch"; // works fine even in Node 22

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const companyListPath = path.join(__dirname, "companyList.json");
const COMPANIES = JSON.parse(fs.readFileSync(companyListPath, "utf8"));

// Basic scraper (no login) — may not get all results because LinkedIn blocks bots
export async function scrapeLinkedInInternships() {
  const baseUrl = "https://www.linkedin.com/jobs/search?keywords=intern&f_TP=1";
  console.log(`🔍 Fetching: ${baseUrl}`);

  const res = await fetch(baseUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

  const html = await res.text();
  const $ = cheerio.load(html);
  const results = [];

  $(".base-card").each((_, el) => {
    const title = $(el).find(".base-search-card__title").text().trim();
    const company = $(el).find(".base-search-card__subtitle").text().trim();
    const link = $(el).find("a.base-card__full-link").attr("href") || "";
    const posted = $(el).find("time").text().trim();

    if (!COMPANIES.some(c => company.toLowerCase().includes(c.toLowerCase()))) return;

    const hours = extractHoursLinkedIn(posted);
    if (hours <= 12) {
      results.push({ title, company, posted, link });
    }
  });

  console.log(`🧾 Found ${results.length} new internships:`);

  for (const job of results) {
    console.log(`→ ${job.company} — ${job.title} (${job.posted})`);
  }

  // You can email, store in DB, or log them here
}

function extractHoursLinkedIn(str) {
  const m = str.match(/(\d+)\s*h/);
  if (m) return parseInt(m[1]);
  if (str.includes("day")) return 24;
  return 100;
}
