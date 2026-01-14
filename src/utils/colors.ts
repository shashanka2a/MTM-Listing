// Color mapping utility for burgundy theme
// Primary: #800000
// Hover: #660000  
// Secondary: #900000

export const COLORS = {
  primary: '#800000',
  primaryHover: '#660000',
  secondary: '#900000',
  secondaryHover: '#700000',
} as const;

// Helper to apply burgundy colors in Tailwind
export const burgundyClasses = {
  primary: 'bg-[#800000] hover:bg-[#660000]',
  text: 'text-[#800000] hover:text-[#660000]',
  border: 'border-[#800000]',
  ring: 'ring-[#800000]',
  focus: 'focus:ring-[#800000]',
  secondary: 'bg-[#900000] hover:bg-[#700000]',
} as const;
