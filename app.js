/**
 * ClassSummariser — Core Application Engine
 * High-accuracy offline NLP lecture summarization, speech dictation, 
 * flashcard generation, action-item extraction, and optional Gemini AI synthesis.
 */

(() => {
  'use strict';

  // --- Sample Lecture Transcripts ---
  const SAMPLE_LECTURES = {
    cs: {
      topic: "Computer Science 301",
      title: "Distributed Systems & Raft Consensus",
      text: `Good morning everyone. Today we are diving into consensus in distributed systems, specifically the Raft consensus algorithm. In a distributed cluster of nodes, machines will fail, networks will partition, yet the system must maintain a consistent state machine across all replicas.

Before Raft, Paxos was the gold standard, but Paxos was notoriously difficult to understand and implement in production. Diego Ongaro and John Ousterhout designed Raft specifically for understandability. Raft decomposes consensus into three independent sub-problems: Leader Election, Log Replication, and Safety.

Let's examine Leader Election first. At any time, each node is in one of three states: Leader, Follower, or Candidate. Followers only respond to incoming RPCs. If a follower hears nothing from a leader within its randomized election timeout—typically between 150ms and 300ms—it transitions to Candidate, increments its current term, votes for itself, and broadcasts RequestVote RPCs to all other cluster nodes.

If the candidate receives votes from a majority of nodes, it becomes the new Leader. Why randomized election timeouts? Because they effectively prevent split votes where multiple candidates split the quorum simultaneously.

Once elected, the leader handles all client write requests through Log Replication. The leader appends the client command to its log and sends AppendEntries RPCs to all followers. Once a log entry is replicated across a majority of nodes, it is committed. The leader then applies the command to its state machine and returns the result to the client.

Safety ensures that if any server applies an entry at a given index, no other server will ever apply a different entry for that index. This guarantees state machine safety.

Now, for administrative announcements: Homework 4 on distributed RPCs is due this Friday by 11:59 PM on Canvas. Also, remember our Midterm Exam is scheduled for Thursday, November 12th in Hall B. Please make sure to read Chapter 6 of Designing Data-Intensive Applications before our next seminar on Monday.`
    },
    bio: {
      topic: "Biology 204",
      title: "Cellular Respiration & ATP Synthase",
      text: `Welcome back to Molecular Biology. Today we are exploring cellular respiration—the catabolic pathway that cells use to extract chemical energy from glucose to synthesize ATP, the universal energy currency of life.

The complete aerobic breakdown of glucose occurs in four main stages: Glycolysis, the Pyruvate Dehydrogenase complex, the Citric Acid Cycle, and Oxidative Phosphorylation.

Glycolysis takes place in the cytoplasm and requires no oxygen. Here, a six-carbon glucose molecule is cleaved into two three-carbon pyruvate molecules, yielding a net gain of 2 ATP through substrate-level phosphorylation and 2 NADH reducing equivalents.

Next, pyruvate is transported across the inner mitochondrial membrane into the matrix. The pyruvate dehydrogenase complex decarboxylates pyruvate into acetyl-CoA, producing another NADH and releasing carbon dioxide.

In the mitochondrial matrix, acetyl-CoA enters the Citric Acid Cycle, also known as the Krebs cycle. Over a cyclic series of enzymatic reactions, the remaining carbon atoms are completely oxidized to CO2. Per glucose, the Krebs cycle generates 2 ATP (or GTP), 6 NADH, and 2 FADH2.

The final and most productive stage is Oxidative Phosphorylation. Here, NADH and FADH2 donate high-energy electrons to the Electron Transport Chain embedded in the cristae of the inner mitochondrial membrane. As electrons cascade down Complexes I through IV to molecular oxygen (the terminal electron acceptor, forming water), protons (H+) are pumped from the matrix into the intermembrane space.

This creates a steep electrochemical proton gradient. Peter Mitchell formulated the Chemiosmotic Hypothesis to explain this. Protons can only flow back into the matrix through a magnificent molecular rotary motor: ATP Synthase. As protons pass through the F0 rotor, the F1 catalytic head rotates and condenses ADP and inorganic phosphate into ATP. This produces approximately 26 to 28 additional ATP per glucose molecule.

Important reminder: Your Cell Metabolism Lab Reports must be submitted by next Tuesday at 5:00 PM. The pre-lab quiz on mitochondrial fractionation opens on Friday.`
    },
    econ: {
      topic: "Economics 102",
      title: "Central Banking & Monetary Policy",
      text: `Good afternoon class. In this lecture, we examine monetary policy and how central banks manage inflation, interest rates, and economic stability. In the United States, the Federal Reserve operates under a statutory dual mandate: maximum sustainable employment and price stability, usually defined as a 2 percent annualized target for Core Personal Consumption Expenditures (PCE).

The central bank controls the supply of credit primarily through the target range for the Federal Funds Rate. This is the overnight interest rate at which depository institutions lend reserve balances to one another on an uncollateralized basis.

When aggregate demand overheats and inflation accelerates above target, the Federal Open Market Committee (FOMC) implements contractionary monetary policy. By raising the policy rate, borrowing costs for mortgages, auto loans, and corporate debt rise. This cools consumer spending and business investment, dampening price pressures.

Conversely, during an economic recession or liquidity crisis, the central bank shifts to expansionary monetary policy by lowering interest rates toward the zero lower bound to stimulate lending and capital expenditure.

When conventional interest rate cuts reach the zero lower bound, central banks deploy unconventional tools, primarily Quantitative Easing (QE). In Quantitative Easing, the central bank conducts large-scale purchases of long-term government bonds and mortgage-backed securities to inject liquidity directly into the commercial banking system and suppress long-term borrowing yields.

Another crucial framework is the Taylor Rule, which prescribes how the nominal policy rate should adjust in response to deviations of inflation from target and actual GDP from potential GDP output.

Please note your assignments: Problem Set 3 on open market operations is due on Monday morning before class. Also, your midterm research briefs on yield curve inversions are due in three weeks on November 18th. Read chapters 14 through 16 in the textbook for Wednesday.`
    }
  };

  // --- Stopwords for Key Concept Extraction ---
  const STOPWORDS = new Set([
    "a","about","above","after","again","against","all","am","an","and","any","are","aren't","as","at","be","because","been",
    "before","being","below","between","both","but","by","can't","cannot","could","couldn't","did","didn't","do","does","doesn't",
    "doing","don't","down","during","each","few","for","from","further","had","hadn't","has","hasn't","have","haven't","having",
    "he","he'd","he'll","he's","her","here","here's","hers","herself","him","himself","his","how","how's","i","i'd","i'll","i'm",
    "i've","if","in","into","is","isn't","it","it's","its","itself","let's","me","more","most","mustn't","my","myself","no","nor",
    "not","of","off","on","once","only","or","other","ought","our","ours","ourselves","out","over","own","same","shan't","she",
    "she'd","she'll","she's","should","shouldn't","so","some","such","than","that","that's","the","their","theirs","them",
    "themselves","then","there","there's","these","they","they'd","they'll","they're","they've","this","those","through","to","too",
    "under","until","up","very","was","wasn't","we","we'd","we'll","we're","we've","were","weren't","what","what's","when","when's",
    "where","where's","which","while","who","who's","whom","why","why's","with","won't","would","wouldn't","you","you'd","you'll",
    "you're","you've","your","yours","yourself","yourselves","good","morning","afternoon","welcome","today","dive","diving","examining",
    "explore","exploring","everyone","class","lecture","chapter","chapters","please","also","let's","make","sure","examine"
  ]);

  // --- Importance Indicator Phrases ---
  const IMPORTANCE_WEIGHTS = [
    { pattern: /\b(key|fundamental|crucial|essential|vital|pivotal|critical)\b/i, weight: 3.5 },
    { pattern: /\b(defined as|refers to|meaning of|is when|is where)\b/i, weight: 3.0 },
    { pattern: /\b(remember|note that|pay attention|important to|takeaway)\b/i, weight: 2.8 },
    { pattern: /\b(first|second|third|finally|sub-problem|stages|phases)\b/i, weight: 2.0 },
    { pattern: /\b(guarantees|ensures|requires|produces|creates|results in)\b/i, weight: 2.2 },
    { pattern: /\b(due|exam|midterm|quiz|homework|assignment|canvas|test)\b/i, weight: 2.5 }
  ];

  // --- State ---
  let appState = {
    theme: localStorage.getItem('cs_theme') || 'dark',
    engine: localStorage.getItem('cs_engine') || 'offline',
    geminiKey: localStorage.getItem('cs_gemini_key') || '',
    activeTab: 'tab-overview',
    flashcards: [],
    currentCardIndex: 0,
    actionItems: [],
    currentSummaryData: null,
    isRecording: false,
    recognition: null
  };

  // --- DOM Elements ---
  const el = {
    themeToggle: document.getElementById('theme-toggle'),
    btnSettings: document.getElementById('btn-settings'),
    aiStatusIndicator: document.getElementById('ai-status-indicator'),
    settingsModal: document.getElementById('settings-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnSaveSettings: document.getElementById('btn-save-settings'),
    geminiKeySection: document.getElementById('gemini-key-section'),
    geminiApiKeyInput: document.getElementById('gemini-api-key'),

    // Input elements
    transcriptInput: document.getElementById('transcript-input'),
    wordCount: document.getElementById('word-count'),
    charCount: document.getElementById('char-count'),
    spokenTime: document.getElementById('spoken-time'),
    btnPaste: document.getElementById('btn-paste-clip'),
    btnUpload: document.getElementById('btn-upload-file'),
    fileInput: document.getElementById('file-input'),
    btnLiveMic: document.getElementById('btn-live-mic'),
    micBtnText: document.getElementById('mic-btn-text'),
    recordingIndicator: document.getElementById('recording-indicator'),
    btnClearText: document.getElementById('btn-clear-text'),
    depthSelector: document.getElementById('depth-selector'),
    btnSummarise: document.getElementById('btn-summarise'),

    // Checkboxes
    optKeyConcepts: document.getElementById('opt-key-concepts'),
    optActionItems: document.getElementById('opt-action-items'),
    optFlashcards: document.getElementById('opt-flashcards'),
    optGlossary: document.getElementById('opt-glossary'),

    // Output stats & states
    emptyState: document.getElementById('empty-state'),
    loadingState: document.getElementById('loading-state'),
    loadingStatusText: document.getElementById('loading-status-text'),
    progressBarFill: document.getElementById('progress-bar-fill'),
    dashboardResults: document.getElementById('dashboard-results'),

    statWordsCondensed: document.getElementById('stat-words-condensed'),
    statReadTime: document.getElementById('stat-read-time'),
    statConceptsCount: document.getElementById('stat-concepts-count'),
    statTasksCount: document.getElementById('stat-tasks-count'),
    badgeActionsCount: document.getElementById('badge-actions-count'),

    // Dashboard tabs
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),

    // Content containers
    lectureTopicBadge: document.getElementById('lecture-topic-badge'),
    lectureTitleDisplay: document.getElementById('lecture-title-display'),
    lectureThesisDisplay: document.getElementById('lecture-thesis-display'),
    takeawaysContainer: document.getElementById('takeaways-container'),
    proseNotesContainer: document.getElementById('prose-notes-container'),
    definitionsContainer: document.getElementById('definitions-container'),
    actionItemsContainer: document.getElementById('action-items-container'),
    tasksProgressBadge: document.getElementById('tasks-progress-badge'),
    timelineContainer: document.getElementById('timeline-container'),

    // Flashcard controls
    flashcardElement: document.getElementById('flashcard-element'),
    fcQuestionText: document.getElementById('fc-question-text'),
    fcAnswerText: document.getElementById('fc-answer-text'),
    flashcardCounter: document.getElementById('flashcard-counter'),
    btnFcPrev: document.getElementById('btn-fc-prev'),
    btnFcNext: document.getElementById('btn-fc-next'),
    btnFcFlip: document.getElementById('btn-fc-flip'),
    fcGridOverview: document.getElementById('flashcards-grid-overview'),

    // Action buttons
    btnCopySummary: document.getElementById('btn-copy-summary'),
    btnExportMd: document.getElementById('btn-export-md'),
    btnPrint: document.getElementById('btn-print'),
    filterSummaryInput: document.getElementById('filter-summary-input'),

    // Q&A
    qaInput: document.getElementById('qa-question-input'),
    btnQaAsk: document.getElementById('btn-qa-ask'),
    qaAnswerBox: document.getElementById('qa-answer-box'),
    qaAnswerText: document.getElementById('qa-answer-text'),
    btnCloseQa: document.getElementById('btn-close-qa'),

    // Toast
    toastContainer: document.getElementById('toast-container')
  };

  // --- Initialization ---
  function init() {
    applyTheme(appState.theme);
    updateEngineIndicator();
    setupEventListeners();
    setupSpeechRecognition();
    updateInputStats();
  }

  // --- Theme Handling ---
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    appState.theme = theme;
    localStorage.setItem('cs_theme', theme);
  }

  function toggleTheme() {
    const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  }

  // --- Toast Notifications ---
  function showToast(message, icon = '✨') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }

  // --- Input Metadata Calculation ---
  function updateInputStats() {
    const text = el.transcriptInput.value.trim();
    if (!text) {
      el.wordCount.textContent = '0 words';
      el.charCount.textContent = '0 characters';
      el.spokenTime.textContent = '~0m lecture time';
      return;
    }
    const words = text.match(/\b\S+\b/g) || [];
    const count = words.length;
    el.wordCount.textContent = `${count.toLocaleString()} words`;
    el.charCount.textContent = `${text.length.toLocaleString()} characters`;
    // Standard human lecture speech pace: ~140 words per minute
    const minutes = Math.ceil(count / 140);
    el.spokenTime.textContent = `~${minutes}m lecture duration`;
  }

  // --- Offline NLP Summarizer Algorithm ---
  function cleanTranscript(rawText) {
    // Strip common VTT/SRT subtitles timestamp lines if present (e.g. 00:01:23.400 --> 00:01:26.000)
    return rawText
      .replace(/\d{2}:\d{2}:\d{2}[\.,]\d{3}\s*-->\s*\d{2}:\d{2}:\d{2}[\.,]\d{3}/g, '')
      .replace(/^\d+\s*$/gm, '')
      .replace(/WEBVTT/g, '')
      .replace(/\r\n/g, '\n')
      .trim();
  }

  function splitIntoSentences(text) {
    // Split sentences respecting abbreviations
    const cleaned = text.replace(/([.?!])\s*(?=[A-Z0-9"'])/g, '$1|__SPLIT__|');
    return cleaned
      .split('|__SPLIT__|')
      .map(s => s.trim())
      .filter(s => s.length > 20);
  }

  function tokenizeWords(sentence) {
    return (sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [])
      .filter(w => !STOPWORDS.has(w));
  }

  function processLectureOffline(rawText, depthLevel) {
    const text = cleanTranscript(rawText);
    const sentences = splitIntoSentences(text);
    if (sentences.length === 0) {
      throw new Error('Please enter a longer lecture dictation to generate meaningful notes.');
    }

    // 1. Calculate word frequencies (TF)
    const wordFreq = {};
    let totalSignificantWords = 0;
    sentences.forEach(s => {
      const tokens = tokenizeWords(s);
      tokens.forEach(w => {
        wordFreq[w] = (wordFreq[w] || 0) + 1;
        totalSignificantWords++;
      });
    });

    // 2. Score sentences with keyword density & positional + marker weights
    const scoredSentences = sentences.map((sentence, index) => {
      const tokens = tokenizeWords(sentence);
      let score = 0;
      tokens.forEach(w => {
        score += (wordFreq[w] || 1);
      });
      // Normalize by sentence length
      score = tokens.length > 0 ? score / Math.sqrt(tokens.length) : 0;

      // Position bias: first 15% and final 15% sentences frequently state thesis / deadlines
      const posRatio = index / sentences.length;
      if (posRatio < 0.15 || posRatio > 0.85) {
        score *= 1.35;
      }

      // Check importance indicators
      IMPORTANCE_WEIGHTS.forEach(({ pattern, weight }) => {
        if (pattern.test(sentence)) {
          score *= weight;
        }
      });

      return { sentence, index, score };
    });

    // 3. Select top sentences based on requested depth
    let countToSelect = 4;
    if (depthLevel === 'standard') countToSelect = Math.max(6, Math.min(10, Math.floor(sentences.length * 0.45)));
    if (depthLevel === 'comprehensive') countToSelect = Math.max(10, Math.min(18, Math.floor(sentences.length * 0.7)));

    // Sort by score to get top items
    const topScored = [...scoredSentences]
      .sort((a, b) => b.score - a.score)
      .slice(0, countToSelect);

    // Re-sort back to chronological order for readability
    topScored.sort((a, b) => a.index - b.index);

    // 4. Extract Key Concepts & Definitions
    const definitions = [];
    const defPatterns = [
      /\b([A-Z][a-zA-Z\s]{2,25})\s+(?:is defined as|refers to|is a|represents|acts as)\s+([^.]+)/i,
      /\b(?:The concept of|In)\s+([A-Z][a-zA-Z\s]{2,20})\s*[,:]\s*([^.]+)/i,
      /\b([A-Z][a-zA-Z0-9\s-]{2,20})\s*:\s*([^.]+)/
    ];

    sentences.forEach(s => {
      defPatterns.forEach(pat => {
        const match = s.match(pat);
        if (match && match[1] && match[2]) {
          const term = match[1].trim();
          const meaning = match[2].trim();
          if (term.length > 2 && term.length < 35 && !definitions.some(d => d.term.toLowerCase() === term.toLowerCase())) {
            definitions.push({ term, meaning: `${meaning}.` });
          }
        }
      });
    });

    // Fallback: if no regex pattern matched, pick top 3 most salient technical words
    if (definitions.length < 2) {
      const sortedKeywords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .filter(([w]) => w.length > 4)
        .slice(0, 4);

      sortedKeywords.forEach(([kw]) => {
        const sentenceWithKw = sentences.find(s => s.toLowerCase().includes(kw));
        if (sentenceWithKw && !definitions.some(d => d.term.toLowerCase() === kw)) {
          definitions.push({
            term: kw.charAt(0).toUpperCase() + kw.slice(1),
            meaning: sentenceWithKw
          });
        }
      });
    }

    // 5. Extract Action Items, Deadlines & Homework
    const actionItems = [];
    const actionRegex = /\b(homework|assignment|due|exam|midterm|canvas|submit|quiz|read chapter|problem set|lab report)\b/i;
    sentences.forEach(s => {
      if (actionRegex.test(s)) {
        let tag = 'assignment';
        if (/exam|midterm|quiz/i.test(s)) tag = 'deadline';
        else if (/read|reading|chapter/i.test(s)) tag = 'reading';

        actionItems.push({
          id: 'task_' + Math.random().toString(36).substring(2, 9),
          text: s,
          tag,
          completed: false
        });
      }
    });

    // 6. Generate Interactive Flashcards
    const flashcards = [];
    // From definitions
    definitions.forEach(def => {
      flashcards.push({
        question: `What is the significance or definition of ${def.term}?`,
        answer: def.meaning
      });
    });

    // From key high-scoring sentences
    topScored.forEach(item => {
      if (flashcards.length < 6 && item.sentence.length > 40) {
        // Formulate a conceptual recall question
        const words = tokenizeWords(item.sentence);
        const focusWord = words[0] || 'this concept';
        flashcards.push({
          question: `Key Takeaway: Explain the mechanism behind "${item.sentence.slice(0, 50)}..."?`,
          answer: item.sentence
        });
      }
    });

    // 7. Chronological Lecture Flow / Timeline
    const timeline = [];
    const stepCount = Math.min(5, Math.max(3, Math.floor(sentences.length / 3)));
    const chunkSize = Math.ceil(sentences.length / stepCount);
    for (let i = 0; i < stepCount; i++) {
      const chunk = sentences.slice(i * chunkSize, (i + 1) * chunkSize);
      if (chunk.length > 0) {
        const firstSentence = chunk[0];
        const titleWords = tokenizeWords(chunk.join(' ')).slice(0, 3).map(w => w.toUpperCase()).join(' & ');
        timeline.push({
          phase: `Phase ${i + 1} (${Math.round((i / stepCount) * 100)}% - ${Math.round(((i + 1) / stepCount) * 100)}%)`,
          title: titleWords || `Lecture Topic Part ${i + 1}`,
          description: firstSentence
        });
      }
    }

    // 8. Thesis and title derivation
    const titleCandidates = sentences[0] || "Synthesized Lecture Discussion";
    const topKeywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));

    return {
      title: topKeywords.length > 0 ? `${topKeywords.join(' • ')} Lecture Notes` : "Lecture Notes",
      topic: topKeywords[0] ? `Field: ${topKeywords[0]}` : "Class Summary",
      thesis: sentences[0] || "Overview of class discussion.",
      takeaways: topScored.map(s => s.sentence),
      definitions,
      actionItems,
      flashcards: flashcards.slice(0, 8),
      timeline,
      originalWordCount: text.match(/\b\S+\b/g)?.length || 0,
      summaryWordCount: topScored.map(s => s.sentence).join(' ').match(/\b\S+\b/g)?.length || 0
    };
  }

  // --- Optional Gemini AI Cloud Call ---
  async function callGeminiApi(promptText, apiKey) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an elite academic tutor. Analyze this lecture dictation and return a strictly formatted JSON object with no markdown backticks.
            Dictation: """${promptText}"""

            Format:
            {
              "title": "Short descriptive lecture title",
              "topic": "Academic subject / domain",
              "thesis": "1-2 sentence core thesis of the class",
              "takeaways": ["4-6 high-impact takeaway bullet sentences"],
              "definitions": [{"term": "concept name", "meaning": "clear definition"}],
              "actionItems": [{"text": "assignment or deadline description", "tag": "assignment|deadline|reading"}],
              "flashcards": [{"question": "concise study question", "answer": "precise explanation"}],
              "timeline": [{"phase": "Stage name", "title": "Section topic", "description": "Key development"}]
            }`
          }]
        }]
      })
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error?.message || 'Gemini API call failed');
    }

    const data = await response.json();
    let rawResult = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
    rawResult = rawResult.replace(/^```json/m, '').replace(/^```/m, '').replace(/```$/m, '').trim();
    const parsed = JSON.parse(rawResult);

    // Compute metrics
    const origWords = promptText.match(/\b\S+\b/g)?.length || 0;
    const summaryWords = (parsed.takeaways?.join(' ') || '').match(/\b\S+\b/g)?.length || 0;

    return {
      ...parsed,
      originalWordCount: origWords,
      summaryWordCount: summaryWords
    };
  }

  // --- Rendering UI Results ---
  function renderDashboard(data) {
    appState.currentSummaryData = data;
    appState.flashcards = data.flashcards || [];
    appState.currentCardIndex = 0;
    appState.actionItems = (data.actionItems || []).map(item => ({
      ...item,
      id: item.id || 'task_' + Math.random().toString(36).substring(2, 9),
      completed: false
    }));

    // 1. Stats Bar
    const orig = data.originalWordCount || 1;
    const condensed = data.summaryWordCount || 1;
    const reductionPercent = Math.max(10, Math.round(((orig - condensed) / orig) * 100));
    el.statWordsCondensed.textContent = `${reductionPercent}%`;
    const readMinutes = Math.max(1, Math.ceil(condensed / 200));
    el.statReadTime.textContent = `${readMinutes} min`;
    el.statConceptsCount.textContent = (data.definitions?.length || 0).toString();
    el.statTasksCount.textContent = appState.actionItems.length.toString();
    el.badgeActionsCount.textContent = appState.actionItems.length.toString();

    // 2. Overview Tab
    el.lectureTopicBadge.textContent = data.topic || 'General Lecture';
    el.lectureTitleDisplay.textContent = data.title || 'Class Synthesis';
    el.lectureThesisDisplay.textContent = data.thesis || '';

    // Takeaways
    el.takeawaysContainer.innerHTML = '';
    (data.takeaways || []).forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'takeaway-card';
      card.innerHTML = `
        <div class="takeaway-num">${idx + 1}</div>
        <div class="takeaway-text">${escapeHtml(item)}</div>
      `;
      el.takeawaysContainer.appendChild(card);
    });

    // Prose notes
    el.proseNotesContainer.innerHTML = (data.takeaways || [])
      .map(t => `<p>• ${escapeHtml(t)}</p>`)
      .join('');

    // 3. Definitions & Concepts Tab
    el.definitionsContainer.innerHTML = '';
    if (!data.definitions || data.definitions.length === 0) {
      el.definitionsContainer.innerHTML = '<p class="text-muted">No explicit glossary definitions identified in this transcript segment.</p>';
    } else {
      data.definitions.forEach(def => {
        const defCard = document.createElement('div');
        defCard.className = 'def-card';
        defCard.innerHTML = `
          <div class="def-term">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            ${escapeHtml(def.term)}
          </div>
          <div class="def-meaning">${escapeHtml(def.meaning)}</div>
        `;
        el.definitionsContainer.appendChild(defCard);
      });
    }

    // 4. Action Items & Deadlines
    renderActionItems();

    // 5. Flashcards
    renderFlashcard(0);
    renderFlashcardThumbnails();

    // 6. Chronological Flow
    el.timelineContainer.innerHTML = '';
    (data.timeline || []).forEach(step => {
      const stepEl = document.createElement('div');
      stepEl.className = 'timeline-step';
      stepEl.innerHTML = `
        <div class="timeline-node"></div>
        <div class="timeline-time">${escapeHtml(step.phase)}</div>
        <div class="timeline-title">${escapeHtml(step.title)}</div>
        <div class="timeline-desc">${escapeHtml(step.description)}</div>
      `;
      el.timelineContainer.appendChild(stepEl);
    });

    // Enable Q&A input
    el.qaInput.disabled = false;
    el.btnQaAsk.disabled = false;
    el.qaInput.placeholder = `Ask a question about "${data.title}"...`;

    // Switch views
    el.emptyState.classList.add('hidden');
    el.loadingState.classList.add('hidden');
    el.dashboardResults.classList.remove('hidden');

    showToast('Lecture summary ready!', '🚀');
  }

  function renderActionItems() {
    el.actionItemsContainer.innerHTML = '';
    if (appState.actionItems.length === 0) {
      el.actionItemsContainer.innerHTML = '<p class="text-muted">No homework or deadlines detected in this lecture snippet.</p>';
      el.tasksProgressBadge.textContent = '0 / 0 Completed';
      return;
    }

    let completedCount = 0;
    appState.actionItems.forEach(item => {
      if (item.completed) completedCount++;

      const row = document.createElement('div');
      row.className = `action-item-row ${item.completed ? 'completed' : ''}`;
      row.innerHTML = `
        <input type="checkbox" class="action-checkbox" id="${item.id}" ${item.completed ? 'checked' : ''}>
        <label for="${item.id}" class="action-item-text">${escapeHtml(item.text)}</label>
        <span class="action-tag ${escapeHtml(item.tag || 'assignment')}">${escapeHtml(item.tag || 'Task')}</span>
      `;

      row.querySelector('.action-checkbox').addEventListener('change', (e) => {
        item.completed = e.target.checked;
        renderActionItems();
      });

      el.actionItemsContainer.appendChild(row);
    });

    el.tasksProgressBadge.textContent = `${completedCount} / ${appState.actionItems.length} Completed`;
  }

  // --- Flashcard Operations ---
  function renderFlashcard(index) {
    if (!appState.flashcards || appState.flashcards.length === 0) {
      el.fcQuestionText.textContent = 'No flashcards generated for this lecture.';
      el.fcAnswerText.textContent = '';
      el.flashcardCounter.textContent = '0 of 0';
      return;
    }

    if (index < 0) index = appState.flashcards.length - 1;
    if (index >= appState.flashcards.length) index = 0;
    appState.currentCardIndex = index;

    // Reset flip
    el.flashcardElement.classList.remove('flipped');

    const card = appState.flashcards[index];
    el.fcQuestionText.textContent = card.question;
    el.fcAnswerText.textContent = card.answer;
    el.flashcardCounter.textContent = `Card ${index + 1} of ${appState.flashcards.length}`;

    // Update thumbnail highlights
    document.querySelectorAll('.fc-thumbnail-btn').forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
    });
  }

  function renderFlashcardThumbnails() {
    el.fcGridOverview.innerHTML = '';
    appState.flashcards.forEach((_, i) => {
      const btn = document.createElement('button');
      btn.className = `fc-thumbnail-btn ${i === appState.currentCardIndex ? 'active' : ''}`;
      btn.textContent = `#${i + 1}`;
      btn.addEventListener('click', () => renderFlashcard(i));
      el.fcGridOverview.appendChild(btn);
    });
  }

  function flipCurrentCard() {
    el.flashcardElement.classList.toggle('flipped');
  }

  // --- Ask My Lecture (Semantic Grounded Search) ---
  function handleAskLecture() {
    const question = el.qaInput.value.trim().toLowerCase();
    if (!question || !el.transcriptInput.value.trim()) return;

    const rawTranscript = cleanTranscript(el.transcriptInput.value);
    const sentences = splitIntoSentences(rawTranscript);

    // Score sentences by matching question terms
    const qTokens = tokenizeWords(question);
    if (qTokens.length === 0) return;

    let bestSentence = '';
    let highestScore = 0;

    sentences.forEach(s => {
      const sTokens = tokenizeWords(s);
      let matchCount = 0;
      qTokens.forEach(qt => {
        if (sTokens.includes(qt) || s.toLowerCase().includes(qt)) {
          matchCount++;
        }
      });
      if (matchCount > highestScore) {
        highestScore = matchCount;
        bestSentence = s;
      }
    });

    el.qaAnswerBox.classList.remove('hidden');
    if (highestScore > 0) {
      el.qaAnswerText.innerHTML = `<strong>Direct excerpt:</strong> "${escapeHtml(bestSentence)}"`;
    } else {
      el.qaAnswerText.textContent = `No direct reference to "${question}" found in the provided dictation. Try searching for broader terms discussed in class.`;
    }
  }

  // --- Real-time Voice Dictation (Web Speech API) ---
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      el.btnLiveMic.title = "Live Speech Dictation not supported in this browser (use Chrome or Safari)";
      el.btnLiveMic.style.opacity = '0.5';
      return;
    }

    appState.recognition = new SpeechRecognition();
    appState.recognition.continuous = true;
    appState.recognition.interimResults = true;
    appState.recognition.lang = 'en-US';

    appState.recognition.onstart = () => {
      appState.isRecording = true;
      el.recordingIndicator.classList.remove('hidden');
      el.btnLiveMic.classList.add('active');
      el.micBtnText.textContent = 'Stop Mic';
      showToast('Live microphone listening... Speak your lecture notes', '🎙️');
    };

    appState.recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        }
      }
      if (finalTranscript) {
        el.transcriptInput.value = (el.transcriptInput.value + ' ' + finalTranscript).trim();
        updateInputStats();
      }
    };

    appState.recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      stopRecording();
      showToast('Microphone error: ' + event.error, '⚠️');
    };

    appState.recognition.onend = () => {
      stopRecording();
    };
  }

  function toggleLiveRecording() {
    if (!appState.recognition) {
      showToast('Speech recognition not supported in this browser.', '⚠️');
      return;
    }

    if (appState.isRecording) {
      appState.recognition.stop();
      stopRecording();
    } else {
      try {
        appState.recognition.start();
      } catch (e) {
        console.error(e);
      }
    }
  }

  function stopRecording() {
    appState.isRecording = false;
    el.recordingIndicator.classList.add('hidden');
    el.btnLiveMic.classList.remove('active');
    el.micBtnText.textContent = 'Live Mic';
  }

  // --- Summarization Controller ---
  async function executeSummarisation() {
    const text = el.transcriptInput.value.trim();
    if (!text || text.length < 30) {
      showToast('Please paste a lecture dictation (at least 30 characters).', '⚠️');
      el.transcriptInput.focus();
      return;
    }

    // Get selected depth
    const activeDepthBtn = el.depthSelector.querySelector('.depth-btn.active');
    const depth = activeDepthBtn ? activeDepthBtn.dataset.depth : 'standard';

    // Show Loading
    el.emptyState.classList.add('hidden');
    el.dashboardResults.classList.add('hidden');
    el.loadingState.classList.remove('hidden');
    el.progressBarFill.style.width = '20%';

    try {
      let results;

      if (appState.engine === 'gemini' && appState.geminiKey) {
        el.loadingStatusText.textContent = 'Synthesizing with Google Gemini 1.5 Flash...';
        el.progressBarFill.style.width = '60%';
        results = await callGeminiApi(text, appState.geminiKey);
      } else {
        el.loadingStatusText.textContent = 'Applying Graph-Rank NLP & Concept Extraction...';
        el.progressBarFill.style.width = '50%';
        await new Promise(r => setTimeout(r, 400)); // Smooth UX transition
        results = processLectureOffline(text, depth);
      }

      el.progressBarFill.style.width = '100%';
      await new Promise(r => setTimeout(r, 200));

      renderDashboard(results);
    } catch (err) {
      console.error(err);
      el.loadingState.classList.add('hidden');
      el.emptyState.classList.remove('hidden');
      showToast('Error summarising: ' + err.message, '❌');
    }
  }

  // --- Export Utilities ---
  function exportMarkdown() {
    if (!appState.currentSummaryData) {
      showToast('No summary generated yet to export!', '⚠️');
      return;
    }
    const d = appState.currentSummaryData;
    let md = `# ${d.title}\n*Topic: ${d.topic}*\n\n`;
    md += `## 🎯 Core Thesis\n${d.thesis}\n\n`;

    md += `## ✨ Key Takeaways\n`;
    (d.takeaways || []).forEach((t, i) => {
      md += `${i + 1}. ${t}\n`;
    });
    md += `\n`;

    if (d.definitions && d.definitions.length > 0) {
      md += `## 💡 Terminology & Concepts\n`;
      d.definitions.forEach(def => {
        md += `- **${def.term}**: ${def.meaning}\n`;
      });
      md += `\n`;
    }

    if (appState.actionItems && appState.actionItems.length > 0) {
      md += `## 📅 Action Items & Deadlines\n`;
      appState.actionItems.forEach(item => {
        md += `- [${item.completed ? 'x' : ' '}] ${item.text} (${item.tag})\n`;
      });
      md += `\n`;
    }

    if (d.timeline && d.timeline.length > 0) {
      md += `## ⏱️ Lecture Progression\n`;
      d.timeline.forEach(step => {
        md += `### ${step.phase}: ${step.title}\n${step.description}\n\n`;
      });
    }

    md += `---\n*Generated by ClassSummariser PRO (gorgioalahmar)*\n`;

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lecture_summary_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded Markdown study notes!', '📥');
  }

  function copySummaryToClipboard() {
    if (!appState.currentSummaryData) {
      showToast('No summary generated yet to copy!', '⚠️');
      return;
    }
    const d = appState.currentSummaryData;
    let text = `${d.title} (${d.topic})\n\n`;
    text += `Thesis: ${d.thesis}\n\n`;
    text += `Key Takeaways:\n` + (d.takeaways || []).map((t, i) => `${i + 1}. ${t}`).join('\n') + `\n\n`;
    if (appState.actionItems?.length > 0) {
      text += `Deadlines & Tasks:\n` + appState.actionItems.map(item => `• ${item.text}`).join('\n');
    }

    navigator.clipboard.writeText(text).then(() => {
      showToast('Copied summary to clipboard!', '📋');
    }).catch(() => {
      showToast('Failed to copy to clipboard', '⚠️');
    });
  }

  // --- Search inside notes ---
  function filterNotes(query) {
    const q = query.toLowerCase().trim();
    const takeawayCards = el.takeawaysContainer.querySelectorAll('.takeaway-card');
    takeawayCards.forEach(card => {
      const match = card.textContent.toLowerCase().includes(q);
      card.style.display = match ? 'flex' : 'none';
    });

    const defCards = el.definitionsContainer.querySelectorAll('.def-card');
    defCards.forEach(card => {
      const match = card.textContent.toLowerCase().includes(q);
      card.style.display = match ? 'block' : 'none';
    });
  }

  // --- Settings & Modal ---
  function openSettings() {
    el.geminiApiKeyInput.value = appState.geminiKey;
    const radios = el.settingsModal.querySelectorAll('input[name="engine-type"]');
    radios.forEach(r => {
      r.checked = (r.value === appState.engine);
      r.closest('.radio-card').classList.toggle('active', r.value === appState.engine);
    });
    el.geminiKeySection.classList.toggle('hidden', appState.engine !== 'gemini');
    el.settingsModal.classList.remove('hidden');
  }

  function closeSettings() {
    el.settingsModal.classList.add('hidden');
  }

  function saveSettings() {
    const selectedRadio = el.settingsModal.querySelector('input[name="engine-type"]:checked');
    if (selectedRadio) {
      appState.engine = selectedRadio.value;
      localStorage.setItem('cs_engine', appState.engine);
    }
    appState.geminiKey = el.geminiApiKeyInput.value.trim();
    localStorage.setItem('cs_gemini_key', appState.geminiKey);

    updateEngineIndicator();
    closeSettings();
    showToast('Preferences saved!', '⚙️');
  }

  function updateEngineIndicator() {
    if (appState.engine === 'gemini' && appState.geminiKey) {
      el.aiStatusIndicator.className = 'status-dot online';
      el.aiStatusIndicator.title = 'Gemini 1.5 Flash Connected';
    } else {
      el.aiStatusIndicator.className = 'status-dot offline';
      el.aiStatusIndicator.title = 'Offline NLP Engine Active';
    }
  }

  // --- Event Listeners Setup ---
  function setupEventListeners() {
    // Theme toggle
    el.themeToggle.addEventListener('click', toggleTheme);

    // Settings modal
    el.btnSettings.addEventListener('click', openSettings);
    el.btnCloseModal.addEventListener('click', closeSettings);
    el.btnSaveSettings.addEventListener('click', saveSettings);
    el.settingsModal.addEventListener('click', (e) => {
      if (e.target === el.settingsModal) closeSettings();
    });

    // Engine radio card toggle
    const engineRadios = el.settingsModal.querySelectorAll('input[name="engine-type"]');
    engineRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        engineRadios.forEach(r => r.closest('.radio-card').classList.toggle('active', r.checked));
        el.geminiKeySection.classList.toggle('hidden', radio.value !== 'gemini');
      });
    });

    // Textarea input stats
    el.transcriptInput.addEventListener('input', updateInputStats);

    // Paste button
    el.btnPaste.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        if (text) {
          el.transcriptInput.value = text;
          updateInputStats();
          showToast('Pasted transcript from clipboard!', '📋');
        }
      } catch (e) {
        showToast('Clipboard access denied. Press ⌘+V to paste.', '⚠️');
      }
    });

    // File Upload
    el.btnUpload.addEventListener('click', () => el.fileInput.click());
    el.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        el.transcriptInput.value = cleanTranscript(event.target.result);
        updateInputStats();
        showToast(`Loaded "${file.name}"!`, '📁');
      };
      reader.readAsText(file);
    });

    // Live Mic Dictation
    el.btnLiveMic.addEventListener('click', toggleLiveRecording);

    // Clear Text
    el.btnClearText.addEventListener('click', () => {
      if (el.transcriptInput.value && confirm('Clear current transcript?')) {
        el.transcriptInput.value = '';
        updateInputStats();
      }
    });

    // Preset Sample Pills
    document.querySelectorAll('.pill-btn[data-sample]').forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        const sample = SAMPLE_LECTURES[sampleKey];
        if (sample) {
          el.transcriptInput.value = sample.text;
          updateInputStats();
          executeSummarisation();
        }
      });
    });

    // Depth Selector Buttons
    el.depthSelector.querySelectorAll('.depth-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        el.depthSelector.querySelectorAll('.depth-btn').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-checked', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      });
    });

    // Summarise Button & Cmd+Enter
    el.btnSummarise.addEventListener('click', executeSummarisation);
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        executeSummarisation();
      }
      // Spacebar to flip flashcard if focused on flashcard or tab active
      if (e.code === 'Space' && appState.activeTab === 'tab-flashcards' && document.activeElement !== el.transcriptInput && document.activeElement !== el.qaInput) {
        e.preventDefault();
        flipCurrentCard();
      }
    });

    // Dashboard Tab Switching
    el.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        appState.activeTab = targetId;

        el.tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        el.tabPanes.forEach(p => {
          p.classList.toggle('active', p.id === targetId);
        });
      });
    });

    // Flashcard Flip & Nav
    el.flashcardElement.addEventListener('click', flipCurrentCard);
    el.btnFcFlip.addEventListener('click', flipCurrentCard);
    el.btnFcPrev.addEventListener('click', () => renderFlashcard(appState.currentCardIndex - 1));
    el.btnFcNext.addEventListener('click', () => renderFlashcard(appState.currentCardIndex + 1));

    // Export & Action Buttons
    el.btnCopySummary.addEventListener('click', copySummaryToClipboard);
    el.btnExportMd.addEventListener('click', exportMarkdown);
    el.btnPrint.addEventListener('click', () => window.print());

    // Search input
    el.filterSummaryInput.addEventListener('input', (e) => filterNotes(e.target.value));

    // Ask My Lecture Q&A
    el.btnQaAsk.addEventListener('click', handleAskLecture);
    el.qaInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleAskLecture();
    });
    el.btnCloseQa.addEventListener('click', () => {
      el.qaAnswerBox.classList.add('hidden');
    });
  }

  // Helper
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
  }

  // Run initialization when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
