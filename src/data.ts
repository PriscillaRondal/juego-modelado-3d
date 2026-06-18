import { Model3D, Commission, Upgrade, PlayableKid } from "./types";

export const MODEL_TEMPLATES: Model3D[] = [
  {
    id: "coffe_mug",
    name: "Taza de Café Ciber",
    description: "La taza de cerámica oficial con café caliente para aguantar la noche de desvelo en el ciber.",
    difficulty: "Fácil",
    scaleFactor: 1.1,
    vertices: [
      // Base bottom plane (0 to 3)
      { id: 0, x: -0.8, y: -1.0, z: -0.8, targetX: -0.8, targetY: -1.0, targetZ: -0.8, label: "Base DI" },
      { id: 1, x: 0.8, y: -1.0, z: -0.8, targetX: 0.8, targetY: -1.0, targetZ: -0.8, label: "Base DD" },
      { id: 2, x: 0.8, y: -1.0, z: 0.8, targetX: 0.8, targetY: -1.0, targetZ: 0.8, label: "Base TD" },
      { id: 3, x: -0.8, y: -1.0, z: 0.8, targetX: -0.8, targetY: -1.0, targetZ: 0.8, label: "Base TI" },
      // Top rim plane (4 to 7)
      { id: 4, x: -1.0, y: 1.0, z: -1.0, targetX: -1.0, targetY: 1.0, targetZ: -1.0, label: "Borde DI" },
      { id: 5, x: 1.0, y: 1.0, z: -1.0, targetX: 1.0, targetY: 1.0, targetZ: -1.0, label: "Borde DD" },
      { id: 6, x: 1.0, y: 1.0, z: 1.0, targetX: 1.0, targetY: 1.0, targetZ: 1.0, label: "Borde TD" },
      { id: 7, x: -1.0, y: 1.0, z: 1.0, targetX: -1.0, targetY: 1.0, targetZ: 1.0, label: "Borde TI" },
      // Handle points (8 and 9)
      { id: 8, x: -1.4, y: 0.4, z: 0.0, targetX: -1.4, targetY: 0.4, targetZ: 0.0, label: "Asa Superior" },
      { id: 9, x: -1.4, y: -0.4, z: 0.0, targetX: -1.4, targetY: -0.4, targetZ: 0.0, label: "Asa Inferior" },
    ],
    faces: [
      // Sides of the mug
      { vertexIds: [0, 1, 5, 4], currentColor: "#ffffff", targetColor: "#ef4444" }, // Front (Red)
      { vertexIds: [1, 2, 6, 5], currentColor: "#ffffff", targetColor: "#ef4444" }, // Right
      { vertexIds: [2, 3, 7, 6], currentColor: "#ffffff", targetColor: "#dc2626" }, // Back
      { vertexIds: [3, 0, 4, 7], currentColor: "#ffffff", targetColor: "#dc2626" }, // Left
      // Bottom face
      { vertexIds: [3, 2, 1, 0], currentColor: "#ffffff", targetColor: "#991b1b" },
      // Top open liquid face/rim inside
      { vertexIds: [4, 5, 6, 7], currentColor: "#ffffff", targetColor: "#7c2d12" }, // Brown Coffee inside
      // Handle faces
      { vertexIds: [4, 8, 9, 0], currentColor: "#ffffff", targetColor: "#fca5a5" },
      { vertexIds: [7, 8, 9, 3], currentColor: "#ffffff", targetColor: "#fca5a5" },
    ],
  },
  {
    id: "neon_sword",
    name: "Espada Láser Retro",
    description: "Una poderosa espada de haz luminoso y núcleo low-poly diseñada para mods de juegos retro.",
    difficulty: "Medio",
    scaleFactor: 1.0,
    vertices: [
      // Hilt pommel (0, 1)
      { id: 0, x: -0.2, y: -1.5, z: -0.2, targetX: -0.2, targetY: -1.5, targetZ: -0.2, label: "Pomo Izq" },
      { id: 1, x: 0.2, y: -1.5, z: 0.2, targetX: 0.2, targetY: -1.5, targetZ: 0.2, label: "Pomo Der" },
      // Guard crossbar left and right (2, 3, 4, 5)
      { id: 2, x: -0.9, y: -0.6, z: -0.1, targetX: -0.9, targetY: -0.6, targetZ: -0.1, label: "Guarda Izq" },
      { id: 3, x: 0.9, y: -0.6, z: 0.1, targetX: 0.9, targetY: -0.6, targetZ: 0.1, label: "Guarda Der" },
      { id: 4, x: -0.2, y: -0.6, z: -0.2, targetX: -0.2, targetY: -0.6, targetZ: -0.2, label: "Mango Nudo I" },
      { id: 5, x: 0.2, y: -0.6, z: 0.2, targetX: 0.2, targetY: -0.6, targetZ: 0.2, label: "Mango Nudo D" },
      // Blade lower endpoints (6, 7, 8, 9)
      { id: 6, x: -0.3, y: -0.4, z: -0.1, targetX: -0.3, targetY: -0.4, targetZ: -0.1, label: "Hoja Base Tras" },
      { id: 7, x: 0.3, y: -0.4, z: -0.1, targetX: 0.3, targetY: -0.4, targetZ: -0.1, label: "Hoja Base Der" },
      { id: 8, x: 0.3, y: -0.4, z: 0.1, targetX: 0.3, targetY: -0.4, targetZ: 0.1, label: "Hoja Base Front" },
      { id: 9, x: -0.3, y: -0.4, z: 0.1, targetX: -0.3, targetY: -0.4, targetZ: 0.1, label: "Hoja Base Izq" },
      // Blade Tips (10, 11)
      { id: 10, x: 0.0, y: 1.6, z: -0.1, targetX: 0.0, targetY: 1.6, targetZ: -0.1, label: "Punta Tras" },
      { id: 11, x: 0.0, y: 1.6, z: 0.1, targetX: 0.0, targetY: 1.6, targetZ: 0.1, label: "Punta Front" },
    ],
    faces: [
      // Handle faces
      { vertexIds: [0, 1, 5, 4], currentColor: "#ffffff", targetColor: "#4b5563" }, // Grey handle
      // Guard faces
      { vertexIds: [4, 2, 6, 9], currentColor: "#ffffff", targetColor: "#d97706" }, // Guard wing Left (Amber)
      { vertexIds: [5, 3, 7, 8], currentColor: "#ffffff", targetColor: "#d97706" }, // Guard wing Right
      // Blade Front / Back Sides
      { vertexIds: [8, 7, 10, 11], currentColor: "#ffffff", targetColor: "#06b6d4" }, // Neon Cyan Blade front-right
      { vertexIds: [9, 8, 11, 11], currentColor: "#ffffff", targetColor: "#22d3ee" }, // Neon light front-left
      { vertexIds: [6, 7, 10, 10], currentColor: "#ffffff", targetColor: "#0891b2" }, // Darker back cyan
      { vertexIds: [9, 6, 10, 11], currentColor: "#ffffff", targetColor: "#a5f3fc" }, // Light core
    ],
  },
  {
    id: "gamer_chair",
    name: "Silla Gamer RGB",
    description: "Una butaca deportiva y ergonómica. Imprescindible para realizar maratones de programación.",
    difficulty: "Medio",
    scaleFactor: 1.0,
    vertices: [
      // Base wheels center points (0 to 3)
      { id: 0, x: -0.8, y: -1.3, z: -0.8, targetX: -0.8, targetY: -1.3, targetZ: -0.8, label: "Rueda TI" },
      { id: 1, x: 0.8, y: -1.3, z: -0.8, targetX: 0.8, targetY: -1.3, targetZ: -0.8, label: "Rueda TD" },
      { id: 2, x: 0.8, y: -1.3, z: 0.8, targetX: 0.8, targetY: -1.3, targetZ: 0.8, label: "Rueda FD" },
      { id: 3, x: -0.8, y: -1.3, z: 0.8, targetX: -0.8, targetY: -1.3, targetZ: 0.8, label: "Rueda FI" },
      // Seat cushion endpoints (4 to 7)
      { id: 4, x: -0.7, y: -0.4, z: -0.7, targetX: -0.7, targetY: -0.4, targetZ: -0.7, label: "Asiento TI" },
      { id: 5, x: 0.7, y: -0.4, z: -0.7, targetX: 0.7, targetY: -0.4, targetZ: -0.7, label: "Asiento TD" },
      { id: 6, x: 0.7, y: -0.4, z: 0.7, targetX: 0.7, targetY: -0.4, targetZ: 0.7, label: "Asiento FD" },
      { id: 7, x: -0.7, y: -0.4, z: 0.7, targetX: -0.7, targetY: -0.4, targetZ: 0.7, label: "Asiento FI" },
      // Backrest top plane (8 to 11)
      { id: 8, x: -0.6, y: 1.2, z: -0.7, targetX: -0.6, targetY: 1.2, targetZ: -0.7, label: "Respaldo Superior I" },
      { id: 9, x: 0.6, y: 1.2, z: -0.7, targetX: 0.6, targetY: 1.2, targetZ: -0.7, label: "Respaldo Superior D" },
      { id: 10, x: 0.6, y: 1.2, z: -0.4, targetX: 0.6, targetY: 1.2, targetZ: -0.4, label: "Almohadilla Cabeza D" },
      { id: 11, x: -0.6, y: 1.2, z: -0.4, targetX: -0.6, targetY: 1.2, targetZ: -0.4, label: "Almohadilla Cabeza I" },
    ],
    faces: [
      // Base star struts
      { vertexIds: [0, 4, 1, 5], currentColor: "#ffffff", targetColor: "#1e1e24" }, // Bottom black metal
      { vertexIds: [2, 6, 3, 7], currentColor: "#ffffff", targetColor: "#1e1e24" },
      // Cushion Sides
      { vertexIds: [4, 5, 6, 7], currentColor: "#ffffff", targetColor: "#a855f7" }, // Violet Cushion seat top
      { vertexIds: [7, 6, 2, 3], currentColor: "#ffffff", targetColor: "#ec4899" }, // Pink accent band
      // Backrest
      { vertexIds: [4, 5, 9, 8], currentColor: "#ffffff", targetColor: "#18181b" }, // Backrest back
      { vertexIds: [8, 9, 10, 11], currentColor: "#ffffff", targetColor: "#a855f7" }, // Headrest top
      { vertexIds: [7, 4, 8, 11], currentColor: "#ffffff", targetColor: "#00f5ff" }, // Side wing light blue
    ],
  },
  {
    id: "spaceship",
    name: "Nave Espacial Starfighter",
    description: "Una nave interestelar ultrarrápida para simuladores arcade en 3D.",
    difficulty: "Difícil",
    scaleFactor: 0.95,
    vertices: [
      // Cabin/Hull cockpit (0, 1)
      { id: 0, x: 0.0, y: 0.5, z: 1.4, targetX: 0.0, targetY: 0.5, targetZ: 1.4, label: "Cabina Punta" },
      { id: 1, x: 0.0, y: 0.8, z: 0.0, targetX: 0.0, targetY: 0.8, targetZ: 0.0, label: "Cabina Cúpula" },
      // Hull lower main bases (2, 3, 4, 5)
      { id: 2, x: -0.4, y: -0.3, z: -1.2, targetX: -0.4, targetY: -0.3, targetZ: -1.2, label: "Escape Trasero I" },
      { id: 3, x: 0.4, y: -0.3, z: -1.2, targetX: 0.4, targetY: -0.3, targetZ: -1.2, label: "Escape Trasero D" },
      { id: 4, x: 0.4, y: -0.2, z: 0.4, targetX: 0.4, targetY: -0.2, targetZ: 0.4, label: "Fuselaje Del Der" },
      { id: 5, x: -0.4, y: -0.2, z: 0.4, targetX: -0.4, targetY: -0.2, targetZ: 0.4, label: "Fuselaje Del Izq" },
      // Left Wing (6, 7)
      { id: 6, x: -1.7, y: -0.4, z: -0.9, targetX: -1.7, targetY: -0.4, targetZ: -0.9, label: "Ala Izquierda Punta" },
      { id: 7, x: -1.0, y: -0.1, z: 0.0, targetX: -1.0, targetY: -0.1, targetZ: 0.0, label: "Ala Izquierda Nudo" },
      // Right Wing (8, 9)
      { id: 8, x: 1.7, y: -0.4, z: -0.9, targetX: 1.7, targetY: -0.4, targetZ: -0.9, label: "Ala Derecha Punta" },
      { id: 9, x: 1.0, y: -0.1, z: 0.0, targetX: 1.0, targetY: -0.1, targetZ: 0.0, label: "Ala Derecha Nudo" },
      // Tail stabilization wing (10, 11)
      { id: 10, x: 0.0, y: 1.4, z: -1.1, targetX: 0.0, targetY: 1.4, targetZ: -1.1, label: "Aleta Estabilizadora Alta" },
      { id: 11, x: 0.0, y: 0.5, z: -0.8, targetX: 0.0, targetY: 0.5, targetZ: -0.8, label: "Aleta Nudo Base" },
    ],
    faces: [
      // Cabin Glass
      { vertexIds: [0, 4, 1, 5], currentColor: "#ffffff", targetColor: "#38bdf8" }, // Cockpit neon sky
      // Left Wing Panel
      { vertexIds: [5, 7, 6, 2], currentColor: "#ffffff", targetColor: "#4f46e5" }, // Indigo wings
      // Right Wing Panel
      { vertexIds: [4, 9, 8, 3], currentColor: "#ffffff", targetColor: "#4f46e5" },
      // Main Fuselages
      { vertexIds: [0, 4, 3, 2], currentColor: "#ffffff", targetColor: "#1e1b4b" }, // Dark core bodies
      { vertexIds: [0, 5, 2, 2], currentColor: "#ffffff", targetColor: "#1e1b4b" },
      // Thruster Area
      { vertexIds: [2, 3, 11, 11], currentColor: "#ffffff", targetColor: "#f43f5e" }, // Rose Thruster Glow
      // Tail wing
      { vertexIds: [1, 11, 10, 10], currentColor: "#ffffff", targetColor: "#a21caf" }, // Purple tail
    ],
  },
  {
    id: "retro_pc",
    name: "Ciber Monitor CRT",
    description: "La mítica computadora de monitor pesado en la que jugábamos horas y horas.",
    difficulty: "Difícil",
    scaleFactor: 1.05,
    vertices: [
      // Screen face outer frame (0 to 3)
      { id: 0, x: -0.9, y: -0.7, z: 1.0, targetX: -0.9, targetY: -0.7, targetZ: 1.0, label: "Pantalla Abajo I" },
      { id: 1, x: 0.9, y: -0.7, z: 1.0, targetX: 0.9, targetY: -0.7, targetZ: 1.0, label: "Pantalla Abajo D" },
      { id: 2, x: 0.9, y: 0.7, z: 1.0, targetX: 0.9, targetY: 0.7, targetZ: 1.0, label: "Pantalla Arriba D" },
      { id: 3, x: -0.9, y: 0.7, z: 1.0, targetX: -0.9, targetY: 0.7, targetZ: 1.0, label: "Pantalla Arriba I" },
      // Back cooling cone (4 to 7)
      { id: 4, x: -0.5, y: -0.4, z: -1.0, targetX: -0.5, targetY: -0.4, targetZ: -1.0, label: "Tubo Trasero AI" },
      { id: 5, x: 0.5, y: -0.4, z: -1.0, targetX: 0.5, targetY: -0.4, targetZ: -1.0, label: "Tubo Trasero AD" },
      { id: 6, x: 0.5, y: 0.4, z: -1.0, targetX: 0.5, targetY: 0.4, targetZ: -1.0, label: "Tubo Trasero Arriba D" },
      { id: 7, x: -0.5, y: 0.4, z: -1.0, targetX: -0.5, targetY: 0.4, targetZ: -1.0, label: "Tubo Trasero Arriba I" },
      // PC Base stand (8 to 11)
      { id: 8, x: -0.4, y: -1.2, z: -0.4, targetX: -0.4, targetY: -1.2, targetZ: -0.4, label: "Soporte Base Atrás I" },
      { id: 9, x: 0.4, y: -1.2, z: -0.4, targetX: 0.4, targetY: -1.2, targetZ: -0.4, label: "Soporte Base Atrás D" },
      { id: 10, x: 0.4, y: -1.0, z: 0.4, targetX: 0.4, targetY: -1.0, targetZ: 0.4, label: "Soporte Base Frente D" },
      { id: 11, x: -0.4, y: -1.0, z: 0.4, targetX: -0.4, targetY: -1.0, targetZ: 0.4, label: "Soporte Base Frente I" },
    ],
    faces: [
      // Matrix Screen front face
      { vertexIds: [0, 1, 2, 3], currentColor: "#ffffff", targetColor: "#22c55e" }, // Bright green phosphor screen
      // Bezel outer casing sides
      { vertexIds: [3, 2, 6, 7], currentColor: "#ffffff", targetColor: "#d1d5db" }, // Top shell
      { vertexIds: [0, 1, 5, 4], currentColor: "#ffffff", targetColor: "#9ca3af" }, // Bottom shell
      { vertexIds: [1, 2, 6, 5], currentColor: "#ffffff", targetColor: "#6b7280" }, // Right side
      { vertexIds: [0, 3, 7, 4], currentColor: "#ffffff", targetColor: "#6b7280" }, // Left side
      // Stand connection
      { vertexIds: [8, 9, 10, 11], currentColor: "#ffffff", targetColor: "#374151" }, // Dark grey base leg
    ],
  },
  {
    id: "gold_cup",
    name: "Copa de Campeón Ciber",
    description: "El mítico trofeo de metal precioso otorgado al mejor jugador en el torneo de Counter Strike.",
    difficulty: "Difícil",
    scaleFactor: 1.05,
    vertices: [
      // Base stand (0 to 3)
      { id: 0, x: -0.6, y: -1.4, z: -0.6, targetX: -0.6, targetY: -1.4, targetZ: -0.6, label: "Base Mármol atrás I" },
      { id: 1, x: 0.6, y: -1.4, z: -0.6, targetX: 0.6, targetY: -1.4, targetZ: -0.6, label: "Base Mármol atrás D" },
      { id: 2, x: 0.6, y: -1.4, z: 0.6, targetX: 0.6, targetY: -1.4, targetZ: 0.6, label: "Base Mármol delante D" },
      { id: 3, x: -0.6, y: -1.4, z: 0.6, targetX: -0.6, targetY: -1.4, targetZ: 0.6, label: "Base Mármol delante I" },
      // Stem nodes (4 to 5)
      { id: 4, x: -0.2, y: -0.6, z: 0.0, targetX: -0.2, targetY: -0.6, targetZ: 0.0, label: "Columna Nudo I" },
      { id: 5, x: 0.2, y: -0.6, z: 0.0, targetX: 0.2, targetY: -0.6, targetZ: 0.0, label: "Columna Nudo D" },
      // Cup rim points (6 to 9)
      { id: 6, x: -1.0, y: 1.0, z: -1.0, targetX: -1.0, targetY: 1.0, targetZ: -1.0, label: "Boca Copa atrás I" },
      { id: 7, x: 1.0, y: 1.0, z: -1.0, targetX: 1.0, targetY: 1.0, targetZ: -1.0, label: "Boca Copa atrás D" },
      { id: 8, x: 1.0, y: 1.0, z: 1.0, targetX: 1.0, targetY: 1.0, targetZ: 1.0, label: "Boca Copa delante D" },
      { id: 9, x: -1.0, y: 1.0, z: 1.0, targetX: -1.0, targetY: 1.0, targetZ: 1.0, label: "Boca Copa delante I" },
      // Decorative Handles (10, 11)
      { id: 10, x: -1.4, y: 0.2, z: 0.0, targetX: -1.4, targetY: 0.2, targetZ: 0.0, label: "Manija Izquierda" },
      { id: 11, x: 1.4, y: 0.2, z: 0.0, targetX: 1.4, targetY: 0.2, targetZ: 0.0, label: "Manija Derecha" },
    ],
    faces: [
      // Marble black stand
      { vertexIds: [0, 1, 2, 3], currentColor: "#ffffff", targetColor: "#1c1917" }, // Marble base
      // Stem
      { vertexIds: [4, 5, 2, 3], currentColor: "#ffffff", targetColor: "#ca8a04" }, // Gold Stem
      // Cup bowls
      { vertexIds: [4, 6, 7, 5], currentColor: "#ffffff", targetColor: "#eab308" }, // Bright gold back
      { vertexIds: [5, 7, 8, 4], currentColor: "#ffffff", targetColor: "#eab308" }, // Bright gold right
      { vertexIds: [4, 8, 9, 4], currentColor: "#ffffff", targetColor: "#facc15" }, // Top highlight
      { vertexIds: [6, 9, 3, 0], currentColor: "#ffffff", targetColor: "#ca8a04" }, // Left cup bowl
      // Handles
      { vertexIds: [6, 10, 4, 9], currentColor: "#ffffff", targetColor: "#ca8a04" },
      { vertexIds: [7, 11, 5, 8], currentColor: "#ffffff", targetColor: "#ca8a04" },
    ],
  },
];

