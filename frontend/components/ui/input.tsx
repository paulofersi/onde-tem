import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { TextInputProps } from 'react-native';
import { TextInput } from 'react-native';

export type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className, style, placeholderTextColor, ...props }: InputProps) {
  const { theme } = useTheme();
  const baseClass = 'border rounded-lg px-4 py-3.5 text-base min-h-[48px]';
  const combinedClassName = `${baseClass} ${className || ''}`.trim();

  const defaultPlaceholderColor = placeholderTextColor || Colors[theme].textSecondary;

  return (
    <TextInput
      className={combinedClassName}
      style={[
        {
          color: Colors[theme].text,
        },
        style,
      ]}
      placeholderTextColor={defaultPlaceholderColor}
      {...props}
    />
  );
}

