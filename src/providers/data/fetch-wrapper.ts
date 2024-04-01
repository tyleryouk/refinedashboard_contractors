import { GraphQLFormattedError } from "graphql";

type Error = {
  message: string;
  statusCode: string;
};

/** 
 * customFetch is an asynchronous function that performs a customized HTTP fetch request.
 * It adds authorization headers to the request based on the access token retrieved from local storage,
 * and sets additional headers such as Content-Type and Apollo-Require-Preflight. 
 */
const customFetch = async (url: string, options: RequestInit) => {
  const accessToken = localStorage.getItem("access_token");

  const headers = options.headers as Record<string, string>;

  return await fetch(url, {
    ...options,
    headers: {
      ...headers,
      Authorization: headers?.Authorization || "Bearer ${accessToken}",

      "Content-Type": "application/json",
      "Apollo-Require-Preflight": "true",
    },
  });
};

//error handling solution
// This function extracts GraphQL errors from a response body and formats them for error handling.
const getGraphQLErrors = (
  body: Record<"errors", GraphQLFormattedError[] | undefined>
  //body of type Record
): Error[] | null => {

  // If the response is empty or undefined, return a single element array 
  if (!body) {
    return [{ message: "Unknown error", statusCode: "INTERNAL_SERVER_ERROR" }];
  }

  // If the response body contains errors, extract and format them.
  if (body.errors !== undefined) {
    // Extract the errors array from the body.
    const errors = body?.errors;

    // Map over each GraphQL error to extract its message and status code.
    return errors.map(error => ({
      // Use the error message or default to "Unknown GraphQL error".
      message: error.message || "Unknown GraphQL error",
      // Extract the status code from the error extensions or default to 500.
      statusCode: error.extensions?.code || 500
    }));
  }

  return null;
};

export const fetchWrapper = async (url: string, options: RequestInit) => {
  const response = await customFetch(url, options);

  const responseClone = response.clone();
  const body = await responseClone.json();

  const error = getGraphQLErrors(body);

  if (error) {
    throw error;
  }

  return response;
};
