import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ActivityIllustration from './Illustrations.jsx';

const STORAGE_KEY = 'baby-walking-tracker:v1';

// --- PROCEDURAL AUDIO GENERATOR (WEB AUDIO API) ---
// A single shared AudioContext is reused across chimes instead of leaking a
// fresh one on every completion.
let sharedAudioCtx = null;
const getAudioContext = () => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  if (!sharedAudioCtx) sharedAudioCtx = new AudioContext();
  if (sharedAudioCtx.state === 'suspended') sharedAudioCtx.resume();
  return sharedAudioCtx;
};

// Generates a gentle bell chime upon exercise / milestone completion
const playCompletionSound = () => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc1.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
    gain2.gain.setValueAtTime(0.08, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + 1.3);
    osc2.stop(ctx.currentTime + 0.9);
  } catch (e) {
    console.warn('Audio playback blocked by browser policy.', e);
  }
};

// --- ICONS ---
const FootprintIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 11c0-2.08-.408-4.07-1.151-5.885M12 11c0-2.08.408-4.07 1.152-5.885M12 11c0 3.517 1.009 6.799 2.753 9.571m3.44-2.04l-.054-.09A13.916 13.916 0 0015 11c0-2.08.408-4.07 1.151-5.885M15 11a12.016 12.016 0 011.153 5.885M9 11a12.016 12.016 0 01-1.153 5.885" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

const ClockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742l4.184-2.185m0 5.686l-4.184-2.185m5.342-1.785a3 3 0 11-6 0 3 3 0 016 0zm6 8a3 3 0 11-6 0 3 3 0 016 0zm6-16a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

// --- MILESTONES DATA ---
const milestonesList = [
  { id: 'w1_1', label: 'Tall-kneels against furniture, hips erect without heel-sitting', category: 'core', weight: 35, week: 1 },
  { id: 'w1_2', label: 'Sits on low stools & reaches down past hips to pick blocks up', category: 'hip', weight: 30, week: 1 },
  { id: 'w1_3', label: 'Exhibits strong contralateral coordination in crawl sequences', category: 'core', weight: 25, week: 1 },

  { id: 'w2_1', label: 'Pulls up to full stand using coffee tables or heavy items', category: 'hip', weight: 35, week: 2 },
  { id: 'w2_2', label: 'Cruises dynamically sideways along sofas using dual hands', category: 'hip', weight: 35, week: 2 },
  { id: 'w2_3', label: 'Safely looks around and behind while holding vertical frames', category: 'balance', weight: 30, week: 2 },

  { id: 'w3_1', label: 'Cruises confidently sideways requiring only single-hand grip', category: 'balance', weight: 35, week: 3 },
  { id: 'w3_2', label: 'Pushes weighted boxes/carts flat-footed on carpets', category: 'ankle', weight: 35, week: 3 },
  { id: 'w3_3', label: 'Smoothly pivots torso 90-degrees to turn and grasp toys', category: 'core', weight: 30, week: 3 },

  { id: 'w4_1', label: 'Stands fully hands-free in open rooms for over 5 seconds', category: 'balance', weight: 40, week: 4 },
  { id: 'w4_2', label: 'Pulls up to standing from direct squat without hand pulls', category: 'ankle', weight: 35, week: 4 },
  { id: 'w4_3', label: 'Takes 2-3 brave independent steps into comforting arms!', category: 'balance', weight: 45, week: 4 },
];

const defaultMilestones = milestonesList.reduce((acc, m) => ({ ...acc, [m.id]: false }), {});

