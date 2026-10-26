# 🎓 ClassSummariser (PRO)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Design%20System-blueviolet.svg)](styles.css)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline-success.svg)](#privacy--architecture)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-purple.svg)](manifest.json)

> **Turn raw class dictations, professor recordings, and messy lecture transcripts into structured study guides, key concepts, action items, and interactive 3D flashcards in seconds.**

---

## ⚡ What is ClassSummariser?

Students often end up with huge, disorganized blocks of speech-to-text dictation from lectures, recordings, or Zoom transcripts. **ClassSummariser** instantly distills raw transcripts into an actionable study dashboard:

- 📌 **Executive Summary & Thesis**: Isolates the main lecture objective and bulleted core takeaways.
- 💡 **Key Concept Glossary**: Discovers and defines technical vocabulary automatically.
- 📅 **Action Items & Exam Deadlines**: Automatically detects homework, upcoming tests, reading assignments, and Canvas submissions into interactive checkable tasks.
- 🃏 **Interactive 3D Study Flashcards**: Automatically transforms lecture takeaways into flip-cards with spaced-repetition controls.
- ⏱️ **Chronological Lecture Flow**: Organizes the progression of the class into structured phases.
- 🎙️ **Live Microphone Voice Dictation**: Dictate spoken lecture notes directly in real time using the browser's native Web Speech API.
- 🤔 **"Ask My Lecture" (Grounded Q&A)**: Ask questions about what the professor covered and receive direct excerpts from the transcript.
- 📥 **Export to Markdown & PDF**: One-click download as clean `.md` or print-optimized PDF study notes.

---

## 🚀 How to Open or Install the App (Step-by-Step Guide)

You can run ClassSummariser in whichever way suits your workflow: directly in your browser, installed as a standalone desktop/mobile app, or run completely offline on your computer.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CHOOSE YOUR SETUP PATH                          │
├───────────────────┬───────────────────────────┬────────────────────────┤
│  1. Web (Instant) │  2. Install as App (PWA)  │  3. Run Locally        │
│  Zero setup       │  Desktop / Phone app icon │  100% Offline via ZIP  │
└───────────────────┴───────────────────────────┴────────────────────────┘
```

---

### Method 1: Open Instantly in Your Web Browser (Zero Install)

The fastest way to use ClassSummariser without downloading anything:

1. **Click the live link**: Open [**https://gorgioalahmar.github.io/class-summariser/**](https://gorgioalahmar.github.io/class-summariser/) in any modern web browser (Google Chrome, Apple Safari, Microsoft Edge, or Mozilla Firefox).
2. **Choose or paste notes**:
   - Click one of the sample lecture buttons (e.g., **"💻 CS 301"**, **"🧬 BIO 204"**, or **"📈 ECON 102"**) for an immediate demonstration.
   - Or paste your own lecture transcript into the box, or click **"Live Mic"** to dictate speech in real-time.
3. **Generate Summary**: Click **"Summarise Class Dictation"** (or press <kbd>⌘ + Enter</kbd> / <kbd>Ctrl + Enter</kbd>).

---

### Method 2: Install as a Desktop App (Mac, Windows, Linux)

Install ClassSummariser as a standalone, distraction-free desktop app with its own launch icon in your macOS Dock or Windows Start Menu.

#### Using Google Chrome or Microsoft Edge:
1. Open [**https://gorgioalahmar.github.io/class-summariser/**](https://gorgioalahmar.github.io/class-summariser/) in Chrome or Edge.
2. In the right side of the address/URL bar, click the **Install** icon (looks like a monitor with an arrow ⊕ or a download icon).
   * *Alternative*: Click the browser menu (`⋮` or `...`) > **"Save and share"** > **"Install ClassSummariser PRO..."**.
3. In the popup prompt, click **Install**.
4. **Done!** ClassSummariser will now launch in its own dedicated window without browser tabs, and is permanently accessible from your **Mac Launchpad / Applications folder** or **Windows Start Menu**.

---

### Method 3: Install on Mobile (iPhone, iPad & Android)

Have ClassSummariser ready to record and summarise lectures on your phone or tablet:

#### On iPhone / iPad (Apple Safari):
1. Open [**https://gorgioalahmar.github.io/class-summariser/**](https://gorgioalahmar.github.io/class-summariser/) in **Safari**.
2. Tap the **Share button** at the bottom of the screen (the square with an upward arrow ⎋).
3. Scroll down the sharing options and tap **"Add to Home Screen"**.
4. Tap **Add** in the top-right corner.
5. **Done!** The ClassSummariser app icon will now appear on your home screen and open in full-screen mode just like a native iOS app.

#### On Android (Google Chrome):
1. Open [**https://gorgioalahmar.github.io/class-summariser/**](https://gorgioalahmar.github.io/class-summariser/) in **Chrome**.
2. Tap the three-dot menu icon `⋮` in the top-right corner.
3. Tap **"Install app"** or **"Add to Home screen"**.
4. Confirm by tapping **Install**.
5. **Done!** ClassSummariser is added to your app drawer and home screen.

---

### Method 4: Download & Run Locally on Your Computer (Offline)

If you prefer keeping the files on your local drive and running offline:

#### Option A: Download as ZIP (No Terminal Required)
1. Visit the repository page: [**https://github.com/gorgioalahmar/class-summariser**](https://github.com/gorgioalahmar/class-summariser).
2. Click the green **`<> Code`** button near the top right.
3. Select **Download ZIP** from the dropdown menu.
4. Locate the downloaded file (`class-summariser-main.zip`) in your Downloads folder and extract / unzip it.
5. Open the extracted folder and **double-click `index.html`**. It will open instantly in your default web browser—no internet connection or server required!

#### Option B: Clone via Git Terminal
Open your terminal (Terminal on macOS/Linux, or PowerShell / Command Prompt on Windows) and run:

```bash
# 1. Clone the repository
git clone https://github.com/gorgioalahmar/class-summariser.git

