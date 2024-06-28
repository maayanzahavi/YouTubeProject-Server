const viewService = require('../services/view');

const updateViews = async (req, res) => {
    const id = req.params.pid;
    const updatedVideo = await viewService.updateViews(id);
    if (updatedVideo) {
      return res.status(200).json(updatedVideo);
    } else {
      return res.status(200).json({ error: "Failed to update views" });
    }
  };
  
module.exports = { updateViews };