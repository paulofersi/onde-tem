import { CREATE_OR_UPDATE_USER } from "@/graphql/mutations";
import { GET_CURRENT_USER } from "@/graphql/queries";
import { apolloClient } from "@/lib/apollo-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { AuthSessionResult } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const USER_STORAGE_KEY = "@onde_tem:user";
const TOKEN_STORAGE_KEY = "@onde_tem:firebase_token";

export const firebaseAuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        email,
        password
      );
      const firebaseUser = userCredential.user;

      const token = await firebaseUser.getIdToken();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);

      const userData = await this.createOrUpdateUserInMongoDB(
        firebaseUser,
        token
      );
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      await apolloClient.resetStore();

      return {
        token,
        user: userData,
      };
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Usuário não encontrado";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Senha incorreta";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (error.code === "auth/user-disabled") {
        errorMessage = "Usuário desabilitado";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        email,
        password
      );
      const firebaseUser = userCredential.user;

      await firebaseUser.updateProfile({ displayName: name });

      const token = await firebaseUser.getIdToken();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      const userData = await this.createOrUpdateUserInMongoDB(
        firebaseUser,
        token,
        name
      );
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      await apolloClient.resetStore();

      return {
        token,
        user: userData,
      };
    } catch (error: any) {
      let errorMessage = "Erro ao registrar";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "Email já está em uso";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Email inválido";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "Senha muito fraca";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  async createOrUpdateUserInMongoDB(
    firebaseUser: FirebaseAuthTypes.User,
    token: string,
    name?: string
  ): Promise<User> {
    try {
      const displayName =
        name ||
        firebaseUser.displayName ||
        firebaseUser.email?.split("@")[0] ||
        "Usuário";

      const { data } = await apolloClient.mutate({
        mutation: CREATE_OR_UPDATE_USER,
        variables: {
          input: {
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: displayName,
          },
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      });

      return (
        data?.createOrUpdateUser || {
          id: firebaseUser.uid,
          name: displayName,
          email: firebaseUser.email || "",
        }
      );
    } catch (error: any) {
      return {
        id: firebaseUser.uid,
        name:
          name ||
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Usuário",
        email: firebaseUser.email || "",
      };
    }
  },

  async logout(): Promise<void> {
    try {
      await auth().signOut();
      await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      await apolloClient.clearStore();
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const firebaseUser = auth().currentUser;
      if (!firebaseUser) {
        return null;
      }

      try {
        const token = await firebaseUser.getIdToken();
        const { data } = await apolloClient.query({
          query: GET_CURRENT_USER,
          fetchPolicy: "network-only",
          context: {
            headers: {
              authorization: `Bearer ${token}`,
            },
          },
        });

        if (data?.me) {
          return data.me;
        }
      } catch (error) {
        // Fallback to Firebase data
      }

      return {
        id: firebaseUser.uid,
        name:
          firebaseUser.displayName ||
          firebaseUser.email?.split("@")[0] ||
          "Usuário",
        email: firebaseUser.email || "",
      };
    } catch (error) {
      return null;
    }
  },

  async getStoredUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error) {
      return null;
    }
  },

  async getStoredToken(): Promise<string | null> {
    try {
      const firebaseUser = auth().currentUser;
      if (firebaseUser) {
        const token = await firebaseUser.getIdToken();
        await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
        return token;
      }
      return await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
    } catch (error) {
      return null;
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const firebaseUser = auth().currentUser;
    return !!firebaseUser;
  },

  async loginWithGoogleResult(
    googleResult: AuthSessionResult
  ): Promise<AuthResponse> {
    try {
      WebBrowser.maybeCompleteAuthSession();

      if (googleResult.type !== "success") {
        throw new Error("Autenticação com Google cancelada");
      }

      const params = (googleResult as any).params || {};
      const id_token = params.id_token;
      const access_token = params.access_token;

      if (!id_token) {
        throw new Error("Token do Google não recebido");
      }

      const googleCredential = auth.GoogleAuthProvider.credential(
        id_token,
        access_token
      );

      const userCredential = await auth().signInWithCredential(
        googleCredential
      );
      const firebaseUser = userCredential.user;
      const token = await firebaseUser.getIdToken();
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      const userData = await this.createOrUpdateUserInMongoDB(
        firebaseUser,
        token
      );
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));

      await apolloClient.resetStore();

      return {
        token,
        user: userData,
      };
    } catch (error: any) {
      let errorMessage = "Erro ao fazer login com Google";
      if (error.code === "auth/account-exists-with-different-credential") {
        errorMessage =
          "Uma conta já existe com este email usando outro método de login";
      } else if (error.code === "auth/invalid-credential") {
        errorMessage = "Credencial inválida";
      } else if (error.message) {
        errorMessage = error.message;
      }

      throw new Error(errorMessage);
    }
  },

  onAuthStateChanged(
    callback: (user: FirebaseAuthTypes.User | null) => void
  ): () => void {
    return auth().onAuthStateChanged(callback);
  },
};
