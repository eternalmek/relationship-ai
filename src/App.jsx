import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, BarChart2, User, Zap, Sparkles, Copy, Check, Link as LinkIcon, Activity, Smile } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { signInAnonymously, onAuthStateChanged, signOut, signInWithCustomToken } from "firebase/auth";
import { collection, addDoc, query, orderBy, limit, onSnapshot, doc, setDoc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from './firebase';

// APP CONFIG
const appId = 'betterus-ai-prod';
const LOVE_LANGUAGES = ["Words of Affirmation", "Acts of Service", "Receiving Gifts", "Quality Time", "Physical Touch"];
const ATTACHMENT_STYLES = ["Secure", "Anxious-Preoccupied", "Dismissive-Avoidant", "Fearful-Avoidant"];

const LoginScreen = ({ onLogin }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
    <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
      <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart className="text-rose-500 w-8 h-8 fill-current" />
      </div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">BetterUs Ai</h1>
      <p className="text-slate-500 mb-8">AI companion for a deeper connection.</p>
      <button onClick={onLogin} className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"><Sparkles className="w-5 h-5" />Get Started</button>
    </div>
  </div>
);

const Dashboard = ({ user, profile, onNavigate }) => {
  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <div><h1 className="text-2xl font-bold text-slate-800">Hi, {profile?.name || 'Partner'}</h1><p className="text-slate-500 text-sm">Welcome to BetterUs.</p></div>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">{profile?.name?.[0] || 'U'}</div>
      </header>
      <div onClick={() => onNavigate('checkin')} className="bg-gradient-to-r from-rose-400 to-orange-300 rounded-3xl p-6 text-white shadow-lg cursor-pointer transform transition hover:scale-[1.02]">
        <h3 className="font-bold text-lg">Daily Check-in</h3><p className="text-white/90 text-sm">Track your mood & bond.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => onNavigate('coach')} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3"><Zap className="text-teal-500" /><span className="font-semibold text-slate-700 text-sm">AI Coach</span></button>
        <button onClick={() => onNavigate('profile')} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3"><User className="text-indigo-500" /><span className="font-semibold text-slate-700 text-sm">Profile</span></button>
      </div>
    </div>
  );
};

