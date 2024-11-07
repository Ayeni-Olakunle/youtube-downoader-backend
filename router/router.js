const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");
const ytdl = require("@distube/ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");

ffmpeg.setFfmpegPath(ffmpegPath);



  router.route("/info").get(async (req, res) => {

    try{
        if (!ytdl.validateURL(req.query.link)) {
            return res.status(400).json({ error: 'Invalid YouTube URL' });
          }

          ytdl.getInfo(req.query.link).then(info => {
            return res.status(200).json({
                videoName: info.videoDetails.title,
                videoFormat: info.formats,
              })
          }).catch((err) => {
            console.error(err);
          });
    } catch {
        console.log("Something went wrong");
    }
  })
  
  router.route("/download").get(async (req, res) => {
  try {
    const videoURL = req.query.link;

    // Validate URL
    if (!ytdl.validateURL(videoURL)) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const info = await ytdl.getInfo(videoURL);
    const videoFormat = ytdl.chooseFormat(info.formats, { quality: "248" });
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: "140" });

    if (!videoFormat || !audioFormat) {
      return res.status(500).json({ error: "Video or audio format not available" });
    }

    const videoFile = path.join(__dirname, "temp_video.mp4");
    const audioFile = path.join(__dirname, "temp_audio.mp4");
    const outputFilePath = path.join(__dirname, `${info.videoDetails.title}.mp4`);

    // Download video and audio separately
    const videoStream = ytdl.downloadFromInfo(info, { format: videoFormat });
    const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });

    const videoPromise = new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream(videoFile);
      videoStream.pipe(outputStream);
      outputStream.on("finish", resolve);
      outputStream.on("error", reject);
    });

    const audioPromise = new Promise((resolve, reject) => {
      const outputStream = fs.createWriteStream(audioFile);
      audioStream.pipe(outputStream);
      outputStream.on("finish", resolve);
      outputStream.on("error", reject);
    });

    // Wait until both downloads are complete
    await Promise.all([videoPromise, audioPromise]);

    // Merge video and audio with ffmpeg
    ffmpeg()
      .input(videoFile)
      .input(audioFile)
      .on("start", () => console.log("Starting ffmpeg process..."))
      .on("error", (err) => {
        console.error("ffmpeg error:", err.message);
        res.status(500).json({ error: "Failed to process video" });
      })
      .on("end", () => {
        console.log("File created successfully");
        res.download(outputFilePath, (err) => {
          if (err) console.error("Download error:", err);

          // Clean up temporary files after download
          fs.unlinkSync(videoFile);
          fs.unlinkSync(audioFile);
          fs.unlinkSync(outputFilePath);
        });
      })
      .save(outputFilePath);
  } catch (err) {
    console.error("Download processing error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

  


  module.exports = router;