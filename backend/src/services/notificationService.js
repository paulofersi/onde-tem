const { Expo } = require('expo-server-sdk');

const expo = new Expo();

async function sendPushNotification(token, title, body, data = {}) {
  if (!Expo.isExpoPushToken(token)) {
    return false;
  }

  const messages = [
    {
      to: token,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      channelId: 'default',
    },
  ];

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Envia notificação push para múltiplos tokens
 */
async function sendPushNotificationsToMany(tokens, title, body, data = {}) {
  const validTokens = tokens.filter((token) => Expo.isExpoPushToken(token));

  if (validTokens.length === 0) {
    return { success: 0, failed: tokens.length };
  }

  const messages = validTokens.map((token) => ({
    to: token,
    sound: 'default',
    title,
    body,
    data,
    priority: 'high',
    channelId: 'default',
  }));

  let successCount = 0;
  let failedCount = 0;

  try {
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];

    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
      } catch (error) {
        failedCount += chunk.length;
      }
    }

    for (const ticket of tickets) {
      if (ticket.status === 'error') {
        failedCount++;
      } else {
        successCount++;
      }
    }

    return { success: successCount, failed: failedCount };
  } catch (error) {
    return { success: 0, failed: validTokens.length };
  }
}

async function notifyNewProduct(product, supermarket) {
  const title = '🎉 Novo Produto com Desconto!';
  const body = `${product.name} - ${product.discountPercentage}% OFF em ${supermarket.name}`;
  
  const data = {
    type: 'NEW_PRODUCT',
    productId: product.id,
    supermarketId: product.supermarketId,
    screen: 'supermarket-details',
    params: {
      id: product.supermarketId,
    },
  };

  return { title, body, data };
}

module.exports = {
  sendPushNotification,
  sendPushNotificationsToMany,
  notifyNewProduct,
};