# 2. Navigate into the project directory
cd class-summariser

# 3. Open index.html directly:
# On macOS:
open index.html

# On Windows:
start index.html

# On Linux:
xdg-open index.html
```

#### Option C: Run with a Local Lightweight Dev Server (Optional)
If you prefer running through `localhost`:

```bash
# Using Python 3 (pre-installed on macOS and most Linux distros):
python3 -m http.server 3000

# Then open in your browser:
# http://localhost:3000
```

---

## 🛠️ Architecture & Privacy

ClassSummariser is built with a **Privacy-First, Zero-Dependency** philosophy:
- **Offline NLP Engine**: Uses graph-scored sentence weighting, positional saliency, and linguistic markers directly in your browser. Your voice recordings and transcripts **never leave your device**.
- **Optional Cloud AI**: If you want generative narrative synthesis, you can plug in your own Google Gemini API key in Settings (`gemini-1.5-flash` / `gemini-2.0-flash`). Keys are kept strictly in browser `localStorage`.
- **Pure Vanilla Web Tech**: Pure HTML5, Modern Vanilla CSS3 with CSS variables & glassmorphism, and modular ES6 JavaScript. No hefty framework bloat or node build requirements.

---

## 📂 Project Structure

```text
class-summariser/
├── index.html        # Semantic HTML5 application shell & accessible dashboard tabs
├── styles.css        # Premium design system: dark/light theme, glassmorphism & 3D cards
├── app.js            # Offline NLP pipeline, Web Speech API dictation & UI controller
├── manifest.json     # PWA manifest for desktop & mobile installation
├── icon.svg          # High-resolution vector application icon
├── README.md         # Documentation & comprehensive installation guide
└── .gitignore        # Git ignore specifications
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + Enter` / `Ctrl + Enter` | Summarise lecture dictation |
| `Space` | Flip interactive flashcard |
| `←` / `→` | Navigate previous / next flashcard |

---

## 📄 License

MIT © [gorgioalahmar](https://github.com/gorgioalahmar)
