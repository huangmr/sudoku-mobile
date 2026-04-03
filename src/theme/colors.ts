// Light theme — soft sky & ocean day
export const lightColors = {
  // Backgrounds
  background: '#ddeef7',
  gradientTop: '#c5e4f5',
  gradientMid: '#ddeef7',
  gradientBottom: '#eef6fb',
  // Surfaces (frosted glass)
  surface: 'rgba(255,255,255,0.62)',
  // Borders
  border: 'rgba(100,175,215,0.35)',
  borderStrong: 'rgba(0,110,170,0.45)',
  borderFaint: 'rgba(140,195,225,0.40)',
  // Text
  text: '#0b2a3a',
  textSecondary: '#3c7a98',
  // Brand
  primary: '#0077b6',
  primaryLight: 'rgba(0,119,182,0.12)',
  // Cells
  cellSelected: 'rgba(0,119,182,0.32)',
  cellSelectedBorder: 'rgba(0,119,182,0.80)',
  cellHighlight: 'rgba(0,150,220,0.08)',
  cellConflict: 'rgba(200,30,30,0.12)',
  cellConflictText: '#b71c1c',
  cellClue: '#0b2a3a',
  cellUser: '#0077b6',
  // Number pad
  numberPad: 'rgba(255,255,255,0.60)',
  numberPadBorder: 'rgba(100,175,215,0.40)',
  // Misc
  heart: '#e53935',
  diamond: '#0096c7',
  success: '#2e7d32',
  // Tab bar
  tabBar: 'rgba(210,235,248,0.97)',
  tabBarBorder: 'rgba(100,175,215,0.30)',
  tabActive: '#0077b6',
  tabInactive: '#5a9ab5',
} as const;

// Dark theme — deep ocean night
export const darkColors = {
  // Backgrounds
  background: '#0b1c33',
  gradientTop: '#0a1628',
  gradientMid: '#0c2040',
  gradientBottom: '#093550',
  // Surfaces (dark frosted glass)
  surface: 'rgba(255,255,255,0.07)',
  // Borders
  border: 'rgba(72,202,228,0.18)',
  borderStrong: 'rgba(72,202,228,0.42)',
  borderFaint: 'rgba(72,202,228,0.22)',
  // Text
  text: '#ddf1fc',
  textSecondary: '#72b5cc',
  // Brand
  primary: '#48cae4',
  primaryLight: 'rgba(72,202,228,0.16)',
  // Cells
  cellSelected: 'rgba(72,202,228,0.38)',
  cellSelectedBorder: 'rgba(72,202,228,0.90)',
  cellHighlight: 'rgba(72,202,228,0.09)',
  cellConflict: 'rgba(210,55,55,0.22)',
  cellConflictText: '#ff8a80',
  cellClue: '#ddf1fc',
  cellUser: '#90e0ef',
  // Number pad
  numberPad: 'rgba(255,255,255,0.07)',
  numberPadBorder: 'rgba(72,202,228,0.22)',
  // Misc
  heart: '#ef5350',
  diamond: '#48cae4',
  success: '#66bb6a',
  // Tab bar
  tabBar: 'rgba(10,22,40,0.97)',
  tabBarBorder: 'rgba(72,202,228,0.16)',
  tabActive: '#48cae4',
  tabInactive: '#3d7a8a',
} as const;

export type Colors = Record<keyof typeof lightColors, string>;
