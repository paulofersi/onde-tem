import { Box } from '@/components/ui/box';
import { useTheme } from '@/context/ThemeContext';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  edges?: Edge[];
  useSafeArea?: boolean;
  className?: string;
};

export function ThemedView({ 
  style, 
  lightColor, 
  darkColor, 
  edges = ['top', 'bottom', 'left', 'right'],
  useSafeArea = true,
  className,
  ...otherProps 
}: ThemedViewProps) {
  const { theme } = useTheme();
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  const bgClass = theme === 'dark' ? 'bg-gray-900' : 'bg-white';
  const combinedClassName = `${bgClass} flex-1 ${className || ''}`.trim();
  
  const BoxComponent = (
    <Box
      className={combinedClassName}
      style={[{ backgroundColor }, style]}
      {...otherProps}
    />
  );

  if (useSafeArea) {
    return (
      <SafeAreaView 
        style={{ flex: 1 }}
        edges={edges}
      >
        {BoxComponent}
      </SafeAreaView>
    );
  }

  return BoxComponent;
}
