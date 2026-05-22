# SprintPow

**AI Sprint Planning Assistant powered by MiMo v2.5 Pro**

SprintPow is an intelligent sprint planning tool that leverages AI to analyze your backlog, estimate story points, identify dependencies, flag blockers, and optimize sprint allocation. Built with Next.js 16, TypeScript, and Tailwind CSS v4.

---

## Features

- **AI-Powered Estimation** -- MiMo v2.5 Pro analyzes backlog items and provides accurate Fibonacci-based story point estimates
- **Dependency Detection** -- Automatically identifies task dependencies and potential blockers before sprint begins
- **Capacity Optimization** -- Calculates realistic sprint capacity based on team size, sprint duration, and historical velocity
- **Interactive Kanban Board** -- 4-column board (Backlog, Sprint, In Progress, Done) with drag-and-drop and click-to-move
- **Real-time AI Streaming** -- SSE-based streaming shows MiMo's reasoning process in real-time
- **Team Configuration** -- Adjustable parameters for developers, sprint days, hours/day, and velocity factor
- **Manual Task Management** -- Add tasks manually or via AI analysis, with full status management

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Icons | lucide-react |
| AI Engine | MiMo v2.5 Pro (Xiaomi) |
| Streaming | Server-Sent Events (SSE) |

---

## Architecture

```
sprintpow/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with Inter font
│   │   ├── globals.css         # Global styles, Tailwind v4 theme
│   │   ├── page.tsx            # Landing page
│   │   ├── workspace/
│   │   │   └── page.tsx        # Main workspace (sidebar + kanban)
│   │   └── api/
│   │       └── mimo/
│   │           └── route.ts    # MiMo API proxy with SSE streaming
│   ├── components/
│   │   ├── Sidebar.tsx         # Sprint info + capacity settings
│   │   ├── BacklogInput.tsx    # Textarea for backlog items
│   │   ├── AnalysisPanel.tsx   # AI analysis results display
│   │   ├── KanbanBoard.tsx     # 4-column kanban grid
│   │   └── TaskCard.tsx        # Individual task card
│   ├── hooks/
│   │   └── useMimoAnalysis.ts  # Custom hook for AI streaming
│   └── lib/
│       └── types.ts            # TypeScript types + utilities
├── .env.example                # Environment variable template
├── .env.local                  # Local env (git-ignored)
├── next.config.ts              # Next.js configuration
├── tsconfig.json               # TypeScript configuration
├── postcss.config.mjs          # PostCSS + Tailwind v4
├── package.json
└── README.md
```

---

## Setup

### Prerequisites

- Node.js 18+
- npm 9+
- A MiMo API key from [Xiaomi MiMo](https://xiaomimimo.com)

### Installation

```bash
git clone <repository-url>
cd sprintpow
npm install
```

### Environment Variables

Copy the example env file and add your API key:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MIMO_API_KEY=your_mimo_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `MIMO_API_KEY` | Yes | API key for MiMo v2.5 Pro authentication |

---

## How It Works

1. **Paste Backlog** -- Enter your user stories and backlog items in the textarea (one per line)
2. **Configure Capacity** -- Set team size, sprint days, hours per day, and velocity factor in the sidebar
3. **Analyze with MiMo** -- Click "Analyze with MiMo" to send your backlog to the AI
4. **Review Results** -- View story point estimates, dependency graphs, warnings, and recommendations
5. **Manage Kanban** -- Move tasks between Backlog, Sprint, In Progress, and Done columns

### Capacity Formula

```
Capacity = Developers x Sprint Days x Hours/Day x Velocity Factor / 4
```

Each story point roughly equals 4 hours of focused work. The velocity factor (0.1 to 1.0) accounts for meetings, code reviews, and other overhead.

---

## MiMo Integration

SprintPow integrates with Xiaomi's MiMo v2.5 Pro model via a server-side API proxy at `/api/mimo`. The integration:

- Uses `api-key` header authentication (not Bearer token)
- Streams responses via Server-Sent Events
- Prioritizes `reasoning_content` field (MiMo's primary output) over `content`
- Provides a structured system prompt that instructs MiMo to output parseable JSON

---

## Screenshots

> _Screenshots to be added_

- Landing page hero section
- Workspace with sidebar, backlog input, and kanban board
- AI analysis panel with streaming results
- Dependency graph visualization

---

## License

MIT License

Copyright (c) 2025 SprintPow

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
