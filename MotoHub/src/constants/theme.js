export const COLORS = {
  primary: '#FF6B00', // Vibrant Orange
  secondary: '#FF8A50', // Lighter Orange
  background: '#FFFFFF',
  surface: '#F9F9F9',
  cardBackground: '#FFF5E0', // Light Orange/Beige for Fuel Card
  text: '#333333',
  textLight: '#777777',
  textDark: '#1A1A1A',
  border: '#E3E3E3',
  white: '#FFFFFF',
  black: '#000000',
  success: '#4CAF50',
  error: '#F44336',
  gray: '#CCCCCC',
  lightGray: '#E3E3E3',
  orangeText: '#E65100', // Darker orange for text
};

export const getColors = (isDark) => ({
  primary: '#FF6B00',
  secondary: '#FF8A50',
  background: isDark ? '#121212' : '#FFFFFF',
  surface: isDark ? '#1E1E1E' : '#F9F9F9',
  cardBackground: isDark ? '#2A1A0E' : '#FFF5E0',
  text: isDark ? '#E0E0E0' : '#333333',
  textLight: isDark ? '#888888' : '#777777',
  textDark: isDark ? '#FFFFFF' : '#1A1A1A',
  border: isDark ? '#2E2E2E' : '#E3E3E3',
  white: isDark ? '#1E1E1E' : '#FFFFFF',
  black: isDark ? '#FFFFFF' : '#000000',
  success: '#4CAF50',
  error: '#F44336',
  gray: isDark ? '#444444' : '#CCCCCC',
  lightGray: isDark ? '#2E2E2E' : '#E3E3E3',
  orangeText: '#E65100',
  // Card-specific
  statusCardBg: isDark ? '#2A1A0E' : '#FFF2E9',
  statusCardBorder: isDark ? '#4A2E1A' : '#FBE4D5',
  divider: isDark ? '#4A2E1A' : '#F5E4D8',
});

export const SIZES = {
  padding: 16,
  baseSpacing: 12,
  smallSpacing: 8,
  largeSpacing: 24,
  radius: 12,
  inputRadius: 12,
  cardRadius: 16,
  h1: 24,
  h2: 20,
  h3: 16,
  body: 14,
};

export const SHADOWS = {
  light: {},
  medium: {},
};
