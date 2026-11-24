# Cybersecurity Attack Detector
### CSC205 – Theory of Automata | Course Project | Spring 2026

A DFA-based cybersecurity attack detection tool that identifies 11 types of cyberattacks
using Deterministic Finite Automata. Built with a Python/Flask backend and a React frontend.

---

## Project Structure

```
cybersecurity-attack-detector/
├── backend/
│   ├── app.py                  # Flask API server (POST /scan endpoint)
│   ├── dfa.py                  # Core DFA class (states, transitions, run)
│   ├── classifier.py           # Master classifier — runs all 11 DFAs
│   ├── visualizer.py           # Tkinter DFA animation (standalone)
│   └── attacks/
│       ├── xss.py              # XSS DFA
│       ├── sql_injection.py    # SQL Injection DFA (10 variants)
│       ├── command_injection.py
│       ├── traversal.py        # Directory Traversal DFA
│       ├── bruteforce.py       # Brute Force DFA
│       ├── phishing.py         # Phishing URL DFA
│       ├── csrf.py             # CSRF DFA
│       ├── buffer_overflow.py  # Buffer Overflow DFA
│       ├── dns_spoofing.py     # DNS Spoofing DFA
│       ├── session_hijacking.py
│       └── xml_injection.py    # XML Injection DFA
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx     # Landing page
│   │   │   └── Home.jsx        # Main scanner page
│   │   └── components/
│   │       ├── Scanner.jsx     # Input + attack payload chips
│   │       ├── DFAVisualizer.jsx # Animated state transition graph
│   │       ├── ResultCard.jsx  # Attack type + details display
│   │       ├── AttackHistory.jsx # Session scan history
│   │       ├── StatsPanel.jsx  # Safe vs threat counters
│   │       ├── Header.jsx
│   │       ├── About.jsx
│   │       └── ThemeToggle.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## Attack Types Detected

| # | Attack | Detection Method |
|---|--------|-----------------|
| 1 | XSS (Cross-Site Scripting) | DFA — detects `<script>` tag sequence |
| 2 | SQL Injection (10 variants) | DFA — Classic, UNION, Boolean, Time-Based, Error, Stacked, Tautology, OOB, Hex, Comment |
| 3 | Command Injection | DFA — detects `;` followed by shell commands |
| 4 | Directory Traversal | DFA — detects `../../` path patterns |
| 5 | Brute Force | DFA — detects 5+ consecutive failed login attempts (FFFFF) |
| 6 | Phishing | DFA — detects lookalike domain substitutions (e.g. paypa1.com) |
| 7 | CSRF | DFA — detects `transfer?amount=` pattern |
| 8 | Buffer Overflow | DFA — flags input length > 100 characters |
| 9 | DNS Spoofing | DFA — detects `domain → fake IP` pattern |
| 10 | Session Hijacking | DFA — detects duplicate session tokens |
| 11 | XML Injection | DFA — detects injected XML tags like `<role>` |

---

## Requirements

### Backend
- Python 3.8+
- Flask
- flask-cors

Install dependencies:
```bash
pip install flask flask-cors
```

### Frontend
- Node.js 18+
- npm

---

## How to Run

### Step 1 — Start the Backend

```bash
cd backend
python app.py
```

The Flask server will start at `http://localhost:5000`

### Step 2 — Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The React app will open at `http://localhost:5173`

### Step 3 — Use the App

1. Open `http://localhost:5173` in your browser
2. Type any input in the scanner box, or click one of the attack payload chips
3. Click **Scan** — the result card will show the detected attack type
4. The DFA Visualizer will animate the state path taken through the automaton
5. View scan history and stats in the right panel

---

## Standalone DFA Visualizer (Tkinter)

To run the standalone Python DFA animation without the web interface:

```bash
cd backend
python visualizer.py
```

Click **Start Animation** to watch the XSS DFA step through states q0 → q8.

---

## How It Works

1. User input is sent via POST to `/scan` on the Flask backend
2. `classifier.py` runs the input through all 11 DFAs in priority order
3. The matching DFA returns the attack label and the full state path taken
4. The backend responds with: `attack_type`, `method` (DFA), `pattern`, and `path`
5. The frontend renders the state path as an animated graph in the DFA Visualizer

---

## Automata Concepts Applied

- **DFA (Deterministic Finite Automaton):** Each attack detector is a formally defined DFA with states (Q), alphabet (Σ), transition function (δ), start state (q₀), and accept states (F)
- **Language Acceptance:** An input is classified as an attack if and only if the DFA reaches an accept state
- **Formal Language Theory:** Each attack type defines a formal language; the DFA decides membership in that language

---

## Tools & Technologies

- **Python 3** — DFA logic and backend
- **Flask** — REST API
- **React + Vite** — Frontend UI
- **Tkinter** — Standalone DFA animation
