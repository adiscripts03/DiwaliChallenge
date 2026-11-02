# 🪔 GDG Diwali Challenge 2026

**Official Real-Time Multi-Platform Competitive Coding Leaderboard**  
Live Website: **[https://diwalichallenge.onrender.com/](https://diwalichallenge.onrender.com/)**

GDG brings you an exclusive 9-day competitive coding challenge designed specially for 1st-year freshers! Track verified problems solved across **LeetCode**, **Codeforces**, and **CodeChef** on a festive, real-time leaderboard.

---

## 📅 Challenge Overview

| Detail | Information |
| :--- | :--- |
| **Event** | GDG Diwali Challenge 2026 |
| **Duration** | **3rd November – 12th November 2026** (10-Day Sprint) |
| **Target Audience** | 1st-Year Freshers only |
| **Platforms Supported** | **LeetCode** • **Codeforces** • **CodeChef** |
| **Official Portal** | [diwalichallenge.onrender.com](https://diwalichallenge.onrender.com/) |
| **Login Credentials** | Use your registered college **BT ID** / Email |
| **Timezone** | `Asia/Kolkata` (IST - UTC+05:30) |

---

## 📌 Mandatory Prerequisites

To be eligible for rankings and prizes, participants must be members of all three:
1. **GDG Community 2026–27**
2. **GDG WhatsApp Channel**
3. **CP / DSA WhatsApp Group**

---

## ⚡ Daily Progress Tracking & Contest Rules

- **Nightly Manual Sync**:
  - Every participant must log in and click **"Sync My Solves Now"** on their [Profile Dashboard](https://diwalichallenge.onrender.com/profile) every night to record problems solved that day.
- **Daily Window**:
  - Only questions solved and synced on that calendar day (since 12:00:00 AM IST) count towards your score.
  - **Unsynced questions will NOT be considered.**
- **Rate-Limiting Protection**:
  - A 5-minute cooldown timer is enforced per participant to prevent platform API rate-limits and IP blocking.
- **Automatic Midnight Rollover**:
  - At midnight IST, the leaderboard daily counter automatically resets for the new day while preserving everyone's cumulative contest total.

---

## 🏆 Leaderboard & Rewards

- **Live Standings**: Track individual solve counts per platform (`LC`, `CF`, `CC`), today's daily sprint count, and cumulative challenge solves.
- **Podium Showcase**: Top 3 performers are displayed prominently in the golden Diwali podium.
- **Exclusive Awards**: The **Top 3 performers** at the end of the 10-day challenge will be awarded exclusive prizes!

---

## ⚖️ Code of Conduct

- **Zero-Tolerance for Cheating**: Cheating, code plagiarism, or using multiple accounts is strictly prohibited.
- **No Duplicate Submissions**: Submitting identical or copied code across accounts will lead to immediate disqualification.
- **Fair Play**: Problem submissions must be authentic and verified on your linked competitive coding profiles.

---

## 🛠️ Tech Stack & Architecture

- **Frontend & App Framework**: [Next.js 14](https://nextjs.org/) (App Router), React, [Tailwind CSS](https://tailwindcss.com/), Lucide Icons
- **Database & Storage**: [Neon Serverless PostgreSQL](https://neon.tech/) with [Prisma ORM](https://www.prisma.io/)
  - Multi-AZ durability and continuous Write-Ahead Log (WAL) backups on AWS.
  - Automated manual snapshots and point-in-time recovery (PITR).
  - Stateless frontend compute on [Render](https://render.com/) decoupled from the database.
- **Authentication**: Secure `bcryptjs` password hashing, HTTP-only signed JWT cookies.
- **Scrapers & Trackers**:
  - **LeetCode**: GraphQL `recentAcSubmissionList` query filtering unique AC slugs.
  - **Codeforces**: Official REST API (`/api/user.status`) filtering `verdict === "OK"`.
  - **CodeChef**: Live submissions scraper analyzing accepted 100-pt solutions since midnight IST.

---

## 📂 Project Structure

```
coding-leaderboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts     # User registration (college BT ID)
│   │   │   ├── login/route.ts        # Authentication & JWT session
│   │   │   ├── me/route.ts           # Current authenticated user
│   │   │   └── logout/route.ts       # Session termination
│   │   ├── leaderboard/route.ts      # Live ranked standings API
│   │   ├── sync/route.ts             # Per-user solve synchronization (5m cooldown)
│   │   └── profile/route.ts          # Handle linking & immediate recalibration
│   ├── developer/page.tsx            # Solo architect & developer credits
│   ├── login/page.tsx                # Sign In page (with password visibility toggle)
│   ├── register/page.tsx             # Sign Up page (with password visibility toggle)
│   ├── profile/page.tsx              # User dashboard & manual sync center
│   ├── globals.css                   # Festive dark theme & radiant Diya glow
│   ├── layout.tsx                    # Root layout with header, footer & nav
│   └── page.tsx                      # Main Leaderboard, Podium & live metrics
├── components/
│   ├── Navbar.tsx                    # Sticky branding navbar with GDG logo
│   ├── Podium.tsx                    # Top 3 medalists showcase
│   ├── LeaderboardTable.tsx          # Searchable, platform-filterable table
│   ├── PlatformBadge.tsx             # Verified platform handles & counts
│   └── DiyaBackground.tsx            # Luminous festive Diwali terracotta Diyas
├── lib/
│   ├── apis/
│   │   ├── leetcode.ts               # LeetCode GraphQL fetcher
│   │   ├── codeforces.ts             # Codeforces REST API fetcher
│   │   ├── codechef.ts               # CodeChef accepted submissions parser
│   │   └── tracker.ts                # Multi-platform synchronization engine
│   ├── auth.ts                       # Password hashing & JWT helpers
│   ├── date.ts                       # Asia/Kolkata timezone & midnight calculators
│   ├── db.ts                         # Neon PostgreSQL database interface
│   └── prisma.ts                     # Prisma client instance
├── prisma/
│   └── schema.prisma                 # PostgreSQL data models & indexes
├── public/
│   └── images/                       # Festive graphics & profile assets
├── tailwind.config.js                # Custom Diwali amber/orange palette
└── package.json
```

---

## 🚀 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adiscripts03/DiwaliChallenge.git
   cd DiwaliChallenge
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://neondb_owner:...@ep-...neon.tech/neondb?sslmode=require"
   JWT_SECRET="your_secure_jwt_secret"
   NEXT_PUBLIC_TIMEZONE="Asia/Kolkata"
   ```

4. **Initialize Prisma Client**:
   ```bash
   npx prisma generate
   ```

5. **Start the local dev server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Developer & Team

Built with ❤️ by the **Website Team** (**Aditya Singh**).

- **GitHub**: [@adiscripts03](https://github.com/adiscripts03)
- **LinkedIn**: [Aditya Singh](https://www.linkedin.com/in/aditya-singh-80827935a/)
- **Live Leaderboard**: [https://diwalichallenge.onrender.com/](https://diwalichallenge.onrender.com/)
