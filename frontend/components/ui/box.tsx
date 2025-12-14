import type { ViewProps } from 'react-native';
import { View } from 'react-native';

export type BoxProps = ViewProps & {
  className?: string;
};

export function Box({ className, style, ...props }: BoxProps) {
  return (
    <View
      className={className}
      style={style}
      {...props}
    />
  );
}

