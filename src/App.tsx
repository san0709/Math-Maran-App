import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Lock, 
  ChevronRight, 
  CheckCircle2, 
  ArrowLeft, 
  Zap, 
  Star,
  User,
  LogOut,
  BrainCircuit,
  Medal,
  Target,
  Award,
  Sparkles,
  ChevronLeft,
  LayoutGrid,
  UserCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MATH_TRICKS, MathTrickExtended } from './constants';
import { MathTrick, UserProgress } from './types';
import { generateBossChallenge, getMaranFeedback } from './services/geminiService';

// --- Components ---

const MathMaranAvatar = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizes = {
    sm: "w-16 h-16 text-2xl",
    md: "w-24 h-24 md:w-32 md:h-32 text-4xl md:text-5xl",
    lg: "w-32 h-32 md:w-48 md:h-48 text-6xl md:text-7xl"
  };
  return (
    <div className={`relative ${sizes[size]} flex-shrink-0 group`}>
      <div className="absolute inset-0 bg-[#FFD700] rounded-full shadow-xl shadow-yellow-500/20 group-hover:scale-105 transition-transform duration-500 overflow-hidden border-4 border-white/50">
        <img 
          src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
          alt="Math-Maran" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute -bottom-1 -right-1 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-lg border border-white/50 text-[10px] font-extrabold uppercase tracking-tighter text-slate-800 shadow-sm z-10">
        MARAN
      </div>
    </div>
  );
};

