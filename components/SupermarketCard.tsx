import React from 'react';
import styled from 'styled-components/native';
import { Supermarket } from '@/types/supermarket';

interface SupermarketCardProps {
  supermarket: Supermarket;
  onPress: (supermarket: Supermarket) => void;
}

const CardContainer = styled.TouchableOpacity`
  background-color: ${({ theme }) => theme.cardBackground || '#ffffff'};
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

const CardTitle = styled.Text`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.text || '#333'};
  margin-bottom: 8px;
`;

const CardAddress = styled.Text`
  font-size: 14px;
  color: ${({ theme }) => theme.textSecondary || '#666'};
  margin-bottom: 4px;
`;

const CardDescription = styled.Text`
  font-size: 13px;
  color: ${({ theme }) => theme.textTertiary || '#888'};
  margin-bottom: 8px;
`;

const DiscountContainer = styled.View`
  background-color: #e8f5e9;
  border-radius: 8px;
  padding: 8px 12px;
  margin-top: 8px;
`;

const DiscountText = styled.Text`
  font-size: 12px;
  color: #4CAF50;
  font-weight: 600;
`;

export const SupermarketCard: React.FC<SupermarketCardProps> = ({ supermarket, onPress }) => {
  const discountCount = supermarket.discountItems?.length || 0;

  return (
    <CardContainer onPress={() => onPress(supermarket)} activeOpacity={0.7}>
      <CardTitle>{supermarket.name}</CardTitle>
      {supermarket.address && <CardAddress>{supermarket.address}</CardAddress>}
      {supermarket.description && (
        <CardDescription>{supermarket.description}</CardDescription>
      )}
      {discountCount > 0 && (
        <DiscountContainer>
          <DiscountText>{discountCount} produto(s) com desconto</DiscountText>
        </DiscountContainer>
      )}
    </CardContainer>
  );
};

