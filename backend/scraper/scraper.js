// backend/scraper/scraper.js
import { scrapeLinkedInInternships } from "./linkedinScraper.js";

export async function scrapeInternships() {
  console.log("🕐 Starting LinkedIn internship scrape...");

  try {
    await scrapeLinkedInInternships();
    console.log("✅ LinkedIn scrape complete.");
  } catch (err) {
    console.error("❌ Scrape failed:", err);
  }
}
