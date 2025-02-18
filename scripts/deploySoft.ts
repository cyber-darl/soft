import { address, toNano } from '@ton/core';
import { MainContract } from '../wrappers/Soft';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const soft = provider.open(
        MainContract.createFromConfig(
            {
                number: 0,
                address: address("0QATA2P3V3XrVgGEi7Rz6AbBCppIcTRmC7lvIZz7mX2XJVoE"),
                owner_address: address(
                  "0QATA2P3V3XrVgGEi7Rz6AbBCppIcTRmC7lvIZz7mX2XJVoE"
                ),
              },
            await compile('Soft')
        )
    );

    await soft.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(soft.address);

   
}
