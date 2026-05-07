/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Trophy, 
  MapPin, 
  Clock, 
  CloudSun, 
  ChevronDown, 
  Tv, 
  User, 
  Map as MapIcon, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Award,
  CircleUser,
  Shield,
  Zap,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import { formatInTimeZone } from 'date-fns-tz';

// --- Types ---
type Language = 'az' | 'en' | 'ru';

interface Player {
  id: number;
  name: string;
  defense: number;
  shoot: number;
  speed: number;
  kg: number;
  height: number;
  age: number;
  technique: number;
  strength: number;
  dribble: number;
  position: { x: number; y: number }; // Percentage for pitch view
  marketValue: string;
  shirtNumber: number;
}

// --- Translations ---
const translations = {
  az: {
    matchPreview: "Oyun Önizləməsi",
    stadium: "264 nömrəli məktəb, Azfar Stadion",
    region: "Əhmədli, Bakı",
    date: "8 May 2026, Cümə",
    time: "20:00",
    referee: "Baş Hakim",
    coach: "Məşqçi",
    price: "Qiymət",
    perPlayer: "nəfər başı",
    liveOn: "Canlı Yayım",
    overallRating: "Ümumi Reytinq",
    performance: "Performans Analizi",
    whoWillWin: "Kim Qalib Gələcək?",
    vote: "Səs ver",
    odds: "Ehtimallar",
    lineups: "Heyətlər",
    details: "Detallar",
    weather: "Hava Proqnozu",
    forecast: "Açıq hava, 22°C",
    bakuTime: "Bakı Vaxtı",
    startsIn: "Başlamasına qalan vaxt",
    clickPlayer: "Statistikaları görmək üçün oyunçuya klikləyin",
    featuredPlayers: "Önə Çıxan Oyunçular",
    aiInsights: "Süni İntellekt Analizi",
    compare: "Müqayisə et",
    vs: "VS",
    startingXI: "Meydan Heyəti",
    aiPrediction: "Musa və Fuadın yüksək hücum reytinqləri nəzərə alınmaqla, oyunun 2.5-dən çox qolla bitmə ehtimalı yüksəkdir (85%). Komandaların xG göstəriciləri (QIZ: 2.15, LEJ: 1.88) hücum meylli qarşılaşma vəd edir. Künc zərbələri ehtimalı 8.5-dən çoxdur.",
    attributes: {
      rating: "Reytinq",
      age: "Yaş",
      value: "Dəyər",
      height: "Boy",
      defense: "Müdafiə",
      shoot: "Zərbə",
      speed: "Sürət",
      technique: "Texnika",
      strength: "Güc",
      dribble: "Driblinq"
    }
  },
  en: {
    matchPreview: "Match Preview",
    stadium: "School 264, Azfar Stadium",
    region: "Ahmedli, Baku",
    date: "May 8, 2026, Friday",
    time: "20:00",
    referee: "Referee",
    coach: "Coach",
    price: "Price",
    perPlayer: "per player",
    liveOn: "Live On",
    overallRating: "Overall Rating",
    performance: "Performance Insights",
    whoWillWin: "Who Will Win?",
    vote: "Vote",
    odds: "Odds",
    lineups: "Lineups",
    details: "Details",
    weather: "Weather Prediction",
    forecast: "Clear sky, 22°C",
    bakuTime: "Baku Time",
    startsIn: "Starts in",
    clickPlayer: "Click on player to see stats",
    featuredPlayers: "Featured Players",
    aiInsights: "AI Insights",
    compare: "Compare Players",
    vs: "VS",
    startingXI: "Starting XI",
    aiPrediction: "Given the high offensive ratings of Musa and Fuad, a high-scoring game (Over 2.5) is predicted with 85% confidence. xG projections (QIZ: 2.15, LEJ: 1.88) suggest an open game. Corner probabilities are high at 8.5+ AVG.",
    attributes: {
      rating: "Rating",
      age: "Age",
      value: "Value",
      height: "Height",
      defense: "Defense",
      shoot: "Shoot",
      speed: "Speed",
      technique: "Technique",
      strength: "Strength",
      dribble: "Dribble"
    }
  },
  ru: {
    matchPreview: "Превью матча",
    stadium: "Школа №264, Азфар Стадион",
    region: "Ахмедлы, Баку",
    date: "8 Мая 2026, Пятница",
    time: "20:00",
    referee: "Судья",
    coach: "Тренер",
    price: "Цена",
    perPlayer: "на игрока",
    liveOn: "Прямой эфир",
    overallRating: "Общий рейтинг",
    performance: "Анализ игры",
    whoWillWin: "Кто победит?",
    vote: "Голосовать",
    odds: "Шансы",
    lineups: "Составы",
    details: "Детали",
    weather: "Прогноз погоды",
    forecast: "Ясно, 22°C",
    bakuTime: "Бакинское время",
    startsIn: "До начала",
    clickPlayer: "Нажмите на игрока, чтобы увидеть статистику",
    featuredPlayers: "Ключевые игроки",
    aiInsights: "AI Аналитика",
    compare: "Сравнить",
    vs: "ПРОТИВ",
    startingXI: "Стартовый состав",
    aiPrediction: "Учитывая высокие рейтинги атаки Мусы и Фуада, предсказывается результативная игра (ТБ 2.5) с вероятностью 85%. Показатели xG (QIZ: 2.15, LEJ: 1.88) указывают на открытый футбол. Вероятность угловых выше 8.5.",
    attributes: {
      rating: "Рейтинг",
      age: "Возраст",
      value: "Цена",
      height: "Рост",
      defense: "Защита",
      shoot: "Удар",
      speed: "Скорость",
      technique: "Техника",
      strength: "Сила",
      dribble: "Дриблинг"
    }
  }
};

