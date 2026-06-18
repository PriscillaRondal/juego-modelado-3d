export interface Vertex3D {
  id: number;
  x: number; // Current player X coordinate (-2 to 2)
  y: number; // Current player Y coordinate (-2 to 2)
  z: number; // Current player Z coordinate (-2 to 2)
  targetX: number; // Target coordinate X
  targetY: number; // Target coordinate Y
  targetZ: number; // Target coordinate Z
  label?: string; // e.g. "Base", "Mango", "Punta"
}

export interface Face3D {
  vertexIds: number[]; // Index into vertices array
  currentColor: string; // Active player color hex
  targetColor: string; // Target color hex
}

export interface Model3D {
  id: string;
  name: string;
  description: string;
  difficulty: "Fácil" | "Medio" | "Difícil";
  vertices: Vertex3D[];
  faces: Face3D[];
  scaleFactor: number; // Overall render scale multiplier
}

export interface Commission {
  id: string;
  clientName: string;
  clientAvatar: string;
  title: string;
  description: string;
  rewardMoney: number;
  rewardXP: number;
  timeLimitSec: number;
  modelTemplateId: string; // Associates to a Model3D template
  tipBonus: number; // Dynamic bonus based on extra-fast speed
}

export interface Upgrade {
  id: string;
  name: string;
  category: "CPU" | "GamerGear" | "Monitor" | "Snack" | "Decor";
  description: string;
  price: number;
  levelRequired: number;
  purchased: boolean;
  activeMultiplier: number; // e.g., 1.2x CPU speeds up submission rendering XP, or decreases vertex search zone
  equipped: boolean;
  flavor: string;
}

export interface PlayableKid {
  id: string;
  name: string;
  avatar: string; // Emoji or SVG
  role: string;
  status: string;
  unlockedAtXP: number;
  lore: string;
}

export interface GameState {
  money: number;
  xp: number;
  level: number;
  activeCommission: Commission | null;
  activeModel: Model3D | null;
  timeRemaining: number;
  activeSnackCooldown: number; // seconds remaining on energy boost
  completedCommissionsCount: number;
  selectedVertexId: number | null;
  activeTool: "vertex" | "paint";
  selectedPaintColor: string;
  yaw: number;
  pitch: number;
  isAutoRotating: boolean;
  upgrades: Upgrade[];
  activeScreen: "ciber_map" | "pc_workstation" | "shop" | "achievements";
}
