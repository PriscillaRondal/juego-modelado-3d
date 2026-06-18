/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { GameState, Commission, Model3D, Upgrade } from "./types";
import { MODEL_TEMPLATES, UPGRADE_ITEMS } from "./data";
import { sound } from "./utils/sound";
import CiberMap from "./components/CiberMap";
import ModelEditor from "./components/ModelEditor";
import Shop from "./components/Shop";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Coins, 
  Award, 
  Zap, 
  Play, 
  Maximize2, 
  TrendingUp, 
  Volume2, 
  VolumeX,
  Sparkles,
  Info,
  Clock
} from "lucide-react";

export default function App() {
  // Game persistent state in local react memory (with localStorage as nice backup)
  const [money, setMoney] = useState<number>(() => {
    const saved = localStorage.getItem("ciber_3d_money");
    return saved ? parseInt(saved) : 100; // start with $100 for some initial snacks
  });

  const [xp, setXP] = useState<number>(() => {
    const saved = localStorage.getItem("ciber_3d_xp");
    return saved ? parseInt(saved) : 0;
  });

  const [level, setLevel] = useState<number>(() => {
    const saved = localStorage.getItem("ciber_3d_level");
    return saved ? parseInt(saved) : 1;
  });

  const [completedCount, setCompletedCount] = useState<number>(() => {
    const saved = localStorage.getItem("ciber_3d_completed");
    return saved ? parseInt(saved) : 0;
  });

  const [upgrades, setUpgrades] = useState<Upgrade[]>(() => {
    const saved = localStorage.getItem("ciber_3d_upgrades");
    return saved ? JSON.parse(saved) : UPGRADE_ITEMS;
  });

  // Current active viewport screens
  const [activeScreen, setActiveScreen] = useState<"ciber_map" | "pc_workstation" | "shop">("ciber_map");
  const [activeCommission, setActiveCommission] = useState<Commission | null>(null);
  const [activeModel, setActiveModel] = useState<Model3D | null>(null);

  // Snack boosts duration countdown
  const [activeSnackCooldown, setActiveSnackCooldown] = useState<number>(0);
  const [activeSnackId, setActiveSnackId] = useState<string | null>(null);

  // Success modals / Splash animations
  const [showLevelUpAlert, setShowLevelUpAlert] = useState<boolean>(false);
  const [lastCommissionOutcome, setLastCommissionOutcome] = useState<{
    success: boolean;
    title: string;
    moneyEarned: number;
    xpEarned: number;
    timeSpent: number;
  } | null>(null);

  // Save game automatically on status edits
  useEffect(() => {
    localStorage.setItem("ciber_3d_money", money.toString());
    localStorage.setItem("ciber_3d_xp", xp.toString());
    localStorage.setItem("ciber_3d_level", level.toString());
    localStorage.setItem("ciber_3d_completed", completedCount.toString());
    localStorage.setItem("ciber_3d_upgrades", JSON.stringify(upgrades));
  }, [money, xp, level, completedCount, upgrades]);

  // Handle active snack time counter
  useEffect(() => {
    if (activeSnackCooldown <= 0) {
      setActiveSnackId(null);
      return;
    }
    const timer = setTimeout(() => {
      setActiveSnackCooldown(prev => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [activeSnackCooldown]);

  // Scramble low-poly model to prepare a beautiful interactive workspace
  const handleStartCommission = (comm: Commission) => {
    sound.playClick();
    // Locate the matching template
    const template = MODEL_TEMPLATES.find(t => t.id === comm.modelTemplateId) || MODEL_TEMPLATES[0];
    
    // Deep clone template
    const activeChallengeModel = JSON.parse(JSON.stringify(template)) as Model3D;

    // Scramble coordinates slightly depending on difficulty
    const jitterFactor = comm.modelTemplateId === "spaceship" || comm.modelTemplateId === "gold_cup" ? 1.4 : 0.9;
    
    activeChallengeModel.vertices = activeChallengeModel.vertices.map((v) => {
      // Random displacement
      const dx = (Math.random() - 0.5) * jitterFactor;
      const dy = (Math.random() - 0.5) * jitterFactor;
      const dz = (Math.random() - 0.5) * jitterFactor;

      return {
        ...v,
        x: parseFloat((v.targetX + dx).toFixed(2)),
        y: parseFloat((v.targetY + dy).toFixed(2)),
        z: parseFloat((v.targetZ + dz).toFixed(2))
      };
    });

    // Reset currents colors to grey/wireframe white for face coloring segment
    activeChallengeModel.faces = activeChallengeModel.faces.map(f => ({
      ...f,
      currentColor: "#ffffff"
    }));

    // Start
    setActiveCommission(comm);
    setActiveModel(activeChallengeModel);
    setActiveScreen("pc_workstation");
  };

  const handleCommissionComplete = (xpEarned: number, moneyEarned: number, timeSpent: number) => {
    // Upgrades multiplier application (e.g. CPU or Subwoofer boosts gains!)
    let computedMoney = moneyEarned;
    let computedXP = xpEarned;

    // Subwoofer boost money
    const hasSubwoofer = upgrades.some(u => u.id === "decor_sub" && u.equipped);
    if (hasSubwoofer) {
      computedMoney = Math.floor(computedMoney * 1.4);
    }

    // CPU boosts process speed & xp
    const activeCPU = upgrades.find(u => u.category === "CPU" && u.equipped);
    if (activeCPU) {
      computedXP = Math.floor(computedXP * activeCPU.activeMultiplier);
    }

    // Update balances
    const nextMoney = money + computedMoney;
    let nextXP = xp + computedXP;
    let nextLevel = level;
    let leveledUp = false;

    // Check leveling thresholds (500 XP points requirement per level ratio)
    const nextLevelThreshold = level * 500;
    if (nextXP >= nextLevelThreshold) {
      nextXP -= nextLevelThreshold;
      nextLevel += 1;
      leveledUp = true;
    }

    setMoney(nextMoney);
    setXP(nextXP);
    setLevel(nextLevel);
    setCompletedCount(prev => prev + 1);

    setLastCommissionOutcome({
      success: true,
      title: activeCommission?.title || "Modelado",
      moneyEarned: computedMoney,
      xpEarned: computedXP,
      timeSpent
    });

    if (leveledUp) {
      setShowLevelUpAlert(true);
      setTimeout(() => {
        sound.playPowerup();
      }, 900);
    }

    // Clear active editing
    setActiveCommission(null);
    setActiveModel(null);
    setActiveScreen("ciber_map");
  };

  const handleCommissionExpire = () => {
    setLastCommissionOutcome({
      success: false,
      title: activeCommission?.title || "Modelado Obsoleto",
      moneyEarned: 0,
      xpEarned: 0,
      timeSpent: activeCommission?.timeLimitSec || 60
    });

    setActiveCommission(null);
    setActiveModel(null);
    setActiveScreen("ciber_map");
  };

  // Snack usage multiplier initiation
  const handleSnackActivate = (snackId: string) => {
    // Mark snack as used (consume it by marking purchased = false)
    const updated = upgrades.map(u => {
      if (u.id === snackId) {
        return { ...u, purchased: false, equipped: false };
      }
      return u;
    });
    setUpgrades(updated);

    // Give 30s Slow motion!
    setActiveSnackId(snackId);
    setActiveSnackCooldown(30);
  };

  // Upgrades purchase handle
  const handlePurchase = (upgradeId: string) => {
    const item = upgrades.find(u => u.id === upgradeId);
    if (!item || money < item.price) return;

    const nextMoney = money - item.price;
    setMoney(nextMoney);

    const updated = upgrades.map(u => {
      if (u.id === upgradeId) {
        // Mark as purchased
        let equipImmediately = u.category !== "Snack"; // snacks are stored as inventory consumables
        return { ...u, purchased: true, equipped: equipImmediately };
      }
      // If same category is NOT a snack, we unequip others
      if (item.category !== "Snack" && u.category === item.category && u.id !== upgradeId) {
        return { ...u, equipped: false };
      }
      return u;
    });

    setUpgrades(updated);
  };

  // Equip handles for already purchased persistent things
  const handleEquip = (upgradeId: string) => {
    const item = upgrades.find(u => u.id === upgradeId);
    if (!item || !item.purchased) return;

    const updated = upgrades.map(u => {
      if (u.id === upgradeId) {
        return { ...u, equipped: true };
      }
      if (u.category === item.category && u.id !== upgradeId) {
        return { ...u, equipped: false };
      }
      return u;
    });

    setUpgrades(updated);
  };

  // Reset cheat handle (helpful for testing complete game sequence)
  const handleResetGame = () => {
    sound.playClick();
    if (confirm("¿Seguro querés reiniciar tu partida del Ciber? Volverás a la PC inicial.")) {
      localStorage.clear();
      setMoney(100);
      setXP(0);
      setLevel(1);
      setCompletedCount(0);
      setUpgrades(UPGRADE_ITEMS);
      setActiveScreen("ciber_map");
      setActiveCommission(null);
      setActiveModel(null);
    }
  };

  return (
    <div id="game_app_viewport" className="min-h-screen bg-zinc-950 text-white selection:bg-teal-500 selection:text-zinc-950 flex flex-col justify-between">
      
      {/* GLOBAL HUD TOP BAR */}
      <header id="global_hud" className="border-b border-zinc-900 bg-zinc-950 px-6 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-bounce">💻</span>
            <div>
              <h1 className="text-lg font-mono font-bold tracking-tight text-teal-400">CIBER-3D: Modeladores de Plástico</h1>
              <p className="text-[10px] text-zinc-500 font-mono">Simulador de Pixel Art y Bajo Polígono Retro</p>
            </div>
          </div>

          {/* ACTIVE SCREEN NAVIGATION TABS */}
          <div className="flex bg-zinc-900 p-1.5 rounded-2xl border border-zinc-850 gap-1">
            <button
              onClick={() => { sound.playClick(); setActiveScreen("ciber_map"); }}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition cursor-pointer ${activeScreen === "ciber_map" ? "bg-teal-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              🏢 El Ciber
            </button>
            <button
              onClick={() => { sound.playClick(); setActiveScreen("shop"); }}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-xl transition cursor-pointer ${activeScreen === "shop" ? "bg-amber-600 text-white shadow" : "text-zinc-400 hover:text-white"}`}
            >
              🥤 Kiosco Don Carlos
            </button>
          </div>

          {/* QUICK CURRENCY / LEVEL HUD */}
          <div className="flex gap-4 items-center font-mono text-xs">
            {/* XP indicator */}
            <div className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-805 flex items-center gap-2">
              <Award className="w-4 h-4 text-violet-400" />
              <span>NIVEL <strong className="text-white">{level}</strong></span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-400">{xp} XP</span>
            </div>

            {/* Money Box */}
            <div className="bg-emerald-950/20 text-emerald-400 px-4 py-1.5 rounded-xl border border-emerald-950 flex items-center gap-1.5 font-bold">
              <Coins className="w-4 h-4 text-emerald-500" />
              <span>${money}</span>
            </div>
          </div>

        </div>
      </header>

      {/* CORE SCREENS ROUTER CONTAINER */}
      <main id="screen_mount" className="flex-1 py-8 px-4 md:px-6 relative">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: CIBER ROOM MAP */}
          {activeScreen === "ciber_map" && (
            <motion.div
              key="screen-ciber"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <CiberMap 
                money={money}
                xp={xp}
                level={level}
                upgrades={upgrades}
                completedCount={completedCount}
                onSelectCommission={handleStartCommission}
                onNavigateToShop={() => setActiveScreen("shop")}
              />
            </motion.div>
          )}

          {/* SCREEN: LIVE 3D CAD EDITOR */}
          {activeScreen === "pc_workstation" && activeModel && activeCommission && (
            <motion.div
              key="screen-workstation"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <ModelEditor 
                initialModel={activeModel}
                commission={activeCommission}
                upgrades={upgrades}
                activeSnackCooldown={activeSnackCooldown}
                onComplete={handleCommissionComplete}
                onCancel={() => {
                  sound.playClick();
                  setActiveCommission(null);
                  setActiveModel(null);
                  setActiveScreen("ciber_map");
                }}
                onSnackActivate={handleSnackActivate}
              />
            </motion.div>
          )}

          {/* SCREEN: SHOP GROCERY */}
          {activeScreen === "shop" && (
            <motion.div
              key="screen-shop"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
            >
              <Shop 
                money={money}
                level={level}
                upgrades={upgrades}
                onPurchase={handlePurchase}
                onEquip={handleEquip}
                onBackToMap={() => setActiveScreen("ciber_map")}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* FOOTER & DEVELOPMENT CHEATS RESET */}
      <footer id="game_footer" className="border-t border-zinc-900 bg-zinc-950 px-6 py-4 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between text-zinc-650 font-mono text-[10px]">
          <div>
            <p>© 2026 Ciber de la Esquina Games. Hecho en honor a las tardes mágicas de Counter 1.6 y MSN Messenger.</p>
          </div>

          <div className="flex gap-4 items-center">
            <button
              onClick={handleResetGame}
              className="text-red-500/50 hover:text-red-400 hover:bg-red-500/10 px-3 py-1 rounded border border-red-500/10 hover:border-red-500/20 transition cursor-pointer"
            >
              Reiniciar Partida
            </button>
            <span>Desarrollo: @rondal.priscilla</span>
          </div>
        </div>
      </footer>

      {/* GLOBAL COMMISSION COMPLETION BANNER OVERLAYS */}
      <AnimatePresence>
        {lastCommissionOutcome && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className={`p-6 max-w-md w-full rounded-3xl border text-center font-mono shadow-[0_0_30px_rgba(0,0,0,0.5)] ${lastCommissionOutcome.success ? "bg-zinc-900 border-emerald-500/50 shadow-emerald-500/10" : "bg-zinc-900 border-red-500/50 shadow-red-500/10"}`}
            >
              <div className="text-6xl mb-4">
                {lastCommissionOutcome.success ? "🏆" : "⏰"}
              </div>

              <h3 className={`text-xl font-bold uppercase ${lastCommissionOutcome.success ? "text-emerald-400" : "text-red-400"}`}>
                {lastCommissionOutcome.success ? "¡Contrato Completado!" : "¡Tiempo Agotado!"}
              </h3>

              <p className="text-zinc-500 text-xs mt-1">
                Proyecto: <strong className="text-white">{lastCommissionOutcome.title}</strong>
              </p>

              {lastCommissionOutcome.success ? (
                <div className="bg-zinc-950/60 p-4 border border-zinc-850 rounded-2xl my-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Pesos del Ciber ganados:</span>
                    <strong className="text-emerald-400">${lastCommissionOutcome.moneyEarned}</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Puntos de XP sumados:</span>
                    <strong className="text-violet-400">+{lastCommissionOutcome.xpEarned} XP</strong>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-400">Tiempo de entrega récord:</span>
                    <strong className="text-zinc-300">{lastCommissionOutcome.timeSpent} segundos</strong>
                  </div>
                </div>
              ) : (
                <p className="text-zinc-400 text-xs leading-relaxed my-4">
                  Se te terminó el tiempo de simulación y el renderizador falló. ¡No te desanimes! Comprá un energizante o snacks para disminuir la velocidad del tiempo en tu próxima comisión.
                </p>
              )}

              <button
                onClick={() => {
                  sound.playClick();
                  setLastCommissionOutcome(null);
                }}
                className={`w-full py-2.5 px-4 font-bold rounded-2xl transition cursor-pointer ${lastCommissionOutcome.success ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-400" : "bg-red-500 text-white hover:bg-red-400"}`}
              >
                ENTENDIDO, VOLVER AL CIBER
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* LEVEL UP MODAL */}
        {showLevelUpAlert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="p-6 max-w-sm w-full bg-zinc-900 border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] rounded-3xl text-center font-mono"
            >
              <div className="text-6xl mb-3 animate-bounce">⚡⚡</div>
              
              <h3 className="text-xl font-bold text-yellow-400 uppercase tracking-widest animate-pulse">
                ¡SUBISTE DE NIVEL!
              </h3>
              
              <p className="text-zinc-400 text-xs mt-2 leading-relaxed">
                ¡Felicitaciones! Ahora eres una leyenda de nivel <strong className="text-white text-base">{level}</strong>. Se han desbloqueado nuevos encargos de modelado en la tabla de trabajos rápidos e items premium en el kiosco de Don Carlos.
              </p>

              <button
                onClick={() => {
                  sound.playClick();
                  setShowLevelUpAlert(false);
                }}
                className="mt-5 w-full bg-yellow-500 text-zinc-950 font-bold py-2.5 px-4 rounded-2xl hover:bg-yellow-400 transition cursor-pointer"
              >
                ¡VAMOS POR MÁS!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
