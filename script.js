/* ============================================================
   CyberLearn — Cybersecurity Learning Platform
   Part 3: Complete JavaScript
   Designed & Developed by AHAD ALI NISAR
   ============================================================ */

'use strict';

/* ============================================================
   1. UTILITIES
   ============================================================ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const STORAGE = {
  get(key, fallback = null) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  },
  set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  },
  remove(key) { try { localStorage.removeItem(key); } catch {} }
};

const KEYS = {
  theme: 'cyberlearn.theme',
  progress: 'cyberlearn.progress',
  bookmarks: 'cyberlearn.bookmarks',
  notes: 'cyberlearn.notes',
  checklist: 'cyberlearn.checklist',
  selfcheck: 'cyberlearn.selfcheck'
};

/* ============================================================
   2. THEME TOGGLE
   ============================================================ */
(function initTheme() {
  const saved = STORAGE.get(KEYS.theme, 'dark');
  document.documentElement.setAttribute('data-theme', saved);
  const btn = $('#themeToggle');
  if (btn) btn.textContent = saved === 'dark' ? '🌙' : '☀️';

  btn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    STORAGE.set(KEYS.theme, next);
    btn.textContent = next === 'dark' ? '🌙' : '☀️';
  });
})();

/* ============================================================
   3. MOBILE MENU
   ============================================================ */
(function initMenu() {
  const toggle = $('#menuToggle');
  const sidebar = $('#sidebar');
  const overlay = $('#overlay');
  if (!toggle || !sidebar || !overlay) return;

  const close = () => {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  };
  const open = () => {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
  };

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? close() : open();
  });
  overlay.addEventListener('click', close);
  $$('.sidebar nav a').forEach(a => a.addEventListener('click', close));

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) close();
  });
})();

/* ============================================================
   4. ACTIVE NAV HIGHLIGHTING + SMOOTH SCROLL
   ============================================================ */
(function initActiveNav() {
  const links = $$('.sidebar nav a.nav-link');
  const sections = links
    .map(a => {
      const id = a.getAttribute('href')?.replace('#', '');
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));

  // Smooth scroll for internal links
  links.forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.getElementById(href.slice(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', href);
        }
      }
    });
  });
})();

/* ============================================================
   5. BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ============================================================
   6. ACCORDION
   ============================================================ */
