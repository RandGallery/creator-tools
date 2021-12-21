const algosdk = require("algosdk");

const { accounts } = require("./accounts");
const { client } = require("./client");

(async () => {
  // Get args from command line.
  const { assetIds, to } = require("minimist")(process.argv.slice(2));
  if (to?.length !== 58) {
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
  const toAccount = accounts[to];
  if (!toAccount) {
    console.error(
      `Please add a passphrase for ${to} to the passphrases.json file`
    );
    process.exit(1);
  }

  // Get "to" account details.
  const toAccountInfo = await client.accountInformation(to).do();
  const addedAssets = new Set(
    toAccountInfo.assets.map((asset) => asset["asset-id"])
  );

  // Choose asset IDs.
  const unfilteredAssetIdsToAdd = String(assetIds)
    .trim()
    .split(",")
    .map((assetId) => +assetId.trim());
  const assetIdsToAdd = unfilteredAssetIdsToAdd.filter(
    (assetId) => !addedAssets.has(assetId)
  );
  const redundantAssetIds =
    unfilteredAssetIdsToAdd.length - assetIdsToAdd.length;
  if (redundantAssetIds > 0) {
    console.log(`${redundantAssetIds} of those Asset IDs are already added`);
  }
  if (assetIdsToAdd.length < 1) {
    console.error(`Please define some Asset IDs to add`);
    process.exit(1);
  }

  // Get suggested parameters.
  const suggestedParams = await client.getTransactionParams().do();

  // Add ASAs.
  for (const assetId of assetIdsToAdd) {
    // Create transaction.
    const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      suggestedParams,

      assetIndex: assetId,

      from: to,
      to,

      amount: 0,
    });

    // Sign the transaction
    const signedTxn = txn.signTxn(toAccount.sk);

    // Send transaction!
    console.log(`Adding ${assetId} to ${to}`);
    const result = await client.sendRawTransaction(signedTxn).do();
    console.log(result);
  }

  console.log("All done!");
  process.exit(0);
})();
