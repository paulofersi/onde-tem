const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Product = require('./models/Product');
const Supermarket = require('./models/Supermarket');
const { sendPushNotificationsToMany, notifyNewProduct } = require('./services/notificationService');
const { verifyFirebaseToken } = require('./services/firebaseAuth');

const JWT_SECRET = process.env.JWT_SECRET || 'seu-secret-key-super-seguro';

const generateToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const authenticate = async (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  
  try {
    try {
      const decodedToken = await verifyFirebaseToken(token);
      
      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (!user) {
        user = await User.findOne({ email: decodedToken.email });
        if (user) {
          user.firebaseUid = decodedToken.uid;
          await user.save();
        } else {
          user = new User({
            firebaseUid: decodedToken.uid,
            email: decodedToken.email || '',
            name: decodedToken.name || decodedToken.email?.split('@')[0] || 'Usuário',
          });
          await user.save();
        }
      }
      
      return user;
    } catch (firebaseError) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
          throw new Error('Usuário não encontrado');
        }
        return user;
      } catch (jwtError) {
        throw new Error('Token inválido');
      }
    }
  } catch (error) {
    throw new Error('Token inválido');
  }
};

const resolvers = {
  Query: {
    me: async (parent, args, { req }) => {
      const user = await authenticate(req);
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        pushToken: user.pushToken,
        createdAt: user.createdAt,
      };
    },

    products: async (parent, args, { req }) => {
      await authenticate(req);
      const products = await Product.find({});
      return products.map(product => ({
        id: product._id.toString(),
        name: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        supermarketId: product.supermarketId,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));
    },

    product: async (parent, { id }, { req }) => {
      await authenticate(req);
      const product = await Product.findById(id);
      if (!product) {
        throw new Error('Produto não encontrado');
      }
      return {
        id: product._id.toString(),
        name: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        supermarketId: product.supermarketId,
        image: product.image,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      };
    },

    supermarkets: async (parent, args, { req }) => {
      await authenticate(req);
      const supermarkets = await Supermarket.find({});
      return supermarkets.map(supermarket => ({
        id: supermarket._id.toString(),
        name: supermarket.name,
        address: supermarket.address,
        description: supermarket.description,
        latitude: supermarket.latitude,
        longitude: supermarket.longitude,
        color: supermarket.color,
        createdAt: supermarket.createdAt,
        updatedAt: supermarket.updatedAt,
      }));
    },

    supermarket: async (parent, { id }, { req }) => {
      await authenticate(req);
      const supermarket = await Supermarket.findById(id);
      if (!supermarket) {
        throw new Error('Supermercado não encontrado');
      }
      return {
        id: supermarket._id.toString(),
        name: supermarket.name,
        address: supermarket.address,
        description: supermarket.description,
        latitude: supermarket.latitude,
        longitude: supermarket.longitude,
        color: supermarket.color,
        createdAt: supermarket.createdAt,
        updatedAt: supermarket.updatedAt,
      };
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        throw new Error('Email ou senha inválidos');
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw new Error('Email ou senha inválidos');
      }

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    },

    register: async (parent, { name, email, password }) => {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        throw new Error('Email já cadastrado');
      }

      const user = new User({
        name,
        email: email.toLowerCase(),
        password,
      });

      await user.save();

      const token = generateToken(user);

      return {
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt,
        },
      };
    },

    createProduct: async (parent, { input }, { req }) => {
      await authenticate(req);
      const product = new Product({
        ...input,
      });

      await product.save();

      const productData = {
        id: product._id.toString(),
        name: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        supermarketId: product.supermarketId,
        image: product.image,
        createdAt: product.createdAt,
      };

      // Enviar notificações push para todos os usuários
      try {
        // Buscar o supermercado para incluir no nome da notificação
        const supermarket = await Supermarket.findById(product.supermarketId);
        const supermarketName = supermarket ? supermarket.name : 'um supermercado';

        // Preparar dados da notificação
        const { title, body, data } = await notifyNewProduct(productData, { name: supermarketName });

        const users = await User.find({ pushToken: { $ne: null } });
        const pushTokens = users.map(user => user.pushToken).filter(Boolean);

        if (pushTokens.length > 0) {
          sendPushNotificationsToMany(pushTokens, title, body, data).catch(() => {});
        }
      } catch (error) {
        // Não falhar a criação do produto se houver erro ao enviar notificações
      }

      return productData;
    },

    updateProduct: async (parent, { id, input }, { req }) => {
      await authenticate(req);
      const product = await Product.findByIdAndUpdate(
        id,
        { ...input },
        { new: true, runValidators: true }
      );

      if (!product) {
        throw new Error('Produto não encontrado');
      }

      return {
        id: product._id.toString(),
        name: product.name,
        originalPrice: product.originalPrice,
        discountPrice: product.discountPrice,
        discountPercentage: product.discountPercentage,
        supermarketId: product.supermarketId,
        image: product.image,
        updatedAt: product.updatedAt,
      };
    },

    deleteProduct: async (parent, { id }, { req }) => {
      await authenticate(req);
      const product = await Product.findByIdAndDelete(id);
      return !!product;
    },

    createSupermarket: async (parent, { input }, { req }) => {
      await authenticate(req);
      const supermarket = new Supermarket({
        ...input,
      });

      await supermarket.save();

      return {
        id: supermarket._id.toString(),
        name: supermarket.name,
        address: supermarket.address,
        description: supermarket.description,
        latitude: supermarket.latitude,
        longitude: supermarket.longitude,
        color: supermarket.color,
        createdAt: supermarket.createdAt,
      };
    },

    updateSupermarket: async (parent, { id, input }, { req }) => {
      await authenticate(req);
      const supermarket = await Supermarket.findByIdAndUpdate(
        id,
        { ...input },
        { new: true, runValidators: true }
      );

      if (!supermarket) {
        throw new Error('Supermercado não encontrado');
      }

      return {
        id: supermarket._id.toString(),
        name: supermarket.name,
        address: supermarket.address,
        description: supermarket.description,
        latitude: supermarket.latitude,
        longitude: supermarket.longitude,
        color: supermarket.color,
        updatedAt: supermarket.updatedAt,
      };
    },

    deleteSupermarket: async (parent, { id }, { req }) => {
      await authenticate(req);
      const productsCount = await Product.countDocuments({ 
        supermarketId: id
      });
      
      if (productsCount > 0) {
        throw new Error('Não é possível excluir supermercado com produtos cadastrados');
      }

      const supermarket = await Supermarket.findByIdAndDelete(id);
      return !!supermarket;
    },

    updatePushToken: async (parent, { pushToken }, { req }) => {
      const user = await authenticate(req);
      if (!user) {
        throw new Error('Não autenticado');
      }

      user.pushToken = pushToken;
      await user.save();

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        pushToken: user.pushToken,
        createdAt: user.createdAt,
      };
    },

    createOrUpdateUser: async (parent, { input }, { req }) => {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error('Não autenticado');
      }

      const token = authHeader.replace('Bearer ', '');
      let decodedToken;
      
      try {
        decodedToken = await verifyFirebaseToken(token);
      } catch (error) {
        throw new Error('Token inválido');
      }

      if (input.firebaseUid !== decodedToken.uid) {
        throw new Error('Firebase UID não corresponde ao token');
      }

      let user = await User.findOne({ firebaseUid: decodedToken.uid });
      
      if (user) {
        user.name = input.name || user.name;
        user.email = input.email || user.email;
        await user.save();
      } else {
        const existingUser = await User.findOne({ email: input.email.toLowerCase() });
        if (existingUser) {
          existingUser.firebaseUid = decodedToken.uid;
          existingUser.name = input.name || existingUser.name;
          await existingUser.save();
          user = existingUser;
        } else {
          user = new User({
            firebaseUid: decodedToken.uid,
            email: input.email.toLowerCase(),
            name: input.name,
          });
          await user.save();
        }
      }

      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      };
    },
  },
};

module.exports = resolvers;

