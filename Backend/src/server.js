const app = require("./app");
const setupSocket = require("./config/socket");
const connectDB = require("./config/db");
connectDB();
const http = require("http");
const server = http.createServer(app);
setupSocket(server);
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
