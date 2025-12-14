import type { TextProps as RNTextProps } from 'react-native';
import { Text as RNText } from 'react-native';

export type TextProps = RNTextProps & {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
};

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function Text({
  className,
  size = 'md',
  weight = 'normal',
  style,
  ...props
}: TextProps) {
  const sizeClass = sizeClasses[size];
  const weightClass = weightClasses[weight];
  const combinedClassName = `${sizeClass} ${weightClass} ${className || ''}`.trim();

  return (
    <RNText
      className={combinedClassName}
      style={style}
      {...props}
    />
  );
}

