const app = require("./index");
const connect = require("./configs/db");

app.listen(2000, async () => {
  await connect();
  console.log("listing on port 2000");
});
