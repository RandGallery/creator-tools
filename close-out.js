const algosdk = require("algosdk");

const { accounts } = require("./accounts");
const { client } = require("./client");

(async () => {
  // Get args from command line.
  const { from, to } = require("minimist")(process.argv.slice(2));
  if (!from || from.length !== 58) {
    console.error("--from should be an Algorand address");
    process.exit(1);
  }
  if (!to || to.length !== 58) {
    console.error("--to should be an Algorand address");
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

  // Get suggested parameters.
  const suggestedParams = await client.getTransactionParams().do();

  // Remove ASAs.
  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    suggestedParams,

    from,
    to: to,

    amount: 0,

    closeRemainderTo: to,
  });

  // Send transaction!
  const blob = txn.signTxn(fromAccount.sk);
  await client.sendRawTransaction(blob).do();
  console.log(`Closed out ${from} to ${to}`);
})();
