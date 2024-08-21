const net = require("net");

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
  return filterRecommendations;
};

const filterRecommendations = (recommendations, allVideos) => {
  // Step 1: If the recommendations array has more than 10 videos, keep the 10 most viewed
  if (recommendations.length > 10) {
    // Sort the recommendations array by views in descending order
    recommendations.sort((a, b) => b.views - a.views);

    // Keep only the top 10 most viewed videos
    recommendations = recommendations.slice(0, 10);
  }

  // Step 2: If the recommendations array has fewer than 6 videos, add random videos
  if (recommendations.length < 6) {
    // Get the list of video IDs already in recommendations to avoid duplicates
    const recommendedVideoIds = new Set(recommendations.map(video => video.id));

    // Find videos that are not already in recommendations
    const availableVideos = allVideos.filter(video => !recommendedVideoIds.has(video.id));

    // Shuffle the availableVideos array to randomize the selection
    for (let i = availableVideos.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availableVideos[i], availableVideos[j]] = [availableVideos[j], availableVideos[i]];
    }

    // Add random videos from the available pool until we have at least 6 videos in recommendations
    while (recommendations.length < 6 && availableVideos.length > 0) {
      recommendations.push(availableVideos.pop());
    }
  }

  return recommendations;
};

module.exports = { getRecommendations };