const SpeechBubble = ({ children, side = "left" }: { children: React.ReactNode, side?: "left" | "right" }) => (
  <motion.div 
    initial={{ opacity: 0, x: side === "left" ? -20 : 20, scale: 0.95 }}
    animate={{ opacity: 1, x: 0, scale: 1 }}
    transition={{ type: "spring", damping: 20, stiffness: 100 }}
    className="relative glass p-6 rounded-[2rem] shadow-xl"
  >
    <div className="font-semibold text-xl leading-relaxed text-slate-800">
      {children}
    </div>
  </motion.div>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserProgress | null>(null);
  const [loginName, setLoginName] = useState('');
  const [activeLevel, setActiveLevel] = useState<MathTrickExtended | null>(null);
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'LEVEL' | 'CHALLENGE' | 'PROFILE'>('LOGIN');
  const [bossChallenge, setBossChallenge] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  
  // Interactive Tutorial State
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [tutorialInput, setTutorialInput] = useState('');
  const [tutorialFeedback, setTutorialFeedback] = useState<{ msg: string, isCorrect: boolean } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('math_maran_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('DASHBOARD');
    }
  }, []);

  const handleLogoClick = () => {
    if (user?.completedLevels.length === 10) {
      setShowEasterEgg(true);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#007BFF', '#FF4500', '#32CD32']
      });
    } else {
      setView('DASHBOARD');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginName.trim()) return;
    const newUser: UserProgress = {
      name: loginName,
      completedLevels: [],
      currentLevel: 1,
      scores: {},
      badges: []
    };
    setUser(newUser);
    localStorage.setItem('math_maran_user', JSON.stringify(newUser));
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    localStorage.removeItem('math_maran_user');
    setUser(null);
    setView('LOGIN');
  };

  const startLevel = (level: MathTrickExtended) => {
    setActiveLevel(level);
    setCurrentStepIndex(0);
    setTutorialInput('');
    setTutorialFeedback(null);
    setView('LEVEL');
  };

  const nextTutorialStep = () => {
    if (!activeLevel) return;
    const currentStep = activeLevel.interactiveSteps[currentStepIndex];
    
    if (currentStep.interactive) {
      const isCorrect = tutorialInput.trim().toLowerCase() === currentStep.interactive.answer.toString().toLowerCase();
      if (isCorrect) {
        setTutorialFeedback({ msg: "Correct-u! Super-pa!", isCorrect: true });
        setTimeout(() => {
          if (currentStepIndex < activeLevel.interactiveSteps.length - 1) {
            setCurrentStepIndex(prev => prev + 1);
            setTutorialInput('');
            setTutorialFeedback(null);
          } else {
            // Tutorial finished
          }
        }, 1500);
      } else {
        setTutorialFeedback({ msg: currentStep.interactive.hint, isCorrect: false });
      }
    } else {
      if (currentStepIndex < activeLevel.interactiveSteps.length - 1) {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  const startBossChallenge = async () => {
    if (!activeLevel) return;
    setIsLoading(true);
    const challenge = await generateBossChallenge(activeLevel.id, activeLevel.title, activeLevel.secretCode);
    setBossChallenge(challenge);
    setUserAnswer('');
    setFeedback(null);
    setView('CHALLENGE');
    setIsLoading(false);
  };

  const checkAnswer = async () => {
    if (!bossChallenge || !user || !activeLevel) return;
    const isCorrect = parseInt(userAnswer) === bossChallenge.answer;
    
    const maranMsg = await getMaranFeedback(isCorrect, user.name);
    setFeedback(maranMsg || (isCorrect ? "Super-pa!" : "Try again-u!"));

    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#007BFF', '#FFFFFF']
      });

      const updatedUser = {
        ...user,
        completedLevels: Array.from(new Set([...user.completedLevels, activeLevel.id])),
        currentLevel: Math.max(user.currentLevel, activeLevel.id + 1),
        scores: {
          ...user.scores,
          [activeLevel.id]: (user.scores[activeLevel.id] || 0) + 100 // Simple scoring
        },
        badges: Array.from(new Set([...user.badges, activeLevel.badge.id]))
      };
      setUser(updatedUser);
      localStorage.setItem('math_maran_user', JSON.stringify(updatedUser));
    }
  };

  // --- Render Helpers ---

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/20 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 blur-[120px] rounded-full translate-x-1/2 translate-y-1/2" />
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass-dark p-12 max-w-md w-full text-center rounded-[3rem] relative z-10"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-28 h-28 bg-[#FFD700] rounded-full flex items-center justify-center text-6xl shadow-2xl shadow-yellow-500/40 overflow-hidden border-4 border-white/20">
              <img 
                src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
                alt="Maran" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <h1 className="text-5xl font-extrabold mb-2 tracking-tighter">Math-Maran</h1>
          <p className="text-xl font-medium mb-10 text-slate-400">Mental Math Academy</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="text-left">
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 ml-2 text-slate-500">Your Name, Nanba?</label>
              <input 
                type="text" 
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-lg text-white placeholder:text-slate-600 transition-all"
                required
              />
            </div>
            <button type="submit" className="btn-primary w-full text-xl py-5 rounded-[1.5rem]">
              Start Learning!
            </button>
          </form>
          <p className="mt-8 text-sm font-medium text-slate-500 uppercase tracking-widest">Est. 2026 • Chennai</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="glass sticky top-0 z-50 px-6 py-4 border-b border-white/20">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={handleLogoClick}>
            <div className="w-12 h-12 bg-[#FFD700] rounded-2xl flex items-center justify-center text-2xl shadow-lg shadow-yellow-500/20 group-hover:rotate-12 transition-transform overflow-hidden">
              <img 
                src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
                alt="Maran" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="font-extrabold text-2xl tracking-tighter hidden sm:block">Math-Maran</h1>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/50 cursor-pointer hover:bg-white/80 transition-colors" onClick={() => setView('PROFILE')}>
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-sm">{user?.completedLevels.length || 0}/10</span>
            </div>
            <div className="flex items-center gap-2 cursor-pointer hover:bg-white/50 px-4 py-2 rounded-2xl transition-colors" onClick={() => setView('PROFILE')}>
              <UserCircle className="w-6 h-6 text-slate-600" />
              <span className="font-bold text-sm hidden sm:block">{user?.name}</span>
            </div>
            <button onClick={handleLogout} className="p-3 hover:bg-red-50 rounded-2xl transition-colors text-red-500">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <AnimatePresence mode="wait">
          {view === 'DASHBOARD' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="flex flex-col md:flex-row items-center gap-8 glass p-10 rounded-[3rem]">
                <MathMaranAvatar size="lg" />
                <div className="flex-1">
                  <SpeechBubble>
                    "Vanakkam {user?.name}! Ready to become a mental math wizard? Start from Level 1 and unlock the secrets of Chennai's fastest calculators!"
                  </SpeechBubble>
                </div>
              </div>

              <div className="bento-grid">
                {MATH_TRICKS.map((trick, index) => {
                  const isCompleted = user?.completedLevels.includes(trick.id);
                  const isLocked = trick.id > (user?.currentLevel || 1);
                  
                  // Assign bento classes based on index
                  let bentoClass = "glass hover-lift rounded-[2.5rem] p-8 flex flex-col justify-between relative overflow-hidden group";
                  if (index === 0) bentoClass += " bento-item-large";
                  else if (index === 3) bentoClass += " bento-item-wide";
                  else if (index === 6) bentoClass += " bento-item-tall";
                  
                  return (
                    <motion.div 
                      key={trick.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={bentoClass}
                    >
                      {/* Background Icon */}
                      <div className="absolute -right-4 -bottom-4 text-9xl opacity-[0.03] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                        {trick.badge.icon}
                      </div>

                      <div className="flex justify-between items-start relative z-10">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl ${isCompleted ? 'bg-green-500 text-white' : 'bg-[#FFD700] text-slate-900'} shadow-lg`}>
                          {trick.id}
                        </div>
                        {isCompleted && <div className="bg-green-100 text-green-600 p-2 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>}
                        {isLocked && <div className="bg-slate-100 text-slate-400 p-2 rounded-xl"><Lock className="w-6 h-6" /></div>}
                      </div>
                      
                      <div className="relative z-10">
                        <h3 className="text-2xl font-extrabold mb-2 tracking-tight">{trick.title}</h3>
                        <p className="text-slate-500 font-medium text-sm mb-6">{trick.secretCode}</p>
                        
                        <button 
                          disabled={isLocked}
                          onClick={() => startLevel(trick)}
                          className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
                            isLocked 
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                              : isCompleted 
                                ? 'bg-white border border-slate-200 hover:bg-slate-50' 
                                : 'btn-blue'
                          }`}
                        >
                          {isLocked ? 'Locked' : isCompleted ? 'Review Trick' : 'Learn Trick'}
                          {!isLocked && <ChevronRight className="w-5 h-5" />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'PROFILE' && user && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-10"
            >
              <button 
                onClick={() => setView('DASHBOARD')}
                className="btn-secondary px-6"
              >
                <ChevronLeft className="w-5 h-5" /> Back to Map
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-1 space-y-8">
                  <div className="glass p-10 text-center rounded-[3rem]">
                    <div className="w-36 h-36 bg-white rounded-[2.5rem] shadow-xl mx-auto mb-6 flex items-center justify-center text-7xl border border-white/50">
                      👦
                    </div>
                    <h2 className="text-4xl font-extrabold mb-1 tracking-tighter">{user.name}</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-8">Level {user.currentLevel} Apprentice</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/50 p-5 rounded-3xl border border-white/50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Score</p>
                        <p className="text-3xl font-black text-blue-600">{Object.values(user.scores).reduce((a, b) => a + b, 0)}</p>
                      </div>
                      <div className="bg-white/50 p-5 rounded-3xl border border-white/50">
                        <p className="text-[10px] font-black uppercase text-slate-400 mb-1 tracking-widest">Badges</p>
                        <p className="text-3xl font-black text-yellow-500">{user.badges.length}</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass p-8 rounded-[3rem] bg-gradient-to-br from-[#FFD700]/20 to-transparent">
                    <h3 className="font-extrabold text-xl mb-6 flex items-center gap-2">
                      <Medal className="w-6 h-6 text-yellow-600" /> Your Collection
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      {MATH_TRICKS.map(trick => {
                        const hasBadge = user.badges.includes(trick.badge.id);
                        return (
                          <div 
                            key={trick.badge.id}
                            className={`aspect-square rounded-2xl border flex flex-col items-center justify-center p-3 transition-all duration-500 ${
                              hasBadge ? 'bg-white border-white/50 shadow-lg scale-100' : 'bg-black/5 border-transparent opacity-20 grayscale scale-90'
                            }`}
                            title={trick.badge.name}
                          >
                            <span className="text-3xl">{trick.badge.icon}</span>
                            {hasBadge && <span className="text-[9px] font-extrabold text-center mt-2 leading-tight uppercase tracking-tighter">{trick.badge.name}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-8">
                  <div className="glass p-10 rounded-[3rem]">
                    <h3 className="text-3xl font-extrabold mb-8 flex items-center gap-3 tracking-tighter">
                      <Target className="w-8 h-8 text-red-500" /> Progress Tracker
                    </h3>
                    <div className="space-y-4">
                      {MATH_TRICKS.map(trick => {
                        const isCompleted = user.completedLevels.includes(trick.id);
                        const score = user.scores[trick.id] || 0;
                        return (
                          <div key={trick.id} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/40 border border-white/50 hover:bg-white/60 transition-colors">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl ${isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-400'} shadow-md`}>
                              {trick.id}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-extrabold text-lg">{trick.title}</h4>
                              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{isCompleted ? 'Mastered' : 'Locked'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xl font-black text-slate-800">{score} <span className="text-[10px] text-slate-400 uppercase">pts</span></p>
                              {isCompleted && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto mt-1" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'LEVEL' && activeLevel && (
            <motion.div 
              key="level"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="space-y-10"
            >
              <button 
                onClick={() => setView('DASHBOARD')}
                className="btn-secondary px-6"
              >
                <ChevronLeft className="w-5 h-5" /> Back to Dashboard
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                  <div className="glass p-10 rounded-[3rem] min-h-[500px] flex flex-col">
                    <div className="flex items-center justify-between mb-10">
                      <div className="flex items-center gap-5">
                        <div className="bg-[#FFD700] p-4 rounded-[1.5rem] shadow-lg shadow-yellow-500/20">
                          <BrainCircuit className="w-8 h-8 text-slate-900" />
                        </div>
                        <div>
                          <h2 className="text-4xl font-extrabold tracking-tighter">{activeLevel.title}</h2>
                          <p className="text-blue-600 font-bold uppercase tracking-widest text-xs">Interactive Tutorial</p>
                        </div>
                      </div>
                      <div className="bg-slate-100 px-4 py-2 rounded-xl text-xs font-black text-slate-500 uppercase tracking-widest">
                        Step {currentStepIndex + 1} / {activeLevel.interactiveSteps.length}
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center space-y-12">
                      <AnimatePresence mode="wait">
                        <motion.div 
                          key={currentStepIndex}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="space-y-10"
                        >
                          <p className="text-3xl font-bold leading-tight text-center text-slate-800">
                            {activeLevel.interactiveSteps[currentStepIndex].text}
                          </p>

                          {activeLevel.interactiveSteps[currentStepIndex].interactive && (
                            <div className="max-w-sm mx-auto space-y-6">
                              <p className="font-extrabold text-center text-blue-600 uppercase tracking-widest text-sm">
                                {activeLevel.interactiveSteps[currentStepIndex].interactive?.question}
                              </p>
                              <input 
                                type="text"
                                value={tutorialInput}
                                onChange={(e) => setTutorialInput(e.target.value)}
                                className="w-full p-6 rounded-[2rem] bg-white border-2 border-slate-100 text-center text-4xl font-black focus:outline-none focus:border-[#FFD700] transition-all shadow-inner"
                                placeholder="?"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && nextTutorialStep()}
                              />
                            </div>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {tutorialFeedback && (
                        <motion.div 
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className={`p-6 rounded-[2rem] text-center font-extrabold text-lg shadow-xl ${tutorialFeedback.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                        >
                          {tutorialFeedback.msg}
                        </motion.div>
                      )}
                    </div>

                    <div className="mt-12 flex justify-between items-center">
                      <button 
                        disabled={currentStepIndex === 0}
                        onClick={() => setCurrentStepIndex(prev => prev - 1)}
                        className={`px-8 py-3 rounded-2xl font-bold transition-all ${currentStepIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'bg-white border border-slate-200 hover:bg-slate-50'}`}
                      >
                        Previous
                      </button>

                      {currentStepIndex < activeLevel.interactiveSteps.length - 1 ? (
                        <button 
                          onClick={nextTutorialStep}
                          className="btn-blue px-12"
                        >
                          Next Step
                        </button>
                      ) : (
                        <button 
                          onClick={startBossChallenge}
                          className="btn-primary px-12"
                        >
                          Face the Boss! <Sparkles className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="glass p-10 rounded-[3rem] bg-blue-50/50 border-blue-100">
                    <h3 className="text-2xl font-extrabold mb-4 flex items-center gap-3 tracking-tighter">
                      <Star className="w-7 h-7 text-blue-500" /> Chennai Scenario
                    </h3>
                    <p className="text-2xl font-medium italic text-blue-900 leading-relaxed">"{activeLevel.scenario}"</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="glass p-8 rounded-[3rem] sticky top-32">
                    <div className="flex justify-center mb-8">
                      <MathMaranAvatar size="lg" />
                    </div>
                    <SpeechBubble>
                      {currentStepIndex === 0 
                        ? "Vanakkam! Let's learn this trick step-by-step. Don't rush-u!" 
                        : currentStepIndex === activeLevel.interactiveSteps.length - 1 
                        ? "Super-pa! You've mastered the tutorial. Now face the Boss!" 
                        : "Correct-u! Keep going, nanba!"}
                    </SpeechBubble>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {view === 'CHALLENGE' && bossChallenge && (
            <motion.div 
              key="challenge"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-3xl mx-auto"
            >
              <div className="glass p-12 rounded-[4rem] space-y-12">
                <div className="text-center space-y-4">
                  <div className="inline-block bg-red-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px] shadow-lg shadow-red-500/20">
                    Boss Level Challenge
                  </div>
                  <h2 className="text-5xl font-black tracking-tighter">Show me your Magic!</h2>
                </div>

                <div className="bg-slate-900 p-10 rounded-[3rem] text-white text-2xl font-medium text-center leading-relaxed shadow-2xl">
                  "{bossChallenge.scenario}"
                </div>

                <div className="text-center space-y-10">
                  <p className="text-7xl font-black tracking-tighter text-slate-900">{bossChallenge.question}</p>
                  
                  <div className="max-w-xs mx-auto">
                    <input 
                      type="number" 
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="?"
                      className="w-full p-8 rounded-[2.5rem] bg-white border-4 border-slate-100 text-center text-6xl font-black focus:outline-none focus:border-[#FFD700] transition-all shadow-2xl"
                      autoFocus
                      onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                    />
                  </div>

                  {!feedback && (
                    <button 
                      onClick={checkAnswer}
                      className="btn-primary w-full text-2xl py-6 rounded-[2rem]"
                    >
                      Check Answer!
                    </button>
                  )}
                </div>

                {feedback && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-6 glass p-8 rounded-[3rem]">
                      <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#FFD700] flex-shrink-0">
                        <img 
                          src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
                          alt="Maran" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="font-extrabold text-2xl italic text-slate-800">"{feedback}"</p>
                    </div>

                    <div className="flex gap-6">
                      {feedback.includes('Super-pa') || feedback.includes('Correct-u') || feedback.includes('Semme') ? (
                        <div className="flex-1 space-y-6">
                          <div className="bg-green-500 p-6 rounded-[2.5rem] text-center shadow-xl shadow-green-500/20">
                            <p className="text-white font-black text-xl flex items-center justify-center gap-3">
                              <Award className="w-7 h-7" /> {activeLevel?.badge.name} UNLOCKED!
                            </p>
                          </div>
                          <button 
                            onClick={() => setView('DASHBOARD')}
                            className="btn-primary w-full py-6 text-2xl rounded-[2rem]"
                          >
                            Next Level!
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => {
                            setFeedback(null);
                            setUserAnswer('');
                          }}
                          className="btn-secondary flex-1 py-6 text-2xl rounded-[2rem]"
                        >
                          Try Again-u
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center">
          <div className="glass-dark p-12 rounded-[4rem] text-center space-y-6 max-w-sm">
            <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-[#FFD700] animate-bounce">
              <img 
                src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
                alt="Maran" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-3xl font-black tracking-tighter">Maran is thinking...</p>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">"Wait-u pannu, nanba!"</p>
          </div>
        </div>
      )}

      {showEasterEgg && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-2xl z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-dark p-12 rounded-[4rem] text-center space-y-8 max-w-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500" />
            
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-8 border-[#FFD700] shadow-2xl shadow-yellow-500/50">
              <img 
                src="https://storage.googleapis.com/generativeai-downloads/images/sxs-upload/Gemini_Generated_Image_4gm5f34gm5f34gm5.png" 
                alt="Maran" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter text-[#FFD700]">ULTIMATE WIZARD!</h2>
              <p className="text-2xl font-bold text-white italic">
                "Nanba! You've mastered all 10 levels! You are now a true Math-Maran of Chennai! 
                Semme performance-u! Go forth and spread the magic of numbers!"
              </p>
            </div>

            <div className="grid grid-cols-5 gap-2 py-4">
              {MATH_TRICKS.map(t => (
                <div key={t.id} className="text-3xl animate-bounce" style={{ animationDelay: `${t.id * 0.1}s` }}>
                  {t.badge.icon}
                </div>
              ))}
            </div>

            <button 
              onClick={() => setShowEasterEgg(false)}
              className="btn-primary w-full text-2xl py-6 rounded-[2rem]"
            >
              You're the Best, Maran!
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
