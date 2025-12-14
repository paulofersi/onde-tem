import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import type { VariantProps } from '@gluestack-ui/utils/nativewind-utils';
import React from 'react';
import { View, ViewProps } from 'react-native';
import { cardStyle } from './styles';

type ICardProps = ViewProps &
  VariantProps<typeof cardStyle> & { className?: string };

const Card = React.forwardRef<React.ComponentRef<typeof View>, ICardProps>(
  function Card(
    { className, size = 'md', variant = 'elevated', style, ...props },
    ref
  ) {
    const { theme } = useTheme();
    const colors = Colors[theme];
    
    return (
      <View
        className={cardStyle({ size, variant, class: className })}
        style={[
          {
            backgroundColor: variant === 'elevated' ? colors.cardBackground : undefined,
          },
          style,
        ]}
        {...props}
        ref={ref}
      />
    );
  }
);

Card.displayName = 'Card';

type ICardHeaderProps = ViewProps & {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const CardHeader = React.forwardRef<React.ComponentRef<typeof View>, ICardHeaderProps>(
  function CardHeader({ size = 'md', className, style, ...props }, ref) {
    const paddingMap = {
      sm: 'px-3 pt-3',
      md: 'px-4 pt-4',
      lg: 'px-6 pt-6',
    };
    
    return (
      <View
        className={`${paddingMap[size]} ${className || ''}`.trim()}
        style={style}
        {...props}
        ref={ref}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

type ICardBodyProps = ViewProps & {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const CardBody = React.forwardRef<React.ComponentRef<typeof View>, ICardBodyProps>(
  function CardBody({ size = 'md', className, style, ...props }, ref) {
    const paddingMap = {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    };
    
    return (
      <View
        className={`${paddingMap[size]} ${className || ''}`.trim()}
        style={style}
        {...props}
        ref={ref}
      />
    );
  }
);

CardBody.displayName = 'CardBody';

type ICardFooterProps = ViewProps & {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

const CardFooter = React.forwardRef<React.ComponentRef<typeof View>, ICardFooterProps>(
  function CardFooter({ size = 'md', className, style, ...props }, ref) {
    const { theme } = useTheme();
    const colors = Colors[theme];
    const paddingMap = {
      sm: 'px-3 pb-3',
      md: 'px-4 pb-4',
      lg: 'px-6 pb-6',
    };
    
    return (
      <View
        className={`${paddingMap[size]} ${className || ''}`.trim()}
        style={[
          {
            borderTopWidth: 1,
            borderTopColor: colors.border,
          },
          style,
        ]}
        {...props}
        ref={ref}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';

export { Card, CardBody, CardFooter, CardHeader };