export const COMMISSIONS_POOL: Commission[] = [
  {
    id: "comm_1",
    clientName: "Sofi Gamer",
    clientAvatar: "👩‍💻",
    title: "Taza de Cafecito Caliente",
    description: "¡Sofi necesita un modelo 3D express de una taza para importarlo en su videojuego móvil! El tiempo corre, los programadores tienen sueño y quieren café.",
    rewardMoney: 120,
    rewardXP: 100,
    timeLimitSec: 60,
    modelTemplateId: "coffe_mug",
    tipBonus: 50,
  },
  {
    id: "comm_2",
    clientName: "Nico 'FragGod'",
    clientAvatar: "🎮",
    title: "La Legendaria Katana de CS",
    description: "Mi clan necesita una apariencia exclusiva de Espada Láser para nuestro mod de Counter Strike de corte retro low-poly. No la cagues con el mango gamer.",
    rewardMoney: 220,
    rewardXP: 180,
    timeLimitSec: 85,
    modelTemplateId: "neon_sword",
    tipBonus: 100,
  },
  {
    id: "comm_3",
    clientName: "Don Carlos",
    clientAvatar: "👨‍💼",
    title: "Una Butaca Gamer Real",
    description: "Quiero publicar un catálogo online para renovar los asientos rotos del ciber. Mostrame que tan ergonómico podés renderizar este modelo de Silla Gamer RGB.",
    rewardMoney: 330,
    rewardXP: 250,
    timeLimitSec: 100,
    modelTemplateId: "gamer_chair",
    tipBonus: 120,
  },
  {
    id: "comm_4",
    clientName: "Thiago 'IndieDev'",
    clientAvatar: "👾",
    title: "Caza Estelar de Combate",
    description: "Estoy diseñando un simulador de naves espaciales en mi PC del Cyber. Necesito urgente la Starfighter principal en formato low-poly optimizado para el motor gráfico.",
    rewardMoney: 450,
    rewardXP: 360,
    timeLimitSec: 130,
    modelTemplateId: "spaceship",
    tipBonus: 200,
  },
  {
    id: "comm_5",
    clientName: "El Pibe Binario",
    clientAvatar: "🤖",
    title: "Monitor de Tubo Nostálgico",
    description: "Para un simulador de Hackers antiguos, necesito una réplica pesada y con pantalla fosforescente verde de un monitor CRT de 14. ¡Metele mecha!",
    rewardMoney: 520,
    rewardXP: 400,
    timeLimitSec: 140,
    modelTemplateId: "retro_pc",
    tipBonus: 250,
  },
  {
    id: "comm_6",
    clientName: "Municipalidad Ciber",
    clientAvatar: "🏆",
    title: "Copa de Campeonatos Mundiales",
    description: "Mañana arranca el torneo de verano del ciber en la red local. Necesitamos el diseño final de la Copa de Campeón Dorada para imprimir en 3D.",
    rewardMoney: 680,
    rewardXP: 550,
    timeLimitSec: 150,
    modelTemplateId: "gold_cup",
    tipBonus: 300,
  },
];