const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [loveLanguage, setLoveLanguage] = useState('');
  const [attachmentStyle, setAttachmentStyle] = useState('');

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const profileData = {
      name,
      loveLanguage,
      attachmentStyle,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), profileData);
    onComplete();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center mb-6">
          {[0, 1, 2].map(i => (
            <div key={i} className={`w-3 h-3 rounded-full mx-1 ${i <= step ? 'bg-rose-400' : 'bg-slate-200'}`} />
          ))}
        </div>
        
        {step === 0 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What's your name?</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 border border-slate-200 rounded-xl mb-6 focus:outline-none focus:border-rose-400"
            />
          </div>
        )}

        {step === 1 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Your Love Language?</h2>
            <div className="space-y-3">
              {LOVE_LANGUAGES.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLoveLanguage(lang)}
                  className={`w-full p-4 rounded-xl border ${loveLanguage === lang ? 'border-rose-400 bg-rose-50' : 'border-slate-200'} text-left`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Attachment Style?</h2>
            <div className="space-y-3">
              {ATTACHMENT_STYLES.map(style => (
                <button
                  key={style}
                  onClick={() => setAttachmentStyle(style)}
                  className={`w-full p-4 rounded-xl border ${attachmentStyle === style ? 'border-rose-400 bg-rose-50' : 'border-slate-200'} text-left`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={(step === 0 && !name) || (step === 1 && !loveLanguage) || (step === 2 && !attachmentStyle)}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {step === 2 ? 'Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

const CheckIn = ({ user, onNavigate }) => {
  const [mood, setMood] = useState(5);
  const [bondRating, setBondRating] = useState(5);
  const [note, setNote] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'checkins'),
      orderBy('createdAt', 'desc'),
      limit(7)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setHistory(data);
    });
    return unsub;
  }, [user.uid]);

  const handleSubmit = async () => {
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'checkins'), {
      mood,
      bondRating,
      note,
      createdAt: serverTimestamp()
    });
    setSubmitted(true);
  };

  const chartData = history.slice().reverse().map((item, idx) => ({
    day: `Day ${idx + 1}`,
    mood: item.mood,
    bond: item.bondRating
  }));

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
          <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-500 w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Check-in Complete!</h2>
          <p className="text-slate-500 mb-6">Keep building your bond.</p>
          <button onClick={() => onNavigate('dashboard')} className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl bg-slate-100">
          <Activity className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Daily Check-in</h1>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Smile className="text-amber-500" />
          <span className="font-semibold text-slate-700">Your Mood Today</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-2">
          <span>Low</span>
          <span className="font-bold text-rose-500">{mood}/10</span>
          <span>Great</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="text-rose-500" />
          <span className="font-semibold text-slate-700">Bond Rating</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={bondRating}
          onChange={(e) => setBondRating(Number(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-slate-500 mt-2">
          <span>Distant</span>
          <span className="font-bold text-rose-500">{bondRating}/10</span>
          <span>Connected</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle className="text-teal-500" />
          <span className="font-semibold text-slate-700">Notes (Optional)</span>
        </div>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How are things going?"
          className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 resize-none"
          rows={3}
        />
      </div>

      {history.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="text-indigo-500" />
            <span className="font-semibold text-slate-700">Your Trend</span>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="mood" stroke="#f472b6" fill="#fce7f3" />
              <Area type="monotone" dataKey="bond" stroke="#818cf8" fill="#e0e7ff" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      <button onClick={handleSubmit} className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all">
        Submit Check-in
      </button>
    </div>
  );
};

const UserProfile = ({ user, profile, onNavigate, onLogout }) => {
  const [name, setName] = useState(profile?.name || '');
  const [loveLanguage, setLoveLanguage] = useState(profile?.loveLanguage || '');
  const [attachmentStyle, setAttachmentStyle] = useState(profile?.attachmentStyle || '');
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || '');
      setLoveLanguage(profile.loveLanguage || '');
      setAttachmentStyle(profile.attachmentStyle || '');
    }
  }, [profile]);

  const handleSave = async () => {
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profile', 'main'), {
      name,
      loveLanguage,
      attachmentStyle,
      updatedAt: serverTimestamp()
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl bg-slate-100">
          <User className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-bold text-slate-800">Your Profile</h1>
      </header>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Love Language</label>
          <select
            value={loveLanguage}
            onChange={(e) => setLoveLanguage(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"
          >
            <option value="">Select...</option>
            {LOVE_LANGUAGES.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-2">Attachment Style</label>
          <select
            value={attachmentStyle}
            onChange={(e) => setAttachmentStyle(e.target.value)}
            className="w-full p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400 bg-white"
          >
            <option value="">Select...</option>
            {ATTACHMENT_STYLES.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <button
          onClick={handleSave}
          className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
        >
          {saved ? <><Check className="w-5 h-5" />Saved!</> : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
        <h3 className="font-semibold text-slate-700 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-indigo-500" />
          Share App
        </h3>
        <button
          onClick={handleCopyLink}
          className="w-full bg-indigo-50 text-indigo-600 py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          {copied ? <><Check className="w-5 h-5" />Copied!</> : <><Copy className="w-5 h-5" />Copy Link</>}
        </button>
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-rose-50 text-rose-600 py-4 rounded-xl font-semibold"
      >
        Sign Out
      </button>
    </div>
  );
};

const AICoach = ({ user, profile, onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query(
      collection(db, 'artifacts', appId, 'users', user.uid, 'coach_messages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setMessages(data);
    });
    return unsub;
  }, [user.uid]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'coach_messages'), {
      role: 'user',
      content: input,
      createdAt: serverTimestamp()
    });
    
    setInput('');
    setLoading(true);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(async () => {
      const responses = [
        "That's a great question! Building connection takes patience and understanding.",
        "Consider expressing your feelings openly with your partner.",
        "Remember, healthy relationships require both partners to communicate effectively.",
        "Try setting aside quality time each day, even if it's just 15 minutes.",
        "Your feelings are valid. It's important to acknowledge them."
      ];
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      
      await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'coach_messages'), {
        role: 'assistant',
        content: aiResponse,
        createdAt: serverTimestamp()
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="flex items-center gap-4 p-6 bg-white border-b border-slate-100">
        <button onClick={() => onNavigate('dashboard')} className="p-2 rounded-xl bg-slate-100">
          <Zap className="w-5 h-5 text-teal-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-slate-800">AI Relationship Coach</h1>
          <p className="text-sm text-slate-500">Get personalized advice</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <Sparkles className="w-12 h-12 text-rose-300 mx-auto mb-4" />
            <p className="text-slate-500">Start a conversation with your AI coach!</p>
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] p-4 rounded-2xl ${
              msg.role === 'user'
                ? 'ml-auto bg-slate-900 text-white'
                : 'bg-white border border-slate-100 text-slate-700'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-[80%] p-4 rounded-2xl bg-white border border-slate-100 text-slate-500">
            <div className="flex gap-1">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.1s' }}>●</span>
              <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>●</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your coach..."
            className="flex-1 p-4 border border-slate-200 rounded-xl focus:outline-none focus:border-rose-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-slate-900 text-white px-6 rounded-xl font-semibold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default function BetterUsApp() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const init = async () => { 
      if (typeof __initial_auth_token !== 'undefined') {
        await signInWithCustomToken(auth, __initial_auth_token); 
      } else {
        await signInAnonymously(auth); 
      }
    };
    init();
    return onAuthStateChanged(auth, async (u) => { 
      setUser(u); 
      setLoading(false);
      if(u) {
        onSnapshot(doc(db,'artifacts',appId,'users',u.uid,'profile','main'), d => {
          const data = d.data();
          setProfile(data);
          if (!data) {
            setView('onboarding');
          }
        }); 
      }
    });
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
    setView('dashboard');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  if (!user) return <LoginScreen onLogin={async () => await signInAnonymously(auth)} />;
  
  return (
    <div className="bg-slate-50 min-h-screen flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {view === 'onboarding' && <Onboarding user={user} onComplete={() => setView('dashboard')} />}
          {view === 'dashboard' && <Dashboard user={user} profile={profile} onNavigate={setView} />}
          {view === 'checkin' && <CheckIn user={user} onNavigate={setView} />}
          {view === 'profile' && <UserProfile user={user} profile={profile} onNavigate={setView} onLogout={handleLogout} />}
          {view === 'coach' && <AICoach user={user} profile={profile} onNavigate={setView} />}
        </div>
      </div>
    </div>
  );
}
