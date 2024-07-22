import * as http from "node:http";

import { app } from "../app";

export async function main() {
  const server = http.createServer(app());

  server.listen(3000, () => {
    console.log("listening at port 3000");
  });
}

main().catch(console.error);
