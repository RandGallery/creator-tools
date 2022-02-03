const algosdk = require("algosdk");

const { accounts } = require("./accounts");
const { client } = require("./client");

(async () => {
  // Get args from command line.
  const { from } = require("minimist")(process.argv.slice(2));
  if (!from || from.length !== 58) {
    console.error("--from should be an Algorand address");
    process.exit(1);
  }

  // Get "from" account.
  const fromAccount = accounts[from];
  if (!fromAccount) {
    console.error(
      `Please add a passphrase for ${from} to the passphrases.json file`
    );
    process.exit(1);
  }

  // Get "from" account details.
  const fromAccountInfo = await client.accountInformation(from).do();
  const assetsToRemove = fromAccountInfo.assets
    .filter((asset) => asset.amount === 0 && asset.creator !== from)
    .map((asset) => ({ assetId: asset["asset-id"], creator: asset.creator }));
  if (assetsToRemove.length < 1) {
    console.error(`No garbage to collect from ${from}`);
    process.exit(1);
  }

  // Get suggested parameters.
  const suggestedParams = await client.getTransactionParams().do();

  // Remove ASAs.
  for (const asset of assetsToRemove) {
    // Create transaction.
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams,

      assetIndex: asset.assetId,

      from,
      to: from,

      amount: 0,

      closeRemainderTo: from,
    });

    // Sign the transaction
    const signedTxn = txn.signTxn(fromAccount.sk);

    // Send transaction!
    console.log(`Remove ${asset.assetId} from ${from}`);
    const result = await client.sendRawTransaction(signedTxn).do();
    console.log(result);
  }
})();