export const UPGRADE_ITEMS: Upgrade[] = [
  // --- CPU upgrades ---
  {
    id: "cpu_old",
    name: "Intel Pentium 4",
    category: "CPU",
    description: "Procesador viejo del ciber. Tarda horas en compilar, pero es tu fiel compañero inicial.",
    price: 0,
    levelRequired: 1,
    purchased: true,
    activeMultiplier: 1.0,
    equipped: true,
    flavor: "Se calienta al iniciar el Paint.",
  },
  {
    id: "cpu_medium",
    name: "Intel Core i5 Ciber Edition",
    category: "CPU",
    description: "Un gran salto. Reduce considerablemente los tiempos de carga de la commission y ofrece bonus de XP extra.",
    price: 180,
    levelRequired: 2,
    purchased: false,
    activeMultiplier: 1.25,
    equipped: false,
    flavor: "¡Ya no se congela por poner música de fondo!",
  },
  {
    id: "cpu_high",
    name: "AMD Ryzen 7 Neon RGB",
    category: "CPU",
    description: "Rendimiento salvaje. El proceso de entrega se renderiza inmediatamente, aumentando ganancias monetarias (+25%).",
    price: 450,
    levelRequired: 3,
    purchased: false,
    activeMultiplier: 1.5,
    equipped: false,
    flavor: "Brilla tanto como tu futuro en el modelado.",
  },
  {
    id: "cpu_quantum",
    name: "Quantum Core 'Don Carlos'",
    category: "CPU",
    description: "Overclockeado personalmente por el dueño del ciber con nitrógeno líquido y pasta térmica casera. Multiplicador monetario bestial.",
    price: 990,
    levelRequired: 5,
    purchased: false,
    activeMultiplier: 2.1,
    equipped: false,
    flavor: "A veces se escucha un motor de avión dentro del gabinete.",
  },

  // --- Keyboard/Mouse Gear ---
  {
    id: "mouse_old",
    name: "Mouse de Bola Sucio",
    category: "GamerGear",
    description: "Saturado de tierra y pelusas. Los movimientos a veces se traban.",
    price: 0,
    levelRequired: 1,
    purchased: true,
    activeMultiplier: 1.0,
    equipped: true,
    flavor: "Tienes que sacarle la bolita para soplar los rodillos.",
  },
  {
    id: "mouse_flat",
    name: "Mouse Óptico de Oficina",
    category: "GamerGear",
    description: "Mouse estándar sin bolitas. Deslizamiento estable sin saltos de coordenadas.",
    price: 90,
    levelRequired: 2,
    purchased: false,
    activeMultiplier: 1.3,
    equipped: false,
    flavor: "Por fin logras trazar líneas sin que el cursor vuele al infinito.",
  },
  {
    id: "keyboard_mech",
    name: "Teclado Mecánico Switch Azul",
    category: "GamerGear",
    description: "Un placer auditivo que asusta a los de al lado en el ciber. El radio de snapping de vértices se amplía.",
    price: 250,
    levelRequired: 3,
    purchased: false,
    activeMultiplier: 1.6,
    equipped: false,
    flavor: "¡CLICK CLACK CLICK CLACK! Imposible modelar en silencio.",
  },
  {
    id: "mouse_pro",
    name: "Mouse Laser Ultraligero 24k DPI",
    category: "GamerGear",
    description: "Líder indiscutido. Suavidad milimétrica. Alinea los vértices un 100% más fácil y reduce temblores del pulso.",
    price: 550,
    levelRequired: 4,
    purchased: false,
    activeMultiplier: 2.0,
    equipped: false,
    flavor: "Se mueve con sólo mirarlo con respeto.",
  },

  // --- Screen / Monitor upgrades ---
  {
    id: "mon_old",
    name: "Monitor CRT LG 14 pulgadas",
    category: "Monitor",
    description: "Humo invisible, electricidad estática en el vidrio y parpadeos molestos a 60 Hz.",
    price: 0,
    levelRequired: 1,
    purchased: true,
    activeMultiplier: 1.0,
    equipped: true,
    flavor: "Si le pasas la mano sentís la magia de los electrones.",
  },
  {
    id: "mon_lcd",
    name: "Monitor LCD Flatron de 19 pulgadas",
    category: "Monitor",
    description: "Pantalla plana ideal de los cyber premium de 2008. Mejora la visibilidad del wireframe.",
    price: 150,
    levelRequired: 2,
    purchased: false,
    activeMultiplier: 1.25,
    equipped: false,
    flavor: "¡Ocupa la mitad de espacio en tu escritorio!",
  },
  {
    id: "mon_wide",
    name: "Monitor Gamer Curvo IPS 144Hz",
    category: "Monitor",
    description: "Fluidez inigualable. Habilita un visor dual que te permite ver la silueta objetivo sobreimpresa sobre tu modelo.",
    price: 380,
    levelRequired: 3,
    purchased: false,
    activeMultiplier: 1.5,
    equipped: false,
    flavor: "Tu visión periférica nunca estuvo tan viva.",
  },
  {
    id: "mon_hologram",
    name: "Proyector Holográfico 3D",
    category: "Monitor",
    description: "El culmen de la tecnología oculta del ciber: flotadores espaciales virtuales. Auto-detecta si un vértice está perfectamente alineado.",
    price: 750,
    levelRequired: 4,
    purchased: false,
    activeMultiplier: 2.0,
    equipped: false,
    flavor: "¡Esto ya es ciencia ficción de barrio!",
  },

  // --- Snacks (One-time or persistent purchase boost) ---
  {
    id: "snack_seed",
    name: "Semillas de Girasol de Kiosco",
    category: "Snack",
    description: "Snack nacional imprescindible. Te da paciencia. Al activarlo disminuye la velocidad del cronómetro un 20%.",
    price: 15,
    levelRequired: 1,
    purchased: false,
    activeMultiplier: 1.2,
    equipped: false,
    flavor: "La bolsa de plástico hace ruido, pero te calma los nervios.",
  },
  {
    id: "snack_cola",
    name: "Gaseosa 'Manaos' Cola de 2L",
    category: "Snack",
    description: "Azúcar líquido directo al torrente sanguíneo. Desacelera el reloj de la entrega un 35% por sobredosis de energía.",
    price: 30,
    levelRequired: 1,
    purchased: false,
    activeMultiplier: 1.35,
    equipped: false,
    flavor: "Un gas inolvidable para un render letal.",
  },
  {
    id: "snack_speed",
    name: "Latón de Energizante 'Speed'",
    category: "Snack",
    description: "Cafreína concentrada ciberndernética. Prácticamente paraliza el cronómetro, dándote precioso tiempo de retoque fino.",
    price: 70,
    levelRequired: 2,
    purchased: false,
    activeMultiplier: 1.6,
    equipped: false,
    flavor: "Los ojos te vibran al ritmo del procesador.",
  },

  // --- Decor (Fun Ciber Cafe ambiance multipliers) ---
  {
    id: "decor_fan",
    name: "Turboterminal de Pie Ruidoso",
    category: "Decor",
    description: "Abanico de plástico atado con cinta. Refresca el ambiente y reduce la fatiga por calor.",
    price: 50,
    levelRequired: 1,
    purchased: false,
    activeMultiplier: 1.1,
    equipped: false,
    flavor: "Su zumbido tapa los murmullos ajenos.",
  },
  {
    id: "decor_led",
    name: "Tira de LEDs RGB Autoadhesivas",
    category: "Decor",
    description: "Pega luces moradas atrás del monitor. Aumenta tu prestigio y te da un bonus permanente de XP.",
    price: 170,
    levelRequired: 2,
    purchased: false,
    activeMultiplier: 1.25,
    equipped: false,
    flavor: "Aura de modelador profesional de la escena cyberpunk.",
  },
  {
    id: "decor_sub",
    name: "Subwoofer de Graves Potentes",
    category: "Decor",
    description: "Don Carlos te deja conectar el sound system al mango. Multiplica ganancias un 40% al vibrar al son de bajos electrónicos.",
    price: 310,
    levelRequired: 3,
    purchased: false,
    activeMultiplier: 1.4,
    equipped: false,
    flavor: "El suelo tiembla, pero tu mano modela como los dioses.",
  },
];

