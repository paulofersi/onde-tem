# 🛒 Onde Tem

Aplicativo mobile para encontrar produtos com desconto próximos ao vencimento em supermercados da região.

## 🛠️ Tecnologias

### Backend
- **Node.js** + **Express** - Servidor HTTP
- **GraphQL** + **Apollo Server** - API GraphQL
- **MongoDB** + **Mongoose** - Banco de dados
- **Firebase Admin SDK** - Autenticação e notificações push

### Frontend
- **React Native** + **Expo** - Framework mobile
- **TypeScript** - Tipagem estática
- **GraphQL** + **Apollo Client** - Cliente GraphQL
- **Redux Toolkit** - Gerenciamento de estado global
- **React Native Firebase** - Autenticação Firebase
- **Gluestack UI** - Componentes UI
- **Expo Notifications** - Notificações push
- **Expo Updates** - Code Push (atualizações OTA)

## 📋 Pré-requisitos

- **Node.js** (v18 ou superior)
- **MongoDB** (instalado e rodando localmente ou URI remota)
- **npm** ou **yarn**
- **Expo CLI** (`npm install -g expo-cli`)
- **Conta Firebase** (para autenticação)
- **Conta Google Cloud** (para Google Sign-In)

## 🚀 Como Executar

### 1. Backend

```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Copiar arquivo de exemplo de variáveis de ambiente
# Windows: copy env.example.txt .env
# Linux/Mac: cp env.example.txt .env

# Editar o arquivo .env com suas configurações:
# - MONGODB_URI (ex: mongodb://127.0.0.1:27017/onde-tem)
# - FIREBASE_SERVICE_ACCOUNT (JSON do Firebase Admin SDK)
# - JWT_SECRET (chave secreta para JWT)
# - PORT (porta do servidor, padrão: 4000)

# Iniciar o servidor
npm start

# Ou em modo desenvolvimento (com auto-reload)
npm run dev
```

O servidor GraphQL estará disponível em: `http://localhost:4000/graphql`

### 2. Frontend

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependências
npm install

# Criar arquivo .env na raiz do frontend com:
# GRAPHQL_URI=http://localhost:4000/graphql
# (ou o IP da sua máquina se testar no dispositivo físico)
# EXPO_PUBLIC_FIREBASE_API_KEY=sua-api-key
# EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-auth-domain
# EXPO_PUBLIC_FIREBASE_PROJECT_ID=seu-project-id
# EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-storage-bucket
# EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu-sender-id
# EXPO_PUBLIC_FIREBASE_APP_ID=seu-app-id
# GOOGLE_MAPS_API_KEY=sua-google-maps-api-key

# Iniciar o Expo
npm start

# Escanear o QR code com:
# - Expo Go (para desenvolvimento)
# - Ou executar em emulador/dispositivo físico
```

### 3. Executar no Emulador/Dispositivo

```bash
# Android
npm run android

# iOS (apenas Mac)
npm run ios

# Web (para testes)
npm run web
```

## 📱 Build de Produção

### Gerar APK (Android)

```bash
cd frontend
npm run build:android
```

O build será feito via EAS Build. Certifique-se de ter configurado o `eas.json` corretamente.

## 🔧 Comandos Úteis

### Backend
- `npm start` - Inicia o servidor
- `npm run dev` - Modo desenvolvimento (com nodemon)
- `npm run seed` - Popular banco com dados de exemplo

### Frontend
- `npm start` - Inicia o Expo
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador
- `npm run lint` - Verifica erros de código

## 📁 Estrutura do Projeto

```
onde-tem/
├── backend/          # API GraphQL
│   ├── src/
│   │   ├── index.js      # Servidor principal
│   │   ├── typeDefs.js    # Schema GraphQL
│   │   ├── resolvers.js   # Resolvers GraphQL
│   │   ├── models/        # Modelos Mongoose
│   │   └── services/      # Serviços (Firebase, Notificações)
│   └── package.json
│
└── frontend/        # App React Native
    ├── app/              # Telas (Expo Router)
    ├── components/       # Componentes reutilizáveis
    ├── hooks/            # Custom hooks
    ├── store/            # Redux store e slices
    ├── services/         # Serviços (GraphQL, Firebase)
    └── package.json
```

## 🔐 Configuração Firebase

1. Crie um projeto no [Firebase Console](https://console.firebase.google.com/)
2. Ative Authentication com Google Sign-In
3. Baixe o arquivo `google-services.json` (Android) e `GoogleService-Info.plist` (iOS)
4. Coloque os arquivos nas pastas `frontend/android/app/` e `frontend/ios/`
5. Configure as variáveis de ambiente no `.env` do frontend

## 🌐 Google Cloud Console

1. Configure OAuth 2.0 Client IDs no [Google Cloud Console](https://console.cloud.google.com/)
2. Adicione os Redirect URIs:
   - Web: `https://auth.expo.io/@seu-usuario/onde-tem`
   - Android: `ondetem://`
   - iOS: `ondetem://`
3. Configure o OAuth Consent Screen
4. Adicione usuários de teste (se estiver em modo "Testing")

## ⚠️ Problemas Comuns

### Backend não conecta ao MongoDB
- Verifique se o MongoDB está rodando: `mongod`
- Confirme a URI no `.env` está correta

### Frontend não conecta ao backend
- Verifique se o backend está rodando na porta 4000
- Se testar no dispositivo físico, use o IP da sua máquina: `http://192.168.x.x:4000/graphql`
- Confirme o `GRAPHQL_URI` no `.env` do frontend

### Erro de autenticação Firebase
- Verifique se as variáveis de ambiente do Firebase estão corretas
- Confirme que os arquivos `google-services.json` estão no lugar certo

## 📝 Licença

ISC
