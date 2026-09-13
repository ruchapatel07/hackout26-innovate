import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Mic, MicOff, X, Volume2, Bot, ChevronDown, Zap } from 'lucide-react';

// ─── FULL Knowledge Base + Action Commands ─────────────────────────────────
const KB = [
  // ── INFO ANSWERS ──────────────────────────────────────────────────────────
  {
    patterns: ['what is carbontrace', 'what is carbantrace', 'what is carbonlink', 'what is this', 'about this platform', 'explain carbontrace', 'what does this do', 'tell me about'],
    answer: "CarbonTrace AI is a digital marketplace that connects CO₂ producers like power plants and refineries with industries that reuse captured carbon — food and beverage, pharmaceuticals, chemicals, and agriculture. Think of it as a real-time stock exchange, but for carbon dioxide."
  },
  {
    patterns: ['how does it work', 'how does carbontrace work', 'how does carbonlink work', 'explain how'],
    answer: "Producers list their captured CO₂ with details like purity, volume, and price. Buyers browse and bid on listings. Once matched, the platform automatically arranges logistics through certified transporters. The entire flow is transparent and tracked in real time."
  },
  {
    patterns: ['how to list', 'add carbon', 'create listing', 'sell co2', 'list my carbon'],
    answer: "To list CO₂, log in as a Seller. In your dashboard, click 'Add Carbon' in the sidebar. Enter your capture method, available volume in tons, purity percentage, and price per ton. Your listing goes live on the marketplace instantly."
  },
  {
    patterns: ['how to buy', 'purchase co2', 'find co2', 'buy carbon', 'search listings'],
    answer: "To buy CO₂, log in as a Buyer. Click 'Find CO₂' in the sidebar to browse live listings. Filter by purity, price, and volume. Place a bid and the seller is notified immediately. Once accepted, transportation is arranged automatically."
  },
  {
    patterns: ['what is a transporter', 'logistics', 'transport co2', 'how is co2 delivered', 'transporter role'],
    answer: "Transporters are certified logistics providers who physically move CO₂ between producers and consumers using cryogenic tankers, ISO tanks, and tube trailers. They register vehicles and routes, and the platform matches them with shipment requests based on location and capacity."
  },
  {
    patterns: ['what is esg', 'esg calculator', 'esg score', 'carbon footprint'],
    answer: "ESG stands for Environmental, Social, and Governance. The ESG Calculator shows the ecological impact of recycling CO₂ — equivalent trees planted, vehicle emissions offset, and estimated carbon credit tokens earned under ISO 14064 certification."
  },
  {
    patterns: ['what is ai match', 'ai matching', 'how does ai work', 'matchmaker'],
    answer: "The AI Matchmaker analyzes listings, buyer purity requirements, and logistics availability to suggest the most efficient pairings. It factors in purity grade, delivery distance, price, and transaction history to find the optimal matches for both parties."
  },
  {
    patterns: ['what is purity', 'co2 purity', 'purity calculator', 'how purity works'],
    answer: "CO₂ purity refers to the percentage of pure carbon dioxide in a batch. Food-grade requires 99.9%, pharmaceutical requires 99.5%, industrial Grade A requires 99%, and Grade B requires 95%. Use the CO₂ Purity Calculator in the dashboard to calculate your batch's grade and market value."
  },
  {
    patterns: ['price', 'how much', 'cost', 'pricing', 'market rate'],
    answer: "CO₂ prices are market-driven. Food-grade CO₂ at 99.9% purity fetches around $85 per ton. Pharmaceutical grade is $70, Industrial Grade A is $55, and Grade B is $40 per ton. Use the Purity Calculator to estimate your exact batch value."
  },
  {
    patterns: ['transportation map', 'track shipment', 'route tracking', 'where is my delivery', 'track my order', 'tracking map'],
    answer: "The Transportation Map is in your dashboard under Transportation, Route Tracking, or Active Delivery. It shows live routes with animated truck positions, pickup and dropoff points, driver info, ETA, and journey progress bars for all active shipments."
  },
  {
    patterns: ['signup', 'register', 'create account', 'join'],
    answer: "To join CarbonTrace, click Get Started on the home page. Choose your role — Producer, Consumer, or Transporter — and fill in your company details. You get immediate access to the marketplace dashboard once registered."
  },
  {
    patterns: ['who are you', 'what are you', 'your name', 'are you ai'],
    answer: "I'm CarbonTrace's built-in Voice Assistant. I can answer questions, navigate to any section, run dashboard actions, and help you use every feature — all by voice. Say 'Help' to hear all available commands."
  },

  // ── NAVIGATION COMMANDS ───────────────────────────────────────────────────
  { patterns: ['go to map', 'show map', 'open map', 'show me the map', 'view map', 'carbon map', 'live map'], answer: "Opening the Live Carbon Map.", action: { type: 'navigate', section: 'map' } },
  { patterns: ['go to marketplace', 'open marketplace', 'show marketplace', 'view marketplace'], answer: "Navigating to the Marketplace.", action: { type: 'page', page: 'marketplace' } },
  { patterns: ['go to dashboard', 'open dashboard', 'my dashboard'], answer: "Opening your Dashboard.", action: { type: 'page', page: 'dashboard' } },
  { patterns: ['go home', 'home page', 'go to home', 'back to home'], answer: "Taking you to the Home page.", action: { type: 'page', page: 'home' } },
  { patterns: ['go to about', 'about page', 'open about'], answer: "Opening the About page.", action: { type: 'page', page: 'about' } },
  { patterns: ['how it works', 'how does this work', 'open how it works'], answer: "Opening the How It Works page.", action: { type: 'page', page: 'how-it-works' } },

  // ── DASHBOARD SECTION COMMANDS ────────────────────────────────────────────
  { patterns: ['open overview', 'show overview', 'dashboard overview', 'go to overview'], answer: "Opening your Dashboard Overview.", action: { type: 'navigate', section: 'overview' } },
  { patterns: ['find co2', 'open find', 'search co2', 'open search'], answer: "Opening Find CO₂ search.", action: { type: 'navigate', section: 'search' } },
  { patterns: ['open listings', 'my listings', 'show listings', 'view listings', 'co2 listings'], answer: "Opening CO₂ Listings.", action: { type: 'navigate', section: 'listings' } },
  { patterns: ['open bids', 'my bids', 'show bids', 'view bids', 'manage bids'], answer: "Opening Bids section.", action: { type: 'navigate', section: 'bids' } },
  { patterns: ['open orders', 'my orders', 'show orders', 'view orders', 'track orders'], answer: "Opening Orders.", action: { type: 'navigate', section: 'orders' } },
  { patterns: ['open transport', 'transportation', 'show transportation', 'logistics section'], answer: "Opening Transportation with the live route tracking map.", action: { type: 'navigate', section: 'transport' } },
  { patterns: ['route tracking', 'open tracking', 'track route', 'show tracking'], answer: "Opening Route Tracking map.", action: { type: 'navigate', section: 'tracking' } },
  { patterns: ['active delivery', 'show delivery', 'open delivery', 'my delivery'], answer: "Opening Active Delivery map.", action: { type: 'navigate', section: 'delivery' } },
  { patterns: ['my trips', 'open trips', 'show trips', 'view trips'], answer: "Opening My Trips.", action: { type: 'navigate', section: 'trips' } },
  { patterns: ['open earnings', 'my earnings', 'show earnings', 'view earnings'], answer: "Opening Earnings.", action: { type: 'navigate', section: 'earnings' } },
  { patterns: ['open messages', 'my messages', 'show messages', 'inbox'], answer: "Opening Messages.", action: { type: 'navigate', section: 'messages' } },
  { patterns: ['add carbon', 'list carbon', 'new listing', 'add co2', 'sell co2', 'create listing'], answer: "Opening Add Carbon listing form.", action: { type: 'navigate', section: 'add-carbon' } },
  { patterns: ['purity calculator', 'co2 calculator', 'open purity', 'calculate purity', 'purity calc'], answer: "Opening the CO₂ Purity Calculator.", action: { type: 'navigate', section: 'purity-calc' } },
  { patterns: ['open profile', 'my profile', 'show profile', 'edit profile'], answer: "Opening your Profile.", action: { type: 'navigate', section: 'profile' } },
  { patterns: ['notifications', 'open notifications', 'show alerts', 'my alerts'], answer: "Opening Notifications.", action: { type: 'navigate', section: 'notifications' } },
  { patterns: ['open requests', 'available requests', 'transport requests'], answer: "Opening Available Requests.", action: { type: 'navigate', section: 'requests' } },
  { patterns: ['manage users', 'user management', 'open users'], answer: "Opening User Management.", action: { type: 'navigate', section: 'users' } },
  { patterns: ['open reports', 'analytics', 'show reports', 'view analytics'], answer: "Opening Reports & Analytics.", action: { type: 'navigate', section: 'reports' } },
  { patterns: ['open payments', 'payment history', 'transactions'], answer: "Opening Payments.", action: { type: 'navigate', section: 'payments' } },
  { patterns: ['security', 'open security', 'show security'], answer: "Opening Security settings.", action: { type: 'navigate', section: 'security' } },

  // ── APP COMMANDS ─────────────────────────────────────────────────────────
  { patterns: ['login', 'sign in', 'open login', 'go to login'], answer: "Opening the Login page.", action: { type: 'page', page: 'login' } },
  { patterns: ['signup', 'register', 'open signup', 'create account', 'join now'], answer: "Opening the Sign Up page.", action: { type: 'page', page: 'signup' } },
  { patterns: ['logout', 'log out', 'sign out', 'exit account'], answer: "Logging you out now. See you soon!", action: { type: 'logout' } },

  // ── HELP ─────────────────────────────────────────────────────────────────
  {
    patterns: ['help', 'what can you do', 'commands', 'what can i say', 'how to use you', 'list commands', 'show commands'],
    answer: "Here's what I can do: Navigate — say 'Go to map', 'Open marketplace', 'Show transportation', 'Open purity calculator', 'Go to my bids', 'Open earnings', 'Add carbon', 'Open notifications', 'Go home'. App actions — 'Login', 'Logout'. Info — 'What is CarbonTrace?', 'How does it work?', 'What is purity?', 'What is ESG?', 'Explain AI match'. Say any of these anytime!"
  },
];

