const net = require("net");
const videoService = require('../services/video');

const getRecommendations = async (req, res) => {
  const userId = req.params.id;
  const videoId = req.params.pid;

  // Prepare the message format as required by the C++ server
  const message = `${userId}:${videoId}`;

  let recommendations = [];

  if (userId != null) {
    const client = new net.Socket();

    const sendAndReceive = (msg) => {
      return new Promise((resolve, reject) => {
        client.write(`${msg}`);
        console.log("Sending: " + msg);

        client.once("data", (data) => {
          console.log(`Received data from TCP server: ${data.toString()}`);
          resolve(data.toString());
        });

        client.once("error", (err) => {
          reject(err);
        });
      });
    };

    client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, async () => {
      try {
        console.log("Connected to TCP server");

        // Send the watch information
        await sendAndReceive(message);

        // Request recommendations
        const recommendationData = await sendAndReceive(`recommend:${userId}`);
        recommendations = recommendationData.split(','); // Assuming recommendations are comma-separated

        client.end(); // Close connection after receiving recommendations
      } catch (err) {
        console.error("Error during communication with TCP server:", err);
        res.status(500).json({ error: "Error during communication with TCP server" });
        client.end(); // Ensure the client connection is closed on error
      }
    });

    client.on("end", () => {
      console.log("Disconnected from TCP server");
      // Return recommendations to the frontend
      res.status(200).json({ recommendations });
    });

    client.on("error", (err) => {
      console.error("Error connecting to TCP server:", err);
      res.status(500).json({ error: "Error connecting to TCP server" });
    });
  } 
  return videoService.filterRecommendations(recommendations);
};

module.exports = { getRecommendations };
