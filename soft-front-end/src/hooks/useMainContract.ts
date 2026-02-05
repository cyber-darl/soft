import { useEffect, useState } from "react";
import { MainContract } from "../contracts/Soft";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core";
import { useTonConnect } from "./useTonConnect";

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const sleep = (time:number) => {
   return new Promise ((resolve)=> setTimeout (resolve, time));
  }
  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState <number | null>(null);

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQBz0DvKJbJUDNRMmKM64nC4_2FnCGNGkO81VN43keyRWGTF") 
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

   useEffect(() => {
    let isActive = true;

    async function getValue() {
      if (!mainContract || !isActive) return;  // FIXED: Added ! before isActive
      const val = await mainContract.getData();
      const { balance } = await mainContract.getBalance();
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });
      setBalance(balance);
      
      if (isActive) {
        await sleep(5000);
        getValue();
      }
    }
    
    getValue();
    
    return () => {
      isActive = false;  // FIXED: Actually set to false
    };
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: async () => {
      return mainContract?.sendIncrement(sender, toNano("0.05"), 5)
    },
    sendDeposit: async () => {
      return mainContract?.sendDeposit(sender, toNano("1"))
    },
    sendWithdrawalRequest: async () => {
      return mainContract?.sendWithdrawalRequest(sender, toNano("0.05"), toNano("0.7"))
    }
  };
}