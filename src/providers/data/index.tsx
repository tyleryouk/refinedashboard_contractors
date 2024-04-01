import graphqlDataProvider, {
  GraphQLClient,
  liveProvider as graphqlLiveProvider
} from "@refinedev/nestjs-query";
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";


export const API_BASE_URL = "http://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient(API_URL, {
  fetch: (url: string, options: RequestInit) => {
    try {
      return fetchWrapper(url, options);
    } catch (error) {
      return Promise.reject(error as Error);
    }
  },
});

/**
 * WebSocket client for real-time subscription communication.
 * Utilizes the GraphQL subscription endpoint provided by the server
 * to listen for real-time updates. 
 * In Refine, there is a built-in provider named live provider 
 * that allows the application to update in real-time, 
 * leveraging GraphQL subscriptions.
 */
export const wsClient =
  typeof window !== "undefined"
    ? createClient({
        url: WS_URL,
        connectionParams: () => {
          const accessToken = localStorage.getItem("access_token");

          return {
            headers: {
              Authorization: "Bearer ${accessToken}",
            },
          };
        },
      })
    : undefined;

//function creates a data provider from the GraphQL client for Refine to use
export const dataProvider = graphqlDataProvider(client); 

// Creates a real-time update provider using WebSocket and GraphQL subscriptions for Refine applications.
export const liveProvider = wsClient ? graphqlLiveProvider(wsClient) : undefined;
