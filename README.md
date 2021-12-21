# Creator Tools

This repository provides helpful scripts for Algo NFT creators.

These scripts come with no warranty whatsoever, so please use them responsibly. Run things on the testnet first, until you're comfortable with the scripts.

@algokittens' [algoNFTs repository](https://github.com/algokittens/algoNFTs) inspired this one, so definitely check it out, especially if you prefer Python over Nodejs!

Also, please read up on Algorand Standard Assets (ASAs), so you can understand things like minimum balance increases and transaction fees: https://developer.algorand.org/docs/features/asa/

## Add NFTs

`node add.js --to SOMEADDRESS --assetIds 123,456`

This script adds NFTs to an account. This allows the account to receive the NFTs from another account later.

## Send NFTs

`node send.js --from SOMEADDRESS --to SOMEOTHERADDRESS --assetIds 123,456`

This script sends NFTs from one account to another.

## Collect Garbage

`node collect-garbage.js --from SOMEADDRESS`

This script opts an account out of NFTs it holds none of.
