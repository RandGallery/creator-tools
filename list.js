const ncp = require("copy-paste");

const { client } = require("./client");

(async () => {
  // Get args from command line.
  const { from } = require("minimist")(process.argv.slice(2));
  if (from?.length !== 58) {
    console.error("--from should be an Algorand address");
    process.exit(1);
  }

  // Get "from" account details.
  const fromAccountInfo = await client.accountInformation(from).do();
  const assetIds = fromAccountInfo.assets
    .filter((asset) => asset.amount >= 1)
    .map((asset) => asset["asset-id"]);

  ncp.copy(assetIds.join(","));
  console.log(`Copied ${assetIds.length} Asset IDs to the clipboard`);
})();
