import React, { useState } from "react";
import { Upgrade } from "../types";
import { sound } from "../utils/sound";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShoppingBag, 
  Cpu, 
  Tv, 
  Volume2, 
  MousePointer2, 
  ChevronRight, 
  Sparkles,
  ShieldAlert,
  Coins
} from "lucide-react";

interface ShopProps {
  money: number;
  level: number;
  upgrades: Upgrade[];
  onPurchase: (upgradeId: string) => void;
  onEquip: (upgradeId: string) => void;
  onBackToMap: () => void;
}

export default function Shop({
  money,
  level,
  upgrades,
  onPurchase,
  onEquip,
  onBackToMap
}: ShopProps) {
  const [activeCategory, setActiveCategory] = useState<"CPU" | "GamerGear" | "Monitor" | "Snack" | "Decor">("CPU");

  // Filter upgrades based on category
  const categorizedUpgrades = upgrades.filter(u => u.category === activeCategory);

  const categoryIcons = {
    CPU: <Cpu className="w-4 h-4" />,
    GamerGear: <MousePointer2 className="w-4 h-4" />,
    Monitor: <Tv className="w-4 h-4" />,
    Snack: <ShoppingBag className="w-4 h-4" />,
    Decor: <Volume2 className="w-4 h-4" />
  };

  const categoryTitles = {
    CPU: "Procesadores (Multiplicador de Procesamiento)",
    GamerGear: "Perifericos Gamer (Alineación de Coordenadas)",
    Monitor: "Pantallas de Viewport (Ayuda Visual 3D)",
    Snack: "Snacks Concentrados (Reductor del Tiempo)",
    Decor: "Decoración del Ciber (Multiplicador Ganancias)"
  };

  const categories: Array<"CPU" | "GamerGear" | "Monitor" | "Snack" | "Decor"> = [
    "CPU", 
    "GamerGear", 
    "Monitor", 
    "Snack", 
    "Decor"
  ];

  return (
    <div id="ciber_shop_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto p-2 font-mono">
      
      {/* LEFT COLUMN: SHOP NAVIGATION TABS */}
      <div className="lg:col-span-3 flex flex-col gap-2">
        <h2 className="text-white text-md font-bold uppercase tracking-wider mb-2 flex items-center gap-2 px-1">
          <ShoppingBag className="w-5 h-5 text-amber-500" /> Categorías de Compra
        </h2>

        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={`shop-tab-${cat}`}
              onClick={() => { sound.playClick(); setActiveCategory(cat); }}
              className={`p-3 rounded-2xl text-xs font-bold font-mono text-left flex items-center justify-between border cursor-pointer transition ${isSelected ? "bg-amber-600/10 border-amber-500 text-amber-400" : "bg-zinc-900 border-zinc-850 hover:bg-zinc-850 text-zinc-400"}`}
            >
              <span className="flex items-center gap-2.5">
                {categoryIcons[cat]}
                {cat === "GamerGear" ? "Mouse & Teclados" : cat === "Decor" ? "Estilo & Audio" : cat}
              </span>
              <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400" : "text-zinc-650"}`} />
            </button>
          );
        })}

        <button
          onClick={() => { sound.playClick(); onBackToMap(); }}
          className="mt-6 text-center py-2.5 px-4 bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white rounded-2xl hover:bg-zinc-900 transition text-xs font-semibold cursor-pointer"
        >
          ← SALIR COMPRAS
        </button>
      </div>

      {/* RIGHT COLUMN: LIST CONTENT OF ITEMS */}
      <div className="lg:col-span-9 flex flex-col gap-5">
        
        {/* SHOP METRICS BOARD */}
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-950 border border-zinc-800 p-5 rounded-3xl flex flex-wrap gap-4 items-center justify-between">
          <div>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold block">Mostrador de Don Carlos IP #1</span>
            <span className="text-white font-bold text-base block mt-0.5">Estás en la Kiosco de Actualización del Ciber</span>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-zinc-950 border border-zinc-850 py-2 px-4 rounded-xl">
              <span className="text-[9px] text-zinc-500 block">Tus Pesos</span>
              <span className="text-emerald-400 font-bold text-xl flex items-center gap-1">
                <Coins className="w-5 h-5 text-emerald-500" /> ${money}
              </span>
            </div>
          </div>
        </div>

        {/* ITEMS CARDS GRID */}
        <div>
          <h3 className="text-zinc-400 font-bold text-xs uppercase mb-3 px-1 tracking-wider">
            {categoryTitles[activeCategory]}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categorizedUpgrades.map((item) => {
              const isDefaultItem = item.price === 0;
              const levelLocked = level < item.levelRequired;
              const affordable = money >= item.price;
              
              return (
                <div
                  key={`shop-item-${item.id}`}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between ${item.purchased ? "bg-zinc-950/60 border-zinc-850" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        {item.purchased && (
                          <span className="bg-emerald-500/10 text-emerald-400 text-[9px] uppercase px-2 py-0.5 rounded-full font-bold inline-block mb-1 border border-emerald-500/20">
                            ✓ Adquirido
                          </span>
                        )}
                        <h4 className="text-white text-sm font-bold block">{item.name}</h4>
                      </div>
                      
                      {!item.purchased && (
                        <span className="text-emerald-400 font-bold text-sm bg-zinc-950/80 px-2.5 py-1 border border-zinc-850 rounded-xl">
                          ${item.price}
                        </span>
                      )}
                    </div>

                    <p className="text-zinc-400 text-xs mt-2 font-mono leading-relaxed">
                      {item.description}
                    </p>

                    <div className="bg-zinc-950/50 p-2.5 mt-3 rounded-xl border border-zinc-900">
                      <p className="text-[10px] text-amber-500 italic block leading-tight">
                        "{item.flavor}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-900 flex justify-between items-center">
                    <span className="text-[9px] text-zinc-500 uppercase">
                      Min Nivel: {item.levelRequired}
                    </span>

                    {levelLocked ? (
                      <span className="text-red-500 text-[10px] font-bold flex items-center gap-1 bg-red-500/10 border border-red-500/20 py-1 px-3 rounded-lg">
                        <ShieldAlert className="w-3.5 h-3.5" /> REFIERE NIVEL {item.levelRequired}
                      </span>
                    ) : item.purchased ? (
                      item.equipped ? (
                        <span className="bg-emerald-600/20 text-emerald-400 font-bold text-xs py-1 px-3 rounded-lg border border-emerald-500/30">
                          EQUIPADO
                        </span>
                      ) : (
                        <button
                          onClick={() => { sound.playClick(); onEquip(item.id); }}
                          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs py-1 px-3 rounded-lg transition cursor-pointer"
                        >
                          EQUIPAR
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => {
                          if (affordable) {
                            sound.playPowerup();
                            onPurchase(item.id);
                          } else {
                            sound.playError();
                          }
                        }}
                        disabled={!affordable}
                        className={`font-semibold text-xs py-1.5 px-4 rounded-xl transition ${affordable ? "bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold cursor-pointer" : "bg-zinc-950 text-zinc-600 border border-zinc-900 cursor-not-allowed"}`}
                      >
                        {affordable ? "COMPRAR COMPONENTE" : "PESOS INSUFICIENTES"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* STATS IMPACT BREAKDOWN */}
        <div id="stats_impact_board" className="bg-zinc-900/60 border border-zinc-800 p-4 rounded-3xl text-zinc-400 font-mono text-[11px] leading-relaxed">
          <span className="text-yellow-500 font-bold block mb-1">🛠️ GUÍA TÉCNICA DE MEJORAS</span>
          <p>
            - <strong>Procesadores (CPUs)</strong>: Optimizan el tiempo de compilación reduciendo retrasos en el visor CAD y otorgan multiplicador de XP.
          </p>
          <p className="mt-1">
            - <strong>Periféricos Gamer (Mouse)</strong>: Optimizan el pulso digital en la mesa, ampliando el rango en el cual un vértice detecta un correcto snapping.
          </p>
          <p className="mt-1">
            - <strong>Pantallas (Monitores)</strong>: Desbloquean herramientas de asistencia que revelan errores de pintura y proyectan vectores fantasmas hacia las coordenadas correctas del modelo.
          </p>
        </div>

      </div>
    </div>
  );
}
