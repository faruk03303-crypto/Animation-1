import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Play, 
  Pause, 
  Save, 
  Download, 
  Users, 
  Image as ImageIcon, 
  Music, 
  Settings, 
  Sparkles, 
  Trash2, 
  ChevronRight, 
  ChevronLeft,
  Video,
  Layers,
  Type,
  Mic,
  Languages
} from 'lucide-react';
import { CHARACTERS, SCENES, ACTIONS } from './constants';
import { Character, Scene, TimelineItem, AnimationAction } from './types/studio';
import { generateScript } from './lib/gemini';
import { cn } from './lib/utils';

import confetti from 'canvas-confetti';

export default function App() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportQuality, setExportQuality] = useState<'720p' | '1080p' | '2K'>('1080p');

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#0047AB', '#FFD700', '#E31837', '#00FF00']
      });
      alert(`Successfully exported in ${exportQuality} High Quality!`);
    }, 3000);
  };
  const [activeTab, setActiveTab] = useState<'characters' | 'scenes' | 'audio' | 'ai'>('characters');
  const [currentScene, setCurrentScene] = useState<Scene>(SCENES[0]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [language, setLanguage] = useState<'en' | 'bn'>('en');

  const [isLiteMode, setIsLiteMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const updateItemProperty = (id: string, property: string, value: any) => {
    setTimeline(prev => prev.map(item => 
      item.id === id ? { ...item, properties: { ...item.properties, [property]: value } } : item
    ));
  };

  const t = {
    en: {
      studio: "PixarAnim Studio",
      characters: "Characters",
      scenes: "Scenes",
      audio: "Audio",
      ai: "AI Assistant",
      play: "Play",
      pause: "Pause",
      save: "Save",
      export: "Export",
      generate: "Generate Script",
      timeline: "Timeline",
      add: "Add to Scene",
      promptPlaceholder: "Describe your story idea...",
      generating: "Generating Pixar Magic...",
      liteMode: "Lite Mode",
    },
    bn: {
      studio: "পিক্সারঅ্যানিম স্টুডিও",
      characters: "চরিত্র",
      scenes: "দৃশ্য",
      audio: "অডিও",
      ai: "এআই সহকারী",
      play: "চালান",
      pause: "থামান",
      save: "সংরক্ষণ",
      export: "এক্সপোর্ট",
      generate: "স্ক্রিপ্ট তৈরি করুন",
      timeline: "টাইমলাইন",
      add: "দৃশ্যে যোগ করুন",
      promptPlaceholder: "আপনার গল্পের ধারণা লিখুন...",
      generating: "পিক্সার ম্যাজিক তৈরি হচ্ছে...",
      liteMode: "লাইট মোড",
    }
  }[language];

  const addToTimeline = (asset: Character | Scene | any, type: 'character' | 'background' | 'audio') => {
    const newItem: TimelineItem = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      startTime: currentTime,
      duration: 5,
      assetId: asset.id,
      properties: type === 'character' ? { x: 50, y: 50, scale: 1, action: 'Standing' } : {}
    };
    setTimeline([...timeline, newItem]);
  };

  const handleAiGenerate = async () => {
    if (!aiPrompt) return;
    setIsGenerating(true);
    try {
      const script = await generateScript(aiPrompt);
      // Find the best matching scene
      const firstScene = SCENES.find(s => 
        s.name.toLowerCase().includes(script.scenes[0].background.toLowerCase()) ||
        script.scenes[0].background.toLowerCase().includes(s.name.toLowerCase())
      ) || SCENES[0];
      
      setCurrentScene(firstScene);
      
      const newTimelineItems: TimelineItem[] = script.scenes[0].characters.map((char: any, idx: number) => {
        const matchedChar = CHARACTERS.find(c => c.name.toLowerCase().includes(char.name.toLowerCase())) || CHARACTERS[idx % CHARACTERS.length];
        return {
          id: Math.random().toString(36).substr(2, 9),
          type: 'character',
          startTime: idx * 1.5,
          duration: 6,
          assetId: matchedChar.id,
          properties: { 
            x: char.position?.x || (20 + (idx * 25)), 
            y: char.position?.y || 60, 
            scale: 1, 
            action: char.action, 
            dialogue: char.dialogue 
          }
        };
      });
      setTimeline(newTimelineItems);
      setIsAiModalOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen flex flex-col font-sans select-none">
      {/* Header */}
      <header className="h-14 glass-panel border-b flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-pixar-blue rounded-xl flex items-center justify-center pixar-shadow">
            <Video className="text-white w-6 h-6" />
          </div>
          <h1 className="font-display font-bold text-xl tracking-tight text-pixar-blue">{t.studio}</h1>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsLiteMode(!isLiteMode)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full transition-all text-sm font-medium",
              isLiteMode ? "bg-pixar-yellow text-black" : "bg-slate-100 text-slate-600"
            )}
          >
            <Settings className={cn("w-4 h-4", isLiteMode && "animate-spin-slow")} />
            {t.liteMode}
          </button>

          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors text-sm font-medium"
          >
            <Languages className="w-4 h-4" />
            {language === 'en' ? 'English' : 'বাংলা'}
          </button>
          
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          
          <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
            {(['720p', '1080p', '2K'] as const).map((q) => (
              <button
                key={q}
                onClick={() => setExportQuality(q)}
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-bold transition-all",
                  exportQuality === q ? "bg-pixar-blue text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {q}
              </button>
            ))}
          </div>

          <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 hover:border-pixar-blue transition-all text-sm font-medium">
            <Save className="w-4 h-4" />
            {t.save}
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-1.5 rounded-full bg-pixar-blue text-white hover:bg-blue-700 transition-all text-sm font-bold pixar-shadow disabled:opacity-50"
          >
            {isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Exporting..." : t.export}
          </button>
        </div>
      </header>

      <div className={cn("flex-1 flex overflow-hidden", isLiteMode && "grayscale-[0.5] contrast-[0.9]")}>
        {/* Sidebar */}
        <aside className={cn("w-80 glass-panel border-r flex flex-col z-40", isLiteMode && "backdrop-blur-none bg-white")}>
          <div className="flex border-b">
            {(['characters', 'scenes', 'audio', 'ai'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "flex-1 py-4 flex flex-col items-center gap-1 transition-all relative",
                  activeTab === tab ? "text-pixar-blue" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab === 'characters' && <Users className="w-5 h-5" />}
                {tab === 'scenes' && <ImageIcon className="w-5 h-5" />}
                {tab === 'audio' && <Music className="w-5 h-5" />}
                {tab === 'ai' && <Sparkles className="w-5 h-5" />}
                <span className="text-[10px] font-bold uppercase tracking-wider">{t[tab]}</span>
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pixar-blue" />
                )}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
            {activeTab === 'characters' && (
              <div className="grid grid-cols-2 gap-3">
                {CHARACTERS.map((char) => (
                  <motion.div
                    key={char.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-transparent hover:border-pixar-blue cursor-pointer bg-slate-100"
                    onClick={() => addToTimeline(char, 'character')}
                  >
                    <img src={char.image} alt={char.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                      <p className="text-white text-xs font-bold">{char.name}</p>
                      <p className="text-white/70 text-[10px]">{char.profession}</p>
                    </div>
                    <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-4">
                {SCENES.map((scene) => (
                  <motion.div
                    key={scene.id}
                    whileHover={{ scale: 1.02 }}
                    className={cn(
                      "relative aspect-video rounded-2xl overflow-hidden cursor-pointer border-2 transition-all",
                      currentScene.id === scene.id ? "border-pixar-blue ring-4 ring-pixar-blue/10" : "border-transparent hover:border-pixar-blue/50"
                    )}
                    onClick={() => setCurrentScene(scene)}
                  >
                    <img src={scene.background} alt={scene.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-3 left-3">
                      <p className="text-white text-sm font-bold drop-shadow-md">{scene.name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">{scene.lighting}</span>
                        <span className="text-[10px] bg-white/20 backdrop-blur-md text-white px-2 py-0.5 rounded-full">{scene.weather}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {activeTab === 'ai' && (
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-pixar-blue/5 border border-pixar-blue/10">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-pixar-blue" />
                    <h3 className="font-display font-bold text-pixar-blue">AI Script Magic</h3>
                  </div>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    Turn your simple idea into a full Pixar-style animation script with characters, actions, and dialogue.
                  </p>
                  <button 
                    onClick={() => setIsAiModalOpen(true)}
                    className="w-full py-3 bg-pixar-blue text-white rounded-2xl font-bold text-sm pixar-shadow hover:bg-blue-700 transition-all"
                  >
                    {t.generate}
                  </button>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-1">Templates</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {['Village Story', 'City Adventure', 'School Lesson', 'Hospital Care'].map((temp) => (
                      <button key={temp} className="text-left px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-sm font-medium flex items-center justify-between group">
                        {temp}
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-pixar-blue transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Canvas Area */}
        <main className="flex-1 flex flex-col bg-slate-200 relative overflow-hidden">
          {/* Canvas Preview */}
          <div className="flex-1 relative flex items-center justify-center p-8" onClick={() => setSelectedItemId(null)}>
            <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden pixar-shadow relative" onClick={(e) => e.stopPropagation()}>
              {/* Background */}
              <img 
                src={currentScene.background} 
                className="absolute inset-0 w-full h-full object-cover transition-all duration-1000"
                style={{ filter: currentScene.lighting === 'Night' ? 'brightness(0.4) saturate(1.2)' : 'none' }}
                referrerPolicy="no-referrer"
              />
              
              {/* Characters on Canvas */}
              <AnimatePresence>
                {timeline.filter(item => item.type === 'character').map((item) => {
                  const char = CHARACTERS.find(c => c.id === item.assetId);
                  if (!char) return null;
                  return (
                    <motion.div
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItemId(item.id);
                      }}
                      initial={{ opacity: 0, y: 100 }}
                      animate={{ 
                        opacity: 1, 
                        bottom: `${100 - item.properties.y}%`,
                        scale: item.properties.scale,
                        rotate: item.properties.action === 'Fighting' ? [0, -10, 10, 0] : 0,
                        x: item.properties.action === 'Running' ? [`${item.properties.x}%`, `${item.properties.x + 2}%`, `${item.properties.x}%`] : `${item.properties.x}%`,
                        y: item.properties.action === 'Flying' ? [0, -20, 0] : 0,
                      }}
                      transition={{
                        rotate: { repeat: Infinity, duration: 0.5, ease: "linear" },
                        x: { repeat: Infinity, duration: 0.3, ease: "easeInOut" },
                        y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                      }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      className={cn(
                        "absolute w-40 h-60 cursor-grab active:cursor-grabbing rounded-3xl transition-all",
                        selectedItemId === item.id ? "ring-4 ring-pixar-yellow ring-offset-4 ring-offset-black/20" : ""
                      )}
                    >
                      <div className="relative group">
                        <img src={char.image} alt={char.name} className="w-full h-full object-contain drop-shadow-2xl" referrerPolicy="no-referrer" />
                        
                        {/* Dialogue Bubble */}
                        {item.properties.dialogue && (
                          <motion.div 
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-2xl rounded-bl-none shadow-xl border border-slate-100 min-w-[120px] z-10"
                          >
                            <p className="text-[10px] font-bold text-pixar-blue mb-0.5">{char.name}</p>
                            <p className="text-xs text-slate-800 leading-tight">{item.properties.dialogue}</p>
                          </motion.div>
                        )}

                        {/* Action Label */}
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-pixar-blue/80 backdrop-blur-md text-white text-[8px] font-bold uppercase px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                          {item.properties.action}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Lighting Overlay */}
              {currentScene.lighting === 'Sunset' && (
                <div className="absolute inset-0 bg-orange-500/20 mix-blend-overlay pointer-events-none" />
              )}
              
              {/* Controls Overlay */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/40 backdrop-blur-xl px-6 py-3 rounded-full border border-white/10">
                <button className="text-white/70 hover:text-white transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-12 h-12 bg-pixar-yellow rounded-full flex items-center justify-center text-black pixar-shadow hover:scale-105 active:scale-95 transition-all"
                >
                  {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                </button>
                <button className="text-white/70 hover:text-white transition-colors"><ChevronRight className="w-5 h-5" /></button>
              </div>

              <div className="absolute top-6 right-6 flex flex-col gap-3">
                <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"><Layers className="w-5 h-5" /></button>
                <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"><Type className="w-5 h-5" /></button>
                <button className="w-10 h-10 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white/20 transition-all"><Mic className="w-5 h-5" /></button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="h-64 glass-panel border-t flex flex-col">
            <div className="h-10 border-b flex items-center justify-between px-6 bg-slate-50/50">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.timeline}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-pixar-red animate-pulse" />
                  <span className="text-xs font-mono font-bold text-slate-600">00:00:{currentTime.toString().padStart(2, '0')}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"><Plus className="w-4 h-4" /></button>
                <button className="p-1.5 rounded-lg hover:bg-slate-200 transition-colors text-slate-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-hidden relative timeline-track custom-scrollbar">
              <div className="absolute top-0 bottom-0 left-0 w-[2000px] p-4 space-y-3">
                {/* Timeline Tracks */}
                <div className="h-12 flex items-center gap-2">
                  <div className="w-24 h-full flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase">Actors</div>
                  <div className="flex-1 h-full relative">
                    {timeline.filter(i => i.type === 'character').map((item, idx) => (
                      <div 
                        key={item.id}
                        className="absolute h-10 bg-pixar-blue/20 border border-pixar-blue/40 rounded-lg flex items-center px-3 gap-2"
                        style={{ left: `${item.startTime * 40}px`, width: `${item.duration * 40}px`, top: '4px' }}
                      >
                        <Users className="w-3 h-3 text-pixar-blue" />
                        <span className="text-[10px] font-bold text-pixar-blue truncate">
                          {CHARACTERS.find(c => c.id === item.assetId)?.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-12 flex items-center gap-2">
                  <div className="w-24 h-full flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase">Scene</div>
                  <div className="flex-1 h-full relative">
                    <div 
                      className="absolute h-10 bg-pixar-yellow/20 border border-pixar-yellow/40 rounded-lg flex items-center px-3 gap-2"
                      style={{ left: '0px', width: '800px', top: '4px' }}
                    >
                      <ImageIcon className="w-3 h-3 text-pixar-yellow" />
                      <span className="text-[10px] font-bold text-pixar-yellow truncate">{currentScene.name}</span>
                    </div>
                  </div>
                </div>

                <div className="h-12 flex items-center gap-2">
                  <div className="w-24 h-full flex items-center justify-end pr-4 text-[10px] font-bold text-slate-400 uppercase">Audio</div>
                  <div className="flex-1 h-full relative">
                    <div 
                      className="absolute h-10 bg-emerald-500/20 border border-emerald-500/40 rounded-lg flex items-center px-3 gap-2"
                      style={{ left: '40px', width: '400px', top: '4px' }}
                    >
                      <Music className="w-3 h-3 text-emerald-600" />
                      <span className="text-[10px] font-bold text-emerald-600 truncate">Background Music.mp3</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Playhead */}
              <div 
                className="absolute top-0 bottom-0 w-0.5 bg-pixar-red z-10 pointer-events-none"
                style={{ left: `${currentTime * 40 + 112}px` }}
              >
                <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 bg-pixar-red rotate-45" />
              </div>
            </div>
          </div>
        </main>

        {/* Properties Panel */}
        <aside className="w-72 glass-panel border-l p-6 z-40 overflow-y-auto custom-scrollbar">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-6">Properties</h3>
          
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700">Animation Action</label>
              <div className="grid grid-cols-1 gap-2">
                {ACTIONS.map((action) => (
                  <button 
                    key={action.id}
                    onClick={() => selectedItemId && updateItemProperty(selectedItemId, 'action', action.name)}
                    className={cn(
                      "flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all text-xs font-medium",
                      selectedItemId && timeline.find(i => i.id === selectedItemId)?.properties.action === action.name
                        ? "bg-pixar-blue text-white border-pixar-blue"
                        : "bg-slate-50 hover:bg-slate-100 border-slate-200"
                    )}
                  >
                    {action.name}
                    <span className={cn(
                      "text-[8px] uppercase",
                      selectedItemId && timeline.find(i => i.id === selectedItemId)?.properties.action === action.name
                        ? "text-white/70"
                        : "text-slate-400"
                    )}>{action.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-slate-700">Environment</label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs">Lighting</span>
                  <select 
                    value={currentScene.lighting}
                    onChange={(e) => setCurrentScene({...currentScene, lighting: e.target.value as any})}
                    className="text-xs font-bold bg-transparent outline-none"
                  >
                    <option>Day</option>
                    <option>Night</option>
                    <option>Sunset</option>
                  </select>
                </div>
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs">Weather</span>
                  <select 
                    value={currentScene.weather}
                    onChange={(e) => setCurrentScene({...currentScene, weather: e.target.value as any})}
                    className="text-xs font-bold bg-transparent outline-none"
                  >
                    <option>Sunny</option>
                    <option>Rainy</option>
                    <option>Cloudy</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* AI Modal */}
      <AnimatePresence>
        {isAiModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg glass-panel rounded-[40px] p-8 pixar-shadow overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pixar-blue via-pixar-yellow to-pixar-red" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-pixar-blue/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-pixar-blue" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-slate-900">{t.ai}</h2>
                  <p className="text-sm text-slate-500">Let AI write your Pixar story</p>
                </div>
              </div>

              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder={t.promptPlaceholder}
                className="w-full h-40 p-5 rounded-3xl bg-slate-50 border border-slate-200 focus:border-pixar-blue focus:ring-4 focus:ring-pixar-blue/10 outline-none transition-all text-sm resize-none mb-6"
              />

              <div className="flex gap-3">
                <button 
                  onClick={() => setIsAiModalOpen(false)}
                  className="flex-1 py-4 rounded-2xl font-bold text-slate-600 hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAiGenerate}
                  disabled={isGenerating || !aiPrompt}
                  className="flex-[2] py-4 bg-pixar-blue text-white rounded-2xl font-bold pixar-shadow hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t.generating}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      {t.generate}
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}} />
    </div>
  );
}
