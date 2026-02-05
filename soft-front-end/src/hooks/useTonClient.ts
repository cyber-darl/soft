import { TonClient } from 'ton';
import { useAsyncInitialize } from './useAsyncInitialize';


const toncenter_api = import.meta.env.VITE_TONCENTER_API;

if (!toncenter_api) {
  throw new Error("toncenter api key not found");
}


export function useTonClient() {
  return useAsyncInitialize(async () => {
    const endpoint = "https://testnet.toncenter.com/api/v2/jsonRPC";
    console.log("Using TON endpoint with API key");
    
    return new TonClient({
      endpoint: endpoint,
      apiKey: toncenter_api // ← Paste your key here
    });
  });
}