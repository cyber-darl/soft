import { useEffect, useState } from "react";
import { MainContract } from "../contracts/Soft";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender, connected } = useTonConnect();

  const sleep = (time: number) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  };

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>(null);

  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) {
      console.log("No TonClient available");
      return null;
    }
    
    try {
      const contractAddress = Address.parse("EQBz0DvKJbJUDNRMmKM64nC4_2FnCGNGkO81VN43keyRWGTF");
      const contract = new MainContract(contractAddress);
      const opened = client.open(contract);
      console.log("Contract opened successfully");
      return opened;
    } catch (err: any) {
      console.error("Failed to open contract:", err);
      setError(`Contract error: ${err.message}`);
      return null;
    }
  }, [client]);

  useEffect(() => {
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    async function getValue() {
      if (!mainContract || !isMounted) return;
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching contract data...");
        
        const val = await mainContract.getData();
        const { balance: contractBalance } = await mainContract.getBalance();
        
        if (isMounted) {
          setContractData({
            counter_value: val.number,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
          });
          setBalance(contractBalance);
          retryCount = 0; // Reset retry count on success
        }
        
      } catch (err: any) {
        console.error("Error fetching contract data:", err);
        
        if (isMounted) {
          setError(`Failed to load contract: ${err.message}`);
          retryCount++;
          
          // Retry a few times
          if (retryCount < maxRetries) {
            console.log(`Retrying... (${retryCount}/${maxRetries})`);
            await sleep(2000);
            getValue();
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
          
          // Only continue polling if successful
          if (retryCount < maxRetries) {
            await sleep(5000);
            if (isMounted) getValue();
          }
        }
      }
    }

    if (mainContract) {
      getValue();
    }

    return () => {
      isMounted = false;
    };
  }, [mainContract]);

  return {
    contract_address: mainContract?.address?.toString(),
    contract_balance: balance,
    counter_value: contractData?.counter_value,
    recent_sender: contractData?.recent_sender,
    owner_address: contractData?.owner_address,
    isLoading,
    error,
    connected,
    
    sendIncrement: async () => {
      if (!mainContract) {
        throw new Error("Contract not loaded");
      }
      
      if (!connected) {
        throw new Error("Wallet not connected");
      }
      
      try {
        // @ts-ignore - bypass type check if needed
        const result = await mainContract.sendIncrement(sender, toNano("0.05"), 5);
        
        // Wait for transaction to confirm
        await sleep(10000);
        
        // Refresh data
        if (mainContract) {
          const val = await mainContract.getData();
          const { balance: newBalance } = await mainContract.getBalance();
          
          setContractData({
            counter_value: val.number,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
          });
          setBalance(newBalance);
        }
        
        return result;
      } catch (err: any) {
        console.error("sendIncrement failed:", err);
        throw err;
      }
    },
    
    sendDeposit: async () => {
      if (!mainContract) {
        throw new Error("Contract not loaded");
      }
      
      if (!connected) {
        throw new Error("Wallet not connected");
      }
      
      try {
        // @ts-ignore - bypass type check if needed
        const result = await mainContract.sendDeposit(sender, toNano("0.05"));
        
        await sleep(10000);
        
        if (mainContract) {
          const val = await mainContract.getData();
          const { balance: newBalance } = await mainContract.getBalance();
          
          setContractData({
            counter_value: val.number,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
          });
          setBalance(newBalance);
        }
        
        return result;
      } catch (err: any) {
        console.error("sendDeposit failed:", err);
        throw err;
      }
    },
    
    sendWithdrawalRequest: async () => {
      if (!mainContract) {
        throw new Error("Contract not loaded");
      }
      
      if (!connected) {
        throw new Error("Wallet not connected");
      }
      
      try {
        // @ts-ignore - bypass type check if needed
        const result = await mainContract.sendWithdrawalRequest(sender, toNano("0.05"), toNano("0.7"));
        
        await sleep(10000);
        
        if (mainContract) {
          const val = await mainContract.getData();
          const { balance: newBalance } = await mainContract.getBalance();
          
          setContractData({
            counter_value: val.number,
            recent_sender: val.recent_sender,
            owner_address: val.owner_address,
          });
          setBalance(newBalance);
        }
        
        return result;
      } catch (err: any) {
        console.error("sendWithdrawalRequest failed:", err);
        throw err;
      }
    }
  };
}