// --- PT EXERCISE CURRICULUM ---
const weekData = [
  {
    week: 1,
    title: 'Core Stability & Pelvic Foundation',
    focus: 'Recruiting structural stabilizers and teaching postural weight-shifts.',
    whyItMatters: 'Before the pelvis can drive walking legs, the trunk muscles must isolate to balance the spine over shifting ground planes.',
    activities: [
      {
        id: 'w1-a1',
        name: 'Tall-Kneeling Reach',
        focus: 'Glutes & Spinal Extensors',
        difficulty: 'Gentle',
        timeLimit: 180,
        frequency: '3x daily',
        howTo: [
          'Sit in front of a low coffee table or ottoman containing high-interest items.',
          'Lift baby onto their knees, ensuring their hips are flat and upright (avoid bottom sliding back).',
          'Hold toys 10 inches off-center to encourage deep torso twisting while in the tall knee extension.',
        ],
        safety: 'Support at the rib cage initially. Do not pull up on hands or arms, let them balance their own shoulder weight.',
      },
      {
        id: 'w1-a2',
        name: 'Low-Stool Block Stacking',
        focus: 'Forward Extension & Ground Loading',
        difficulty: 'Gentle',
        timeLimit: 300,
        frequency: '2x daily',
        howTo: [
          'Position baby comfortably on a tiny non-slip footstool with feet fully flat on the ground.',
          'Scatter blocks around their toes. Encourage them to lean forward, grasp a block, and return to an upright sitting posture.',
        ],
        safety: 'Ensure the stool stays entirely fixed. Be ready to intercept forward lunges.',
      },
      {
        id: 'w1-a3',
        name: 'Pillow Mountain Crawler',
        focus: 'Contralateral Trunk Rotation',
        difficulty: 'Moderate',
        timeLimit: 300,
        frequency: '3x daily',
        howTo: [
          'Create a 3-foot track of flat, firm couch cushions on the rug.',
          'Lure baby to crawl directly over these soft, unstable hills to retrieve parents keys or interactive boards.',
        ],
        safety: 'Avoid puffy, thick pillows that could trap small hands or feet. Keep paths flat and low.',
      },
    ],
  },
  {
    week: 2,
    title: 'Cruising & Hip Mobilization',
    focus: 'Weight shifts across the coronal plane and gluteus medius firing patterns.',
    whyItMatters: 'Sideways stepping along support centers trains lateral hip muscles, ensuring your child can lift one leg safely without collapsing.',
    activities: [
      {
        id: 'w2-a1',
        name: 'The Couch Shuffle',
        focus: 'Coronal Hip Abduction',
        difficulty: 'Moderate',
        timeLimit: 240,
        frequency: '3x daily',
        howTo: [
          'Remove all sofa cushions to expose the frame. Scatter snack bites or blocks along the frame.',
          'Help baby stand upright and let them shuffle sideways to reach their goals.',
        ],
        safety: 'Stay directly behind. Cruising babies tend to release pressure suddenly and fall backwards.',
      },
      {
        id: 'w2-a2',
        name: 'The Living Room Rift',
        focus: 'Letting Go of Support Surfaces',
        difficulty: 'Challenging',
        timeLimit: 180,
        frequency: '2x daily',
        howTo: [
          'Align a solid armchair 8 inches away from the sofa edge.',
          'Encourage baby to reach across the open boundary to secure a toy, releasing their original handhold briefly.',
        ],
        safety: 'Validate that both pieces of furniture are heavily anchored and cannot drift apart.',
      },
    ],
  },
  {
    week: 3,
    title: 'Supported Gait & Propulsion',
    focus: 'Shifting the center of mass forward while achieving heel-strike coordination.',
    whyItMatters: 'Forward movement requires loading the ankles with forward momentum. Pushing resistance devices slows the gait to build flat-foot tracking.',
    activities: [
      {
        id: 'w3-a1',
        name: 'Weighted Box Push',
        focus: 'Tibialis Anterior Recruitment',
        difficulty: 'Challenging',
        timeLimit: 300,
        frequency: '3x daily',
        howTo: [
          'Load a smooth laundry basket or thick cardboard box with books (around 6-8 lbs total weight).',
          'Help baby grip the handles and push the weighted base across a carpeted floor.',
        ],
        safety: 'Avoid wheeled, plastic walkers that roll instantly. Friction is necessary to teach forward posture control.',
      },
      {
        id: 'w3-a2',
        name: 'Wooden Spoon Horizontal Hold',
        focus: 'Symmetrical Weight Distribution',
        difficulty: 'Challenging',
        timeLimit: 180,
        frequency: '2x daily',
        howTo: [
          'Hold a wooden kitchen spoon horizontally. Have baby grasp the center while you guide the edges, keeping it at chest height.',
          'Walk slowly backward, allowing them to balance their own weight without hanging onto your hands.',
        ],
        safety: "If baby's feet slide or go to tiptoes, reduce speed or lower the spoon height below chest level.",
      },
    ],
  },
  {
    week: 4,
    title: 'Unassisted Launch & Foot Control',
    focus: 'Eliminating secondary supports to achieve standalone balance structures.',
    whyItMatters: 'Independent walking is fundamentally a mind-body integration where the brain trusts its own sensory feedback loop.',
    activities: [
      {
        id: 'w4-a1',
        name: 'The Soft Surface Release',
        focus: 'Postural Equilibrium Response',
        difficulty: 'Challenging',
        timeLimit: 120,
        frequency: '5x daily',
        howTo: [
          'Support baby standing upright against a cushioned wall or parent\'s chest.',
          'Slowly slide your hand away from their hips, counting out loud to track their standalone balance duration.',
        ],
        safety: 'Remain within hugging distance. Celebrate all collapses as hilarious, fun play moments.',
      },
      {
        id: 'w4-a2',
        name: 'The Safe Launchpad',
        focus: 'First Autonomous Steps',
        difficulty: 'Maximum',
        timeLimit: 180,
        frequency: '4x daily',
        howTo: [
          'Stand baby with their back supported safely by a couch cushion.',
          'Sit two short steps away, extending your hands. Encourage them to take those brave steps into your arms.',
        ],
        safety: 'Make sure the transition rug is completely free of wires, hard objects, or toy blocks.',
      },
    ],
  },
];

