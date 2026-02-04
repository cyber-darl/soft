import { address, toNano } from '@ton/core';
import { MainContract } from '../wrappers/Soft';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const soft = provider.open(
        MainContract.createFromConfig(
            {
                number: 0,
                address: address("EQCA0v6nQm92kle8RIBPpuN3pPxv0BBikXJOM4NpHZ2CVyaP"),
                owner_address: address(
                  "EQCA0v6nQm92kle8RIBPpuN3pPxv0BBikXJOM4NpHZ2CVyaP"
                ),
              },
            await compile('Soft')
        )
    );

    await soft.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(soft.address);

   
}