(function initAccordion() {
  $$('.acc-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasOpen = item.classList.contains('open');
      $$('.acc-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

/* ============================================================
   7. LIFECYCLE INTERACTION
   ============================================================ */
(function initLifecycle() {
  const steps = $$('.lifecycle-step');
  if (!steps.length) return;
  steps.forEach(step => {
    step.setAttribute('tabindex', '0');
    const activate = () => {
      steps.forEach(s => s.classList.remove('active'));
      step.classList.add('active');
    };
    step.addEventListener('click', activate);
    step.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  });
})();

/* ============================================================
   8. DICTIONARY DATA
   ============================================================ */
const DICTIONARY = [
  { term: 'Cybersecurity', en: 'Protecting digital systems, data, and identity.', rm: 'Cybersecurity ka matlab hai digital systems, devices aur information ko unauthorized access, damage aur misuse se protect karna.', why: 'Aapki poori digital life isi ke through safe rehti hai.' },
  { term: 'Cyber Attack', en: 'An attempt to damage or gain unauthorized access.', rm: 'Cyber attack wo koshish hai jisme attacker kisi system ya data ko nuqsan pohnchane ya ghalat tareeqe se access karne ki koshish karta hai.', why: 'Attacks ko samajh kar hi defend kar sakte hain.' },
  { term: 'Threat', en: 'Anything capable of causing harm.', rm: 'Threat koi bhi cheez hai jo aapke system ya data ko nuqsan pohncha sakti hai — jaise malware, hacker, ya careless user.', why: 'Threat identify karna defensive planning ka pehla step hai.' },
  { term: 'Threat Actor', en: 'A person or group that poses a threat.', rm: 'Threat actor wo insaan ya group hai jo systems ko nuqsan pohnchane ki koshish karta hai — jaise cybercriminal, hacktivist, ya nation-state.', why: 'Motivation samajhne se defense better ban jati hai.' },
  { term: 'Vulnerability', en: 'A weakness that can be exploited.', rm: 'Vulnerability system mein aik kamzori hai jo attacker use kar sakta hai — jaise purana software, weak password, ya misconfiguration.', why: 'Vulnerability patch karna sabse basic defense hai.' },
  { term: 'Exploit', en: 'A method that takes advantage of a vulnerability.', rm: 'Exploit wo technique ya code hai jo vulnerability ko use karke system mein ghusne ya nuqsan pohnchane ka kaam karta hai.', why: 'Exploit se bachne ke liye patching zaroori hai.' },
  { term: 'Attack Vector', en: 'A path used to launch an attack.', rm: 'Attack vector wo rasta hai jisse attacker aapke system tak pohnchta hai — jaise email, website, USB, ya third-party vendor.', why: 'Vector block karne se attack rok jata hai.' },
  { term: 'Malware', en: 'Malicious software.', rm: 'Malware wo harmful software hai jo system ko nuqsan pohnchane, data churane ya control lene ke liye banaya jata hai.', why: 'Malware sabse common threat hai.' },
  { term: 'Virus', en: 'Malware that spreads by attaching to files.', rm: 'Virus aik tarah ka malware hai jo files mein attach hota hai aur doosri files ko infect karta hai.', why: 'Antivirus aur safe browsing se bacha jaa sakta hai.' },
  { term: 'Worm', en: 'Malware that spreads itself over networks.', rm: 'Worm aik self-replicating malware hai jo network ke through khud ko spread karta hai — bina user click ke.', why: 'Patching se worm attacks ruk sakte hain.' },
  { term: 'Trojan', en: 'Malware disguised as legitimate software.', rm: 'Trojan aik malware hai jo acha software dikhta hai lekin andar se harmful hota hai.', why: 'Sirf trusted sources se software install karein.' },
  { term: 'Ransomware', en: 'Malware that locks data and demands payment.', rm: 'Ransomware aapke files ko encrypt kar deta hai aur wapas dene ke liye paisa demand karta hai.', why: 'Backups ransomware ka best defense hain.' },
  { term: 'Botnet', en: 'A network of infected machines.', rm: 'Botnet kai infected computers ka network hota hai jinhe attacker remotely control karta hai — bina owner ko pata.', why: 'Botnets bade attacks launch karte hain.' },
  { term: 'Firewall', en: 'A filter for network traffic.', rm: 'Firewall network traffic ko monitor aur filter karta hai — sirf allowed connections guzarne deta hai.', why: 'External attacks ka pehla defense hai.' },
  { term: 'Encryption', en: 'Converting data into unreadable form.', rm: 'Encryption aapke data ko is tarah convert karta hai ke bina key ke koi padh nahi sakta.', why: 'Data chori ho jaye to bhi safe rehta hai.' },
  { term: 'Authentication', en: 'Verifying identity.', rm: 'Authentication ka matlab hai confirm karna ke aap waqai wo hi insaan hain jiska aap claim karte hain.', why: 'Sirf authorized log systems mein aayein.' },
  { term: 'Authorization', en: 'Deciding what an authenticated user can do.', rm: 'Authorization decide karta hai ke authenticate hone ke baad aap kya kar sakte hain aur kya nahi.', why: 'Permissions enforce karna zaroori hai.' },
  { term: 'Access Control', en: 'Managing who can access what.', rm: 'Access control wo system hai jo decide karta hai ke kaunsa user kaunsa data ya system access kar sakta hai.', why: 'Data sirf authorized logon tak pohnche.' },
  { term: 'Patch Management', en: 'Applying software updates.', rm: 'Patch management ka matlab hai regularly software updates lagana taake known vulnerabilities fix ho jayein.', why: 'Purana software sabse aasan target hota hai.' },
  { term: 'Penetration Testing', en: 'Authorized simulated attack.', rm: 'Penetration testing mein authorized experts apne hi system par attack simulate karte hain taake weaknesses dhoondh sakein.', why: 'Attack se pehle apni kamzori pata chal jati hai.' },
  { term: 'Intrusion Detection', en: 'Detecting suspicious activity.', rm: 'Intrusion detection ka matlab hai system par nazar rakhna aur suspicious activity detect karna — alerts generate karna.', why: 'Early detection nuqsan kam karta hai.' },
  { term: 'Intrusion Prevention', en: 'Blocking suspicious activity.', rm: 'Intrusion prevention detect karne ke saath saath suspicious activity ko block bhi karta hai — real-time.', why: 'Active attacks ko rok deta hai.' },
  { term: 'Risk', en: 'Chance and impact of harm.', rm: 'Risk ka matlab hai kisi nuqsan ke hone ka chance aur uska impact.', why: 'Risk samajhna hi defensive decisions ki bunyaad hai.' },
  { term: 'Asset', en: 'Something valuable that needs protection.', rm: 'Asset wo cheez hai jo valuable hai — jaise data, systems, ya reputation.', why: 'Pehle pata karein kya protect karna hai.' },
  { term: 'Incident', en: 'A security event that causes harm.', rm: 'Incident wo event hai jisme security breach ya nuqsan hota hai.', why: 'Incident ko jaldi handle karna zaroori hai.' },
  { term: 'Incident Response', en: 'Systematic reaction to an incident.', rm: 'Incident response wo process hai jisme incident ke waqt systematically react kiya jata hai — detect, contain, recover.', why: 'Sahi response nuqsan kam karta hai.' },
  { term: 'Defense in Depth', en: 'Multiple layers of security.', rm: 'Defense in depth ka matlab hai multiple layers mein security lagana taake ek fail ho to doosri bacha le.', why: 'Ek layer kaafi nahi hoti.' },
  { term: 'Social Engineering', en: 'Manipulating people to gain access.', rm: 'Social engineering mein attacker insaan ko manipulate karta hai — technical hack nahi, psychological hack.', why: 'Insaan sabse bara risk aur sabse bara asset hai.' },
  { term: 'Phishing', en: 'Fake messages to steal information.', rm: 'Phishing mein attacker fake email ya message bhejta hai taake aap link click karein ya credentials dein.', why: 'Sabse common attack vector hai.' },
  { term: 'Insider Threat', en: 'Risk from someone inside.', rm: 'Insider threat wo risk hai jo organization ke andar kisi trusted person se aata hai — employee, contractor, ya vendor.', why: 'Detect karna mushkil hota hai.' },
  { term: 'Data Breach', en: 'Unauthorized access to data.', rm: 'Data breach wo incident hai jisme sensitive data unauthorized logon ke haath lag jata hai.', why: 'Financial aur reputation damage hota hai.' },
  { term: 'Security Monitoring', en: 'Continuous watching of systems.', rm: 'Security monitoring ka matlab hai continuously systems par nazar rakhna taake suspicious activity jaldi detect ho.', why: 'Early detection hi best defense hai.' },
  { term: 'Backup', en: 'A copy of data.', rm: 'Backup aapke data ki extra copy hai jo kisi aur jagah safe rakhi jati hai.', why: 'Data loss aur ransomware se bachata hai.' },
  { term: 'Recovery', en: 'Restoring systems after an incident.', rm: 'Recovery ka matlab hai incident ke baad systems aur data ko wapas normal karna.', why: 'Business continuity ke liye zaroori hai.' },
  { term: 'Cloud', en: 'Remote servers accessed over the internet.', rm: 'Cloud ka matlab hai aapka data aur applications kisi doosre ke server par hain, internet ke through accessible.', why: 'Convenience ke saath naye security challenges bhi.' },
  { term: 'Zero Day', en: 'A vulnerability with no patch yet.', rm: 'Zero day wo vulnerability hai jiska patch available nahi hota — attacker use kar sakta hai.', why: 'Ye sabse khatarnak vulnerabilities hote hain.' },
  { term: 'Multi-Factor Authentication (MFA)', en: 'Two or more verification steps.', rm: 'MFA mein aapko do ya zyada tareeqon se apni identity verify karni hoti hai — password + OTP.', why: 'Account takeover se bachata hai.' },
  { term: 'Least Privilege', en: 'Give only the minimum access needed.', rm: 'Least privilege ka matlab hai har user ko sirf utna access dena jitna uske kaam ke liye zaroori hai.', why: 'Insider aur privilege misuse kam hota hai.' },
  { term: 'Stacked Risk', en: 'Multiple small weaknesses combining.', rm: 'Stacked risk ka matlab hai kai chhoti weaknesses mil kar aik bara risk bana dena.', why: 'Chhoti ghaltiyan ignore na karein.' },
  { term: 'Residual Risk', en: 'Risk remaining after controls.', rm: 'Residual risk wo risk hai jo controls lagane ke baad bhi bachta hai.', why: 'Perfect security possible nahi hoti.' },
  { term: 'Network Segmentation', en: 'Dividing a network into parts.', rm: 'Network segmentation ka matlab hai network ko chhote hisson mein divide karna taake attack aik hisse se doosre mein na phaile.', why: 'Attack spread rokta hai.' },
  { term: 'Patch', en: 'A software fix.', rm: 'Patch aik chhota software update hota hai jo bug ya vulnerability fix karta hai.', why: 'Regular patches zaroori hain.' }
];

/* ============================================================
   9. DICTIONARY RENDER + SEARCH + A-Z
   ============================================================ */
(function initDictionary() {
  const grid = $('#dictGrid');
  const empty = $('#dictEmpty');
  const searchInput = $('#dictSearch');
  const azButtons = $$('#azFilter button');
  if (!grid) return;

  let currentLetter = 'all';
  let currentQuery = '';

  function render() {
    const q = currentQuery.toLowerCase().trim();
    const filtered = DICTIONARY.filter(item => {
      const matchLetter = currentLetter === 'all' || item.term.toLowerCase().startsWith(currentLetter);
      const matchQuery = !q || item.term.toLowerCase().includes(q) ||
                         item.rm.toLowerCase().includes(q) ||
                         item.en.toLowerCase().includes(q);
      return matchLetter && matchQuery;
    }).sort((a, b) => a.term.localeCompare(b.term));

    if (!filtered.length) {
      grid.innerHTML = '';
      empty.hidden = false;
      return;
    }
    empty.hidden = true;

    grid.innerHTML = filtered.map(item => `
      <div class="dict-card">
        <button class="dict-copy" data-term="${item.term.replace(/"/g, '&quot;')}" aria-label="Copy definition">Copy</button>
        <h4>${item.term}</h4>
        <p class="dict-en"><strong>English:</strong> ${item.en}</p>
        <p class="dict-rm"><strong>Roman English:</strong> ${item.rm}</p>
        <p class="dict-why"><strong>Why it matters:</strong> ${item.why}</p>
      </div>
    `).join('');

    // Copy buttons
    $$('.dict-copy', grid).forEach(btn => {
      btn.addEventListener('click', async () => {
        const term = btn.dataset.term;
        const item = DICTIONARY.find(d => d.term === term);
        if (!item) return;
        const text = `${item.term}\n${item.en}\n${item.rm}\nWhy it matters: ${item.why}`;
        try {
          await navigator.clipboard.writeText(text);
          btn.textContent = 'Copied!';
          btn.classList.add('copied');
          setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1400);
        } catch {
          btn.textContent = 'Error';
          setTimeout(() => { btn.textContent = 'Copy'; }, 1400);
        }
      });
    });
  }

  searchInput?.addEventListener('input', e => {
    currentQuery = e.target.value;
    render();
  });

  azButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      azButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentLetter = btn.dataset.letter;
      render();
    });
  });

  render();
})();

