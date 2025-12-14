import type { PressableProps } from 'react-native';
import { Pressable } from 'react-native';
import { Text } from './text';

export type ButtonProps = PressableProps & {
  className?: string;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
};

const variantClasses = {
  solid: 'bg-blue-600',
  outline: 'border border-blue-600 bg-transparent',
  ghost: 'bg-transparent',
};

const sizeClasses = {
  sm: 'px-3 py-1.5',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

export function Button({
  className,
  variant = 'solid',
  size = 'md',
  children,
  style,
  ...props
}: ButtonProps) {
  const variantClass = variantClasses[variant];
  const sizeClass = sizeClasses[size];
  const baseClass = 'rounded-lg items-center justify-center';
  const hasCustomBg = className?.includes('bg-');
  const combinedClassName = hasCustomBg
    ? `${baseClass} ${sizeClass} ${className || ''}`.trim()
    : `${baseClass} ${variantClass} ${sizeClass} ${className || ''}`.trim();

  return (
    <Pressable
      className={combinedClassName}
      style={style}
      {...props}
    >
      {typeof children === 'string' ? (
        <Text
          weight="medium"
          className={variant === 'solid' ? 'text-white' : 'text-blue-600'}
        >
          {children}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}

