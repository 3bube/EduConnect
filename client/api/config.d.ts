declare module '@/api/config' {
  const config: {
    baseURL: string;
    headers: {
      'Content-Type': string;
    };
    getAuthHeader: () => Record<string, string>;
  };
  
  export default config;
}
