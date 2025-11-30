import React, { useEffect, useState, useCallback } from 'react';
import {
  Heart,
  MessageCircle,
  BarChart2,
  User,
  Zap,
  Sparkles,
  Link as LinkIcon,
  Copy,
  Check,
  LogOut,
  ChevronRight,
  Activity,
  Smile,
} from 'lucide-react';
import {
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { supabase } from './supabase';

const LOVE_LANGUAGES = ['Words of Affirmation', 'Acts of Service', 'Receiving Gifts', 'Quality Time', 'Physical Touch'];
const ATTACHMENT_STYLES = ['Secure', 'Anxious-Preoccupied', 'Dismissive-Avoidant', 'Fearful-Avoidant'];

const MOCK_DATA = [
  { name: 'Mon', mood: 6, connection: 5 },
  { name: 'Tue', mood: 7, connection: 6 },
  { name: 'Wed', mood: 5, connection: 8 },
  { name: 'Thu', mood: 8, connection: 7 },
  { name: 'Fri', mood: 7, connection: 9 },
  { name: 'Sat', mood: 9, connection: 9 },
  { name: 'Sun', mood: 8, connection: 8 },
];

async function generateRelationshipAI(prompt, systemInstruction) {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  if (!apiKey) return 'Please configure an OpenAI API key for live insights.';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error('AI Service Unavailable');
    const data = await response.json();
    const completion = data.choices?.[0]?.message?.content?.trim();
    return completion || "I couldn't generate insight right now.";
  } catch (error) {
    console.error('AI Error:', error);
    return 'Our relationship AI is taking a momentary break.';
  }
}

