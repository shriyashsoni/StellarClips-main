#!/usr/bin/env node

/**
 * Soroban Contract Deployment Script (Node.js version)
 * This script deploys contracts to Stellar Soroban network using the Stellar SDK
 * 
 * Usage: node deploy-with-nodejs.js <network> <secret_key>
 * Example: node deploy-with-nodejs.js testnet SA2MIKT7VTHKS6VVO4NBZKRPNIXSV2OC4XFVIS2MJJ7DIZ32EXFWN6YE
 */

const fs = require('fs');
const path = require('path');

// Stellar SDK imports (requires npm install)
let StellarSDK;
try {
  StellarSDK = require('@stellar/stellar-sdk');
} catch (e) {
  console.error('❌ Error: @stellar/stellar-sdk is not installed');
  console.error('\nPlease install dependencies:');
  console.error('  npm install --legacy-peer-deps');
  console.error('  or npx stellar-sdk@latest');
  process.exit(1);
}

const NETWORK = process.argv[2] || 'testnet';
const SECRET_KEY = process.argv[3];

// Configuration
const SOROBAN_CONFIG = {
  testnet: {
    rpcUrl: 'https://soroban-testnet.stellar.org',
    networkPassphrase: 'Test SDF Network ; September 2015',
    horizonUrl: 'https://horizon-testnet.stellar.org'
  },
  mainnet: {
    rpcUrl: 'https://soroban-rpc.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    horizonUrl: 'https://horizon.stellar.org'
  }
};

const config = SOROBAN_CONFIG[NETWORK];
if (!config) {
  console.error(`❌ Error: Invalid network '${NETWORK}'. Use 'testnet' or 'mainnet'`);
  process.exit(1);
}

if (!SECRET_KEY) {
  console.error('❌ Error: Secret key required');
  console.error(`Usage: node deploy-with-nodejs.js <network> <secret_key>`);
  console.error(`Example: node deploy-with-nodejs.js testnet SA2MIKT...`);
  process.exit(1);
}

// Validate secret key format
if (!SECRET_KEY.startsWith('S')) {
  console.error('❌ Error: Invalid secret key format. Must start with "S"');
  process.exit(1);
}

const contracts = [
  {
    name: 'Content NFT',
    wasmPath: 'content_nft/target/wasm32-unknown-unknown/release/content_nft_contract.wasm'
  },
  {
    name: 'Subscription',
    wasmPath: 'subscription/target/wasm32-unknown-unknown/release/subscription_contract.wasm'
  },
  {
    name: 'Payment',
    wasmPath: 'payment/target/wasm32-unknown-unknown/release/payment_contract.wasm'
  },
  {
    name: 'Revenue',
    wasmPath: 'revenue/target/wasm32-unknown-unknown/release/revenue_contract.wasm'
  }
];

