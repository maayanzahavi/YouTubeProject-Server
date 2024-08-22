const net = require("net");
const videoService = require('../services/video');

const getRecommendations = async (req, res) => {
  const userId = req.params.id;
  const videoId = req.params.pid;

  console.log("user: ", userId, "video: ", videoId);
  let recommendations = [];

  if (userId) {
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

    try {
      await new Promise((resolve, reject) => {
        client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, async () => {
          try {
            console.log("Connected to TCP server");

            // Send the watch information
            await sendAndReceive(`${userId}:${videoId}`);

            // Request recommendations from the C++ server
            const recommendationData = await sendAndReceive(`recommend:${userId}`);
            recommendations = recommendationData.split(','); // Assuming recommendations are comma-separated

            client.end(); // Close the TCP connection
            resolve(); // Resolve the promise to continue with the next steps
          } catch (err) {
            console.error("Error during communication with TCP server:", err);
            client.end(); // Close the connection in case of an error
            reject(err); // Reject the promise to handle the error
          }
        });

        client.on("error", (err) => {
          console.error("Error connecting to TCP server:", err);
          reject(err); // Handle connection error
        });
      });
    } catch (err) {
      // If an error occurred during communication or connection, send the error response
      return res.status(500).json({ error: "Error during communication with TCP server" });
    }
  }

  // Whether or not the user exists, filter the recommendations and send them to the client
  try {
    const finalRecommendations = await videoService.filterRecommendations(recommendations);
    console.log("Final recommendations: ", finalRecommendations);

    return res.status(200).json(finalRecommendations);
  } catch (error) {
    console.error("Error filtering recommendations:", error);
    return res.status(500).json({ error: "Error filtering recommendations" });
  }
};

module.exports = { getRecommendations };