const LoginScreen = ({ onAuthenticate, authError, loading }) => {
  const [mode, setMode] = useState('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthenticate({ mode, email, password });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-rose-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm text-center">
        <div className="bg-rose-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="text-rose-500 w-8 h-8 fill-current" />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Relationship OS</h1>
        <p className="text-slate-500 mb-6">
          Start with your email to secure your space before sharing relationship details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-xs font-semibold text-slate-500">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200"
            />
          </div>
          {authError && <p className="text-sm text-rose-500">{authError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Activity className="animate-spin" size={18} /> : <Sparkles className="w-5 h-5" />}
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
          className="w-full text-slate-500 text-sm mt-4 hover:text-slate-700"
        >
          {mode === 'signin' ? "New here? Create an account" : 'Already have an account? Sign in'}
        </button>
        <p className="text-xs text-slate-400 mt-4">Private & Secure • Syncs across devices</p>
      </div>
    </div>
  );
};

const Onboarding = ({ user, onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    partner_name: '',
    relationship_length: '',
    love_language: LOVE_LANGUAGES[0],
    attachment_style: ATTACHMENT_STYLES[0],
    goal: '',
  });
  const [loadingState, setLoadingState] = useState(false);

  const handleSave = async () => {
    setLoadingState(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        email: user.email || '',
        name: formData.name,
        partner_name: formData.partner_name,
        relationship_length: formData.relationship_length,
        love_language: formData.love_language,
        attachment_style: formData.attachment_style,
        goal: formData.goal,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      onComplete();
    } catch (e) {
      console.error(e);
      alert('Error saving profile.');
    }
    setLoadingState(false);
  };

  const InputClass =
    'w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-200 transition-all';
  const LabelClass = 'block text-sm font-semibold text-slate-500 mb-2 uppercase tracking-wide';

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col justify-center max-w-md mx-auto">
      <div className="mb-8">
        <div className="flex gap-2 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-rose-400' : 'bg-slate-200'}`} />
          ))}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">
          {step === 1 && 'Tell us about you'}
          {step === 2 && 'Understanding your bond'}
          {step === 3 && 'Your relationship style'}
        </h2>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <div>
            <label className={LabelClass}>Your Name</label>
            <input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={InputClass}
              placeholder="e.g. Alex"
            />
          </div>
          <div>
            <label className={LabelClass}>Partner&apos;s Name</label>
            <input
              value={formData.partner_name}
              onChange={(e) => setFormData({ ...formData, partner_name: e.target.value })}
              className={InputClass}
              placeholder="e.g. Sam"
            />
          </div>
          <button onClick={() => setStep(2)} className="w-full bg-rose-500 text-white py-4 rounded-xl font-semibold mt-4">
            Next Step
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <div>
            <label className={LabelClass}>How long have you been together?</label>
            <select
              value={formData.relationship_length}
              onChange={(e) => setFormData({ ...formData, relationship_length: e.target.value })}
              className={InputClass}
            >
              <option value="">Select duration...</option>
              <option value="Less than 6 months">Less than 6 months</option>
              <option value="6 months - 2 years">6 months - 2 years</option>
              <option value="2 - 5 years">2 - 5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div>
            <label className={LabelClass}>Primary Relationship Goal</label>
            <input
              value={formData.goal}
              onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              className={InputClass}
              placeholder="e.g. Communicate better without fighting"
            />
          </div>
          <button onClick={() => setStep(3)} className="w-full bg-rose-500 text-white py-4 rounded-xl font-semibold mt-4">
            Next Step
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
          <div>
            <label className={LabelClass}>Your Love Language</label>
            <select
              value={formData.love_language}
              onChange={(e) => setFormData({ ...formData, love_language: e.target.value })}
              className={InputClass}
            >
              {LOVE_LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={LabelClass}>Your Attachment Style</label>
            <select
              value={formData.attachment_style}
              onChange={(e) => setFormData({ ...formData, attachment_style: e.target.value })}
              className={InputClass}
            >
              {ATTACHMENT_STYLES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSave}
            disabled={loadingState}
            className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold mt-4 disabled:opacity-50"
          >
            {loadingState ? 'Setting up...' : 'Complete Profile'}
          </button>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ user, profile, onNavigate }) => {
  const [chartData, setChartData] = useState(MOCK_DATA);
  const [todayLog, setTodayLog] = useState(null);
  const [partnerLog, setPartnerLog] = useState(null);
  const [partnerName, setPartnerName] = useState('Partner');

  useEffect(() => {
    if (!user) return;

    const fetchEmotions = async () => {
      const { data, error } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      if (!error && data && data.length > 0) {
        const logs = [...data].reverse().map((d) => ({
          name: d.day_name,
          mood: d.mood,
          connection: d.connection,
        }));
        setChartData(logs);

        const todayStr = new Date().toLocaleDateString();
        const foundToday = data.find((d) => d.date_str === todayStr);
        setTodayLog(foundToday || null);
      }
    };

    fetchEmotions();

    // Set up realtime subscription for emotions
    const channel = supabase
      .channel('emotions-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'emotions', filter: `user_id=eq.${user.id}` },
        () => {
          fetchEmotions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => {
    if (!user || !profile?.partner_id) return;

    const fetchPartnerData = async () => {
      // Fetch partner's profile
      const { data: partnerProfile } = await supabase
        .from('profiles')
        .select('name')
        .eq('id', profile.partner_id)
        .single();

      if (partnerProfile) {
        setPartnerName(partnerProfile.name);
      }

      // Fetch partner's latest emotion
      const todayStr = new Date().toLocaleDateString();
      const { data: partnerEmotions } = await supabase
        .from('emotions')
        .select('*')
        .eq('user_id', profile.partner_id)
        .eq('date_str', todayStr)
        .limit(1)
        .single();

      if (partnerEmotions) {
        setPartnerLog(partnerEmotions);
      }
    };

    fetchPartnerData();
  }, [user, profile]);

  return (
    <div className="p-6 pb-24 space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hi, {profile?.name || 'Friend'}</h1>
          <p className="text-slate-500 text-sm">Let&apos;s nurture your connection today.</p>
        </div>
        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
          {profile?.name?.[0] || 'U'}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!todayLog ? (
          <div
            onClick={() => onNavigate('checkin')}
            className="bg-gradient-to-r from-rose-400 to-orange-300 rounded-3xl p-6 text-white shadow-lg shadow-rose-200/50 cursor-pointer transform transition hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg mb-1">Daily Check-in</h3>
                <p className="text-white/90 text-sm">Track your mood.</p>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">✨ 2 min</span>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-green-100 p-2 rounded-full text-green-600">
                <Sparkles size={16} />
              </div>
              <h3 className="font-bold text-slate-800">You&apos;re checked in</h3>
            </div>
            <p className="text-slate-500 text-sm">Mood: {todayLog.mood}/10</p>
          </div>
        )}

        {profile?.partner_id ? (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-6 border border-indigo-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-indigo-500 fill-current" />
              <h3 className="font-bold text-indigo-900">{partnerName}&apos;s Pulse</h3>
            </div>
            {partnerLog ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-indigo-700 font-medium">Mood</span>
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div key={i} className={`w-1.5 h-3 rounded-full ${i < partnerLog.mood ? 'bg-indigo-400' : 'bg-indigo-200/50'}`} />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-2">
                <p className="text-indigo-400 text-sm italic">{partnerName} hasn&apos;t checked in yet today.</p>
              </div>
            )}
          </div>
        ) : (
          <div
            onClick={() => onNavigate('profile')}
            className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-100 transition"
          >
            <LinkIcon className="text-slate-400 mb-2" />
            <h3 className="font-bold text-slate-600 text-sm">Connect Partner</h3>
            <p className="text-xs text-slate-400">See each other&apos;s mood</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onNavigate('analyzer')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:bg-slate-50 transition"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-500">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700 text-sm">Message Analyzer</span>
        </button>
        <button
          onClick={() => onNavigate('coach')}
          className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 hover:bg-slate-50 transition"
        >
          <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center text-teal-500">
            <Zap className="w-6 h-6" />
          </div>
          <span className="font-semibold text-slate-700 text-sm">Daily Coach</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-indigo-500" />
          Emotional Trends
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Area type="monotone" dataKey="mood" stroke="#8884d8" strokeWidth={2} fillOpacity={1} fill="url(#colorMood)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const CheckIn = ({ user, onComplete }) => {
  const [values, setValues] = useState({ mood: 5, stress: 5, connection: 5, appreciation: 5 });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const today = new Date();
    const dateStr = today.toLocaleDateString();
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = days[today.getDay()];

    try {
      const { error } = await supabase.from('emotions').insert({
        user_id: user.id,
        mood: values.mood,
        stress: values.stress,
        connection: values.connection,
        appreciation: values.appreciation,
        date_str: dateStr,
        day_name: dayName,
      });
      if (error) throw error;
      onComplete();
    } catch (e) {
      console.error(e);
      alert('Error saving check-in.');
    }
    setIsSubmitting(false);
  };

  const renderSlider = (key, label, icon) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between mb-4">
        <label className="font-semibold text-slate-700 flex items-center gap-2">
          {icon} {label}
        </label>
        <span className="font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full text-sm">{values[key]}/10</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        value={values[key]}
        onChange={(e) => setValues({ ...values, [key]: parseInt(e.target.value, 10) })}
        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Daily Check-in</h2>
      {renderSlider('mood', 'Overall Mood', <Smile size={18} className="text-yellow-500" />)}
      {renderSlider('stress', 'Stress Level', <Activity size={18} className="text-rose-500" />)}
      {renderSlider('connection', 'Connection Feeling', <Heart size={18} className="text-rose-400" />)}
      {renderSlider('appreciation', 'Appreciation', <Sparkles size={18} className="text-amber-400" />)}

      <button
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full bg-slate-900 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-slate-800 transition-all mt-4"
      >
        {isSubmitting ? 'Saving...' : 'Save & Continue'}
      </button>
    </div>
  );
};

const MessageAnalyzer = ({ user }) => {
  const [text, setText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loadingState, setLoadingState] = useState(false);

  const analyze = async () => {
    if (!text) return;
    setLoadingState(true);
    const systemPrompt =
      "You are an expert conflict resolution mediator. Analyze the user's message. Return JSON with keys: 'tone', 'underlying_emotion', 'interpretation' (what partner hears), 'constructive_response'.";

    try {
      const resultStr = await generateRelationshipAI(text, systemPrompt);
      const jsonStr = resultStr.replace(/```json|```/g, '').trim();
      const result = JSON.parse(jsonStr);
      setAnalysis(result);

      if (user) {
        const { error } = await supabase.from('conversations').insert({
          user_id: user.id,
          text,
          analysis: result,
        });
        if (error) {
          console.error('Error saving conversation:', error);
        }
      }
    } catch (e) {
      console.error(e);
      setAnalysis({
        tone: 'Unclear',
        underlying_emotion: 'Confusion',
        interpretation: "We couldn't parse the specific emotion here.",
        constructive_response: 'Try taking a deep breath and asking for clarification.',
      });
    }
    setLoadingState(false);
  };

  return (
    <div className="p-6 pb-24 space-y-6 h-full flex flex-col">
      <h2 className="text-2xl font-bold text-slate-800">Message Analyzer</h2>
      {!analysis ? (
        <div className="flex-1 flex flex-col gap-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full flex-1 p-4 rounded-2xl border border-slate-200 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-100 text-slate-700 bg-white"
            placeholder="Paste conversation or message here..."
          />
          <button
            onClick={analyze}
            disabled={loadingState || !text}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
          >
            {loadingState ? <Activity className="animate-spin" /> : <Sparkles size={20} />}
            {loadingState ? 'Analyzing...' : 'Analyze Message'}
          </button>
        </div>
      ) : (
        <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Emotional Tone</h3>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium">{analysis.tone}</span>
              <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-sm font-medium">{analysis.underlying_emotion}</span>
            </div>
          </div>
          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">What they hear</h3>
            <p className="text-amber-900 text-sm">{analysis.interpretation}</p>
          </div>
          <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Try saying</h3>
            <p className="text-emerald-900 text-sm">{analysis.constructive_response}</p>
          </div>
          <button
            onClick={() => {
              setAnalysis(null);
              setText('');
            }}
            className="w-full text-slate-400 text-sm py-4 font-medium hover:text-slate-600"
          >
            Analyze Another
          </button>
        </div>
      )}
    </div>
  );
};

const DailyCoach = ({ profile }) => {
  const [advice, setAdvice] = useState(null);
  const [loadingState, setLoadingState] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoadingState(true);
      const systemPrompt = `You are a warm relationship coach. User Attachment: "${profile?.attachment_style || 'Secure'}", Love Language: "${
        profile?.love_language || 'Words'
      }". Generate daily advice. Return JSON with 3 keys: 'do', 'say', 'avoid'.`;

      try {
        const resultStr = await generateRelationshipAI('Daily relationship coaching', systemPrompt);
        const jsonStr = resultStr.replace(/```json|```/g, '').trim();
        const data = JSON.parse(jsonStr);
        setAdvice(data);
      } catch {
        setAdvice({
          do: 'Take 5 minutes to just listen.',
          say: 'I appreciate you.',
          avoid: 'Criticism.',
        });
      }
      setLoadingState(false);
    };

    fetchAdvice();
  }, [profile]);

  if (loadingState)
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-slate-400 space-y-4">
        <Sparkles className="w-12 h-12 text-rose-300 animate-bounce" />
        <p>Curating wisdom...</p>
      </div>
    );

  return (
    <div className="p-6 pb-24 space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Daily Coach</h2>
      <div className="space-y-4">
        <div className="bg-emerald-50 p-6 rounded-3xl border-l-8 border-emerald-400 shadow-sm">
          <h3 className="font-bold text-emerald-800 mb-2">Do This</h3>
          <p className="text-slate-700">{advice.do}</p>
        </div>
        <div className="bg-indigo-50 p-6 rounded-3xl border-l-8 border-indigo-400 shadow-sm">
          <h3 className="font-bold text-indigo-800 mb-2">Say This</h3>
          <p className="text-slate-700">&quot;{advice.say}&quot;</p>
        </div>
        <div className="bg-rose-50 p-6 rounded-3xl border-l-8 border-rose-400 shadow-sm">
          <h3 className="font-bold text-rose-800 mb-2">Avoid This</h3>
          <p className="text-slate-700">{advice.avoid}</p>
        </div>
      </div>
    </div>
  );
};

