import { Supermarket } from '@/types/supermarket';

// Dados mockados de supermercados para demonstração
export const mockSupermarkets: Supermarket[] = [
  {
    id: '1',
    name: 'Supermercado Central',
    latitude: -23.5505,
    longitude: -46.6333,
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    description: 'Produtos próximos ao vencimento com até 50% de desconto',
    discountItems: [
      {
        id: '1',
        name: 'Leite Integral',
        originalPrice: 5.99,
        discountPrice: 2.99,
        discountPercentage: 50,
        expirationDate: '2024-12-20',
      },
      {
        id: '2',
        name: 'Pão de Açúcar',
        originalPrice: 4.50,
        discountPrice: 2.25,
        discountPercentage: 50,
        expirationDate: '2024-12-19',
      },
    ],
  },
  {
    id: '2',
    name: 'Mercado do Bairro',
    latitude: -23.5489,
    longitude: -46.6388,
    address: 'Rua Augusta, 500 - São Paulo, SP',
    description: 'Ofertas especiais de produtos próximos ao vencimento',
    discountItems: [
      {
        id: '3',
        name: 'Iogurte Natural',
        originalPrice: 8.99,
        discountPrice: 4.50,
        discountPercentage: 50,
        expirationDate: '2024-12-21',
      },
    ],
  },
  {
    id: '3',
    name: 'Atacadão Express',
    latitude: -23.5521,
    longitude: -46.6312,
    address: 'Rua Consolação, 2000 - São Paulo, SP',
    description: 'Grandes descontos em produtos próximos ao vencimento',
    discountItems: [
      {
        id: '4',
        name: 'Queijo Mussarela',
        originalPrice: 12.99,
        discountPrice: 6.50,
        discountPercentage: 50,
        expirationDate: '2024-12-22',
      },
      {
        id: '5',
        name: 'Presunto',
        originalPrice: 9.99,
        discountPrice: 5.00,
        discountPercentage: 50,
        expirationDate: '2024-12-21',
      },
    ],
  },
];