const findAnswer = (text) => {
  const lower = text.toLowerCase().trim();
  for (const entry of KB) {
    if (entry.patterns.some(p => lower.includes(p))) return entry;
  }
  return {
    answer: "I didn't catch that. Try saying 'Help' to hear all available commands, or ask something like 'What is CarbonTrace?' or 'Open the map'."
  };
};

// ─── Component ─────────────────────────────────────────────────────────────
export const VoiceAssistant = () => {
  const { navigatePage, setDashboardSection, currentUser, activePage, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm your CarbonTrace Voice Assistant 🎤\nSay 'Help' to hear all commands, or try: 'Open purity calculator', 'Show transportation map', 'Go to my bids'." }
  ]);
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setSupported(false); return; }
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.continuous = false;
    recog.interimResults = true;
    recog.onstart = () => setIsListening(true);
    recog.onend = () => setIsListening(false);
    recog.onerror = () => setIsListening(false);
    recog.onresult = (event) => {
      const interim = Array.from(event.results).map(r => r[0].transcript).join('');
      setTranscript(interim);
      if (event.results[event.results.length - 1].isFinal) {
        handleUserSpeech(interim);
        setTranscript('');
      }
    };
    recognitionRef.current = recog;
    return () => recog.abort();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speak = useCallback((text) => {
    synthRef.current.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.95; utter.pitch = 1.05; utter.volume = 1;
    utter.onstart = () => setIsSpeaking(true);
    utter.onend = () => setIsSpeaking(false);
    synthRef.current.speak(utter);
  }, []);

  const executeAction = useCallback((action) => {
    if (!action) return;
    setTimeout(() => {
      if (action.type === 'navigate') {
        // Always go to dashboard then set section
        if (activePage !== 'dashboard' && currentUser) navigatePage('dashboard');
        setTimeout(() => setDashboardSection(action.section), activePage !== 'dashboard' ? 400 : 0);
      } else if (action.type === 'page') {
        navigatePage(action.page);
      } else if (action.type === 'logout') {
        logout?.();
      }
    }, 800);
  }, [activePage, currentUser, navigatePage, setDashboardSection, logout]);

  const handleUserSpeech = useCallback((text) => {
    if (!text.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    const result = findAnswer(text);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text: result.answer }]);
      speak(result.answer);
      if (result.action) executeAction(result.action);
    }, 300);
  }, [speak, executeAction]);

  const toggleListen = () => {
    if (!supported) return;
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      synthRef.current.cancel();
      try { recognitionRef.current?.start(); } catch (e) { /* already started */ }
    }
  };

  const stopSpeaking = () => { synthRef.current.cancel(); setIsSpeaking(false); };

  // Quick command chips
  const QUICK_CMDS = ['Help', 'Open purity calculator', 'Show transportation', 'Open map', 'My bids', 'Add carbon'];

  return (
    <>
      {/* Floating Panel */}
      {isOpen && (
        <div id="voiceAssistantPanel" style={{
          position: 'fixed', bottom: '90px', right: '24px', width: '380px', maxHeight: '520px',
          zIndex: 9999, display: 'flex', flexDirection: 'column', borderRadius: '22px', overflow: 'hidden',
          background: 'linear-gradient(135deg, #0a1f14 0%, #071b0f 100%)',
          border: '1px solid rgba(16,185,129,0.25)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.75), 0 0 50px rgba(16,185,129,0.08)',
          fontFamily: 'Inter, sans-serif'
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 18px', background: 'rgba(16,185,129,0.1)', borderBottom: '1px solid rgba(16,185,129,0.15)', flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#10b981,#059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: isSpeaking ? '0 0 18px rgba(16,185,129,0.9)' : '0 0 8px rgba(16,185,129,0.4)', transition: 'box-shadow 0.3s' }}>
              <Bot size={18} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: 13 }}>CarbonTrace Assistant</div>
              <div style={{ color: '#6b7c72', fontSize: 11 }}>
                {isListening ? '🔴 Listening…' : isSpeaking ? '🔊 Speaking…' : '● Ready — say a command'}
              </div>
            </div>
            {isSpeaking && (
              <button onClick={stopSpeaking} style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '4px 8px', cursor: 'pointer', color: '#f87171', fontSize: 11 }}>
                <Volume2 size={12} style={{ display: 'inline', marginRight: 3 }} />Stop
              </button>
            )}
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#6b7c72', padding: 4 }}>
              <ChevronDown size={18} />
            </button>
          </div>

          {/* Quick Commands */}
          <div style={{ padding: '8px 14px', display: 'flex', flexWrap: 'wrap', gap: 6, borderBottom: '1px solid rgba(16,185,129,0.1)', flexShrink: 0, background: 'rgba(0,0,0,0.15)' }}>
            {QUICK_CMDS.map(cmd => (
              <button key={cmd} onClick={() => handleUserSpeech(cmd)} style={{ padding: '3px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)', color: '#6ee7b7', transition: 'all 0.15s' }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.25)'; e.currentTarget.style.color = '#fff'; }}
                onMouseOut={e => { e.currentTarget.style.background = 'rgba(16,185,129,0.12)'; e.currentTarget.style.color = '#6ee7b7'; }}>
                <Zap size={9} style={{ display: 'inline', marginRight: 3 }} />{cmd}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '86%', padding: '9px 13px',
                  borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.from === 'user' ? 'linear-gradient(135deg,#10b981,#059669)' : 'rgba(255,255,255,0.06)',
                  border: msg.from === 'user' ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  color: msg.from === 'user' ? '#fff' : '#d1fae5',
                  fontSize: 12.5, lineHeight: 1.55,
                  fontWeight: msg.from === 'user' ? 600 : 400,
                  whiteSpace: 'pre-line'
                }}>{msg.text}</div>
              </div>
            ))}
            {transcript && (
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ maxWidth: '86%', padding: '9px 13px', borderRadius: '16px 16px 4px 16px', background: 'rgba(16,185,129,0.15)', border: '1px dashed rgba(16,185,129,0.4)', color: '#6ee7b7', fontSize: 12.5, fontStyle: 'italic' }}>
                  {transcript}…
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Mic Bar */}
          <div style={{ padding: '12px 16px', flexShrink: 0, borderTop: '1px solid rgba(16,185,129,0.12)', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', gap: 12 }}>
            {!supported ? (
              <p style={{ color: '#6b7c72', fontSize: 12 }}>Speech recognition not supported in this browser. Use Chrome or Edge.</p>
            ) : (
              <>
                <button id="voiceMicButton" onClick={toggleListen} style={{
                  width: 50, height: 50, borderRadius: '50%', border: 'none', cursor: 'pointer',
                  background: isListening ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: isListening ? '0 0 0 6px rgba(239,68,68,0.25), 0 0 20px rgba(239,68,68,0.6)' : '0 0 0 4px rgba(16,185,129,0.2), 0 0 16px rgba(16,185,129,0.35)',
                  transition: 'all 0.25s ease',
                  animation: isListening ? 'va-pulse 1.2s ease-in-out infinite' : 'none'
                }}>
                  {isListening ? <MicOff size={20} color="white" /> : <Mic size={20} color="white" />}
                </button>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#d1fae5', fontSize: 12, fontWeight: 700, margin: 0 }}>
                    {isListening ? 'Listening… speak your command' : 'Tap mic or click a command above'}
                  </p>
                  <p style={{ color: '#6b7c72', fontSize: 10, margin: 0 }}>
                    Works best in Chrome · Edge · Safari
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Trigger */}
      <button id="voiceAssistantTrigger" onClick={() => setIsOpen(p => !p)} title="Voice Assistant" style={{
        position: 'fixed', bottom: '24px', right: '24px',
        width: 58, height: 58, borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 10000,
        background: isOpen ? 'linear-gradient(135deg,#374151,#1f2937)' : 'linear-gradient(135deg,#10b981,#059669)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: isOpen ? '0 4px 20px rgba(0,0,0,0.4)' : '0 4px 24px rgba(16,185,129,0.5), 0 0 0 4px rgba(16,185,129,0.15)',
        transition: 'all 0.3s ease'
      }}>
        {isOpen ? <X size={24} color="white" /> : <Mic size={24} color="white" />}
        {!isOpen && (
          <span style={{ position: 'absolute', top: 2, right: 2, width: 12, height: 12, borderRadius: '50%', background: '#10b981', border: '2px solid #07100a', animation: 'va-dot-pulse 2s ease-in-out infinite' }} />
        )}
      </button>

      {/* Animations */}
      <style>{`
        @keyframes va-pulse { 0%,100%{box-shadow:0 0 0 4px rgba(239,68,68,.25),0 0 20px rgba(239,68,68,.5)} 50%{box-shadow:0 0 0 10px rgba(239,68,68,.1),0 0 30px rgba(239,68,68,.8)} }
        @keyframes va-dot-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
      `}</style>
    </>
  );
};
