export const requestHandler = async <T>(
  apiCall: Promise<{ data: T }>
): Promise<T | Error> => {
  try {
    const { data } = await apiCall;

    return data;
  } catch (error) {
    console.error("API request failed:", error);
    if (error instanceof Error) {
      return error;
    }
    return new Error("An unknown error occurred");
  }
};
