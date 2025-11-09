import { IconSymbol } from '@/components/ui/icon-symbol';
import { Supermarket } from '@/types/supermarket';
import React from 'react';
import { GestureResponderEvent } from 'react-native';
import styled from 'styled-components/native';

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
  const handleDeletePress = (event: GestureResponderEvent) => {
    event.stopPropagation();
    if (disableDelete) {
      return;
    }
    onDeletePress?.(supermarket);
  };

  return (
    <CardContainer
      activeOpacity={0.8}
      isTablet={isTablet}
      onPress={() => onPress(supermarket)}>
      <Header>
        <Title numberOfLines={2}>{supermarket.name}</Title>
        {onDeletePress && (
          <DeleteButton activeOpacity={0.7} onPress={handleDeletePress}>
            <IconSymbol
              name="trash"
              size={20}
              color={disableDelete ? '#ccc' : '#DC143C'}
            />
          </DeleteButton>
        )}
      </Header>

      {supermarket.address ? (
        <Address numberOfLines={2}>{supermarket.address}</Address>
      ) : null}

      {supermarket.description ? (
        <Description numberOfLines={3}>{supermarket.description}</Description>
      ) : null}

      {productCount > 0 ? (
        <ProductBadge>{productCount} produto(s) com desconto</ProductBadge>
      ) : null}
    </CardContainer>
  );
};

type StyledTheme = {
  cardBackground?: string;
  text?: string;
  textSecondary?: string;
  textTertiary?: string;
};

const getThemeColor = (
  theme: unknown,
  key: keyof StyledTheme,
  fallback: string,
) => {
  const typedTheme = theme as StyledTheme | undefined;
  return typedTheme?.[key] ?? fallback;
};

const CardContainer = styled.TouchableOpacity.attrs<{ isTablet: boolean; style?: object }>(
  ({ style }) => ({
    style: [
      {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      style,
    ],
  }),
)<{ isTablet: boolean }>`
  background-color: ${({ theme }) => getThemeColor(theme, 'cardBackground', '#ffffff')};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  flex: ${({ isTablet }) => (isTablet ? 0.48 : 1)};
`;

const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

const Title = styled.Text`
  flex: 1;
  margin-right: 12px;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => getThemeColor(theme, 'text', '#333')};
`;

const DeleteButton = styled.TouchableOpacity`
  padding: 4px;
  border-radius: 4px;
`;

const Address = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => getThemeColor(theme, 'textSecondary', '#666')};
  margin-bottom: 4px;
`;

const Description = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => getThemeColor(theme, 'textTertiary', '#888')};
  margin-bottom: 8px;
`;

const ProductBadge = styled.Text`
  font-size: 12px;
  color: #4caf50;
  font-weight: 600;
`;

