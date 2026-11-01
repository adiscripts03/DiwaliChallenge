# 🏆 DailyCodePulse — Multi-Platform Daily Coding Leaderboard

A full-stack, production-ready web application that tracks how many competitive programming problems users solve **today** across **LeetCode**, **Codeforces**, and **CodeChef**, and displays them on a real-time competitive leaderboard with user authentication and profile management.

---

## ⚡ Features

- **Multi-Platform Daily Solves Tracker**:
  - **LeetCode**: Unauthenticated GraphQL queries (`recentAcSubmissionList`).
  - **Codeforces**: Official REST API (`/api/user.status`) filtering by `verdict === "OK"`.
  - **CodeChef**: Profile scraper analyzing recent accepted submissions.
- **Start-of-Today Timezone Support**: Correctly checks midnight boundaries based on your timezone (configured via `NEXT_PUBLIC_TIMEZONE`, default `Asia/Kolkata` or `UTC`).
- **Real-Time Daily Leaderboard**:
  - Interactive Podium highlighting the **Gold**, **Silver**, and **Bronze** champions of the day.
  - Search by coder name or platform handle.
  - Filter tabs: **All Combined**, **LeetCode Only**, **Codeforces Only**, **CodeChef Only**.
  - One-click global "Sync All Solves" or per-user refresh buttons.
- **Basic Auth & User Profiles**:
  - Secure registration and login with `bcryptjs` password hashing and HTTP-only `JWT` cookies.
  - User dashboard to connect and edit their LeetCode, Codeforces, and CodeChef handles anytime.
  - "Sync My Solves Now" button to verify and test handles immediately.
- **Zero-Setup File Database**:
  - Uses a lightweight, persistent JSON database in `data/db.json`.
  - Zero external database services (MongoDB/Postgres) needed to test or run!

---

## 🚀 Getting Started

### 1. Open in Antigravity or Terminal
Navigate into this project directory:
```bash
cd /Users/adityasingh/coding-leaderboard
```

### 2. Run the Development Server
```bash
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)**.

---

## 🔑 Demo Login

If you want to quickly test the application without creating a new user:
- **Email**: `alex@example.com`
- **Password**: `password123`

Or simply click the **"Click here to use demo account"** button on the `/login` page.

---

## 🛠️ API Implementations Explained

### 1. LeetCode GraphQL API (`lib/apis/leetcode.ts`)
Queries LeetCode's public GraphQL endpoint without requiring private session cookies:
```graphql
query recentAcSubmissions($username: String!, $limit: Int!) {
  recentAcSubmissionList(username: $username, limit: $limit) {
    id
    title
    titleSlug
    timestamp
  }
}
```
Filters `timestamp >= startOfTodayTimestamp` and counts unique solved problem slugs.

### 2. Codeforces REST API (`lib/apis/codeforces.ts`)
Queries the official Codeforces API:
```
GET https://codeforces.com/api/user.status?handle={username}&from=1&count=50
```
Filters for submissions where:
- `creationTimeSeconds >= startOfTodayTimestamp`
- `verdict === "OK"`
De-duplicates multiple submissions for the same problem ID (`contestId + index`).

### 3. CodeChef Profile Parser (`lib/apis/codechef.ts`)
Inspects the user's public profile page (`https://www.codechef.com/users/{username}`) with `cheerio` to extract recent activity and accepted solution records.

---

## 📂 Project Structure

```
coding-leaderboard/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── register/route.ts   # Registration & JWT cookie
│   │   │   ├── login/route.ts      # Authentication
│   │   │   ├── me/route.ts         # Current session info
│   │   │   └── logout/route.ts     # Cookie clear
│   │   ├── leaderboard/route.ts    # Ranked user list
│   │   ├── sync/route.ts           # Sync trigger for all or single user
│   │   └── profile/route.ts        # Handle updates
│   ├── login/page.tsx              # Sign In UI
│   ├── register/page.tsx           # Sign Up UI
│   ├── profile/page.tsx            # User handle manager
│   ├── globals.css                 # Dark theme & Tailwind styles
│   ├── layout.tsx                  # Root layout & Navigation
│   └── page.tsx                    # Main Leaderboard & Podium view
├── components/
│   ├── Navbar.tsx                  # Top navigation & user status
│   ├── Podium.tsx                  # Top 3 winners display
│   ├── LeaderboardTable.tsx        # Filterable & searchable table
│   └── PlatformBadge.tsx           # Platform tag indicators
├── lib/
│   ├── apis/
│   │   ├── leetcode.ts             # LeetCode GraphQL fetcher
│   │   ├── codeforces.ts           # Codeforces REST fetcher
│   │   ├── codechef.ts             # CodeChef parser
│   │   └── tracker.ts              # Timezone & batch aggregator
│   ├── auth.ts                     # Password hashing & JWT helpers
│   └── db.ts                       # Persistent file-based store
├── data/
│   └── db.json                     # Persistent user & stats storage
├── .env.local                      # Environment variables & timezone
├── package.json
└── tsconfig.json
```