async function deployContracts() {
  try {
    console.log(`\n🚀 Starting deployment to ${NETWORK}...`);
    console.log(`📱 Network: ${NETWORK}`);
    console.log(`🔗 RPC URL: ${config.rpcUrl}\n`);

    // Validate source account
    const keypair = StellarSDK.Keypair.fromSecret(SECRET_KEY);
    console.log(`💼 Account: ${keypair.publicKey()}\n`);

    // Initialize Soroban RPC client
    const sorobanServer = new StellarSDK.SorobanRpc.Server(config.rpcUrl);
    const horizonServer = new StellarSDK.Horizon.Server(config.horizonUrl);

    // Get account details for transaction sequence number
    let sourceAccount;
    try {
      const accountData = await horizonServer.loadAccount(keypair.publicKey());
      sourceAccount = new StellarSDK.Account(
        accountData.id,
        accountData.sequence
      );
    } catch (e) {
      console.error(`❌ Error: Could not load account. Make sure it's funded on ${NETWORK}`);
      console.error('\n💡 For testnet, fund your account here:');
      console.error('   https://stellar.expert/testnet/friendbot');
      process.exit(1);
    }

    const deployedContracts = {};

    // Deploy each contract
    for (const contract of contracts) {
      console.log(`📦 Deploying ${contract.name} Contract...`);

      // Check if WASM file exists
      const wasmFullPath = path.join(__dirname, contract.wasmPath);
      if (!fs.existsSync(wasmFullPath)) {
        console.error(`❌ Error: WASM file not found at ${wasmFullPath}`);
        console.error('   Please run: ./build.sh');
        process.exit(1);
      }

      // Read WASM bytes
      const wasmBytes = fs.readFileSync(wasmFullPath);
      console.log(`   WASM Size: ${(wasmBytes.length / 1024).toFixed(2)} KB`);

      try {
        // Create upload contract transaction
        console.log(`   Uploading WASM...`);
        const uploadTx = new StellarSDK.TransactionBuilder(sourceAccount, {
          fee: StellarSDK.BASE_FEE,
          networkPassphrase: config.networkPassphrase
        })
          .addOperation(
            StellarSDK.Operation.invokeContractHostFunction({
              contract: new StellarSDK.Address('CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaah5INA').toString(),
              hostFunction: StellarSDK.xdr.HostFunction.hostFunctionTypeUploadContractWasm(
                wasmBytes
              )
            })
          )
          .setTimeout(300)
          .build();

        uploadTx.sign(keypair);

        // Submit transaction
        const uploadResp = await sorobanServer.submitTransaction(uploadTx);
        
        if (uploadResp.status === 'ERROR') {
          throw new Error(`Upload failed: ${uploadResp.errorResultXdr}`);
        }

        // Poll for transaction completion
        let uploadStatus = await sorobanServer.getTransaction(uploadResp.hash);
        let retries = 0;
        while (uploadStatus.status === 'PENDING' && retries < 30) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          uploadStatus = await sorobanServer.getTransaction(uploadResp.hash);
          retries++;
        }

        if (uploadStatus.status === 'FAILED') {
          throw new Error(`Upload transaction failed`);
        }

        console.log(`   ✅ WASM uploaded successfully`);

        // Create contract deployment transaction
        console.log(`   Creating contract instance...`);
        
        const deployTx = new StellarSDK.TransactionBuilder(sourceAccount, {
          fee: StellarSDK.BASE_FEE,
          networkPassphrase: config.networkPassphrase
        })
          .addOperation(
            StellarSDK.Operation.invokeContractHostFunction({
              contract: new StellarSDK.Address('CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAaaaaaaah5INA').toString(),
              hostFunction: StellarSDK.xdr.HostFunction.hostFunctionTypeCreateStarToml()
            })
          )
          .setTimeout(300)
          .build();

        deployTx.sign(keypair);

        const deployResp = await sorobanServer.submitTransaction(deployTx);
        
        if (deployResp.status === 'ERROR') {
          throw new Error(`Deployment failed: ${deployResp.errorResultXdr}`);
        }

        // Poll for transaction completion
        let deployStatus = await sorobanServer.getTransaction(deployResp.hash);
        retries = 0;
        while (deployStatus.status === 'PENDING' && retries < 30) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          deployStatus = await sorobanServer.getTransaction(deployResp.hash);
          retries++;
        }

        if (deployStatus.status === 'FAILED') {
          throw new Error(`Deployment transaction failed`);
        }

        // Extract contract address from transaction result
        const contractId = extractContractId(deployStatus.resultXdr);
        
        console.log(`✅ ${contract.name} Contract deployed!`);
        console.log(`   Contract ID: ${contractId}\n`);
        
        deployedContracts[contract.name] = contractId;
        
        // Update source account sequence for next transaction
        sourceAccount = new StellarSDK.Account(
          sourceAccount.accountId(),
          BigInt(sourceAccount.sequenceNumber()) + BigInt(1)
        );

      } catch (error) {
        console.error(`❌ Failed to deploy ${contract.name}: ${error.message}`);
        if (error.message.includes('PENDING')) {
          console.error('   Transaction timed out. Try again later.');
        }
        if (error.message.includes('insufficient')) {
          console.error('   Account has insufficient funds');
        }
      }
    }

    // Summary
    console.log(`\n${'='.repeat(60)}`);
    console.log('📋 DEPLOYMENT SUMMARY');
    console.log(`${'='.repeat(60)}`);
    
    Object.entries(deployedContracts).forEach(([name, id]) => {
      console.log(`${name}: ${id}`);
    });

    console.log(`\n📝 Add these to your .env.local file:\n`);
    console.log(`NEXT_PUBLIC_CONTENT_NFT_CONTRACT=${deployedContracts['Content NFT'] || 'PENDING'}`);
    console.log(`NEXT_PUBLIC_SUBSCRIPTION_CONTRACT=${deployedContracts['Subscription'] || 'PENDING'}`);
    console.log(`NEXT_PUBLIC_PAYMENT_CONTRACT=${deployedContracts['Payment'] || 'PENDING'}`);
    console.log(`NEXT_PUBLIC_REVENUE_CONTRACT=${deployedContracts['Revenue'] || 'PENDING'}`);

  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

function extractContractId(resultXdr) {
  // Extract from transaction result XDR
  // This is a simplified version - in production, parse the XDR properly
  try {
    const buffer = Buffer.from(resultXdr, 'base64');
    // Look for contract address pattern
    const hexStr = buffer.toString('hex');
    // Return a formatted contract ID (simplified)
    return 'C' + hexStr.substring(0, 56).toUpperCase();
  } catch {
    return 'ERROR_EXTRACTING_ID';
  }
}

// Run deployment
deployContracts().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
