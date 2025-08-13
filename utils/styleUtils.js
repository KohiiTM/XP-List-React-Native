import { Colors } from '@constants/Colors';
import { Platform } from 'react-native';

export const createThemedStyles = (theme = Colors.dark) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background,
  },
  
  safeContainer: {
    flex: 1,
    backgroundColor: theme.background,
    paddingTop: Platform.OS === 'ios' ? 44 : 0,
  },
  
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    margin: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalContent: {
    backgroundColor: theme.background,
    borderRadius: 12,
    padding: 20,
    minWidth: 280,
    maxWidth: '90%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  
  input: {
    backgroundColor: theme.secondary,
    color: theme.text,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: theme.border,
    fontSize: 16,
    marginBottom: 16,
  },
  
  inputFocused: {
    borderColor: theme.accent,
    borderWidth: 2,
  },
  
  inputError: {
    borderColor: theme.error,
    borderWidth: 2,
  },
  
  button: {
    backgroundColor: theme.button,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  
  buttonText: {
    color: theme.buttonText,
    fontSize: 16,
    fontWeight: '600',
  },
  
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.border,
  },
  
  buttonSecondaryText: {
    color: theme.text,
  },
  
  buttonDisabled: {
    backgroundColor: theme.border,
    opacity: 0.6,
  },
  
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  
  text: {
    color: theme.text,
    fontSize: 16,
  },
  
  textSecondary: {
    color: theme.textSecondary,
    fontSize: 14,
  },
  
  textSmall: {
    color: theme.textSecondary,
    fontSize: 12,
  },
  
  textLarge: {
    color: theme.text,
    fontSize: 18,
    fontWeight: '600',
  },
  
  title: {
    color: theme.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  
  subtitle: {
    color: theme.textSecondary,
    fontSize: 16,
    marginBottom: 8,
  },
  
  divider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 16,
  },
  
  badge: {
    backgroundColor: theme.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  
  badgeText: {
    color: theme.buttonText,
    fontSize: 12,
    fontWeight: '600',
  },
  
  errorContainer: {
    backgroundColor: theme.error,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  
  errorText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.background,
  },
  
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  emptyText: {
    color: theme.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  column: {
    flexDirection: 'column',
  },
  
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  flex1: {
    flex: 1,
  },
  
  marginTop: {
    marginTop: 16,
  },
  
  marginBottom: {
    marginBottom: 16,
  },
  
  marginHorizontal: {
    marginHorizontal: 16,
  },
  
  marginVertical: {
    marginVertical: 16,
  },
  
  padding: {
    padding: 16,
  },
  
  paddingHorizontal: {
    paddingHorizontal: 16,
  },
  
  paddingVertical: {
    paddingVertical: 16,
  },
  
  borderRadius: {
    borderRadius: 8,
  },
  
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  shadowLarge: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export const getThemedColor = (colorKey, theme = Colors.dark) => {
  return theme[colorKey] || colorKey;
};

export const getDifficultyColor = (difficulty, theme = Colors.dark) => {
  const difficultyMap = {
    easy: theme.easy,
    medium: theme.medium,
    hard: theme.hard,
    expert: theme.error,
    legendary: theme.accent,
  };
  
  return difficultyMap[difficulty?.toLowerCase()] || theme.textSecondary;
};

export const getStatusColor = (status, theme = Colors.dark) => {
  const statusMap = {
    pending: theme.textSecondary,
    completed: theme.success,
    failed: theme.error,
    active: theme.accent,
    inactive: theme.textSecondary,
  };
  
  return statusMap[status?.toLowerCase()] || theme.textSecondary;
};

export const responsiveSize = (size, scale = 1) => {
  return Math.round(size * scale);
};

export const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

export const hexToRgba = (hex, alpha = 1) => {
  if (!isValidHexColor(hex)) return hex;
  
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const commonStyles = createThemedStyles();

export default {
  createThemedStyles,
  getThemedColor,
  getDifficultyColor,
  getStatusColor,
  responsiveSize,
  isValidHexColor,
  hexToRgba,
  commonStyles,
};