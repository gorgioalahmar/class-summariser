# 🎓 ClassSummariser (PRO)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-Design%20System-blueviolet.svg)](styles.css)
[![Privacy First](https://img.shields.io/badge/Privacy-100%25%20Offline-success.svg)](#privacy--architecture)

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

## 🚀 Live Demo & Presets

Try the app instantly by choosing one of the built-in lecture presets:
1. **Computer Science 301**: Distributed Systems & Raft Consensus Algorithm
2. **Biology 204**: Cellular Respiration, Citric Acid Cycle & ATP Synthase
3. **Economics 102**: Central Banking, Inflation Targeting & the Taylor Rule

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
├── README.md         # Documentation & guide
└── .gitignore        # Standard ignore file
```

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + Enter` / `Ctrl + Enter` | Summarise lecture dictation |
| `Space` | Flip interactive flashcard |
| `←` / `→` | Navigate previous / next flashcard |

---

## 💻 Local Quickstart

You don't need any package managers or compilers to run ClassSummariser. Simply open `index.html` in your browser:

```bash
# Clone the repository
git clone https://github.com/gorgioalahmar/class-summariser.git

# Enter project directory
cd class-summariser

# Open in browser (macOS)
open index.html

# Or serve via Python HTTP server:
python3 -m http.server 8080
```

Visit `http://localhost:8080` in your browser.

---

## 📄 License

MIT © [gorgioalahmar](https://github.com/gorgioalahmar)