const UserProfile = ({ user, profile, onLogout, onProfileUpdate }) => {
  const [linkCode, setLinkCode] = useState('');
  const [linking, setLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const copyCode = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      alert('ID Copied to clipboard');
    }
  };

  const linkPartner = async () => {
    if (!linkCode) return;
    setLinking(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ partner_id: linkCode.trim(), updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      setLinkSuccess(true);
      onProfileUpdate();
      setTimeout(() => setLinkSuccess(false), 3000);
    } catch (e) {
      console.error(e);
      alert('Failed to link partner. Check ID.');
    }
    setLinking(false);
  };

  return (
    <div className="p-6 pb-24 space-y-8">
      <div className="text-center">
        <div className="w-24 h-24 bg-slate-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-slate-500">
          {profile?.name?.[0] || <User />}
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{profile?.name}</h2>
        <p className="text-slate-500">User ID: {user?.id?.slice(0, 6)}...</p>
      </div>

      <div className="bg-indigo-900 rounded-3xl p-6 shadow-xl text-white relative overflow-hidden">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <LinkIcon className="w-5 h-5" /> Connect Partner
        </h3>

        {!profile?.partner_id ? (
          <>
            <div className="mb-6">
              <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">1. Your Connection Code</label>
              <div
                onClick={copyCode}
                className="bg-indigo-800/50 p-3 rounded-xl flex items-center justify-between cursor-pointer hover:bg-indigo-800 transition"
              >
                <code className="text-xs text-indigo-100 truncate flex-1 mr-2">{user?.id}</code>
                <Copy size={16} className="text-indigo-300" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider mb-2 block">2. Enter Partner&apos;s Code</label>
              <div className="flex gap-2">
                <input
                  value={linkCode}
                  onChange={(e) => setLinkCode(e.target.value)}
                  className="flex-1 bg-white text-slate-900 p-3 rounded-xl text-sm focus:outline-none"
                  placeholder="Paste their code..."
                />
                <button
                  onClick={linkPartner}
                  disabled={linking}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-4 rounded-xl font-bold transition flex items-center"
                >
                  {linking ? <Activity className="animate-spin" size={16} /> : <Check size={16} />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white/10 p-4 rounded-xl flex items-center gap-3">
            <div className="bg-green-400 p-1 rounded-full">
              <Check size={12} className="text-indigo-900" />
            </div>
            <div>
              <p className="font-bold text-sm">Connected to Partner</p>
              <p className="text-xs text-indigo-200 break-all">{profile.partner_id}</p>
            </div>
          </div>
        )}
        {linkSuccess && <p className="text-green-300 text-xs mt-3 font-bold">Successfully linked!</p>}
      </div>

      <button
        onClick={onLogout}
        className="w-full bg-slate-100 text-slate-500 py-4 rounded-xl font-semibold hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
      >
        <LogOut size={18} />
        Sign Out
      </button>
    </div>
  );
};

