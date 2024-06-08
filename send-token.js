const web3 = require('@solana/web3.js');
let {
    PublicKey
} = require("@solana/web3.js");
let {
    TOKEN_PROGRAM_ID,
    getMint,
    createMint
} = require("@solana/spl-token");

const spl = require('@solana/spl-token');
const {
    publicKey
} = require('@project-serum/anchor/dist/cjs/utils');

const bs58 = require('bs58')

var wallet = web3.Keypair.generate();
console.log("public key...", wallet.publicKey);
console.log("secret key...", wallet.secretKey);

const address = bs58.encode(wallet.secretKey);

// console.log(address);

let pkey = '5k5M3j1uQh9MPq1YbbYHK2ERpVvxVGkcJ3UfGMtQezwqFxUokvVGo6n1QSQ5stB2dsGDeauTFv8PjTyhX7y2WhZX';

let {
    Keypair
} = require('@solana/web3.js');


function base58ToKeypair(base58PrivateKey) {
    try {
        const privateKeyBuffer = bs58.decode(base58PrivateKey);
        return Keypair.fromSecretKey(privateKeyBuffer);
    } catch (error) {
        throw new Error("Invalid base58 private key.");
    }
}

// Example usage
const base58PrivateKey = pkey; // Replace with actual base58 private key
const keypair = base58ToKeypair(base58PrivateKey);
console.log(`Public Key: ${keypair.publicKey.toBase58()}`); //prints the base58-encoded public key
// console.log(keypair);

let recipientPublicKey = '3r99drMEtrFk2TtsrBcBSVKzDA5bhinwyysyrKXhauv2';
// const mintAddress = new web3.PublicKey(recipientPublicKey);
const mintAddress = new web3.PublicKey('Aa4G2EhDfGrxHAkNTCtGXergg1JG3EVwNu4KtNMmVybt');




(async () => {
    // Connect to cluster
    //  const connection = new web3.Connection(web3.clusterApiUrl('devnet'), 'confirmed');
    const connection = new web3.Connection('https://api.mainnet-beta.solana.com');

    // connect to a previously generated wallet

    const myKeypair = keypair;
    const fromWallet = myKeypair;


    // Generate a new wallet to receive newly minted token
    const walletTo = recipientPublicKey;
    const destPublicKey = new web3.PublicKey(walletTo);
    const destMint = mintAddress;
    const tokenM = new web3.PublicKey(destMint)
    //console.log(toWallet.publicKey)
    // Create new token mint


    // Get the token account of the fromWallet address, and if it does not exist, create it
    const fromTokenAccount = await spl.getOrCreateAssociatedTokenAccount(
        connection,
        fromWallet,
        tokenM,
        fromWallet.publicKey
    );



    // Get the token account of the toWallet address, and if it does not exist, create it
    const toTokenAccount = await spl.getOrCreateAssociatedTokenAccount(connection, fromWallet, tokenM, destPublicKey);






    // Mint 1 new token to the "fromTokenAccount" account we just created
    let signature = await spl.mintTo(
        connection,
        fromWallet,
        destMint,
        fromTokenAccount.address,
        fromWallet.publicKey,
        1 * web3.LAMPORTS_PER_SOL
    );
    console.log('mint tx:', signature);

    // Transfer the new token to the "toTokenAccount" we just created
    signature = await spl.transfer(
        connection,
        fromWallet,
        fromTokenAccount.address,
        toTokenAccount.address,
        fromWallet.publicKey,
        1 * web3.LAMPORTS_PER_SOL
    );
})();