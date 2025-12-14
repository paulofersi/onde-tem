declare module "@react-native-firebase/auth" {
  import { ReactNativeFirebase } from "@react-native-firebase/app";

  export interface FirebaseAuthTypes {
    User: ReactNativeFirebase.FirebaseAuthTypes.User;
  }

  const auth: () => ReactNativeFirebase.FirebaseAuthTypes.Module;
  export default auth;
  export { FirebaseAuthTypes };
}

declare module "@react-native-firebase/app" {
  export namespace ReactNativeFirebase {
    export namespace FirebaseAuthTypes {
      export interface User {
        uid: string;
        email: string | null;
        displayName: string | null;
        getIdToken(forceRefresh?: boolean): Promise<string>;
        updateProfile(profile: { displayName?: string }): Promise<void>;
      }

      export interface Module {
        currentUser: User | null;
        signInWithEmailAndPassword(
          email: string,
          password: string
        ): Promise<{ user: User }>;
        createUserWithEmailAndPassword(
          email: string,
          password: string
        ): Promise<{ user: User }>;
        signInWithCredential(credential: any): Promise<{ user: User }>;
        signOut(): Promise<void>;
        onAuthStateChanged(callback: (user: User | null) => void): () => void;
        GoogleAuthProvider: {
          credential(idToken: string, accessToken?: string): any;
        };
      }
    }
  }

  const app: any;
  export default app;
}
