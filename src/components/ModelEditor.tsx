import React, { useState, useEffect, useMemo, useRef } from "react";
import { Model3D, Vertex3D, Face3D, Upgrade, Commission } from "../types";
import { sound } from "../utils/sound";
import { motion, AnimatePresence } from "motion/react";
import { 
  RotateCw, 
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Rotate3d,
  Palette,
  Crosshair,
  HelpCircle,
  Clock,
  Zap,
  Check,
  Award
} from "lucide-react";

interface ModelEditorProps {
  initialModel: Model3D;
  commission: Commission;
  upgrades: Upgrade[];
  activeSnackCooldown: number;
  onComplete: (xpEarned: number, moneyEarned: number, timeSpent: number) => void;
  onCancel: () => void;
  onSnackActivate: (snackId: string) => void;
}

export default function ModelEditor({
  initialModel,
  commission,
  upgrades,
  activeSnackCooldown,
  onComplete,
  onCancel,
  onSnackActivate
}: ModelEditorProps) {
  // Deep clone of model to local state
  const [model, setModel] = useState<Model3D>(() => JSON.parse(JSON.stringify(initialModel)));
  const [selectedVertexId, setSelectedVertexId] = useState<number | null>(null);
  
  // Custom rotation angles
  const [yaw, setYaw] = useState<number>(0.6); // Horizontal angle
  const [pitch, setPitch] = useState<number>(0.35); // Vertical angle
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<"project" | "target" | "overlay">("project");
  
  // Painting properties
  const [activeTool, setActiveTool] = useState<"vertex" | "paint">("vertex");
  
  // Extract custom target colors as paintable palette
  const uniqueTargetColors = useMemo(() => {
    const colors = new Set<string>();
    model.faces.forEach(f => colors.add(f.targetColor));
    return Array.from(colors);
  }, [model]);
  
  const [selectedPaintColor, setSelectedPaintColor] = useState<string>(uniqueTargetColors[0] || "#ef4444");

  // Snack statuses (from upgrades)
  const availableSnacks = useMemo(() => {
    return upgrades.filter(u => u.category === "Snack" && u.purchased);
  }, [upgrades]);

  // Timing
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(commission.timeLimitSec);
  const [isDone, setIsDone] = useState<boolean>(false);

  // Upgrade bonuses
  const hasQuantumCPU = upgrades.some(u => u.id === "cpu_quantum" && u.equipped);
  const hasIPSMomitor = upgrades.some(u => u.id === "mon_wide" && u.equipped);
  const hasHoloProj = upgrades.some(u => u.id === "mon_hologram" && u.equipped);
  const hasBlueKeyboard = upgrades.some(u => u.id === "keyboard_mech" && u.equipped);
  const hasSuperMouse = upgrades.some(u => u.id === "mouse_pro" && u.equipped);

  // Snapping calculations depending on equipped gear
  const SNAP_THRESHOLD = useMemo(() => {
    let base = 0.22;
    if (hasSuperMouse) base = 0.38; // massive snap helper
    else if (hasBlueKeyboard) base = 0.30; // standard snap helper
    return base;
  }, [hasSuperMouse, hasBlueKeyboard]);

  // Rotator loops
  useEffect(() => {
    if (!isAutoRotating || isDone) return;
    const interval = setInterval(() => {
      setYaw(y => (y + 0.012) % (Math.PI * 2));
    }, 40);
    return () => clearInterval(interval);
  }, [isAutoRotating, isDone]);

  // Custom Countdown which can be slowed down by snacks!
  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsDone(true);
          sound.playError();
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, activeSnackCooldown > 0 ? 1800 : 1000); // 1.8x slower tick rate if snack is active!

    return () => clearInterval(interval);
  }, [isDone, activeSnackCooldown]);

  // 3D coordinate projection helper
  const projectPoint = (x: number, y: number, z: number, theta: number, phi: number, w: number, h: number) => {
    // 3D rotations based on yaw (theta) and pitch (phi)
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    let x1 = x * cosT - z * sinT;
    let z1 = x * sinT + z * cosT;

    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);
    let y2 = y * cosP - z1 * sinP;
    let z2 = y * sinP + z1 * cosP;

    // Projection calculation (Orthographic depth scaled)
    const cameraDist = 4.2;
    const depthScale = h * 0.30 * model.scaleFactor;
    const perspectiveFactor = cameraDist / (cameraDist + z2);
    const scale = depthScale * perspectiveFactor;

    const screenX = w / 2 + x1 * scale;
    const screenY = h / 2 - y2 * scale; // Invert SVG axis

    return { x: screenX, y: screenY, depth: z2 };
  };

  // Check if a single vertex is aligned/snapped
  const isVertexAligned = (v: Vertex3D) => {
    const distance = Math.sqrt(
      Math.pow(v.x - v.targetX, 2) +
      Math.pow(v.y - v.targetY, 2) +
      Math.pow(v.z - v.targetZ, 2)
    );
    return distance < SNAP_THRESHOLD;
  };

  // Check everything is aligned and colored correctly
  const checkGlobalStatus = (updatedModel: Model3D) => {
    const verticesAllAligned = updatedModel.vertices.every(v => isVertexAligned(v));
    const colorsAllCorrect = updatedModel.faces.every(f => f.currentColor === f.targetColor);

    if (verticesAllAligned && colorsAllCorrect && !isDone) {
      setIsDone(true);
      sound.playSuccess();
      // Calculate bonus
      const speedBonusMultiplier = timeLeft / commission.timeLimitSec > 0.4 ? 1.3 : 1.0;
      onComplete(
        Math.floor(commission.rewardXP * speedBonusMultiplier),
        Math.floor(commission.rewardMoney * speedBonusMultiplier),
        timeElapsed
      );
    }
  };

  // Vertex slider edits
  const handleVertexCoordChange = (axis: "x" | "y" | "z", value: number) => {
    if (!selectedVertexId && selectedVertexId !== 0) return;
    sound.playKeyboardTick();

    const updatedVertices = model.vertices.map(v => {
      if (v.id === selectedVertexId) {
        const updated = { ...v, [axis]: value };
        // Trigger neat snap sound immediately if snapped during drag
        const previouslyAligned = isVertexAligned(v);
        const nowAligned = isVertexAligned(updated);
        if (!previouslyAligned && nowAligned) {
          sound.playSnap();
        }
        return updated;
      }
      return v;
    });

    const newModel = { ...model, vertices: updatedVertices };
    setModel(newModel);
    checkGlobalStatus(newModel);
  };

  // Face coloring edit
  const handleFaceClick = (faceIndex: number) => {
    if (activeTool !== "paint" || isDone) return;
    sound.playClick();

    const updatedFaces = model.faces.map((f, idx) => {
      if (idx === faceIndex) {
        return { ...f, currentColor: selectedPaintColor };
      }
      return f;
    });

    const newModel = { ...model, faces: updatedFaces };
    setModel(newModel);
    checkGlobalStatus(newModel);
  };

  // Quantum computer autocomplete helper
  const handleQuantumHelp = () => {
    if (!hasQuantumCPU || isDone) return;
    // Find first misaligned vertex and snap it!
    const firstMisaligned = model.vertices.find(v => !isVertexAligned(v));
    if (firstMisaligned) {
      sound.playSuccess();
      const updatedVertices = model.vertices.map(v => {
        if (v.id === firstMisaligned.id) {
          return { ...v, x: v.targetX, y: v.targetY, z: v.targetZ };
        }
        return v;
      });
      const newModel = { ...model, vertices: updatedVertices };
      setModel(newModel);
      checkGlobalStatus(newModel);
    }
  };

  // Viewport setup
  const viewWidth = 320;
  const viewHeight = 280;

  // Projected polygons helper
  const computeRenderPolygons = (isTargetViewer: boolean) => {
    const list: Array<{
      faceIndex: number;
      polygonPoints: string;
      color: string;
      targetColor: string;
      averageDepth: number;
      isHighlighted: boolean;
    }> = [];

    model.faces.forEach((face, fIndex) => {
      let sumDepth = 0;
      let pointsStr = "";
      let valid = true;

      face.vertexIds.forEach(vId => {
        const vInfo = model.vertices.find(vx => vx.id === vId);
        if (!vInfo) {
          valid = false;
          return;
        }
        const coordX = isTargetViewer ? vInfo.targetX : vInfo.x;
        const coordY = isTargetViewer ? vInfo.targetY : vInfo.y;
        const coordZ = isTargetViewer ? vInfo.targetZ : vInfo.z;

        const projected = projectPoint(coordX, coordY, coordZ, yaw, pitch, viewWidth, viewHeight);
        sumDepth += projected.depth;
        pointsStr += `${projected.x.toFixed(1)},${projected.y.toFixed(1)} `;
      });

      if (valid) {
        const avgDepth = sumDepth / face.vertexIds.length;
        const color = isTargetViewer ? face.targetColor : face.currentColor;
        let isHighlighted = false;
        
        // Show mismatches in paint mode inside editor
        if (!isTargetViewer && activeTool === "paint" && face.currentColor !== face.targetColor && hasIPSMomitor) {
          isHighlighted = true;
        }

        list.push({
          faceIndex: fIndex,
          polygonPoints: pointsStr.trim(),
          color,
          targetColor: face.targetColor,
          averageDepth: avgDepth,
          isHighlighted
        });
      }
    });

    // Painter's Algorithm: draw deepest faces first (descending depth)
    return list.sort((a, b) => b.averageDepth - a.averageDepth);
  };

  const modelDraftPolygons = computeRenderPolygons(false);
  const targetHoloPolygons = computeRenderPolygons(true);

  // Selected vertex details
  const currentSelectedVertex = model.vertices.find(v => v.id === selectedVertexId);

  return (
    <div id="model_editor_container" className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto p-2">
      {/* LEFT COLUMN: EDITOR APP IN THE MONITOR */}
      <div className="lg:col-span-8 flex flex-col">
        {/* Retro CRT bezel styling around our modeling app */}
        <div id="retro_bezel" className="bg-zinc-800 p-4 rounded-3xl border-4 border-zinc-700 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col relative overflow-hidden">
          {/* Bezel glare gloss */}
          <div className="absolute top-0 left-0 w-full h-2 bg-white/5 pointer-events-none rounded-t-3xl" />
          
          {/* Header Bar of CAD software */}
          <div id="cad_titlebar" className="bg-zinc-900 px-4 py-2 flex items-center justify-between border-b border-zinc-700 rounded-lg text-xs font-mono mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-zinc-400 font-bold">CyberMesh v2.4a PRO</span>
              <span className="text-zinc-600">|</span>
              <span className="text-green-400 font-semibold">{model.name}</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Clock className="w-3.5 h-3.5 text-pink-500" />
                <span className={timeLeft < 20 ? "text-red-500 font-bold animate-pulse" : "font-mono font-medium"}>
                  {timeLeft}s
                </span>
                {activeSnackCooldown > 0 && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-[10px] px-1.5 rounded flex items-center gap-0.5 animate-bounce">
                    <Zap className="w-2.5 h-2.5 fill-yellow-400 text-yellow-500" /> SLOW-MO
                  </span>
                )}
              </div>
              
              <button 
                onClick={() => { sound.playClick(); onCancel(); }}
                className="bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 text-red-400 px-2 py-0.5 rounded text-[10px] transition cursor-pointer"
              >
                CERRAR
              </button>
            </div>
          </div>

          <div id="cad_workspace" className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* VIEWPORTS ZONE */}
            <div className="md:col-span-8 flex flex-col gap-3">
              {/* Dual screen or slider widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* YOUR PROJECT VISUALIZER */}
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 relative overflow-hidden flex flex-col">
                  <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 text-[10px] uppercase font-mono tracking-wider text-teal-400 flex items-center justify-between">
                    <span>✏️ Proyecto Activo</span>
                    <span className="text-zinc-500 font-normal">PC #4 IP</span>
                  </div>

                  {/* Rendering Stage */}
                  <div className="h-[280px] bg-zinc-950 flex items-center justify-center relative">
                    {/* SVG projection */}
                    <svg width={viewWidth} height={viewHeight} className="absolute inset-0 w-full h-full">
                      {/* Grid background markers for modeling space */}
                      <g stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1">
                        <line x1="0" y1={viewHeight/2} x2={viewWidth} y2={viewHeight/2} />
                        <line x1={viewWidth/2} y1="0" x2={viewWidth/2} y2={viewHeight} />
                      </g>

                      {/* Render Model Draft faces */}
                      {modelDraftPolygons.map((poly) => {
                        const isSelectedFace = false; // Add click to paint state
                        const matches = poly.color === poly.targetColor;
                        return (
                          <polygon 
                            key={`draft-face-${poly.faceIndex}`}
                            points={poly.polygonPoints}
                            fill={poly.color}
                            fillOpacity={0.85}
                            stroke={poly.isHighlighted ? "#fbbf24" : matches ? "rgba(255,255,255,0.2)" : "#ffffff"}
                            strokeWidth={poly.isHighlighted ? 2.5 : 1}
                            strokeOpacity={poly.isHighlighted ? 1 : 0.4}
                            className={`transition duration-150 ${activeTool === "paint" ? "cursor-fill hover:brightness-125 select-none" : ""}`}
                            onClick={() => handleFaceClick(poly.faceIndex)}
                          />
                        );
                      })}

                      {/* Render vertices if tool is vertex */}
                      {activeTool === "vertex" && model.vertices.map((v) => {
                        const projected = projectPoint(v.x, v.y, v.z, yaw, pitch, viewWidth, viewHeight);
                        const isAligned = isVertexAligned(v);
                        const isSelected = selectedVertexId === v.id;

                        return (
                          <g key={`vertex-dot-${v.id}`}>
                            {isSelected && (
                              <circle 
                                cx={projected.x} 
                                cy={projected.y} 
                                r={13} 
                                fill="none" 
                                stroke="#38bdf8" 
                                strokeWidth="1.5"
                                strokeDasharray="3 3"
                                className="animate-spin"
                              />
                            )}
                            <circle 
                              cx={projected.x} 
                              cy={projected.y} 
                              r={isSelected ? 7 : 5} 
                              fill={isAligned ? "#10b981" : "#ef4444"}
                              stroke="#ffffff"
                              strokeWidth={1.5}
                              className="cursor-pointer hover:scale-125 transition drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                              onClick={() => {
                                sound.playClick();
                                setSelectedVertexId(v.id);
                              }}
                            />
                            {hasHoloProj && !isAligned && (
                              // Directional guiding arrow line to target
                              <line 
                                x1={projected.x} 
                                y1={projected.y} 
                                x2={projectPoint(v.targetX, v.targetY, v.targetZ, yaw, pitch, viewWidth, viewHeight).x}
                                y2={projectPoint(v.targetX, v.targetY, v.targetZ, yaw, pitch, viewWidth, viewHeight).y}
                                stroke="#f59e0b"
                                strokeWidth="1"
                                strokeDasharray="2 2"
                                strokeOpacity="0.7"
                              />
                            )}
                          </g>
                        );
                      })}
                    </svg>

                    {/* Paint Tooltip Overlay */}
                    {activeTool === "paint" && (
                      <div className="absolute bottom-2 left-2 bg-purple-950/90 text-[10px] font-mono border border-purple-500/30 px-2 py-1 rounded text-purple-200">
                        🎨 Modo Pintura: Clickeá caras del modelo para colorear
                      </div>
                    )}
                  </div>
                </div>

                {/* TARGET HOLOGRAM VISUALIZER */}
                <div className="bg-zinc-950 rounded-xl border border-zinc-800 relative overflow-hidden flex flex-col">
                  <div className="bg-zinc-900 px-3 py-1 border-b border-zinc-800 text-[10px] uppercase font-mono tracking-wider text-pink-500 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-pink-400 animate-pulse" /> Holograma Objetivo
                    </span>
                    <span className="text-zinc-600">Requerido</span>
                  </div>

                  <div className="h-[280px] bg-zinc-950 flex items-center justify-center relative">
                    {/* Hologram visual noise rays */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0)_95%,rgba(219,39,119,0.06)_95%)] bg-[length:100%_12px] pointer-events-none" />

                    <svg width={viewWidth} height={viewHeight} className="absolute inset-0 w-full h-full">
                      {targetHoloPolygons.map((poly) => (
                        <polygon 
                          key={`target-face-${poly.faceIndex}`}
                          points={poly.polygonPoints}
                          fill={poly.color}
                          fillOpacity={0.65}
                          stroke="#db2777"
                          strokeWidth={1.5}
                          strokeOpacity={0.5}
                        />
                      ))}
                    </svg>

                    <div className="absolute top-2 right-2 bg-pink-900/30 text-[10px] text-pink-400 border border-pink-500/30 px-1.5 py-0.5 rounded font-mono">
                      ROTANDO...
                    </div>
                  </div>
                </div>
              </div>

              {/* EDITOR HARDWARE VIEW ROTATION & CONTROLS SCREEN */}
              <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex flex-wrap gap-3 items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => { sound.playClick(); setYaw(y => y - 0.2); }}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                    title="Girar Izquierda"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { sound.playClick(); setYaw(y => y + 0.2); }}
                    className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded cursor-pointer"
                    title="Girar Derecha"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { sound.playClick(); setIsAutoRotating(!isAutoRotating); }}
                    className={`px-3 py-1 font-mono text-[11px] rounded flex items-center gap-1 cursor-pointer ${isAutoRotating ? "bg-indigo-600/30 text-indigo-400 border border-indigo-500/30" : "bg-zinc-800 text-zinc-400 border border-zinc-700"}`}
                  >
                    <Rotate3d className="w-3.5 h-3.5" /> Auto-Giro: {isAutoRotating ? "ON" : "OFF"}
                  </button>
                </div>

                {/* SLOW TEMPERATURE INDICATOR FOR RETRO TIES */}
                <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                  <span>GPU: <strong className="text-amber-500">72°C</strong></span>
                  <span>FPS: <strong className="text-emerald-400">144.0</strong></span>
                  <span>Gama: <strong className="text-zinc-400">1.8</strong></span>
                </div>
              </div>
            </div>

            {/* RIGHT WORKBENCH SIDEBAR: TREE, SELECTOR AND SLIDERS */}
            <div className="md:col-span-4 flex flex-col gap-4">
              {/* TOOL SELECTION: VERTICES VS PAINTER */}
              <div className="bg-zinc-900 p-2.5 rounded-xl border border-zinc-800">
                <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Herramienta Activa</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { sound.playClick(); setActiveTool("vertex"); }}
                    className={`py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition ${activeTool === "vertex" ? "bg-teal-600 text-white shadow" : "bg-zinc-950 text-zinc-400 hover:bg-zinc-850"}`}
                  >
                    <Crosshair className="w-4 h-4" /> Vértices
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setActiveTool("paint"); }}
                    className={`py-2 px-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-center gap-2 cursor-pointer transition ${activeTool === "paint" ? "bg-purple-600 text-white shadow" : "bg-zinc-950 text-zinc-400 hover:bg-zinc-850"}`}
                  >
                    <Palette className="w-4 h-4" /> Colorear
                  </button>
                </div>
              </div>

              {/* VERTEX MANIPULATION SUBPANEL */}
              {activeTool === "vertex" && (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex-1 flex flex-col justify-between min-h-[290px]">
                  <div>
                    <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Crosshair className="w-3.5 h-3.5 text-teal-400" /> Coordenadas 3D
                    </h3>

                    {currentSelectedVertex ? (
                      <div className="space-y-4">
                        <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800 font-mono">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-teal-400 font-bold">{currentSelectedVertex.label || `Nodo #${currentSelectedVertex.id}`}</span>
                            {isVertexAligned(currentSelectedVertex) ? (
                              <span className="text-emerald-400 text-[10px] flex items-center gap-0.5 font-bold">
                                <Check className="w-3 h-3" /> ALINEADO
                              </span>
                            ) : (
                              <span className="text-amber-500 text-[10px] flex items-center gap-0.5 animate-pulse">
                                <AlertTriangle className="w-3 h-3" /> DESALINEADO
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-zinc-500 mt-1 flex gap-2">
                            <span>Fijo: ({currentSelectedVertex.targetX}, {currentSelectedVertex.targetY}, {currentSelectedVertex.targetZ})</span>
                          </div>
                        </div>

                        {/* Sliders for X, Y, Z coordinates */}
                        <div className="space-y-3 font-mono text-xs">
                          {/* AXIS X */}
                          <div>
                            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                              <span>Eje Horizontal (X)</span>
                              <span className="font-bold text-white">{currentSelectedVertex.x.toFixed(2)}</span>
                            </div>
                            <input 
                              type="range"
                              min="-2.0"
                              max="2.0"
                              step="0.05"
                              value={currentSelectedVertex.x}
                              onChange={(e) => handleVertexCoordChange("x", parseFloat(e.target.value))}
                              className="w-full accent-teal-400 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>

                          {/* AXIS Y */}
                          <div>
                            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                              <span>Eje Vertical (Y)</span>
                              <span className="font-bold text-white">{currentSelectedVertex.y.toFixed(2)}</span>
                            </div>
                            <input 
                              type="range"
                              min="-2.0"
                              max="2.0"
                              step="0.05"
                              value={currentSelectedVertex.y}
                              onChange={(e) => handleVertexCoordChange("y", parseFloat(e.target.value))}
                              className="w-full accent-teal-400 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>

                          {/* AXIS Z */}
                          <div>
                            <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                              <span>Eje Profundidad (Z)</span>
                              <span className="font-bold text-white">{currentSelectedVertex.z.toFixed(2)}</span>
                            </div>
                            <input 
                              type="range"
                              min="-2.0"
                              max="2.0"
                              step="0.05"
                              value={currentSelectedVertex.z}
                              onChange={(e) => handleVertexCoordChange("z", parseFloat(e.target.value))}
                              className="w-full accent-teal-400 bg-zinc-950 h-1.5 rounded-lg appearance-none cursor-ew-resize"
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800/60 text-center text-zinc-500 font-mono text-xs my-4 flex flex-col items-center gap-2">
                        <HelpCircle className="w-7 h-7 text-zinc-600" />
                        <span>Hacé click en un vértice rojo o verde sobre la pantalla para empezar a modelarlo o elegilo en la lista.</span>
                      </div>
                    )}
                  </div>

                  {/* Quantum CPU Help Button */}
                  {hasQuantumCPU && (
                    <button
                      onClick={handleQuantumHelp}
                      className="mt-4 w-full bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/40 text-yellow-400 py-1.5 px-3 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-yellow-400" /> AUTOCOMPILAR SENSOR (Quantum)
                    </button>
                  )}
                </div>
              )}

              {/* COLORS MULTIPICKER PANEL */}
              {activeTool === "paint" && (
                <div className="bg-zinc-900 p-3 rounded-xl border border-zinc-800 flex-1 flex flex-col min-h-[290px]">
                  <h3 className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Palette className="w-3.5 h-3.5 text-purple-400" /> Paleta de Colores
                  </h3>

                  <p className="text-[11px] text-zinc-500 font-mono mb-3 leading-relaxed">
                    Elegí un color y presioná las caras en el panel de dibujo para pintarla:
                  </p>

                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {uniqueTargetColors.map((colorHex) => (
                      <button
                        key={`paint-swatch-${colorHex}`}
                        onClick={() => { sound.playClick(); setSelectedPaintColor(colorHex); }}
                        className={`aspect-square rounded-lg relative border-2 cursor-pointer transition transform hover:scale-105 ${selectedPaintColor === colorHex ? "border-white scale-110 shadow-lg" : "border-transparent"}`}
                        style={{ backgroundColor: colorHex }}
                        title={colorHex}
                      >
                        {selectedPaintColor === colorHex && (
                          <span className="absolute inset-0 flex items-center justify-center text-zinc-950 font-bold text-xs bg-black/10 rounded-md">
                            ✓
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Diagnostic details if Wide Monitor is equipped */}
                  {hasIPSMomitor && (
                    <div className="mt-auto bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 font-mono text-[10px]">
                      <span className="text-yellow-400 font-bold block mb-1">🔬 Monitor IPS: Análisis de Caras</span>
                      <div className="text-zinc-400 max-h-[100px] overflow-y-auto space-y-1">
                        {model.faces.map((f, i) => {
                          const matching = f.currentColor === f.targetColor;
                          return (
                            <div key={`diag-face-${i}`} className="flex justify-between">
                              <span>Cara #{i+1}</span>
                              <span className={matching ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
                                {matching ? "Correcta" : "Diferente"}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {!hasIPSMomitor && (
                    <div className="mt-auto bg-zinc-950/40 p-2 text-center rounded text-[10px] text-zinc-600 font-mono">
                      Compra el Monitor LCD de 19p o el Gamer de 144Hz para ver el corrector de pintura automático.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* CRT SCANLINES & SCREEN BULGE EFFECTS */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] select-none bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.15)_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
      </div>

      {/* RIGHT COLUMN: OUTSIDE PROGRESS LISTING & ACTIVE SNACK BOOST */}
      <div id="editor_external_stats" className="lg:col-span-4 flex flex-col gap-5">
        
        {/* CLIENT INFO */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow">
          <div className="flex items-center gap-3">
            <span className="text-4xl bg-zinc-950 border border-zinc-800 p-2 rounded-xl">{commission.clientAvatar}</span>
            <div>
              <p className="text-[10px] font-mono text-pink-500 uppercase tracking-widest">Pedido de Cliente</p>
              <h2 className="text-white font-bold text-base leading-tight">{commission.clientName}</h2>
              <p className="text-zinc-500 text-xs font-mono">Contrato: {commission.title}</p>
            </div>
          </div>

          <div className="mt-3 bg-zinc-950 border border-zinc-850 p-3 rounded-lg text-xs leading-relaxed text-zinc-300 font-mono">
            {commission.description}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-zinc-800 pt-3">
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block">Pago Fijo</span>
              <span className="font-mono text-lg font-bold text-teal-400">${commission.rewardMoney}</span>
            </div>
            <div>
              <span className="text-[10px] font-mono text-zinc-500 block">XP Al Completar</span>
              <span className="font-mono text-lg font-bold text-violet-400">+{commission.rewardXP} pts</span>
            </div>
          </div>
        </div>

        {/* DETAILED MESH NODE LIST */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow flex-1 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold font-mono uppercase text-zinc-400 tracking-wider mb-2.5 flex items-center justify-between">
              <span>Nodos de la Malla ({model.vertices.length})</span>
              <span className="text-[11px] font-mono font-medium text-zinc-500">Snapping: {Math.round(SNAP_THRESHOLD * 100)}%</span>
            </h3>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {model.vertices.map((v) => {
                const aligned = isVertexAligned(v);
                const isSelected = selectedVertexId === v.id;
                
                return (
                  <button
                    key={`list-v-${v.id}`}
                    onClick={() => { sound.playClick(); setSelectedVertexId(v.id); }}
                    className={`w-full font-mono text-[11px] p-1.5 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${isSelected ? "bg-teal-950/40 border-teal-500 text-teal-300" : "bg-zinc-950/80 border-transparent hover:border-zinc-800 text-zinc-400"}`}
                  >
                    <span className="font-bold flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${aligned ? "bg-emerald-400" : "bg-red-500 animate-pulse"}`} />
                      {v.label || `Nodo #${v.id}`}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {aligned ? "✓ Alineado" : `Dif: ${Math.sqrt(Math.pow(v.x-v.targetX,2)+Math.pow(v.y-v.targetY,2)+Math.pow(v.z-v.targetZ,2)).toFixed(2)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE SNACKS FAST ACTION ZONE */}
          {availableSnacks.length > 0 && (
            <div className="border-t border-zinc-800 pt-3 mt-4">
              <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">Comer Snack de Energía</span>
              <div className="grid grid-cols-1 gap-1.5">
                {availableSnacks.map((u) => {
                  const hasCooldown = activeSnackCooldown > 0;
                  return (
                    <button
                      key={`editor-snack-${u.id}`}
                      disabled={hasCooldown}
                      onClick={() => {
                        sound.playPowerup();
                        onSnackActivate(u.id);
                      }}
                      className={`font-mono text-[11px] py-1.5 px-3 rounded-lg border text-left flex items-center justify-between transition ${hasCooldown ? "bg-zinc-950 border-zinc-900 text-zinc-650 cursor-not-allowed opacity-50" : "bg-amber-600/10 hover:bg-amber-600/20 border-amber-600/30 text-amber-400 cursor-pointer"}`}
                    >
                      <span className="font-bold flex items-center gap-1.5">
                        🥤 {u.name}
                      </span>
                      <span>{hasCooldown ? "USANDO..." : "ACTIVAR"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
