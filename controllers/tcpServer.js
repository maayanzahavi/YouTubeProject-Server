const net = require("net");

const sendWatchInfo = async (req, res) => {
  const userId = req.body.userId;
  const videoId = req.body.videoId;

  // Prepare the message format as required by the C++ server
  const message = `user_${userId} watched video_${videoId}`;

  let recommendations = [];
  const client = new net.Socket();

  client.connect(process.env.TCP_SERVER_PORT, process.env.TCP_SERVER_IP, () => {
    console.log("Connected to TCP server");

    // Send the watch information
    sendAndReceive(message).then(() => {
      // After sending the watch info, request recommendations
      return sendAndReceive("recommend");
    }).then(() => {
      client.end();  // Close connection after receiving recommendations
    });
  });

  const sendAndReceive = (msg) => {
    return new Promise((resolve) => {
      client.write(`${msg}`);
      console.log("Sending: " + msg);

      client.once("data", (data) => {
        console.log(`Received data from TCP server: ${data.toString()}`);

        // If the message is a recommendation, store it
        if (msg === "recommend") {
          recommendations = data.toString().split(',');  // Assuming recommendations are comma-separated
        }

        resolve();
      });
    });
  };

  client.on("end", () => {
    console.log("Disconnected from TCP server");
    // Return recommendations to the frontend
    res.status(200).json({ recommendations });
  });

  client.on("error", (err) => {
    console.error("Error connecting to TCP server:", err);
    res.status(500).json({ error: "Error connecting to TCP server" });
  });
};

module.exports = { sendWatchInfo };
