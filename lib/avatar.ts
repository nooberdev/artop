// Sistema de avatares con DiceBear (estilo adventurer, 100% local).
// Las opciones son valores reales del schema instalado: arrays de un
// elemento = determinista. La vista previa grande hace de etiqueta.
export interface AvatarConfig {
  skin: string;
  hair: string;
  hairColor: string;
  eyes: string;
  brows: string;
  mouth: string;
  glasses: string;
  bg: string;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  skin: "ecad80",
  hair: "short01",
  hairColor: "6b4226",
  eyes: "variant01",
  brows: "variant01",
  mouth: "variant01",
  glasses: "nada",
  bg: "7000FF",
};

export const SKINS = [
  { id: "f2d3b1", label: "Clara" },
  { id: "ecad80", label: "Media" },
  { id: "9e5622", label: "Canela" },
  { id: "763900", label: "Oscura" },
];

export const HAIRS = [
  { id: "short01", label: "Corto 1" },
  { id: "short08", label: "Corto 2" },
  { id: "short16", label: "Corto 3" },
  { id: "long01", label: "Largo 1" },
  { id: "long12", label: "Largo 2" },
  { id: "long22", label: "Largo 3" },
];

export const HAIR_COLORS = [
  { id: "2b2b33", label: "Negro" },
  { id: "6b4226", label: "Castaño" },
  { id: "eab308", label: "Rubio" },
  { id: "ff007f", label: "Rosa" },
  { id: "00a6ff", label: "Azul" },
  { id: "7000ff", label: "Violeta" },
];

export const EYES = [
  { id: "variant01", label: "Mirada 1" },
  { id: "variant05", label: "Mirada 2" },
  { id: "variant10", label: "Mirada 3" },
  { id: "variant15", label: "Mirada 4" },
  { id: "variant20", label: "Mirada 5" },
  { id: "variant25", label: "Mirada 6" },
];

export const BROWS = [
  { id: "variant01", label: "Cejas 1" },
  { id: "variant05", label: "Cejas 2" },
  { id: "variant10", label: "Cejas 3" },
];

export const MOUTHS = [
  { id: "variant01", label: "Boca 1" },
  { id: "variant06", label: "Boca 2" },
  { id: "variant12", label: "Boca 3" },
  { id: "variant18", label: "Boca 4" },
  { id: "variant24", label: "Boca 5" },
  { id: "variant30", label: "Boca 6" },
];

export const GLASSES = [
  { id: "nada", label: "Sin gafas" },
  { id: "variant01", label: "Modelo 1" },
  { id: "variant02", label: "Modelo 2" },
  { id: "variant03", label: "Modelo 3" },
  { id: "variant04", label: "Modelo 4" },
  { id: "variant05", label: "Modelo 5" },
];

export const AVATAR_BGS = [
  { id: "7000FF", label: "Violeta" },
  { id: "FF007F", label: "Rosa" },
  { id: "00A6FF", label: "Cobalto" },
  { id: "22C55E", label: "Verde" },
  { id: "FF9600", label: "Naranja" },
  { id: "2B2B33", label: "Carbón" },
];

/** Opciones listas para createAvatar. Hex en minúsculas (formato DiceBear). */
export function diceBearOptions(c: AvatarConfig): Record<string, unknown> {
  const noGlasses = c.glasses === "nada";
  return {
    seed: "artop",
    backgroundColor: [c.bg.toLowerCase()],
    skinColor: [c.skin.toLowerCase()],
    hair: [c.hair],
    hairColor: [c.hairColor.toLowerCase()],
    hairProbability: 100,
    eyes: [c.eyes],
    eyebrows: [c.brows],
    mouth: [c.mouth],
    glasses: noGlasses ? [] : [c.glasses],
    glassesProbability: noGlasses ? 0 : 100,
    earringsProbability: 0,
    featuresProbability: 0,
  };
}

export function randomAvatar(): AvatarConfig {
  const pick = <T extends { id: string }>(arr: T[]): string => arr[Math.floor(Math.random() * arr.length)].id;
  return {
    skin: pick(SKINS),
    hair: pick(HAIRS),
    hairColor: pick(HAIR_COLORS),
    eyes: pick(EYES),
    brows: pick(BROWS),
    mouth: pick(MOUTHS),
    glasses: Math.random() < 0.3 ? pick(GLASSES.slice(1)) : "nada",
    bg: pick(AVATAR_BGS),
  };
}
