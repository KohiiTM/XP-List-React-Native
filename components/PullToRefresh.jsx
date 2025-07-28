import React, { useCallback } from 'react';
import { RefreshControl } from 'react-native';
import { Colors } from '@constants/Colors';
import { useColorScheme } from 'react-native';

const PullToRefresh = ({ refreshing, onRefresh }) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme] ?? Colors.light;

  return (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
      colors={[theme.accent]}
      tintColor={theme.accent}
      progressBackgroundColor={theme.background}
    />
  );
};

export default PullToRefresh;