// --- Data ---
const team1PlayersRaw = [
  { name: "Ali", def: 83, sho: 86, spd: 80, kg: 88, h: 186, age: 32, tech: 77, str: 84, dri: 76, shirt: 10, val: "€2.4M" },
  { name: "Murad", def: 90, sho: 84, spd: 88, kg: 80, h: 180, age: 26, tech: 83, str: 89, dri: 82, shirt: 7, val: "€4.1M" },
  { name: "Elvin", def: 82, sho: 84, spd: 73, kg: 88, h: 176, age: 32, tech: 74, str: 82, dri: 74, shirt: 4, val: "€1.8M" },
  { name: "Musa", def: 84, sho: 91, spd: 87, kg: 55, h: 168, age: 17, tech: 90, str: 77, dri: 90, shirt: 11, val: "€12M" },
  { name: "Nihad", def: 78, sho: 78, spd: 70, kg: 85, h: 178, age: 27, tech: 80, str: 79, dri: 77, shirt: 5, val: "€2.1M" },
  { name: "Elmir", def: 78, sho: 83, spd: 81, kg: 55, h: 171, age: 20, tech: 79, str: 73, dri: 78, shirt: 22, val: "€3.5M" },
];

const team2PlayersRaw = [
  { name: "Fuad", def: 86, sho: 90, spd: 86, kg: 72, h: 177, age: 22, tech: 86, str: 80, dri: 85, shirt: 9, val: "€7.2M" },
  { name: "Tural", def: 87, sho: 83, spd: 81, kg: 110, h: 184, age: 22, tech: 80, str: 90, dri: 77, shirt: 6, val: "€3.8M" },
  { name: "Seymur", def: 85, sho: 80, spd: 80, kg: 100, h: 182, age: 32, tech: 82, str: 88, dri: 73, shirt: 8, val: "€2.5M" },
  { name: "Zaur", def: 65, sho: 88, spd: 61, kg: 120, h: 185, age: 26, tech: 78, str: 92, dri: 60, shirt: 1, val: "€1.2M" },
  { name: "Elnur", def: 80, sho: 66, spd: 62, kg: 84, h: 173, age: 20, tech: 66, str: 85, dri: 67, shirt: 13, val: "€0.9M" },
  { name: "Nicat", def: 83, sho: 87, spd: 78, kg: 67, h: 165, age: 26, tech: 82, str: 80, dri: 73, shirt: 17, val: "€2.9M" },
];

const processPlayers = (raw: any[], team: number) => {
  return raw.map((p, i) => ({
    id: team * 100 + i,
    name: p.name,
    defense: p.def,
    shoot: p.sho,
    speed: p.spd,
    kg: p.kg,
    height: p.h,
    age: p.age,
    technique: p.tech,
    strength: p.str,
    dribble: p.dri,
    shirtNumber: p.shirt,
    marketValue: p.val,
    // 6 players formation logic (2-2-1 if small pitch)
    position: getPosition(i, team)
  }));
};

const getPosition = (index: number, team: number) => {
  const isTeam1 = team === 1;
  const basePositions = [
    { x: 50, y: 14 }, // GK (Increased border gap)
    { x: 32, y: 42 }, // Def Left (Moved further towards center)
    { x: 68, y: 42 }, // Def Right (Moved further towards center)
    { x: 50, y: 70 }, // Midfield (Central hub)
    { x: 32, y: 96 }, // Attacker Left (Safe distance from half-line)
    { x: 68, y: 96 }, // Attacker Right (Safe distance from half-line)
  ];
  
  const pos = basePositions[index];
  return isTeam1 ? pos : { x: pos.x, y: 100 - pos.y };
};

// --- Components ---