/* ============================================================
   10. GLOBAL SEARCH
   ============================================================ */
(function initGlobalSearch() {
  const input = $('#globalSearch');
  const results = $('#searchResults');
  if (!input || !results) return;

  // Build search index from sections + dictionary
  const index = [];
  $$('.section').forEach(sec => {
    const id = sec.id;
    const title = $('h2', sec)?.textContent?.trim() || id;
    const body = sec.textContent.replace(/\s+/g, ' ').trim();
    index.push({ id, title, body, type: 'Section' });
  });
  DICTIONARY.forEach(d => {
    index.push({ id: 'dictionary', title: d.term, body: `${d.en} ${d.rm} ${d.why}`, type: 'Dictionary' });
  });

  function showResults(items) {
    if (!items.length) {
      results.innerHTML = '<div class="sr-empty">Koi result nahi mila.</div>';
      results.classList.add('active');
      return;
    }
    results.innerHTML = items.slice(0, 12).map(r => `
      <a class="sr-item" href="#${r.id}" data-target="${r.id}">
        <strong>${r.title}</strong>
        <small>${r.type} • ${r.body.slice(0, 90)}...</small>
      </a>
    `).join('');
    results.classList.add('active');

    $$('.sr-item', results).forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.getElementById(a.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        results.classList.remove('active');
        input.value = '';
      });
    });
  }

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (q.length < 2) { results.classList.remove('active'); return; }
    const matches = index.filter(item =>
      item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q)
    );
    showResults(matches);
  });

  input.addEventListener('focus', () => {
    if (input.value.length >= 2) results.classList.add('active');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.topbar-search')) results.classList.remove('active');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') results.classList.remove('active');
  });
})();

