const admin = require('firebase-admin');

if (!admin.apps.length) {
  try {
    // Tentar usar credenciais do arquivo de serviço
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (serviceAccount) {
      let cleanedJson = serviceAccount.trim();
      cleanedJson = cleanedJson.replace(/\n/g, ' ').replace(/\r/g, '').replace(/\t/g, ' ');
      cleanedJson = cleanedJson.replace(/\s{2,}/g, ' ');
      const credentials = JSON.parse(cleanedJson);
      admin.initializeApp({
        credential: admin.credential.cert(credentials),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    }
  } catch (error) {}
}

async function verifyFirebaseToken(token) {
  try {
    if (!admin.apps.length) {
      throw new Error('Firebase Admin não inicializado');
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Token inválido');
  }
}

async function getFirebaseUser(uid) {
  try {
    if (!admin.apps.length) {
      return null;
    }
    
    const userRecord = await admin.auth().getUser(uid);
    return userRecord;
  } catch (error) {
    return null;
  }
}

module.exports = {
  verifyFirebaseToken,
  getFirebaseUser,
  admin,
};
