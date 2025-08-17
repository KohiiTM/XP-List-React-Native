// Character asset mappings for modular character system
import DefaultIcon from '../images/icon.png';

// Base character parts - using fallback for now
export const BASE_CHARACTERS = {
  light_short_brown: DefaultIcon,
  light_short_black: DefaultIcon,
  light_short_blonde: DefaultIcon,
  light_long_brown: DefaultIcon,
  light_bald: DefaultIcon,
  
  medium_short_brown: DefaultIcon,
  medium_short_black: DefaultIcon,
  medium_short_blonde: DefaultIcon,
  medium_long_brown: DefaultIcon,
  medium_bald: DefaultIcon,
  
  dark_short_brown: DefaultIcon,
  dark_short_black: DefaultIcon,
  dark_short_blonde: DefaultIcon,
  dark_long_brown: DefaultIcon,
  dark_bald: DefaultIcon,
};

// Equipment overlays - using fallback for now
export const EQUIPMENT_OVERLAYS = {
  head: {
    'golden_helmet': DefaultIcon,
    'wizard_hat': DefaultIcon,
    'crown': DefaultIcon,
  },
  body: {
    'leather_armor': DefaultIcon,
    'wizard_robe': DefaultIcon,
    'royal_garments': DefaultIcon,
  },
  weapon: {
    'iron_sword': DefaultIcon,
    'magic_staff': DefaultIcon,
    'golden_scepter': DefaultIcon,
  },
  accessory: {
    'explorer_badge': DefaultIcon,
    'magic_amulet': DefaultIcon,
    'royal_ring': DefaultIcon,
  },
};

// Face-only versions for profile display - using fallback for now
export const FACE_VARIANTS = {
  light_short_brown: DefaultIcon,
  light_short_black: DefaultIcon,
  light_short_blonde: DefaultIcon,
  light_long_brown: DefaultIcon,
  light_bald: DefaultIcon,
  
  medium_short_brown: DefaultIcon,
  medium_short_black: DefaultIcon,
  medium_short_blonde: DefaultIcon,
  medium_long_brown: DefaultIcon,
  medium_bald: DefaultIcon,
  
  dark_short_brown: DefaultIcon,
  dark_short_black: DefaultIcon,
  dark_short_blonde: DefaultIcon,
  dark_long_brown: DefaultIcon,
  dark_bald: DefaultIcon,
};

// Face equipment overlays - using fallback for now
export const FACE_EQUIPMENT = {
  head: {
    'golden_helmet': DefaultIcon,
    'wizard_hat': DefaultIcon,
    'crown': DefaultIcon,
  },
};

// Helper function to get character key
export const getCharacterKey = (skinTone, hairStyle, hairColor) => {
  return `${skinTone}_${hairStyle}_${hairColor}`;
};

// Helper function to get equipment asset
export const getEquipmentAsset = (slot, itemName, faceOnly = false) => {
  if (faceOnly && slot === 'head' && FACE_EQUIPMENT[slot][itemName]) {
    return FACE_EQUIPMENT[slot][itemName];
  }
  return EQUIPMENT_OVERLAYS[slot]?.[itemName] || null;
};