/* ============================================================
   11. PROGRESS TRACKER (Chapter Completion)
   ============================================================ */
(function initProgress() {
  const buttons = $$('.complete-btn');
  const fill = $('#progressFill');
  const percentEl = $('#progressPercent');
  const countEl = $('#progressCount');
  if (!buttons.length) return;

  const TOTAL = 16;
  let completed = STORAGE.get(KEYS.progress, []);

  function refresh() {
    const pct = Math.round((completed.length / TOTAL) * 100);
    if (fill) fill.style.width = pct + '%';
    if (percentEl) percentEl.textContent = pct + '%';
    if (countEl) countEl.textContent = `${completed.length}/${TOTAL}`;

    buttons.forEach(btn => {
      const ch = btn.dataset.chapter;
      const isDone = completed.includes(ch);
      btn.classList.toggle('done', isDone);
      btn.textContent = isDone ? '✓ Completed' : 'Mark as Complete';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const ch = btn.dataset.chapter;
      if (completed.includes(ch)) {
        completed = completed.filter(c => c !== ch);
      } else {
        completed.push(ch);
      }
      STORAGE.set(KEYS.progress, completed);
      refresh();
    });
  });

  refresh();
})();

/* ============================================================
   12. BOOKMARKS
   ============================================================ */
(function initBookmarks() {
  const list = $('#bookmarksList');
  const empty = $('#bookmarksEmpty');
  if (!list) return;

  let bookmarks = STORAGE.get(KEYS.bookmarks, []);

  function render() {
    if (!bookmarks.length) {
      list.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    list.innerHTML = bookmarks.map((bm, i) => `
      <div class="bookmark-card">
        <h4>${bm.term}</h4>
        <p>${bm.meaning}</p>
        <button class="bm-remove" data-index="${i}">Remove</button>
      </div>
    `).join('');

    $$('.bm-remove', list).forEach(btn => {
      btn.addEventListener('click', () => {
        bookmarks.splice(parseInt(btn.dataset.index, 10), 1);
        STORAGE.set(KEYS.bookmarks, bookmarks);
        render();
      });
    });
  }

  // Add bookmark buttons to concept cards
  $$('.concept-card').forEach(card => {
    const term = $('h4', card)?.textContent?.trim();
    const meaning = $('.concept-meaning', card)?.textContent?.trim();
    if (!term || !meaning) return;

    const btn = document.createElement('button');
    btn.className = 'bm-toggle';
    btn.type = 'button';
    const isSaved = () => bookmarks.some(b => b.term === term);
    btn.textContent = isSaved() ? '🔖 Saved' : '🔖 Save';
    if (isSaved()) btn.classList.add('saved');

    btn.addEventListener('click', () => {
      if (isSaved()) {
        bookmarks = bookmarks.filter(b => b.term !== term);
        btn.textContent = '🔖 Save';
        btn.classList.remove('saved');
      } else {
        bookmarks.push({ term, meaning });
        btn.textContent = '🔖 Saved';
        btn.classList.add('saved');
      }
      STORAGE.set(KEYS.bookmarks, bookmarks);
      render();
    });

    card.appendChild(btn);
  });

  render();
})();

/* ============================================================
   13. NOTES
   ============================================================ */
(function initNotes() {
  const titleInput = $('#noteTitle');
  const bodyInput = $('#noteBody');
  const saveBtn = $('#saveNote');
  const clearBtn = $('#clearNote');
  const list = $('#notesList');
  const empty = $('#notesEmpty');
  if (!list) return;

  let notes = STORAGE.get(KEYS.notes, []);
  let editingIndex = null;

  function render() {
    if (!notes.length) {
      list.innerHTML = '';
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;
    list.innerHTML = notes.map((n, i) => `
      <div class="note-card">
        <div class="note-actions">
          <button class="edit" data-index="${i}">Edit</button>
          <button class="del" data-index="${i}">Delete</button>
        </div>
        <h4>${escapeHtml(n.title || 'Untitled')}</h4>
        <p>${escapeHtml(n.body)}</p>
        <small>${n.date}</small>
      </div>
    `).join('');

    $$('.note-card .edit', list).forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.index, 10);
        const note = notes[idx];
        titleInput.value = note.title;
        bodyInput.value = note.body;
        editingIndex = idx;
        saveBtn.textContent = 'Update Note';
        window.scrollTo({ top: $('#notes').offsetTop - 100, behavior: 'smooth' });
      });
    });

    $$('.note-card .del', list).forEach(b => {
      b.addEventListener('click', () => {
        const idx = parseInt(b.dataset.index, 10);
        notes.splice(idx, 1);
        STORAGE.set(KEYS.notes, notes);
        if (editingIndex === idx) { editingIndex = null; saveBtn.textContent = 'Save Note'; }
        render();
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  saveBtn?.addEventListener('click', () => {
    const title = titleInput.value.trim();
    const body = bodyInput.value.trim();
    if (!title && !body) { alert('Note title ya body likhein.'); return; }

    const note = {
      title: title || 'Untitled',
      body: body || '(empty)',
      date: new Date().toLocaleString()
    };

    if (editingIndex !== null) {
      notes[editingIndex] = note;
      editingIndex = null;
      saveBtn.textContent = 'Save Note';
    } else {
      notes.unshift(note);
    }
    STORAGE.set(KEYS.notes, notes);
    titleInput.value = '';
    bodyInput.value = '';
    render();
  });

  clearBtn?.addEventListener('click', () => {
    titleInput.value = '';
    bodyInput.value = '';
    editingIndex = null;
    saveBtn.textContent = 'Save Note';
  });

  render();
})();

/* ============================================================
   14. SELF-CHECK (Chapter 13)
   ============================================================ */
(function initSelfCheck() {
  const btn = $('#selfcheckBtn');
  const result = $('#selfcheckResult');
  if (!btn || !result) return;

  const boxes = $$('.selfcheck input[type="checkbox"]');
  const saved = STORAGE.get(KEYS.selfcheck, {});
  boxes.forEach(b => { if (saved[b.dataset.check]) b.checked = true; });

  boxes.forEach(b => {
    b.addEventListener('change', () => {
      const state = {};
      boxes.forEach(x => state[x.dataset.check] = x.checked);
      STORAGE.set(KEYS.selfcheck, state);
    });
  });

  btn.addEventListener('click', () => {
    const total = boxes.length;
    const checked = boxes.filter(b => b.checked).length;
    const pct = Math.round((checked / total) * 100);

    let verdict = '';
    let focus = [];
    if (pct >= 80) verdict = 'Bohat achha! Aapki security habits strong lagti hain.';
    else if (pct >= 50) verdict = 'Theek hai, lekin improve karne ki gunjaish hai.';
    else verdict = 'Aapko kuch basic security habits par kaam karna chahiye.';

    if (!boxes.find(b => b.dataset.check === 'a2')?.checked) focus.push('Multi-factor authentication on karein');
    if (!boxes.find(b => b.dataset.check === 'da1')?.checked) focus.push('Important data ka backup banayein');
    if (!boxes.find(b => b.dataset.check === 'd1')?.checked) focus.push('Devices updated rakhein');
    if (!boxes.find(b => b.dataset.check === 'p1')?.checked) focus.push('Phishing pehchanna seekhein');
    if (!boxes.find(b => b.dataset.check === 'r2')?.checked) focus.push('Recovery plan banayein');

    result.innerHTML = `
      <h4>Results</h4>
      <span class="result-score">${pct}%</span>
      <p>${verdict}</p>
      ${focus.length ? `<h4 style="margin-top:12px;">Areas to Review:</h4><ul>${focus.map(f => `<li>${f}</li>`).join('')}</ul>` : ''}
      <p style="margin-top:12px;font-size:0.8rem;color:var(--text-mute);">Ye educational self-check hai — professional security audit nahi.</p>
    `;
    result.classList.add('show');
  });
})();

/* ============================================================
   15. CHECKLIST
   ============================================================ */
(function initChecklist() {
  const grid = $('#checklistGrid');
  const resetBtn = $('#resetChecklist');
  if (!grid) return;

  const CATEGORIES = [
    { name: 'Accounts', items: ['Strong unique passwords har account par', 'Multi-factor authentication on', 'Purane accounts delete karein'] },
    { name: 'Devices', items: ['Devices updated rakhein', 'Screen lock on', 'Unknown USB use na karein'] },
    { name: 'Software', items: ['Sirf trusted sources se install', 'Unused software remove karein', 'Licensed software use karein'] },
    { name: 'Updates', items: ['OS updates time par lagayein', 'Auto-update on karein', 'Browser extensions review karein'] },
    { name: 'Protection', items: ['Antivirus / anti-malware on', 'Firewall on', 'Encryption enable karein'] },
    { name: 'Monitoring', items: ['Account activity check karein', 'Suspicious emails report karein', 'Login alerts on karein'] },
    { name: 'People', items: ['Security training lein', 'Phishing pehchanna seekhein', 'Suspicious activity report karein'] },
    { name: 'Processes', items: ['Incident response plan ready', 'Backup routine set karein', 'Recovery steps likhein'] },
    { name: 'Third Parties', items: ['Apps ki permissions review', 'Connected services check karein', 'Data sharing settings review'] },
    { name: 'Incident Response', items: ['Emergency contacts likhein', 'Steps ka list ready', 'Reporting channels clear'] },
    { name: 'Recovery', items: ['Backups test karein', 'Restore process likhein', 'Alternate plan ready'] }
  ];

  const state = STORAGE.get(KEYS.checklist, {});

  grid.innerHTML = CATEGORIES.map((cat, ci) => `
    <div class="checklist-cat">
      <h4>${cat.name}</h4>
      ${cat.items.map((item, ii) => {
        const key = `${ci}-${ii}`;
        return `<label><input type="checkbox" data-key="${key}" ${state[key] ? 'checked' : ''}> ${item}</label>`;
      }).join('')}
    </div>
  `).join('');

  $$('input[type="checkbox"]', grid).forEach(box => {
    box.addEventListener('change', () => {
      state[box.dataset.key] = box.checked;
      STORAGE.set(KEYS.checklist, state);
    });
  });

  resetBtn?.addEventListener('click', () => {
    if (!confirm('Checklist reset karein?')) return;
    STORAGE.remove(KEYS.checklist);
    $$('input[type="checkbox"]', grid).forEach(b => b.checked = false);
  });
})();

/* ============================================================
   16. QUIZ SYSTEM
   ============================================================ */
(function initQuiz() {
  const selector = $('#quizSelector');
  const container = $('#quizContainer');
  const titleEl = $('#quizTitle');
  const questionsEl = $('#quizQuestions');
  const submitBtn = $('#submitQuiz');
  const resultEl = $('#quizResult');
  if (!selector) return;

  const QUIZZES = [
    {
      name: 'Quiz 1 — Foundations',
      questions: [
        { q: 'Cybersecurity ka basic purpose kya hai?', opts: ['Games khelna', 'Digital systems ko protect karna', 'Internet slow karna', 'Software banana'], ans: 1, exp: 'Cybersecurity ka basic purpose digital systems, devices aur information ko protect karna hai.' },
        { q: 'Vulnerability kya hai?', opts: ['Aik tool', 'Aik kamzori', 'Aik attack', 'Aik protocol'], ans: 1, exp: 'Vulnerability system mein aik kamzori hai jo attacker use kar sakta hai.' },
        { q: 'Attack vector ka matlab hai:', opts: ['Attack ka rasta', 'Attack ka time', 'Attack ka naam', 'Attack ka size'], ans: 0, exp: 'Attack vector wo rasta hai jisse attacker system tak pohnchta hai.' },
        { q: 'Cloud ka matlab hai:', opts: ['Aasman', 'Remote servers', 'Local disk', 'USB drive'], ans: 1, exp: 'Cloud ka matlab hai remote servers jo internet ke through accessible hain.' },
        { q: 'Cybersecurity sirf technology ka masla hai?', opts: ['Haan', 'Nahi', 'Kabhi kabhi', 'Depends'], ans: 1, exp: 'Cybersecurity = Technology + People + Processes.' }
      ]
    },
    {
      name: 'Quiz 2 — Case Studies',
      questions: [
        { q: 'Case studies kyun padhi jati hain?', opts: ['Entertainment', 'Real lessons seekhne', 'Time pass', 'Kuch nahi'], ans: 1, exp: 'Case studies real incidents se real lessons deti hain.' },
        { q: 'Stacked risk kya hai?', opts: ['Aik bara risk', 'Kai chhoti weaknesses mil kar bara risk', 'Risk ka naam', 'Kuch nahi'], ans: 1, exp: 'Kai chhoti weaknesses mil kar bara risk banati hain.' },
        { q: 'Third-party risk ka matlab:', opts: ['Apna risk', 'Vendor ka risk jo aapko affect kare', 'Kuch nahi', 'Sirf financial'], ans: 1, exp: 'Vendor ke systems ki weakness aapko affect kar sakti hai.' },
        { q: 'Target 2013 mein entry point kya tha?', opts: ['Direct attack', 'Third-party vendor', 'Email nahi', 'Kuch nahi'], ans: 1, exp: 'Attackers ne pehle vendor ko compromise kiya.' },
        { q: 'Defensive lesson kya tha?', opts: ['Ignore karna', 'Network segmentation', 'Sirf password', 'Kuch nahi'], ans: 1, exp: 'Network segmentation se attack spread nahi hota.' }
      ]
    },
    {
      name: 'Quiz 3 — Concepts',
      questions: [
        { q: 'Identify phase mein kya hota hai?', opts: ['Attack karna', 'Assets identify karna', 'Data delete karna', 'Kuch nahi'], ans: 1, exp: 'Identify mein hum jaante hain kya protect karna hai.' },
        { q: 'Defense in Depth ka matlab:', opts: ['Aik layer', 'Multiple layers', 'Kuch nahi', 'Sirf firewall'], ans: 1, exp: 'Multiple layers mein security lagana.' },
        { q: 'Detect phase mein kya hota hai?', opts: ['Monitoring', 'Attack', 'Delete', 'Kuch nahi'], ans: 0, exp: 'Detection mein monitoring hoti hai.' },
        { q: 'Recover phase ka goal kya hai?', opts: ['Attack', 'Systems wapas normal', 'Data delete', 'Kuch nahi'], ans: 1, exp: 'Recovery mein systems ko normal karte hain.' },
        { q: 'Repeat & Refine kyun zaroori hai?', opts: ['Waqt pass', 'Continuous improvement', 'Kuch nahi', 'Sirf reports'], ans: 1, exp: 'Continuous improvement hi asli security hai.' }
      ]
    },
    {
      name: 'Quiz 4 — Human Factors',
      questions: [
        { q: 'Zyada tar incidents kis wajah se hote hain?', opts: ['Hardware', 'Human error', 'Nature', 'Kuch nahi'], ans: 1, exp: 'Zyada tar incidents human error se shuru hote hain.' },
        { q: 'Social engineering kya hai?', opts: ['Technical hack', 'Insaan ko manipulate', 'Kuch nahi', 'Firewall'], ans: 1, exp: 'Social engineering mein insaan ko manipulate kiya jata hai.' },
        { q: 'Phishing kya hai?', opts: ['Fake message', 'Real email', 'Kuch nahi', 'Software'], ans: 0, exp: 'Phishing mein fake messages bheje jate hain.' },
        { q: 'Security culture kab banti hai?', opts: ['Sirf IT', 'Har employee responsibility samjhe', 'Kuch nahi', 'Manager ka kaam'], ans: 1, exp: 'Jab har employee samjhe ke security uski zimmedari hai.' },
        { q: 'Training kyun zaroori hai?', opts: ['Waqt pass', 'Awareness ke liye', 'Kuch nahi', 'Sirf HR'], ans: 1, exp: 'Training se awareness barhti hai.' }
      ]
    },
    {
      name: 'Quiz 5 — Technical Security',
      questions: [
        { q: 'Authentication kya karta hai?', opts: ['Identity verify', 'Data delete', 'Kuch nahi', 'File save'], ans: 0, exp: 'Authentication identity verify karta hai.' },
        { q: 'Encryption ka purpose:', opts: ['Data unreadable banana', 'Data delete', 'Kuch nahi', 'Speed'], ans: 0, exp: 'Encryption data ko unreadable banata hai.' },
        { q: 'Firewall kya karta hai?', opts: ['Games', 'Traffic filter', 'Kuch nahi', 'Files'], ans: 1, exp: 'Firewall network traffic filter karta hai.' },
        { q: 'Patch management kya hai?', opts: ['Updates lagana', 'Delete karna', 'Kuch nahi', 'Install'], ans: 0, exp: 'Regular updates lagana zaroori hai.' },
        { q: 'IDS aur IPS mein farq?', opts: ['Same', 'IDS detect, IPS block', 'Kuch nahi', 'IPS detect'], ans: 1, exp: 'IDS detect karta hai, IPS block bhi karta hai.' }
      ]
    },
    {
      name: 'Quiz 6 — Evolution & Threats',
      questions: [
        { q: 'Attack aur defense kaisa hai?', opts: ['Static', 'Evolving', 'Same', 'Kuch nahi'], ans: 1, exp: 'Dono continuously evolve karte hain.' },
        { q: 'Cybercriminal ki motivation?', opts: ['Political', 'Financial', 'Fun', 'Kuch nahi'], ans: 1, exp: 'Financial gain sabse common motivation hai.' },
        { q: 'Hacktivist ki motivation?', opts: ['Financial', 'Political/social', 'Fun', 'Kuch nahi'], ans: 1, exp: 'Hacktivists political ya social messages ke liye attack karte hain.' },
        { q: 'Nation-state actors ki motivation?', opts: ['Fun', 'Espionage/sabotage', 'Kuch nahi', 'Financial'], ans: 1, exp: 'Espionage aur sabotage unki motivations hain.' },
        { q: 'Zero day kya hai?', opts: ['Purana bug', 'No patch available', 'Kuch nahi', 'Patch'], ans: 1, exp: 'Zero day mein patch available nahi hota.' }
      ]
    },
    {
      name: 'Quiz 7 — Risk & Response',
      questions: [
        { q: 'Risk ka matlab:', opts: ['Nuqsan ka chance + impact', 'Kuch nahi', 'Sirf chance', 'Sirf impact'], ans: 0, exp: 'Risk = chance + impact.' },
        { q: 'Residual risk kya hai?', opts: ['Pehle ka risk', 'Controls ke baad bacha risk', 'Kuch nahi', 'Zero risk'], ans: 1, exp: 'Controls ke baad jo risk bachta hai.' },
        { q: 'Incident response ka pehla step?', opts: ['Recover', 'Detect', 'Kuch nahi', 'Delete'], ans: 1, exp: 'Pehla step detection hai.' },
        { q: 'Containment ka matlab:', opts: ['Spread rokna', 'Attack', 'Kuch nahi', 'Delete'], ans: 0, exp: 'Containment se spread rukta hai.' },
        { q: 'Post-incident review kyun zaroori?', opts: ['Waqt pass', 'Lessons seekhne', 'Kuch nahi', 'Report'], ans: 1, exp: 'Lessons seekhne se future better hota hai.' }
      ]
    },
    {
      name: 'Quiz 8 — Master Model',
      questions: [
        { q: 'Cybersecurity ke 3 core pillars?', opts: ['People, Process, Technology', 'Sirf tech', 'Sirf people', 'Kuch nahi'], ans: 0, exp: 'Teenon pillars zaroori hain.' },
        { q: 'Continuous improvement kyun zaroori?', opts: ['Waqt pass', 'Naye threats aate hain', 'Kuch nahi', 'Report'], ans: 1, exp: 'Naye threats aate rehte hain.' },
        { q: 'Backups kis liye zaroori?', opts: ['Speed', 'Data loss se bachna', 'Kuch nahi', 'Games'], ans: 1, exp: 'Backups data loss se bachate hain.' },
        { q: 'Security ek journey hai ya destination?', opts: ['Destination', 'Journey', 'Dono', 'Kuch nahi'], ans: 1, exp: 'Security ek continuous journey hai.' },
        { q: 'Insider threat detect kyun mushkil?', opts: ['Easy', 'Andar se aata hai', 'Kuch nahi', 'Sirf tech'], ans: 1, exp: 'Andar ke logon ka access legitimate lagta hai.' }
      ]
    }
  ];

  // Render quiz selector
  selector.innerHTML = QUIZZES.map((q, i) =>
    `<button class="quiz-btn" data-quiz="${i}">${q.name} <br><small style="color:var(--text-mute)">${q.questions.length} questions</small></button>`
  ).join('');

  $$('.quiz-btn', selector).forEach(btn => {
    btn.addEventListener('click', () => loadQuiz(parseInt(btn.dataset.quiz, 10)));
  });

  function loadQuiz(index) {
    const quiz = QUIZZES[index];
    if (!quiz) return;
    titleEl.textContent = quiz.name;
    questionsEl.innerHTML = quiz.questions.map((q, qi) => `
      <div class="quiz-q" data-q="${qi}">
        <strong>${qi + 1}. ${q.q}</strong>
        ${q.opts.map((opt, oi) => `
          <label class="quiz-opt">
            <input type="radio" name="q${qi}" value="${oi}">
            <span>${opt}</span>
          </label>
        `).join('')}
      </div>
    `).join('');
    resultEl.classList.remove('show');
    resultEl.innerHTML = '';
    container.hidden = false;
    container.dataset.current = index;
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  submitBtn?.addEventListener('click', () => {
    const idx = parseInt(container.dataset.current, 10);
    const quiz = QUIZZES[idx];
    if (!quiz) return;

    let correct = 0;
    quiz.questions.forEach((q, qi) => {
      const qEl = questionsEl.querySelector(`.quiz-q[data-q="${qi}"]`);
      const selected = qEl.querySelector(`input[name="q${qi}"]:checked`);
      const correctRadio = qEl.querySelector(`input[value="${q.ans}"]`);

      qEl.classList.remove('correct', 'wrong');

      if (selected && parseInt(selected.value, 10) === q.ans) {
        correct++;
        qEl.classList.add('correct');
      } else {
        qEl.classList.add('wrong');
      }

      // Show explanation
      let exp = qEl.querySelector('.quiz-explain');
      if (!exp) {
        exp = document.createElement('div');
        exp.className = 'quiz-explain';
        qEl.appendChild(exp);
      }
      const wasCorrect = selected && parseInt(selected.value, 10) === q.ans;
      exp.innerHTML = `${wasCorrect ? '✅ Correct!' : '❌ Incorrect.'} ${q.exp}`;
      if (correctRadio) correctRadio.parentElement.style.fontWeight = '600';
    });

    const total = quiz.questions.length;
    const pct = Math.round((correct / total) * 100);
    let msg = '';
    if (pct >= 80) msg = 'Bohat acha! Aapne concepts samajh liye hain.';
    else if (pct >= 50) msg = 'Theek hai, lekin mazeed practice karein.';
    else msg = 'Chapter dobara padhein aur phir try karein.';

    resultEl.innerHTML = `
      <h4>Result</h4>
      <span class="result-score">${correct}/${total} (${pct}%)</span>
      <p>${msg}</p>
    `;
    resultEl.classList.add('show');
  });
})();

/* ============================================================
   17. YEAR IN FOOTER
   ============================================================ */
(function setYear() {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ============================================================
   18. KEYBOARD SHORTCUT — "/" focuses search
   ============================================================ */
(function shortcut() {
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      $('#globalSearch')?.focus();
    }
  });
})();

/* ============================================================
   19. INIT LOG
   ============================================================ */
console.log('%cCyberLearn', 'color:#22d3ee;font-size:20px;font-weight:bold;');
console.log('%cCybersecurity Learning Platform — Designed & Developed by AHAD ALI NISAR', 'color:#9aa7b8;');