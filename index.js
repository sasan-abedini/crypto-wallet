const { ethers } = require("ethers");

// لیستی از شبکه‌های EVM که می‌خواهید پشتیبانی کنید
const networks = [
    { name: "Ethereum Mainnet", rpc: "https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID", chainId: 1 },
    { name: "Binance Smart Chain", rpc: "https://bsc-dataseed.binance.org/", chainId: 56 },
    { name: "Polygon", rpc: "https://polygon-rpc.com/", chainId: 137 },
    { name: "Avalanche", rpc: "https://api.avax.network/ext/bc/C/rpc", chainId: 43114 },
    { name: "Fantom", rpc: "https://rpcapi.fantom.network", chainId: 250 },
    { name: "Arbitrum", rpc: "https://arb1.arbitrum.io/rpc", chainId: 42161 },
    { name: "Optimism", rpc: "https://mainnet.optimism.io", chainId: 10 },
    { name: "Cronos", rpc: "https://evm-cronos.crypto.org", chainId: 25 },
    { name: "Harmony", rpc: "https://api.harmony.one", chainId: 1666600000 },
    { name: "Celo", rpc: "https://forno.celo.org", chainId: 42220 }
];

// ایجاد کیف پول جدید یا استفاده از کیف پول موجود با کلید خصوصی
const wallet = ethers.Wallet.createRandom(); // برای ایجاد کیف پول جدید
// const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY'); // برای استفاده از کیف پول موجود

console.log(`Address: ${wallet.address}`);
console.log(`Private Key: ${wallet.privateKey}`);

// تابعی برای دریافت موجودی در شبکه‌های مختلف
async function getBalance(wallet, network) {
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    const balance = await provider.getBalance(wallet.address);
    return ethers.utils.formatEther(balance);
}

// تابعی برای انتقال ارز دیجیتال
async function sendTransaction(wallet, network, to, amount) {
    const provider = new ethers.providers.JsonRpcProvider(network.rpc);
    const walletWithProvider = wallet.connect(provider);
    const tx = {
        to: to,
        value: ethers.utils.parseEther(amount),
        gasPrice: await provider.getGasPrice(),
        gasLimit: ethers.utils.hexlify(21000) // حداقل گس برای انتقال ساده
    };

    const transaction = await walletWithProvider.sendTransaction(tx);
    await transaction.wait();
    return transaction;
}

async function main() {
    // بررسی موجودی در هر شبکه
    for (const network of networks) {
        const balance = await getBalance(wallet, network);
        console.log(`${network.name}: ${balance} ETH`);
    }

    // انتقال ارز دیجیتال در شبکه Ethereum Mainnet به عنوان نمونه
    const targetNetwork = networks[0]; // Ethereum Mainnet
    const toAddress = 'RECIPIENT_ADDRESS';
    const amount = '0.01'; // مقدار انتقال به اتریوم

    try {
        const tx = await sendTransaction(wallet, targetNetwork, toAddress, amount);
        console.log(`Transaction Hash: ${tx.hash}`);
    } catch (error) {
        console.error(`Failed to send transaction: ${error}`);
    }
}

main().catch(console.error);
