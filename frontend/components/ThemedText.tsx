import { Text } from '@/components/ui/text';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { TextProps as RNTextProps } from 'react-native';

export type ThemedTextProps = RNTextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  className,
  ...rest
}: ThemedTextProps & { className?: string }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  const typeProps = {
    default: { size: 'md' as const, weight: 'normal' as const },
    title: { size: '4xl' as const, weight: 'bold' as const },
    defaultSemiBold: { size: 'md' as const, weight: 'semibold' as const },
    subtitle: { size: 'xl' as const, weight: 'bold' as const },
    link: { size: 'md' as const, weight: 'normal' as const, className: 'text-blue-600' },
  }[type];

  return (
    <Text
      {...typeProps}
      className={className}
      style={[{ color: type === 'link' ? '#0a7ea4' : color }, style]}
      {...rest}
    />
  );
}
