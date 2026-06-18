import React, { useState, useEffect } from "react";
import { PlayableKid, Commission, GameState, Upgrade } from "../types";
import { PLAYABLE_KIDS, CIBER_JOKES, COMMISSIONS_POOL } from "../data";
import { sound } from "../utils/sound";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Tv, 
  Layers, 
  Compass, 
  MessageSquare, 
  Coins, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  Award
} from "lucide-react";

interface CiberMapProps {
  money: number;
  xp: number;
  level: number;
  upgrades: Upgrade[];
  completedCount: number;
  onSelectCommission: (commission: Commission) => void;
  onNavigateToShop: () => void;
}

export default function CiberMap({
  money,
  xp,
  level,
  upgrades,
  completedCount,
  onSelectCommission,
  onNavigateToShop
}: CiberMapProps) {
  // Local active chat balloon messages
  const [activeJoke, setActiveJoke] = useState<string>(CIBER_JOKES[0]);
  const [selectedKidId, setSelectedKidId] = useState<string | null>("nico");

  // Cycle ciber ambient quotes
  useEffect(() => {
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * CIBER_JOKES.length);
      setActiveJoke(CIBER_JOKES[idx]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const selectedKid = PLAYABLE_KIDS.find(k => k.id === selectedKidId) || PLAYABLE_KIDS[0];

  // Helper arrays for retro cyber grid illustration
  const pcStations = [
    { num: 1, user: "Nico 'Speedy'", bg: "bg-red-500/20 text-red-400 border-red-500/30", isPlayer: false, state: "Quake III Arena" },
    { num: 2, user: "Sofi 'PixelGirl'", bg: "bg-pink-500/20 text-pink-400 border-pink-500/30", isPlayer: false, state: "3D Textures" },
    { num: 3, user: "Thiago 'NetMaster'", bg: "bg-blue-500/20 text-blue-400 border-blue-500/30", isPlayer: false, state: "Cheat Engine" },
    { num: 4, user: "💻 TÚ (PC #4)", bg: "bg-emerald-500/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-pulse", isPlayer: true, state: "¡CyberMesh Editor!" },
    { num: 5, user: "PC Cerrada", bg: "bg-zinc-950 text-zinc-600 border-zinc-900", isPlayer: false, state: "Apagada" },
    { num: 6, user: "Mati 'PibeLocal'", bg: "bg-purple-500/20 text-purple-400 border-purple-500/30", isPlayer: false, state: "Counter Strike" },
    { num: 7, user: "Don Carlos Station", bg: "bg-amber-500/20 text-amber-400 border-amber-500/30", isPlayer: false, state: "Servidor / Tarificador" },
    { num: 8, user: "Socio #12", bg: "bg-zinc-950 text-zinc-600 border-zinc-900", isPlayer: false, state: "MSN Messenger" },
  ];

  // Calculate matching available jobs depending on level
  const filteredCommissions = COMMISSIONS_POOL.filter(c => {
    // Basic level locks
    if (c.modelTemplateId === "spaceship" && level < 3) return false;
    if (c.modelTemplateId === "retro_pc" && level < 4) return false;
    if (c.modelTemplateId === "gold_cup" && level < 5) return false;
    return true;
  });

  return (
    <div id="ciber_room_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto p-2">
      
      {/* LEFT COLUMN: ISOMETRIC WORKSTATION ROOM MAP */}
      <div className="lg:col-span-8 flex flex-col gap-5">
        
        {/* ROOM INTERACTION PREVIEW */}
        <div className="bg-zinc-900 p-5 rounded-3xl border border-zinc-800 shadow relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          
          {/* Cyber Retro Floor Grid Ambient Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(99,102,241,0.08),transparent_70%)] pointer-events-none" />
          
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block font-bold">Distribución en tiempo real</span>
                <h2 className="text-white text-xl font-mono font-bold flex items-center gap-2">
                  🎮 El Ciber "Net-World" de la Esquina 🚀
                </h2>
              </div>

              {/* Dynamic chatter floating bulb */}
              <div className="bg-zinc-950 px-3.5 py-2 rounded-xl text-neutral-300 text-xs font-mono max-w-[280px] border border-zinc-800 shadow-lg relative animate-bounce">
                <span className="text-pink-400 block font-bold text-[9px] uppercase mb-0.5">🗣️ Ruido de Fondo ciber:</span>
                "{activeJoke}"
                <div className="absolute top-1/2 -left-2 w-0 h-0 border-y-4 border-y-transparent border-r-8 border-r-zinc-950 transform -translate-y-1/2" />
              </div>
            </div>

            {/* INTERACTIVE ISOMETRIC PC GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 mt-4">
              {pcStations.map((pc) => {
                return (
                  <motion.div
                    key={`pc-node-${pc.num}`}
                    whileHover={{ scale: 1.03 }}
                    onClick={() => {
                      sound.playClick();
                      if (pc.isPlayer) {
                        // Let focus on projects
                      } else {
                        // Find matching kid avatar details
                        const kidMatch = PLAYABLE_KIDS.find(k => pc.user.toLowerCase().includes(k.name.toLowerCase()));
                        if (kidMatch) {
                          setSelectedKidId(kidMatch.id);
                        }
                      }
                    }}
                    className={`cursor-pointer border p-3 rounded-2xl flex flex-col justify-between min-h-[110px] transition ${pc.bg}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-zinc-950/60 rounded text-zinc-300">
                        PC #{pc.num}
                      </span>
                      {pc.isPlayer && (
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      )}
                    </div>

                    <div className="mt-2.5">
                      <p className="text-xs font-mono font-bold tracking-tight">{pc.user}</p>
                      <p className="text-[10px] opacity-70 font-mono flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {pc.state}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* AMBIENCE EXTRAS IN ROOM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Don Carlos Counter station */}
              <div 
                onClick={() => { sound.playClick(); onNavigateToShop(); }}
                className="bg-amber-950/20 hover:bg-amber-950/30 border border-amber-500/25 p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition transform hover:scale-[1.01]"
              >
                <span className="text-3xl p-2 bg-zinc-950 border border-zinc-800 rounded-xl">🧔</span>
                <div className="font-mono text-xs">
                  <span className="text-amber-400 font-bold block">Mostrador de Don Carlos</span>
                  <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">Compra componentes rápidos, CPUs modernas y snacks refrescantes.</p>
                </div>
              </div>

              {/* Achievements banner */}
              <div className="bg-purple-950/20 border border-purple-500/25 p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition transform hover:scale-[1.01]">
                <span className="text-3xl p-2 bg-zinc-950 border border-zinc-800 rounded-xl">🏆</span>
                <div className="font-mono text-xs">
                  <span className="text-purple-400 font-bold block">Tus Estadísticas en Ligas</span>
                  <p className="text-zinc-400 text-[10px] leading-tight mt-0.5">Estás en nivel <strong>{level}</strong>. Subes al modelar mallas 3D complejas sin expirar tiempo.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SOCIAL INTERACTION: MULTI KIID DISCUSSION */}
          <div className="border-t border-zinc-800 pt-4 mt-6">
            <h3 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-pink-500" /> Hablar con los Pibes del Ciber
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {PLAYABLE_KIDS.map((k) => (
                <button
                  key={`kid-btn-${k.id}`}
                  onClick={() => { sound.playClick(); setSelectedKidId(k.id); }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition cursor-pointer ${selectedKidId === k.id ? "bg-indigo-600 border border-indigo-400 text-white" : "bg-zinc-950 text-zinc-400 border border-zinc-850 hover:bg-zinc-850"}`}
                >
                  <span>{k.avatar}</span>
                  <span>{k.name}</span>
                </button>
              ))}
            </div>

            <div className="bg-zinc-950 p-3 rounded-2xl border border-zinc-800 flex items-start gap-4 font-mono text-xs">
              <span className="text-3xl">{selectedKid.avatar}</span>
              <div>
                <div className="flex gap-2 items-center">
                  <span className="text-indigo-400 font-bold text-sm">{selectedKid.name}</span>
                  <span className="bg-zinc-900 border border-zinc-850 px-2 py-0.2 rounded text-[9px] text-zinc-500">{selectedKid.role}</span>
                </div>
                <p className="text-zinc-500 text-[10px] mt-1 italic">"{selectedKid.status}"</p>
                <p className="text-zinc-300 text-[11px] mt-1.5 leading-relaxed">{selectedKid.lore}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN: BULLETIN BOARD WITH ACTIVE COMMISSION LISTING */}
      <div className="lg:col-span-4 flex flex-col gap-5">
        
        {/* PLAYER STATUS WIDGET */}
        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 rounded-3xl p-5 shadow flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Perfil Profesional</span>
              <span className="bg-teal-500/20 text-teal-400 border border-teal-500/30 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold">PC #4</span>
            </div>
            
            <h1 className="text-white text-lg font-bold font-mono truncate leading-none mb-0.5">Modelador Estelar</h1>
            <p className="text-zinc-500 text-xs font-mono">El programador preferido de Don Carlos</p>
          </div>

          <div className="space-y-3 font-mono mt-4">
            <div>
              <div className="flex justify-between text-xs text-zinc-400 mb-1">
                <span>Rango de Nivel {level}</span>
                <span className="font-bold text-teal-400">{xp} / {level * 500} XP</span>
              </div>
              <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-850">
                <div 
                  className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (xp / (level * 500)) * 100)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-zinc-900">
              <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-900">
                <span className="text-[9px] text-zinc-500 block">Billetera</span>
                <span className="text-emerald-400 font-bold text-lg flex items-center gap-1">${money}</span>
              </div>
              <div className="bg-zinc-950/60 p-2 rounded-xl border border-zinc-900">
                <span className="text-[9px] text-zinc-500 block">Completados</span>
                <span className="text-indigo-400 font-bold text-lg">{completedCount} Trabajos</span>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVE BOUNTY COMMISSIONS LISTING */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 shadow flex-1 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-mono text-pink-500 uppercase tracking-widest block font-bold mb-1">Trabajos Rápidos</span>
            <h3 className="text-white text-base font-mono font-bold border-b border-zinc-800 pb-2 mb-3 flex items-center justify-between">
              <span>📋 Pizarra de Comisiones 3D</span>
              <span className="bg-pink-600 text-white rounded-full text-[10px] px-2 py-0.5 font-bold">Activas</span>
            </h3>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {filteredCommissions.map((comm) => {
                return (
                  <div
                    key={`comm-card-${comm.id}`}
                    className="p-3 bg-zinc-950 rounded-2xl border border-zinc-850 hover:border-zinc-700 transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1 font-mono">
                        <span className="font-bold text-white flex items-center gap-1">
                          {comm.clientAvatar} {comm.title}
                        </span>
                        <span className="text-[10px] bg-indigo-950/40 text-indigo-400 border border-indigo-900 px-1.5 rounded uppercase">
                          {comm.id === "comm_1" || comm.id === "comm_2" ? "Fácil" : comm.id === "comm_3" ? "Medio" : "Difícil"}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono mt-1 line-clamp-2">
                        {comm.description}
                      </p>
                    </div>

                    <div className="mt-3.5 flex justify-between items-center border-t border-zinc-900 pt-2 font-mono text-xs">
                      <div>
                        <span className="text-[9px] text-zinc-500 block">PAGO / XP</span>
                        <span className="text-emerald-400 font-bold">${comm.rewardMoney}</span>
                        <span className="text-zinc-500"> / </span>
                        <span className="text-violet-400 font-bold">{comm.rewardXP}XP</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          sound.playClick();
                          onSelectCommission(comm);
                        }}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-0.5 transition cursor-pointer"
                      >
                        Modelar <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 leading-relaxed bg-zinc-950/40 p-2.5 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Los trabajos complejos se habilitan automáticamente a medida que alcanzas niveles de experiencia altos.</span>
          </div>
        </div>

      </div>
    </div>
  );
}
