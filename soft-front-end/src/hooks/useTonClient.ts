import { TonClient } from 'ton';
import { useAsyncInitialize } from './useAsyncInitialize';

export function useTonClient() {
  return useAsyncInitialize(async () => {
    const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC";
    console.log("Using TON endpoint with API key");
    
    return new TonClient({
      endpoint: endpoint,
      apiKey: "2874420b1b4a82fa0e83a79306339f6dc14399523c4dbc8126a87ca691849a3d" // ← Paste your key here
    });
  });
}