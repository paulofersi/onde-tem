import { Box } from '@/components/ui/box';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { Colors } from '@/constants/theme';
import { useTheme } from '@/context/ThemeContext';
import { Supermarket } from '@/types/supermarket';
import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';

interface SupermarketCardProps {
  supermarket: Supermarket;
  productCount: number;
  onPress: (supermarket: Supermarket) => void;
  onDeletePress?: (supermarket: Supermarket) => void;
  disableDelete?: boolean;
  isTablet?: boolean;
}

export const SupermarketCard: React.FC<SupermarketCardProps> = ({
  supermarket,
  productCount,
  onPress,
  onDeletePress,
  disableDelete = false,
  isTablet = false,
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];

  const handleDeletePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (disableDelete) {
      return;
    }
    onDeletePress?.(supermarket);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(supermarket)}
      className={`rounded-2xl p-5 mb-4 ${isTablet ? 'flex-[0.48]' : 'flex-1'}`}
      style={[
        { backgroundColor: colors.cardBackground },
        getCardShadow(colors, theme === 'dark'),
      ]}>
      <Box className="flex-row justify-between items-start mb-3">
        <Text 
          numberOfLines={2} 
          className="flex-1 mr-3 text-lg font-semibold"
          style={{ color: colors.text }}>
          {supermarket.name}
        </Text>
        {onDeletePress && (
          <TouchableOpacity 
            activeOpacity={0.7} 
            onPress={handleDeletePress}
            className="p-1 rounded">
            <IconSymbol
              name="trash"
              size={20}
              color={disableDelete ? colors.disabled : colors.error}
            />
          </TouchableOpacity>
        )}
      </Box>

      {supermarket.address ? (
        <Text 
          numberOfLines={2} 
          className="text-sm mb-1"
          style={{ color: colors.textSecondary }}>
          {supermarket.address}
        </Text>
      ) : null}

      {supermarket.description ? (
        <Text 
          numberOfLines={3} 
          className="text-[13px] mb-2"
          style={{ color: colors.textTertiary }}>
          {supermarket.description}
        </Text>
      ) : null}

      {productCount > 0 ? (
        <Text 
          className="text-xs font-semibold mt-2 pt-2 border-t"
          style={{ 
            color: colors.success,
            borderTopColor: colors.border,
          }}>
          {productCount} produto(s) com desconto
        </Text>
      ) : null}
    </TouchableOpacity>
  );
};

const getCardShadow = (colors: typeof Colors.light, isDark: boolean) => ({
  shadowColor: isDark ? '#000' : '#000',
  shadowOffset: { width: 0, height: isDark ? 2 : 1 },
  shadowOpacity: isDark ? 0.3 : 0.08,
  shadowRadius: isDark ? 6 : 4,
  elevation: isDark ? 4 : 2,
});