const RadarInsight = ({ player, labels }: { player: Player, labels: any }) => {
  const data = [
    { subject: labels.defense, A: player.defense, fullMark: 100 },
    { subject: labels.shoot, A: player.shoot, fullMark: 100 },
    { subject: labels.speed, A: player.speed, fullMark: 100 },
    { subject: labels.technique, A: player.technique, fullMark: 100 },
    { subject: labels.strength, A: player.strength, fullMark: 100 },
    { subject: labels.dribble, A: player.dribble, fullMark: 100 },
  ];

  return (
    <div className="w-full h-48 sm:h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
          <Radar
            name={player.name}
            dataKey="A"
            stroke="#3B82F6"
            fill="#3B82F6"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

const team1Logo = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Flag_of_the_Turkmen-Qizilbash_of_Southeastern_Anatolia.png/250px-Flag_of_the_Turkmen-Qizilbash_of_Southeastern_Anatolia.png";
const team2Logo = "https://dcassetcdn.com/design_img/18197/25699/25699_442722_18197_image.jpg";

export default function App() {
  const [lang, setLang] = useState<Language>('az');
  const [bakuNow, setBakuNow] = useState(new Date());
  const [selectedAttr, setSelectedAttr] = useState<'rating' | 'age' | 'value' | 'height'>('rating');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [comparePlayer, setComparePlayer] = useState<Player | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [activeTeamView, setActiveTeamView] = useState<1 | 2>(1);
  const [votes, setVotes] = useState({ t1: 45, t2: 40, draw: 15 });

  const [timeLeft, setTimeLeft] = useState<{ d: number, h: number, m: number, s: number } | null>(null);

  const t = translations[lang];

  // Match Target: May 8, 2026, 20:00 Baku (UTC+4)
  const matchDate = useMemo(() => new Date("2026-05-08T20:00:00+04:00"), []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setBakuNow(now);
      
      const diff = matchDate.getTime() - now.getTime();
      if (diff > 0) {
        setTimeLeft({
          d: Math.floor(diff / (1000 * 60 * 60 * 24)),
          h: Math.floor((diff / (1000 * 60 * 60)) % 24),
          m: Math.floor((diff / 1000 / 60) % 60),
          s: Math.floor((diff / 1000) % 60),
        });
      } else {
        setTimeLeft(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [matchDate]);

  const timeString = formatInTimeZone(bakuNow, 'Asia/Baku', 'HH:mm:ss');
  
  const calculateRating = (p: Partial<Player>) => {
    if (!p.defense) return 0;
    return Math.round((p.defense + p.shoot + p.speed + p.technique + p.strength + p.dribble) / 6);
  };

  const players1 = useMemo(() => processPlayers(team1PlayersRaw, 1), []);
  const players2 = useMemo(() => processPlayers(team2PlayersRaw, 2), []);

  const handleVote = (team: 't1' | 't2' | 'draw') => {
    setVotes(prev => ({
      ...prev,
      [team]: prev[team] + 1
    }));
  };

  const getAttrValue = (p: Player) => {
    switch(selectedAttr) {
      case 'rating': return calculateRating(p).toString();
      case 'age': return p.age.toString();
      case 'value': return p.marketValue;
      case 'height': return `${p.height}cm`;
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-gray-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden pb-12">
      {/* Header / Navbar */}
      <nav className="sticky top-0 z-50 bg-[#12141C] border-b border-gray-800 py-3 px-6 flex items-center justify-between shrink-0 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-xl italic shadow-lg shadow-indigo-900/20">
            S
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold leading-none mb-1">MatchDay Baku</span>
            <span className="font-bold text-white text-sm leading-none tracking-tight">SOFASCORE PREVIEW</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] text-gray-500 uppercase font-bold">{t.bakuTime}</span>
            <span className="font-mono text-sm font-bold text-indigo-400 tabular-nums">{timeString}</span>
          </div>
          
          <div className="flex items-center gap-2 bg-[#1C1F26] p-1 rounded-full border border-gray-700 shadow-inner">
            {(['az', 'en', 'ru'] as Language[]).map(l => (
              <button 
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${lang === l ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Match Card */}
      <section className="px-4 pt-6 max-w-4xl mx-auto w-full">
        <div className="bg-[#12141C] border border-gray-800 rounded-[32px] overflow-hidden relative shadow-2xl">
          {/* Header Gradient */}
          <div className="bg-gradient-to-b from-[#1C1F26] to-[#12141C] p-4 sm:p-8 flex flex-row items-center justify-between relative z-10 w-full">
            <div className="text-center w-24 sm:w-32 flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-600 rounded-full shadow-2xl shadow-blue-900/40 border-4 border-white/5 flex items-center justify-center overflow-hidden">
                <img src={team1Logo} className="w-full h-full object-cover" alt="Qizilbashlar" />
              </div>
              <h3 className="font-bold text-[10px] sm:text-xs uppercase tracking-wider leading-tight text-white/90">Qızılbaşlar</h3>
            </div>

            <div className="flex flex-col items-center flex-1 min-w-0 px-2">
              <span className="text-[9px] sm:text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mb-1 opacity-60 tabular-nums">8 MAY • {t.time}</span>
              <div className="text-4xl sm:text-7xl font-black tabular-nums tracking-tighter mb-1 text-white drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                20:00
              </div>
              <div className="px-3 sm:px-5 py-1 sm:py-2 bg-indigo-500/20 text-indigo-400 rounded-full text-[9px] sm:text-[12px] font-black tracking-[0.2em] uppercase border border-indigo-500/40 backdrop-blur-md">
                {timeLeft ? t.startsIn : 'LIVE'}
              </div>
              {timeLeft && (
                <div className="mt-3 flex gap-1 sm:gap-2 items-center font-mono text-[10px] sm:text-[14px] font-bold text-white shadow-sm px-2 sm:px-4 py-1 sm:py-1.5 bg-white/5 rounded-2xl border border-white/5 scale-90 sm:scale-100">
                  <span className="text-indigo-400">{timeLeft.d}d</span>
                  <span className="opacity-30">|</span>
                  <span>{timeLeft.h}h</span>
                  <span className="opacity-30">|</span>
                  <span>{timeLeft.m}m</span>
                  <span className="opacity-30">|</span>
                  <span>{timeLeft.s}s</span>
                </div>
              )}
            </div>

            <div className="text-center w-24 sm:w-32 flex flex-col items-center gap-2 shrink-0">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-600 rounded-full shadow-2xl shadow-red-900/40 border-4 border-white/5 flex items-center justify-center overflow-hidden">
                <img src={team2Logo} className="w-full h-full object-cover" alt="Lejyonerler" />
              </div>
              <h3 className="font-bold text-[10px] sm:text-xs uppercase tracking-wider leading-tight text-white/90">Lejyonerlər</h3>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 p-6 sm:p-8 bg-[#12141C]">
            <div className="bg-[#1C1F26] rounded-2xl p-4 border border-gray-800 flex flex-col items-center text-center group hover:bg-gray-800/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-2 group-hover:scale-110 transition-transform">☀️</div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">{t.weather}</span>
              <span className="text-xs font-bold text-white/80">{t.forecast}</span>
            </div>
            <div className="bg-[#1C1F26] rounded-2xl p-4 border border-gray-800 flex flex-col items-center text-center group hover:bg-gray-800/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-2 font-mono text-sm font-bold group-hover:scale-110 transition-transform">20</div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">{t.bakuTime}</span>
              <span className="text-xs font-bold font-mono tabular-nums text-white/80">{timeString.split(':')[0]}:{timeString.split(':')[1]}</span>
            </div>
            <div className="bg-[#1C1F26] rounded-2xl p-4 border border-gray-800 flex flex-col items-center text-center group hover:bg-gray-800/40 transition-colors">
              <div className="w-8 h-8 rounded-full bg-red-500 font-black text-white text-[10px] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">TV</div>
              <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter mb-1">{t.liveOn}</span>
              <span className="text-xs font-bold text-red-500">İDMAN TV</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-6 px-4 mt-8">
        
        {/* Left Column - Odds & Voting (Mobile First Stack) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">{t.whoWillWin}</span>
              <TrendingUp className="w-4 h-4 text-indigo-500" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              <button onClick={() => handleVote('t1')} className="group flex flex-col items-center gap-1 bg-[#1C1F26] border border-gray-800 p-4 rounded-2xl hover:border-blue-500/50 transition-all hover:bg-[#252a35]">
                <span className="text-[9px] text-gray-500 font-black uppercase">QIZ</span>
                <span className="text-lg font-black text-blue-400 group-hover:scale-110 transition-transform tracking-tighter">1.85</span>
              </button>
              <button onClick={() => handleVote('draw')} className="group flex flex-col items-center gap-1 bg-[#1C1F26] border border-gray-800 p-4 rounded-2xl hover:border-white/20 transition-all hover:bg-[#252a35]">
                <span className="text-[9px] text-gray-500 font-black uppercase text-center">X</span>
                <span className="text-lg font-black text-white group-hover:scale-110 transition-transform tracking-tighter">3.40</span>
              </button>
              <button onClick={() => handleVote('t2')} className="group flex flex-col items-center gap-1 bg-[#1C1F26] border border-gray-800 p-4 rounded-2xl hover:border-red-500/50 transition-all hover:bg-[#252a35]">
                <span className="text-[9px] text-gray-500 font-black uppercase">LEJ</span>
                <span className="text-lg font-black text-red-500 group-hover:scale-110 transition-transform tracking-tighter">2.10</span>
              </button>
            </div>

            <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex shadow-inner">
              <motion.div initial={{ width: 0 }} animate={{ width: `${votes.t1}%` }} className="h-full bg-blue-600 border-r border-black/20" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${votes.draw}%` }} className="h-full bg-gray-600" />
              <motion.div initial={{ width: 0 }} animate={{ width: `${votes.t2}%` }} className="h-full bg-red-600 border-l border-black/20" />
            </div>
            <div className="flex justify-between mt-3 text-[10px] font-mono font-bold text-gray-500">
              <span className="text-blue-400">{votes.t1}%</span>
              <span>{votes.draw}%</span>
              <span className="text-red-400">{votes.t2}%</span>
            </div>
          </div>

          {/* Stadium Details Card */}
          <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 shadow-xl overflow-hidden group">
             <div className="flex items-center justify-between mb-6">
              <span className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">{t.details}</span>
              <MapIcon className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
            </div>
            
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase font-bold mb-1 tracking-tighter">{t.stadium}</span>
                <div className="text-sm font-bold flex items-center justify-between text-white/90">
                  {t.region}
                  <span className="text-indigo-400 font-black tabular-nums">70 AZN</span>
                </div>
              </div>

              <div className="h-[1px] bg-gray-800/60" />

              <div className="grid grid-cols-1 gap-2">
                <a href="https://maps.apple.com/place?place-id=ID8A95518FF7EC3BE&_provider=9902" target="_blank" className="bg-[#1C1F26] px-4 h-12 rounded-xl border border-gray-800 flex items-center gap-3 hover:bg-gray-800 transition-all hover:border-gray-600 group">
                  <img src="https://www.apple.com/v/maps/d/images/overview/intro_icon__dfyvjc1ohbcm_large.png" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black tracking-widest italic flex-1 text-left">APPLE MAPS</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white" />
                </a>
                <a href="https://maps.app.goo.gl/cYtRAS4271ygRCTo6" target="_blank" className="bg-[#1C1F26] px-4 h-12 rounded-xl border border-gray-800 flex items-center gap-3 hover:bg-gray-800 transition-all hover:border-gray-600 group">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Google_Maps_icon_%282015-2020%29.svg/3840px-Google_Maps_icon_%282015-2020%29.svg.png" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black tracking-widest italic flex-1 text-left">GOOGLE MAPS</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white" />
                </a>
                <a href="https://ul.waze.com/ul?venue_id=32768404.327487430.10653861" target="_blank" className="bg-[#1C1F26] px-4 h-12 rounded-xl border border-gray-800 flex items-center gap-3 hover:bg-gray-800 transition-all hover:border-gray-600 group">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSif4ZruHe9ZcBratDwdlteQBc6cV95VM9gw&s" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black tracking-widest italic flex-1 text-left">WAZE</span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Field & Lineups */}
        <div className="md:col-span-8 space-y-6">
          <div className="bg-[#12141C] border border-gray-800 rounded-[40px] p-2 relative overflow-hidden shadow-2xl flex flex-col">
            {/* Header Controls */}
            <div className="flex flex-col gap-4 px-6 py-4 z-10 shrink-0">
               <div className="flex bg-[#1C1F26] p-1 rounded-full border border-gray-700 shadow-inner w-full justify-between items-center">
                <div className="flex gap-1">
                  {(['rating', 'age', 'value', 'height'] as const).map(attr => (
                    <button
                      key={attr}
                      onClick={() => setSelectedAttr(attr)}
                      className={`px-3 sm:px-4 py-1.5 text-[8px] sm:text-[9px] uppercase font-black rounded-full transition-all tracking-tighter ${selectedAttr === attr ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                      {t.attributes[attr]}
                    </button>
                  ))}
                </div>
                <Shield className="w-4 h-4 text-indigo-500/30 ml-2" />
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">{t.clickPlayer}</span>
                <div className="flex bg-[#1C1F26] p-0.5 rounded-lg border border-gray-800 md:hidden">
                  <button onClick={() => setActiveTeamView(1)} className={`px-2 py-1 text-[9px] font-black rounded ${activeTeamView === 1 ? 'bg-blue-600 text-white' : 'text-gray-600'}`}>QIZ</button>
                  <button onClick={() => setActiveTeamView(2)} className={`px-2 py-1 text-[9px] font-black rounded ${activeTeamView === 2 ? 'bg-red-600 text-white' : 'text-gray-600'}`}>LEJ</button>
                </div>
              </div>
            </div>

            {/* Field View */}
            <div className="m-2 rounded-[32px] aspect-[4/5] sm:aspect-auto sm:h-[650px] overflow-hidden border border-white/5 relative shadow-inner">
               <div className="absolute inset-0 bg-[#143B14] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_100%)]">
                {/* Field Pattern Overlays */}
                <div className="absolute inset-x-0 h-full opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 40px, transparent 40px, transparent 80px)' }}></div>
              </div>

              {/* Pitch Helper Text */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 opacity-10 flex flex-col items-center pointer-events-none">
                <span className="text-4xl sm:text-6xl font-black italic tracking-widest text-white">{t.vs}</span>
              </div>

              {/* Team Labels on Pitch */}
              <div className="absolute top-8 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center opacity-30 pointer-events-none">
                <span className="text-lg sm:text-2xl font-black uppercase tracking-[0.3em] font-mono">QIZILBAŞLAR</span>
              </div>
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-0 flex flex-col items-center opacity-30 pointer-events-none rotate-180">
                <span className="text-lg sm:text-2xl font-black uppercase tracking-[0.3em] font-mono">LEJYONERLƏR</span>
              </div>
              
              <div className="absolute inset-0 flex flex-col p-4 sm:p-8 justify-between z-10">
                {/* Team 1 Side (Conditional visibility on mobile) */}
                <div className={`flex-1 border-[2px] border-white/10 rounded-t-[40px] relative mb-1 transition-all duration-300 md:opacity-100 ${activeTeamView === 2 ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-16 sm:h-20 border-[2px] border-white/10 rounded-b-[48px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border-[2px] border-white/10" />
                  
                  {/* Players Team 1 */}
                  <div className="absolute inset-0">
                    {players1.map((p) => (
                      <motion.div
                        key={p.id}
                        layoutId={`player-${p.id}`}
                        onClick={() => setSelectedPlayer(p)}
                        style={{ left: `${p.position.x}%`, top: `${p.position.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-20"
                      >
                        <div className="relative group">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600 border-[2px] border-white flex items-center justify-center text-xs font-black shadow-2xl group-hover:scale-110 transition-transform text-white">
                            {p.shirtNumber}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-white px-1 sm:px-1.5 rounded-sm text-[8px] font-black text-blue-900 leading-none py-0.5 sm:py-1 shadow-lg border border-blue-900/10">
                            {calculateRating(p)}
                          </div>
                        </div>
                        <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md flex flex-col items-center min-w-[45px] sm:min-w-[55px] border border-white/5 shadow-2xl">
                          <span className="text-[9px] sm:text-[10px] font-black text-white/90 truncate max-w-[50px] sm:max-w-[60px] text-center uppercase tracking-tighter">{p.name}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-blue-400/80">{getAttrValue(p)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Team 2 Side (Conditional visibility on mobile) */}
                <div className={`flex-1 border-[2px] border-white/10 rounded-b-[40px] relative mt-1 rotate-180 transition-all duration-300 md:opacity-100 ${activeTeamView === 1 ? 'opacity-0 pointer-events-none md:opacity-100 md:pointer-events-auto' : 'opacity-100'}`}>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-16 sm:h-20 border-[2px] border-white/10 rounded-b-[48px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-8 sm:w-10 h-8 sm:h-10 rounded-full border-[2px] border-white/10" />
                  
                  {/* Players Team 2 */}
                  <div className="absolute inset-0">
                    {players2.map((p) => (
                      <motion.div
                        key={p.id}
                        layoutId={`player-${p.id}`}
                        onClick={() => setSelectedPlayer(p)}
                        style={{ left: `${p.position.x}%`, top: `${p.position.y}%` }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 cursor-pointer z-20 rotate-180"
                      >
                        <div className="relative group">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-600 border-[2px] border-white flex items-center justify-center text-xs font-black shadow-2xl group-hover:scale-110 transition-transform text-white">
                            {p.shirtNumber}
                          </div>
                          <div className="absolute -top-1 -right-1 bg-white px-1 sm:px-1.5 rounded-sm text-[8px] font-black text-red-900 leading-none py-0.5 sm:py-1 shadow-lg border border-red-900/10">
                            {calculateRating(p)}
                          </div>
                        </div>
                        <div className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md flex flex-col items-center min-w-[45px] sm:min-w-[55px] border border-white/5 shadow-2xl">
                          <span className="text-[9px] sm:text-[10px] font-black text-white/90 truncate max-w-[50px] sm:max-w-[60px] text-center uppercase tracking-tighter">{p.name}</span>
                          <span className="text-[8px] sm:text-[9px] font-bold text-red-400/80">{getAttrValue(p)}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Starting XI List View */}
            <div className="px-4 py-4 md:px-8 md:py-6 bg-white/5 border-t border-gray-800">
               <div className="flex items-center justify-between mb-4">
                 <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">{t.startingXI}</h5>
                 <div className="flex gap-2">
                    <button onClick={() => setActiveTeamView(1)} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${activeTeamView === 1 ? 'bg-blue-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400'}`}>1</button>
                    <button onClick={() => setActiveTeamView(2)} className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${activeTeamView === 2 ? 'bg-red-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400'}`}>2</button>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 {(activeTeamView === 1 ? players1 : players2).map(p => (
                   <div key={p.id} onClick={() => setSelectedPlayer(p)} className="flex items-center justify-between p-3 bg-[#1C1F26] border border-gray-800 rounded-xl hover:border-gray-500 transition-all cursor-pointer group">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-black text-gray-500 w-4 tracking-tighter group-hover:text-white transition-colors">{p.shirtNumber}</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${activeTeamView === 1 ? 'bg-blue-600' : 'bg-red-600'}`} />
                        <span className="text-sm font-bold text-white/90 group-hover:translate-x-1 transition-transform">{p.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded tabular-nums italic">OVR {calculateRating(p)}</span>
                        <ChevronRight className="w-3 h-3 text-gray-700 group-hover:text-white transition-all transform group-hover:translate-x-0.5" />
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>

        {/* Personnel Section (Staff & AI Insights) */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
          <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
            <span className="text-[11px] text-indigo-400 uppercase font-black tracking-[0.2em]">{t.aiInsights}</span>
            <div className="flex gap-4 items-start mb-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-900/40 flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm font-medium leading-relaxed text-gray-300 italic">
                "{t.aiPrediction}"
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <span className="block text-[10px] text-gray-500 uppercase font-black mb-2 tracking-tighter group-hover:text-blue-400 transition-colors">Possession %</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-blue-400">52%</span>
                  <div className="w-8 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: '52%' }} />
                  </div>
                  <span className="text-sm font-black text-red-500">48%</span>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <span className="block text-[10px] text-gray-500 uppercase font-black mb-2 tracking-tighter group-hover:text-amber-500 transition-colors">Expected Goals (xG)</span>
                <div className="flex items-center justify-between font-black">
                  <span className="text-sm text-blue-400">2.15</span>
                  <span className="text-[10px] text-gray-600">VS</span>
                  <span className="text-sm text-red-500">1.88</span>
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <span className="block text-[10px] text-gray-500 uppercase font-black mb-2 tracking-tighter group-hover:text-green-400 transition-colors">Corners Probability</span>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white/90">8.5 AVG</span>
                  <TrendingUp className="w-4 h-4 text-green-400" />
                </div>
              </div>
              <div className="bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <span className="block text-[10px] text-gray-500 uppercase font-black mb-2 tracking-tighter group-hover:text-indigo-400 transition-colors">Pass Accuracy</span>
                <div className="flex items-center justify-between font-black">
                  <span className="text-sm text-blue-400">84%</span>
                  <span className="text-sm text-red-500">81%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 shadow-xl flex flex-col gap-4">
            <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em]">{t.featuredPlayers}</span>
            <div className="flex gap-4">
              {[players1[3], players2[0]].map((p, i) => (
                <div key={p.id} className="flex-1 bg-white/5 border border-white/5 p-3 rounded-2xl flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm text-white ${i === 0 ? 'bg-blue-600' : 'bg-red-600'}`}>
                    {p.shirtNumber}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black">{p.name}</span>
                    <span className="text-[9px] text-gray-500 font-bold uppercase">{i === 0 ? 'Qızılbaşlar' : 'Lejyonerlər'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
           <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 flex flex-col gap-6 shadow-xl group overflow-hidden">
            <span className="text-[11px] text-gray-500 uppercase font-bold tracking-widest">{t.coach} Heyəti</span>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">QIZILBAŞLAR</span>
                <span className="text-sm font-black italic text-white/90">Hansi Flick</span>
              </div>
              <div className="w-px h-10 bg-gray-800 mx-4 group-hover:scale-y-110 transition-transform" />
              <div className="flex flex-col items-end text-right gap-1">
                <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">LEJYONERLƏR</span>
                <span className="text-sm font-black italic text-white/90">Pep Guardiola</span>
              </div>
            </div>
          </div>

          <div className="bg-[#12141C] border border-gray-800 rounded-3xl p-6 shadow-xl">
             <span className="text-[11px] text-gray-500 uppercase font-bold tracking-widest mb-4 block">{t.referee}</span>
             <div className="flex items-center gap-4 bg-[#1C1F26] p-4 rounded-2xl border border-gray-800 group hover:border-gray-600 transition-all cursor-default relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <img src="https://cwgspeakers.com/wp-content/uploads/2025/07/Pierluigi-Collina.jpg" className="w-full h-full object-cover grayscale brightness-50" />
                </div>
                <div className="w-12 h-12 bg-indigo-600 rounded-xl overflow-hidden flex items-center justify-center font-black text-white text-sm shadow-lg group-hover:scale-105 transition-all relative z-10">
                   <img src="https://cwgspeakers.com/wp-content/uploads/2025/07/Pierluigi-Collina.jpg" className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col relative z-10">
                  <span className="text-sm font-black tracking-tight text-white/90">Pierluigi Collina</span>
                  <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.1em]">International Class</span>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Modal - Player Detailed Analysis */}
      <AnimatePresence>
        {selectedPlayer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPlayer(null)}
              className="fixed inset-0 bg-[#090A0D]/95 backdrop-blur-md z-[100]"
            />
            <motion.div 
              layoutId={`player-${selectedPlayer.id}`}
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              className="fixed inset-x-0 bottom-0 z-[101] bg-[#12141C] rounded-t-[48px] border-t border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-800 rounded-full" />
              
              <div className="p-8 pt-12 sm:p-12 sm:pt-16 max-w-2xl mx-auto">
                <div className="flex items-start justify-between mb-10">
                  <div className="flex items-center gap-6">
                    <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-4xl font-black text-white shadow-2xl relative border-4 border-white/5 ${selectedPlayer.id < 200 ? 'bg-blue-600' : 'bg-red-600'}`}>
                      {selectedPlayer.shirtNumber}
                    </div>
                    <div>
                      <h2 className="text-3xl font-black tracking-tighter mb-1 text-white">{selectedPlayer.name}</h2>
                      <div className="flex items-center gap-3">
                        <span className="bg-indigo-600/90 px-3 py-1 rounded-md text-[11px] font-black tracking-widest text-white shadow-lg">
                          OVR {calculateRating(selectedPlayer)}
                        </span>
                        <span className="text-xs text-gray-500 font-bold uppercase tracking-widest tabular-nums">{selectedPlayer.age} {t.attributes.age} • {selectedPlayer.marketValue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-amber-500 border border-gray-800">
                    <Award className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-[#1C1F26] rounded-[32px] p-8 border border-gray-800 mb-8 relative overflow-hidden group shadow-2xl">
                  {/* Subtle Background Pattern */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-[80px]" />
                  
                  <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em] mb-6 block text-center opacity-60 underline decoration-indigo-500/30 underline-offset-8 decoration-2">{t.performance}</span>
                  <RadarInsight player={selectedPlayer} labels={t.attributes} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: t.attributes.height, val: `${selectedPlayer.height} cm` },
                    { label: t.attributes.value, val: selectedPlayer.marketValue, color: 'text-green-400' },
                    { label: 'Weight', val: `${selectedPlayer.kg} kg` },
                    { label: t.attributes.technique, val: `${selectedPlayer.technique}%`, icon: Zap }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-[#1C1F26] p-6 rounded-2xl border border-gray-800 hover:bg-[#252a35] hover:border-gray-500 transition-all group">
                      <span className="block text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1 group-hover:text-indigo-400 transition-colors">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-black ${item.color || 'text-white/90'}`}>{item.val}</span>
                        {item.icon && <item.icon className="w-4 h-4 text-amber-500 animate-bounce" />}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <button 
                    onClick={() => {
                      setShowComparison(true);
                      setComparePlayer(null);
                    }}
                    className="w-full bg-[#1C1F26] hover:bg-indigo-600/20 text-indigo-400 font-black py-4 rounded-3xl transition-all border border-indigo-500/30 uppercase tracking-[0.2em] text-xs"
                  >
                    {t.compare}
                  </button>
                  <button 
                    onClick={() => setSelectedPlayer(null)}
                    className="w-full bg-[#1C1F26] hover:bg-red-600/20 text-red-400 font-black py-4 rounded-3xl transition-all border border-red-500/30 uppercase tracking-[0.2em] text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && selectedPlayer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowComparison(false)}
              className="fixed inset-0 bg-[#090A0D]/98 backdrop-blur-xl z-[200]"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="fixed inset-4 sm:inset-x-0 sm:max-w-4xl sm:mx-auto top-20 bottom-10 z-[201] bg-[#12141C] rounded-[40px] border border-white/5 shadow-2xl flex flex-col"
            >
              <div className="p-8 flex-1 flex flex-col overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-[11px] text-gray-500 uppercase font-black tracking-[0.2em] underline decoration-indigo-500 decoration-2 underline-offset-8">{t.compare}</span>
                  <button onClick={() => setShowComparison(false)} className="text-gray-500 hover:text-white transition-colors">Close</button>
                </div>

                <div className="flex items-center justify-between gap-4 mb-12">
                   <div className="flex-1 flex flex-col items-center text-center gap-2">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center font-black text-white text-xl">
                      {selectedPlayer.shirtNumber}
                    </div>
                    <span className="font-black text-sm">{selectedPlayer.name}</span>
                    <span className="text-[10px] text-indigo-400 font-bold">OVR {calculateRating(selectedPlayer)}</span>
                  </div>

                  <div className="text-2xl font-black italic opacity-20">{t.vs}</div>

                  {!comparePlayer ? (
                    <div className="flex-1 flex flex-col items-center">
                       <div className="w-16 h-16 rounded-2xl bg-white/5 border-2 border-dashed border-white/10 flex items-center justify-center text-gray-700">
                        ?
                      </div>
                      <span className="mt-2 text-[10px] text-gray-500 font-bold uppercase">Select Player</span>
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center text-center gap-2">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center font-black text-white text-xl ${comparePlayer.id < 200 ? 'bg-blue-600' : 'bg-red-600'}`}>
                        {comparePlayer.shirtNumber}
                      </div>
                      <span className="font-black text-sm">{comparePlayer.name}</span>
                      <span className="text-[10px] text-indigo-400 font-bold">OVR {calculateRating(comparePlayer)}</span>
                    </div>
                  )}
                </div>

                {comparePlayer ? (
                  <div className="space-y-8">
                    <div className="bg-[#1C1F26] rounded-[32px] p-4 border border-white/5 relative h-64">
                       <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={[
                          { subject: t.attributes.defense, A: selectedPlayer.defense, B: comparePlayer.defense },
                          { subject: t.attributes.shoot, A: selectedPlayer.shoot, B: comparePlayer.shoot },
                          { subject: t.attributes.speed, A: selectedPlayer.speed, B: comparePlayer.speed },
                          { subject: t.attributes.technique, A: selectedPlayer.technique, B: comparePlayer.technique },
                          { subject: t.attributes.strength, A: selectedPlayer.strength, B: comparePlayer.strength },
                          { subject: t.attributes.dribble, A: selectedPlayer.dribble, B: comparePlayer.dribble },
                        ]}>
                          <PolarGrid stroke="#374151" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10 }} />
                          <Radar name={selectedPlayer.name} dataKey="A" stroke="#4F46E5" fill="#4F46E5" fillOpacity={0.6} />
                          <Radar name={comparePlayer.name} dataKey="B" stroke="#EF4444" fill="#EF4444" fillOpacity={0.4} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="space-y-3 px-2 pb-8">
                      {(['defense', 'shoot', 'speed', 'technique', 'strength', 'dribble'] as (keyof Player)[]).map(key => (
                        <div key={key as string} className="flex items-center gap-4">
                          <span className={`${(selectedPlayer[key] as number) > (comparePlayer[key] as number) ? 'text-blue-400 font-black' : 'text-gray-500'} text-xs w-8 text-right`}>{selectedPlayer[key]}</span>
                          <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden flex relative">
                            <div className="h-full absolute left-1/2 -translate-x-full bg-blue-500 rounded-l-full" style={{ width: `${((selectedPlayer[key] as number)/100)*50}%` }} />
                            <div className="h-full absolute left-1/2 bg-red-500 rounded-r-full" style={{ width: `${((comparePlayer[key] as number)/100)*50}%` }} />
                          </div>
                          <span className={`${(comparePlayer[key] as number) > (selectedPlayer[key] as number) ? 'text-red-400 font-black' : 'text-gray-500'} text-xs w-8 text-left`}>{comparePlayer[key]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 py-4">
                    {[...players1, ...players2].filter(p => p.id !== selectedPlayer.id).map(p => (
                      <button 
                        key={p.id} 
                        onClick={() => setComparePlayer(p)}
                        className="bg-white/5 border border-white/5 p-3 rounded-2xl flex flex-col items-center gap-1 hover:bg-indigo-500 hover:text-white transition-all"
                      >
                        <span className="text-xs font-black">{p.name}</span>
                        <span className="text-[9px] opacity-50 uppercase">{p.id < 200 ? 'QIZ' : 'LEJ'}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <footer className="mt-12 text-center flex flex-col items-center gap-6 border-t border-gray-800/30 pt-12">
        <div className="flex items-center gap-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default group">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg font-black text-xs italic flex items-center justify-center group-hover:rotate-12 transition-transform">S</div>
           <span className="text-[11px] font-black uppercase tracking-[0.3em]">MatchDay Baku v2.0</span>
        </div>
        <p className="text-[9px] text-gray-600 font-bold uppercase tracking-[0.4em] max-w-[280px] leading-relaxed mx-auto">
          Inspired by SofaScore • Designed for Baku Football Community • May 2026
        </p>
      </footer>
    </div>
  );
}

