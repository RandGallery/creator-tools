const algosdk = require("algosdk");

const { accounts } = require("./accounts");
const { client } = require("./client");

(async () => {
  // Get args from command line.
  const { from, to, assetIds } = require("minimist")(process.argv.slice(2));
  if (!from || from.length !== 58) {
    console.error("--from should be an Algorand address");
    process.exit(1);
  }
  if (!to || to.length !== 58) {
    console.error("--to should be an Algorand address");
    process.exit(1);
  }
  if (!assetIds || assetIds.length < 0) {
    console.error(
      "--assetIds should be a list of Asset IDs divided by commas (ex: 123,456)"
    );
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
  const sendableAssets = new Set(
    fromAccountInfo.assets
      .filter((asset) => asset.amount >= 1)
      .map((asset) => asset["asset-id"])
  );

  // Choose asset IDs.
  const assetIdsToSend = String(assetIds)
    .trim()
    .split(",")
    .map((assetId) => +assetId.trim())
    .filter((assetId) => sendableAssets.has(assetId));
  if (assetIdsToSend.length < 1) {
    console.error(`None of those Asset IDs are in ${from}`);
    process.exit(1);
  }

  // Get suggested parameters.
  const suggestedParams = await client.getTransactionParams().do();

  // Add ASAs.
  for (const assetId of assetIdsToSend) {
    // Create transaction.
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams,

      assetIndex: assetId,

      from,
      to,

      amount: 1,
    });

    // Sign the transaction
    const signedTxn = txn.signTxn(fromAccount.sk);

    // Send transaction!
    console.log(`Sending ${assetId} from ${from} to ${to}`);
    const result = await client.sendRawTransaction(signedTxn).do();
    console.log(result);
  }
})();
