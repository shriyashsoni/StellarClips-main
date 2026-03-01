#!/usr/bin/env node

const { spawnSync } = require('node:child_process')
const path = require('node:path')

const network = process.argv[2] || 'testnet'
const source = process.argv[3] || process.env.SOROBAN_SOURCE

if (!source) {
  console.error('❌ Missing source account/secret')
  console.error('Usage: node deploy-with-nodejs.js <network> <source_account_or_secret>')
  console.error('   or: SOROBAN_SOURCE=<source_account_or_secret> node deploy-with-nodejs.js <network>')
  process.exit(1)
}

const scriptPath = path.join(__dirname, 'deploy.sh')

console.log('ℹ️ Using maintained Soroban CLI deployment flow via deploy.sh')
const result = spawnSync('bash', [scriptPath, network, source], {
  stdio: 'inherit',
  shell: false,
})

if (result.error) {
  console.error(`❌ Failed to run deploy.sh: ${result.error.message}`)
  process.exit(1)
}

process.exit(result.status ?? 1)
