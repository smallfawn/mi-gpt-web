const config = require("./.migpt.js");
const { MiGPT } = require("mi-gpt")

async function main() {
  const client = MiGPT.create(config);
  await client.start();
}

main();