// UTF-8 safe base64 (co-avoids the deprecated escape/unescape pair)
function encodeState(state) {
  const bytes = new TextEncoder().encode(JSON.stringify(state));
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function decodeState(encoded) {
  const binary = atob(encoded);
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

const CONFETTI_COLORS = ['#F2A354', '#4FB3A9', '#5B9BD5', '#E8798A', '#8FB88A', '#F7D97A'];

function ConfettiBurst() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        delay: Math.random() * 0.25,
        duration: 0.9 + Math.random() * 0.6,
        rotate: Math.random() > 0.5 ? 360 : -360,
        size: 6 + Math.random() * 6,
      })),
    []
  );
  return (
    <div className="fixed inset-x-0 top-0 h-0 z-[60] pointer-events-none" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-0 rounded-sm animate-confettiFall"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.6,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--confetti-rotate': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  const [activeWeek, setActiveWeek] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState(0);
  const [activeEduTab, setActiveEduTab] = useState(0);

  // --- LIVE BALANCE TIMER STATE ---
  const [timerSeconds, setTimerSeconds] = useState(180);
  const [timerMax, setTimerMax] = useState(180);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // --- GESTATIONAL PREMATURITY ADJUSTER STATE ---
  const [isPreemie, setIsPreemie] = useState(false);
  const [weeksPremature, setWeeksPremature] = useState(4);
  const [babyAgeWeeks, setBabyAgeWeeks] = useState(48);

  // --- PERSISTED / SHAREABLE STATE ---
  const [babyName, setBabyName] = useState('My Little Explorer');
  const [isEditingName, setIsEditingName] = useState(false);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Parent 🤰');
  const [completedMilestones, setCompletedMilestones] = useState(defaultMilestones);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [celebration, setCelebration] = useState(null);

  const hasLoadedRef = useRef(false);

  const triggerToast = useCallback((msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4500);
  }, []);

  // --- LOAD: shared link snapshot takes priority, otherwise local save ---
  useEffect(() => {
    const hash = window.location.hash;
    const shareMatch = hash.match(/#share=(.+)$/);

    if (shareMatch) {
      try {
        const payload = decodeState(decodeURIComponent(shareMatch[1]));
        if (payload.babyName) setBabyName(payload.babyName);
        if (payload.milestones) setCompletedMilestones({ ...defaultMilestones, ...payload.milestones });
        if (payload.notes) setNotes(payload.notes);
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
        triggerToast('📥 Loaded a shared progress snapshot!');
        hasLoadedRef.current = true;
        return;
      } catch (e) {
        console.warn('Could not parse shared snapshot link.', e);
      }
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const payload = JSON.parse(raw);
        if (payload.babyName) setBabyName(payload.babyName);
        if (payload.milestones) setCompletedMilestones({ ...defaultMilestones, ...payload.milestones });
        if (payload.notes) setNotes(payload.notes);
      }
    } catch (e) {
      console.warn('Could not read saved progress.', e);
    }
    hasLoadedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- AUTOSAVE ---
  useEffect(() => {
    if (!hasLoadedRef.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ babyName, milestones: completedMilestones, notes }));
    } catch (e) {
      console.warn('Could not save progress locally.', e);
    }
  }, [babyName, completedMilestones, notes]);

  // --- DYNAMIC TAB TITLE ---
  useEffect(() => {
    document.title = `${babyName}’s Steps — Walking Milestone Tracker`;
  }, [babyName]);

  // --- CELEBRATION BURST AUTO-CLEAR ---
  useEffect(() => {
    if (!celebration) return;
    const t = setTimeout(() => setCelebration(null), 1500);
    return () => clearTimeout(t);
  }, [celebration]);

  // --- TIMER CONTROLLER ---
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);
            playCompletionSound();
            triggerToast('🎉 Target time complete! Incredible job, baby!');
            return timerMax;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerMax, triggerToast]);

  const toggleMilestone = (id) => {
    setCompletedMilestones((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      if (updated[id]) {
        playCompletionSound();
        setCelebration(Date.now());
      }
      return updated;
    });
  };

  const saveBabyName = () => {
    setIsEditingName(false);
  };

  const submitNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const freshNote = {
      id: `note-${Date.now()}`,
      author: noteAuthor,
      text: newNote.trim(),
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [freshNote, ...prev]);
    setNewNote('');
  };

  const generateShareLink = async () => {
    const snapshot = { babyName, milestones: completedMilestones, notes };
    const encoded = encodeState(snapshot);
    const url = `${window.location.origin}${window.location.pathname}#share=${encoded}`;
    setShareUrl(url);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        const dummy = document.createElement('textarea');
        dummy.value = url;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);
      }
      triggerToast('📋 Shareable snapshot link copied to your clipboard!');
    } catch (e) {
      triggerToast('Link ready below — copy it manually.');
    }
  };

  const clearAllData = () => {
    if (!window.confirm('Reset all progress on this device? This cannot be undone.')) return;
    localStorage.removeItem(STORAGE_KEY);
    setBabyName('My Little Explorer');
    setCompletedMilestones(defaultMilestones);
    setNotes([]);
    triggerToast('🧹 Tracker reset to a blank slate.');
  };

  // --- GESTATIONAL AGE MATHEMATICS ---
  const getAdjustedWeeks = () => {
    if (!isPreemie) return babyAgeWeeks;
    const adjusted = babyAgeWeeks - weeksPremature;
    return adjusted < 0 ? 0 : adjusted;
  };

  // --- NEUROMOTOR SKILL CALCULATOR ---
  const calculateNeuromotorStrengths = () => {
    const categories = {
      core: { name: 'Core Control & Posture', score: 0, total: 0 },
      hip: { name: 'Hip Extensors & Cruise', score: 0, total: 0 },
      ankle: { name: 'Ankle & Foot Flexors', score: 0, total: 0 },
      balance: { name: 'Balance & Confidence', score: 0, total: 0 },
    };

    milestonesList.forEach((m) => {
      categories[m.category].total += m.weight;
      if (completedMilestones[m.id]) {
        categories[m.category].score += m.weight;
      }
    });

    return Object.keys(categories).map((key) => {
      const item = categories[key];
      const percent = item.total > 0 ? Math.round((item.score / item.total) * 100) : 0;
      return { key, name: item.name, percentage: percent };
    });
  };

  const currentWeekData = weekData.find((w) => w.week === activeWeek) || weekData[0];
  const activeActivity = currentWeekData.activities[selectedActivity] || currentWeekData.activities[0];
  const skillStrengths = calculateNeuromotorStrengths();
  const overallProgress = Math.round(skillStrengths.reduce((sum, s) => sum + s.percentage, 0) / skillStrengths.length);

  const selectWeek = (wk) => {
    const wkData = weekData.find((w) => w.week === wk);
    setActiveWeek(wk);
    setSelectedActivity(0);
    setTimerRunning(false);
    if (wkData) {
      setTimerSeconds(wkData.activities[0].timeLimit);
      setTimerMax(wkData.activities[0].timeLimit);
    }
  };

  const selectActivity = (idx) => {
    setSelectedActivity(idx);
    setTimerRunning(false);
    const act = currentWeekData.activities[idx];
    setTimerSeconds(act.timeLimit);
    setTimerMax(act.timeLimit);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#FFF9F2] text-stone-800 font-sans antialiased selection:bg-amber-150">
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-stone-900 text-white text-xs px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-slideIn" role="status" aria-live="polite">
          <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping shrink-0" />
          <span className="font-medium leading-relaxed">{toastMessage}</span>
        </div>
      )}

      {celebration && <ConfettiBurst key={celebration} />}

      {/* --- HEADER --- */}
      <header className="border-b border-stone-200/50 bg-white/70 backdrop-blur-xl sticky top-0 z-40 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl text-amber-800 shadow-md transform hover:rotate-12 transition-transform shrink-0">
              <FootprintIcon />
            </div>
            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={babyName}
                      onChange={(e) => setBabyName(e.target.value)}
                      onBlur={saveBabyName}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveBabyName();
                      }}
                      aria-label="Baby's name"
                      className="border-2 border-amber-300 rounded-xl px-2.5 py-0.5 text-md font-bold focus:outline-none focus:ring-2 focus:ring-amber-200 bg-amber-50/40 text-stone-850"
                      autoFocus
                    />
                    <button onClick={saveBabyName} className="text-xs bg-amber-500 hover:bg-amber-600 px-3 py-1.5 rounded-lg text-white font-bold transition-all">
                      Save
                    </button>
                  </div>
                ) : (
                  <h1 className="text-lg sm:text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                    {babyName}&rsquo;s Steps
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-[11px] text-amber-600 hover:text-amber-700 underline font-semibold cursor-pointer shrink-0"
                    >
                      (Rename)
                    </button>
                  </h1>
                )}
                <span className="text-[10px] px-2.5 py-0.5 bg-orange-100 text-orange-700 rounded-full font-bold uppercase tracking-wider shrink-0">
                  PT Master Class
                </span>
                <span className="text-[10px] px-2.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold uppercase tracking-wider shrink-0" title="Average across all four skill categories">
                  {overallProgress}% Overall Progress
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-medium">A gentle, week-by-week gait acceleration guide &amp; progress diagnostic suite</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
            <button
              onClick={generateShareLink}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-3 px-5 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-100/30 cursor-pointer active:scale-95 transition-all"
            >
              <ShareIcon /> Copy Shareable Progress Link
            </button>
          </div>
        </div>
      </header>

      {shareUrl && (
        <div className="max-w-7xl mx-auto m-4 p-4 rounded-3xl bg-teal-50/50 border border-teal-100 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm animate-fadeIn">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">👪</span>
            <div>
              <h4 className="font-extrabold text-stone-900 text-xs sm:text-sm">Snapshot link ready</h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Anyone who opens this link sees {babyName}&rsquo;s current progress. It&rsquo;s a point-in-time snapshot, not a live sync —
                if they make changes, they&rsquo;ll need to send you a fresh link back.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="bg-white border border-stone-200 text-xs text-stone-500 rounded-xl px-4 py-2 w-full md:w-64 font-mono focus:outline-none"
              onClick={(e) => e.target.select()}
            />
            <button onClick={generateShareLink} className="bg-stone-900 hover:bg-stone-850 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all">
              Copy
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN GRID --- */}
      <main className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-2.5 shadow-md border border-stone-150/60 flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((wk) => (
              <button
                key={wk}
                onClick={() => selectWeek(wk)}
                aria-pressed={activeWeek === wk}
                className={`flex-1 min-w-[80px] py-3 px-3 rounded-2xl text-center transition-all cursor-pointer ${
                  activeWeek === wk
                    ? 'bg-gradient-to-r from-orange-400 to-amber-500 text-white shadow-md shadow-orange-100/40 transform scale-[1.01]'
                    : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                <span className="block text-[9px] uppercase tracking-widest font-black opacity-85">Week</span>
                <span className="text-base font-black">0{wk}</span>
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/50 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                <CalendarIcon />
              </span>
              <h2 className="text-xl font-black text-stone-900">
                Stage {activeWeek}: {currentWeekData.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-amber-50/30 p-4 rounded-2xl text-xs sm:text-sm">
              <div>
                <span className="font-extrabold text-stone-800 block mb-1">🎯 Pediatric Target Focus:</span>
                <p className="text-stone-600 leading-relaxed">{currentWeekData.focus}</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-stone-200/70 pt-3 md:pt-0 md:pl-4">
                <span className="font-extrabold text-stone-800 block mb-1">🔬 Clinical Bio-Mechanisms:</span>
                <p className="text-stone-600 leading-relaxed">{currentWeekData.whyItMatters}</p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-wider text-stone-400 font-black">Curriculum Workouts:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {currentWeekData.activities.map((act, idx) => (
                  <button
                    key={act.id}
                    onClick={() => selectActivity(idx)}
                    aria-pressed={selectedActivity === idx}
                    className={`p-4 rounded-2xl text-left border-2 transition-all cursor-pointer ${
                      selectedActivity === idx ? 'border-orange-400 bg-orange-50/20 shadow-inner' : 'border-stone-150 bg-white hover:border-stone-200'
                    }`}
                  >
                    <span className="text-[9px] font-black text-orange-500 uppercase tracking-wider block mb-0.5">Option 0{idx + 1}</span>
                    <span className="font-bold text-sm text-stone-900 block leading-tight">{act.name}</span>
                    <div className="flex gap-1 mt-2">
                      <span className="text-[10px] px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md font-bold">{act.difficulty}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-150 flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest block">Active Dynamic Workshop</span>
                <h3 className="text-2xl font-black text-stone-950 mt-1">{activeActivity.name}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-stone-100 px-3 py-1 rounded-full text-stone-600 font-bold">Goal: {activeActivity.focus}</span>
                  <span className="text-xs bg-stone-100 px-3 py-1 rounded-full text-stone-600 font-bold">Cycle: {activeActivity.frequency}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-5">
                <div>
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <span className="w-1.5 h-4 bg-orange-400 rounded-full block"></span> How To Execute:
                  </h4>
                  <ol className="flex flex-col gap-3">
                    {activeActivity.howTo.map((step, sIdx) => (
                      <li key={sIdx} className="flex gap-2 text-xs sm:text-sm leading-relaxed text-stone-600">
                        <span className="font-bold text-orange-500 bg-orange-50 rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          {sIdx + 1}
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-gradient-to-br from-stone-900 to-stone-850 text-white p-5 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h5 className="font-bold text-xs text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                      <ClockIcon /> Clinical Timer
                    </h5>
                    <p className="text-[11px] text-stone-300 mt-1 max-w-[200px]">Keep baby in this balance posture for target duration.</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-2xl font-mono font-black text-white bg-stone-800 px-3.5 py-1.5 rounded-xl border border-stone-700 shadow-inner">
                      {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                    </div>

                    <button
                      onClick={() => setTimerRunning(!timerRunning)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                        timerRunning ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-amber-400 hover:bg-amber-500 text-stone-900'
                      }`}
                    >
                      {timerRunning ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(activeActivity.timeLimit);
                      }}
                      className="bg-stone-700 hover:bg-stone-600 p-2 rounded-xl text-xs"
                      title="Reset Timer"
                      aria-label="Reset timer"
                    >
                      ↺
                    </button>
                  </div>
                </div>

                <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl">
                  <h6 className="font-bold text-rose-800 text-xs flex items-center gap-1.5 mb-1">⚠️ Supervision Guidelines:</h6>
                  <p className="text-xs text-rose-700 leading-relaxed">{activeActivity.safety}</p>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center border-2 border-dashed border-stone-250 rounded-3xl p-5 bg-[#FDFCFB] relative min-h-[300px]">
                <div key={activeActivity.id} className="w-full animate-fadeIn">
                  <ActivityIllustration activityId={activeActivity.id} />
                </div>
                <p className="text-[10px] text-stone-400 text-center mt-3.5 italic">Illustrated guide: {activeActivity.name}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/50 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                <span>🗓️</span> Timeline Adjusted Age Advisor
              </h3>
              <p className="text-xs text-stone-500">Calculate correct developmental stages matching pediatric adjusted gestational guidelines.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-stone-50 p-4 rounded-2xl text-xs">
              <div className="flex items-center gap-2 select-none">
                <input
                  type="checkbox"
                  id="preemie-checkbox"
                  checked={isPreemie}
                  onChange={(e) => setIsPreemie(e.target.checked)}
                  className="w-4 h-4 text-orange-500 border-stone-300 rounded focus:ring-orange-400"
                />
                <label htmlFor="preemie-checkbox" className="font-bold text-stone-700 cursor-pointer">
                  Was Baby Born Prematurely?
                </label>
              </div>

              {isPreemie && (
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Weeks Early:</span>
                    <input
                      type="number"
                      min="0"
                      value={weeksPremature}
                      onChange={(e) => setWeeksPremature(Number(e.target.value))}
                      className="w-12 border border-stone-300 rounded px-1.5 py-0.5 text-stone-800 text-center font-bold focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-stone-500">Chronological Age (Weeks):</span>
                    <input
                      type="number"
                      min="0"
                      value={babyAgeWeeks}
                      onChange={(e) => setBabyAgeWeeks(Number(e.target.value))}
                      className="w-14 border border-stone-300 rounded px-1.5 py-0.5 text-stone-800 text-center font-bold focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {isPreemie && (
              <div className="bg-amber-50 border border-amber-200/60 p-4 rounded-2xl text-xs text-amber-900 leading-relaxed">
                🧑‍⚕️ <strong>Adjusted Age: {getAdjustedWeeks()} Weeks</strong> (versus {babyAgeWeeks} Weeks chronologically). Pediatric guidelines
                state walking milestones typically appear between <strong>9 to 18 months (39 to 78 weeks) adjusted age</strong>. Using adjusted
                timelines helps eliminate premature milestone anxiety!
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-stone-150">
            <h3 className="text-lg font-black text-stone-900 mb-1 flex items-center gap-1.5">
              <span>📊</span> Neuromotor Diagnostics
            </h3>
            <p className="text-xs text-stone-500 mb-4">Live muscle-group recruitment strength computed directly from completed milestone nodes.</p>

            <div className="flex flex-col gap-4">
              {skillStrengths.map((skill) => (
                <div key={skill.key} className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-xs font-bold text-stone-700">
                    <span>{skill.name}</span>
                    <span className="text-orange-500 font-black">{skill.percentage}%</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden border border-stone-200/50">
                    <div
                      className="bg-gradient-to-r from-orange-400 to-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/50">
            <h3 className="text-lg font-black text-stone-900 mb-1 flex items-center gap-1.5">
              <span>🏅</span> Milestone Accomplishments
            </h3>
            <p className="text-xs text-stone-500 mb-4">Tap milestones as your baby achieves them to power the diagnostics above.</p>

            <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
              {milestonesList.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => toggleMilestone(m.id)}
                  aria-pressed={completedMilestones[m.id]}
                  className={`w-full p-3 rounded-2xl border transition-all flex items-start gap-3 select-none cursor-pointer text-left ${
                    completedMilestones[m.id] ? 'border-emerald-200 bg-emerald-50/20' : 'border-stone-150 hover:border-stone-250 bg-[#FDFDFC]'
                  }`}
                >
                  <div
                    aria-hidden="true"
                    className={`w-5 h-5 rounded-full flex items-center justify-center border mt-0.5 transition-all shrink-0 ${
                      completedMilestones[m.id] ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'
                    }`}
                  >
                    {completedMilestones[m.id] && <CheckIcon />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] uppercase font-extrabold tracking-wider text-stone-400">Week {m.week}</span>
                      <span className="text-[8px] uppercase font-extrabold tracking-wider bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                        {m.category}
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 font-semibold leading-snug mt-0.5">{m.label}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/50 flex flex-col gap-4">
            <div>
              <h3 className="text-lg font-black text-stone-900 flex items-center gap-1.5">
                <span>💬</span> Family Log
              </h3>
              <p className="text-xs text-stone-500">Jot down wins and sessions. Saved on this device, and included in shared snapshot links.</p>
            </div>

            <form onSubmit={submitNote} className="flex flex-col gap-2.5 bg-stone-50 p-3.5 rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase shrink-0">I am:</span>
                <select
                  value={noteAuthor}
                  onChange={(e) => setNoteAuthor(e.target.value)}
                  className="bg-white border border-stone-200 text-xs rounded-xl px-2 py-1 focus:outline-none text-stone-700 font-bold"
                >
                  <option value="Parent 🤰">Parent 🤰</option>
                  <option value="Grandparent 👵">Grandparent 👵</option>
                  <option value="PT Specialist 🩺">PT Specialist 🩺</option>
                  <option value="Nanny 🧸">Nanny / Sitter 🧸</option>
                </select>
              </div>

              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log physical updates, walking successes, or session dates..."
                rows={2}
                aria-label="New log entry"
                className="w-full bg-white border border-stone-150 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-200 resize-none text-stone-850"
              />

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] self-end cursor-pointer transition-all duration-150"
              >
                Add Log Entry
              </button>
            </form>

            <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto pr-1">
              {notes.length === 0 ? (
                <div className="text-center py-4 text-stone-400 text-xs italic">No notes posted yet. Submit an update above!</div>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="p-3 bg-[#FDFBF9] rounded-2xl border border-stone-100 flex flex-col gap-1 text-xs">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-amber-700">{n.author}</span>
                      <span className="text-stone-400">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-stone-700 leading-normal font-medium">{n.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200/50">
            <h3 className="text-lg font-black text-stone-900 mb-1 flex items-center gap-1.5">
              <span>📚</span> Clinical Wisdom Board
            </h3>
            <p className="text-xs text-stone-500 mb-4">Science facts supporting safe infant locomotion.</p>

            <div className="flex gap-1.5 border-b border-stone-100 pb-3 mb-4">
              {['Barefoot', 'Walker Toys', 'Supporting Posture'].map((name, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveEduTab(idx)}
                  className={`flex-1 py-1 px-1 rounded-lg text-[10px] sm:text-xs font-bold text-center cursor-pointer transition-all ${
                    activeEduTab === idx ? 'bg-orange-100 text-orange-700' : 'text-stone-500 hover:bg-stone-50'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>

            {activeEduTab === 0 && (
              <div className="flex flex-col gap-2.5 text-xs leading-relaxed text-stone-600">
                <span className="font-extrabold text-stone-850">👣 Why Barefoot Walking is Crucial:</span>
                <p>Barefoot contact stimulates dynamic neural connections. Feeling varied terrain textures directly shapes early arches and fires balancing sensory paths.</p>
              </div>
            )}

            {activeEduTab === 1 && (
              <div className="flex flex-col gap-2.5 text-xs leading-relaxed text-stone-600">
                <span className="font-extrabold text-stone-850">🛑 Sit-In Walkers delay milestones:</span>
                <p>Traditional wheeled baby walkers promote abnormal toe-walking postures, tightening calf muscles and bypassing crucial core stabilizer development.</p>
              </div>
            )}

            {activeEduTab === 2 && (
              <div className="flex flex-col gap-2.5 text-xs leading-relaxed text-stone-600">
                <span className="font-extrabold text-stone-850">👐 How to Hold Correctly:</span>
                <p>Support your infant near their lower hips and pelvis rather than lifting their arms skyward. Holding them low forces their spine to assume the balancing role.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="mt-12 border-t border-stone-200/60 bg-stone-50 py-8 text-center px-4">
        <p className="text-xs text-stone-400 font-medium">
          For general developmental encouragement only — always follow guidance from your pediatrician or physical therapist.
        </p>
        <button onClick={clearAllData} className="text-[11px] text-stone-400 hover:text-rose-500 underline mt-2 cursor-pointer">
          Reset tracker on this device
        </button>
      </footer>
    </div>
  );
}