// NavItem component defined outside of App to avoid re-creation on render
const NavItem = ({ id, icon: Icon, label, currentView, onNavigate }) => (
  <button
    onClick={() => onNavigate(id)}
    className={`flex flex-col items-center gap-1 ${currentView === id ? 'text-indigo-600' : 'text-slate-400'} transition-colors`}
  >
    <Icon size={24} className={currentView === id ? 'fill-current' : ''} strokeWidth={2} />
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [view, setView] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const fetchProfile = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setUserProfile(data);
    } else {
      setUserProfile(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  const handleAuth = async ({ mode, email, password }) => {
    setAuthError('');
    setAuthLoading(true);
    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        if (data.user) {
          // Create initial profile
          await supabase.from('profiles').insert({
            id: data.user.id,
            email,
          });
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error) {
      setAuthError(error?.message || 'Authentication failed.');
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUserProfile(null);
    setView('dashboard');
  };

  const handleProfileUpdate = () => {
    if (user) {
      fetchProfile(user.id);
    }
  };

  if (loading)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Sparkles className="animate-spin text-indigo-400" />
      </div>
    );

  if (!user) return <LoginScreen onAuthenticate={handleAuth} authError={authError} loading={authLoading} />;
  if (user && !userProfile?.name)
    return <Onboarding user={user} onComplete={() => fetchProfile(user.id)} />;

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 flex justify-center">
      <div className="w-full bg-white min-h-screen shadow-2xl relative flex flex-col">
        <div className="flex-1 overflow-y-auto">
          {view === 'dashboard' && <Dashboard user={user} profile={userProfile} onNavigate={setView} />}
          {view === 'checkin' && <CheckIn user={user} onComplete={() => setView('dashboard')} />}
          {view === 'analyzer' && <MessageAnalyzer user={user} />}
          {view === 'coach' && <DailyCoach profile={userProfile} />}
          {view === 'profile' && <UserProfile user={user} profile={userProfile} onLogout={handleLogout} onProfileUpdate={handleProfileUpdate} />}
        </div>

        <nav className="bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center sticky bottom-0 z-10 pb-6">
          <NavItem id="dashboard" icon={Heart} label="Home" currentView={view} onNavigate={setView} />
          <NavItem id="analyzer" icon={MessageCircle} label="Analyze" currentView={view} onNavigate={setView} />
          <NavItem id="coach" icon={Zap} label="Coach" currentView={view} onNavigate={setView} />
          <NavItem id="profile" icon={User} label="Profile" currentView={view} onNavigate={setView} />
        </nav>
      </div>
    </div>
  );
}