export const PLAYABLE_KIDS: PlayableKid[] = [
  {
    id: "nico",
    name: "Nico 'Speedy'",
    avatar: "🎒",
    role: "Speedrunner del Quake",
    status: "Te mira con curiosidad mientras come papitas.",
    unlockedAtXP: 0,
    lore: "Se pasa el Quake en 12 minutos. Le fascinan los wireframes rápidos.",
  },
  {
    id: "sofi",
    name: "Sofi 'PixelGirl'",
    avatar: "👧",
    role: "Artista de Texturas",
    status: "Dibuja skins de armas con un lápiz viejo.",
    unlockedAtXP: 150,
    lore: "Quiere diseñar su propio RPG. Siempre te da consejos de colores atractivos.",
  },
  {
    id: "thiago",
    name: "Thiago 'NetMaster'",
    avatar: "🕶️",
    role: "Hackercito de CS 1.6",
    status: "Configurando el archivo config.cfg para saltar más alto.",
    unlockedAtXP: 380,
    lore: "Conoce todos los trucos y hacks del internet. Conectar redes locales es su obsesión.",
  },
  {
    id: "don_carlos",
    name: "Don Carlos",
    avatar: "🧔",
    role: "Dueño del Ciber Net",
    status: "Limpiando un teclado mugriento con un cepillo.",
    unlockedAtXP: 900,
    lore: "El monarca indiscutido de PC #1 a PC #15. Su ley es ley. Fiaba horas de juego si le ayudás con los planos.",
  },
];

export const CIBER_JOKES = [
  "¡Che, quién corrió el Ares que se me cayó la red en pleno modelado!",
  "Cuidado con patear la zapatilla de la PC 4, que se apaga sola.",
  "¡Don Carlos! ¿Me vende 20 pesos más de vicio para la PC 4?",
  "Nico está gritando por el Counter, bajale un cambio che.",
  "¿Alguien tiene mouses limpios que a este se le trabó la bolita de goma?",
  "El disco duro de la PC 6 hace ruidos de licuadora. ¡Apagalo, Thiago!",
  "¿Quién dejó la cuenta de Hotmail abierta en la PC 12?",
];
