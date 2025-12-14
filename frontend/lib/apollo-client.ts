import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  from,
  type FetchPolicy,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import AsyncStorage from "@react-native-async-storage/async-storage";
import auth from "@react-native-firebase/auth";
import Constants from "expo-constants";

const getGraphQLUri = (): string => {
  const configuredUri =
    Constants.expoConfig?.extra?.graphqlUri || process.env.GRAPHQL_URI;

  if (configuredUri && !configuredUri.includes("localhost")) {
    return configuredUri;
  }

  return configuredUri || "http://localhost:4000/graphql";
};

const GRAPHQL_URI = getGraphQLUri();

const httpLink = createHttpLink({
  uri: GRAPHQL_URI,
});

const authLink = setContext(async (_, { headers }) => {
  try {
    const firebaseUser = auth().currentUser;

    if (firebaseUser) {
      try {
        const token = await firebaseUser.getIdToken();
        return {
          headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
          },
        };
      } catch (firebaseError) {
        // Fallback to stored token
      }
    }

    const token = await AsyncStorage.getItem("@onde_tem:token");
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : "",
      },
    };
  } catch (error) {
    return { headers };
  }
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (networkError) {
    const isAuthError =
      "statusCode" in networkError && networkError.statusCode === 401;

    if (isAuthError) {
      AsyncStorage.removeItem("@onde_tem:token");
      AsyncStorage.removeItem("@onde_tem:user");
    }
  }
});

export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          products: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
          supermarkets: {
            merge(existing = [], incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-first" as FetchPolicy,
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "cache-first" as FetchPolicy,
      errorPolicy: "all",
    },
  },
});
