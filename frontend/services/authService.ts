// Este arquivo mantém compatibilidade, mas agora usa Firebase Auth
// Veja firebaseAuthService.ts para a implementação atual
import { AuthResponse, firebaseAuthService, User } from "./firebaseAuthService";

// Re-exportar tipos
export type { AuthResponse, User };

// Re-exportar do firebaseAuthService para compatibilidade
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return firebaseAuthService.login(email, password);
  },

  async register(
    name: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    return firebaseAuthService.register(name, email, password);
  },

  async logout(): Promise<void> {
    return firebaseAuthService.logout();
  },

  async getCurrentUser(): Promise<User | null> {
    return firebaseAuthService.getCurrentUser();
  },

  async getStoredUser(): Promise<User | null> {
    return firebaseAuthService.getStoredUser();
  },

  async getStoredToken(): Promise<string | null> {
    return firebaseAuthService.getStoredToken();
  },

  async isAuthenticated(): Promise<boolean> {
    return firebaseAuthService.isAuthenticated();
  },

  async loginWithGoogleResult(googleResult: any): Promise<AuthResponse> {
    return firebaseAuthService.loginWithGoogleResult(googleResult);
  },
};
