import { View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  edges?: Edge[];
  useSafeArea?: boolean;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  edges = ['top', 'bottom', 'left', 'right'],
  useSafeArea = true,
  ...otherProps 
}: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  if (useSafeArea) {
    return (
      <SafeAreaView 
        style={[{ backgroundColor, flex: 1 }, style]} 
        edges={edges}
        {...otherProps} 
      />
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
