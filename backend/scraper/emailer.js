// backend/scraper/emailer.js
import nodemailer from "nodemailer";

export async function sendEmail(results, to) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // e.g. your Gmail address
      pass: process.env.MAIL_PASS  // app password
    },
  });

  const htmlList = results
    .map(
      (r) => `
      <li>
        <b>${r.company}</b> — ${r.title}<br/>
        Posted: ${r.timeText}<br/>
        <a href="${r.link}">View Posting</a>
      </li>`
    )
    .join("");

  const mailOptions = {
    from: `"Internship Tracker Bot" <${process.env.MAIL_USER}>`,
    to,
    subject: `🧭 ${results.length} New Internship Postings (last 12h)`,
    html: `<h3>New Internships Found</h3><ul>${htmlList}</ul>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to}`);
}
