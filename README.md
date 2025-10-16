# Internship Tracker + Scraper

This project is your personal internship/job tracking dashboard plus an automated scraper that fetches internship postings from trusted companies (including LinkedIn) and emails them to you.

---

## 📦 Directory Structure

internship-tracker/
├── backend/
│ ├── server.js
│ ├── scraper/
│ │ ├── companyList.json
│ │ ├── scraper.js
│ │ └── emailer.js
│ ├── package.json
│ └── prisma/
│ └── schema.prisma
├── app/ # Next.js frontend (App Router)
│ ├── page.tsx
│ ├── add-job/
│ │ └── page.tsx
│ ├── edit-job/
│ │ └── [id]/page.tsx
│ ├── scraper/
│ │ └── page.tsx # optional viewer of scraped jobs
│ └── globals.css
├── package.json # frontend package
└── README.md


---

## 🛠 Prerequisites

- Node.js v18+  
- A Gmail account (or other SMTP) for sending email (you may need to allow “app passwords” or enable SMTP)  
- Internet access (for scraping)  
- For LinkedIn scraping, you may need authentication or a proxy (LinkedIn is more restrictive than Indeed).

---

## 🔧 Setup & Configuration

### Backend Setup

1. Navigate into backend folder:

   ```bash
   cd backend

2. Edit package.json to include:
    {
        "type": "module",
        ...
    }

3. Install dependencies:
    npm install express cors @prisma/client prisma node-cron nodemailer node-fetch cheerio

4. Setup Prisma schema (in backend/prisma/schema.prisma) and run:
    npx prisma migrate dev --name init

5. Create a .env in backend/ with email credentials:
    MAIL_USER=your.email@gmail.com
    MAIL_PASS=your-email-app-password

### Frontend Setup

In the root of your project (the folder containing package.json for frontend):
    npm install
Make sure that your app/layout.tsx imports globals.css.

### 🚀 Running the App

In the root of your project (the folder containing package.json for frontend):

1. Start backend + scraper

   ```bash
   cd backend
If you added a cron schedule inside server.js (e.g. to run scraping every few hours), the scraper will run automatically.

Alternatively, you can manually run:
    node scraper/scraper.js
to trigger a scrape + email immediately.

2. Start frontend:
    npm run dev

Open your browser at http://localhost:3000.
