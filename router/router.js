const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");
// const ytdl = require("@distube/ytdl-core");
// const ytdl = require("ytdl-core");
const ytdl = require('@distube/ytdl-core');
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const HttpsProxyAgent = require("https-proxy-agent");
const proxy = "http://168.63.76.32:3128";
const { exec } = require('child_process');
const youtubedl = require('youtube-dl-exec').raw;

const { ytdown } = require('nayan-media-downloader');

ffmpeg.setFfmpegPath(ffmpegPath);


router.route("/download").get(async (req, res) => {
    const { url } = req.query;  // URL of the YouTube video
  if (!url) {
    return res.status(400).send('Please provide a valid YouTube URL');
  }

  try {
    // Call the correct method to download the video
    const video = await ytdown(url, { format: 'mp4', quality: 'highest' });
    console.log('Downloaded video object:', video);  // Log the video object to inspect it
    
    res.status(200).json(video)

    if (!video || !video.stream) {
      return res.status(500).send('Video stream not available');
    }

    // Set the file path for storing the downloaded video
    const videoFilePath = path.join(__dirname, 'downloads', `${video.title}.mp4`);

    // Create the 'downloads' directory if it doesn't exist
    if (!fs.existsSync(path.dirname(videoFilePath))) {
      fs.mkdirSync(path.dirname(videoFilePath), { recursive: true });
    }

    // Save the video stream to a file
    const writeStream = fs.createWriteStream(videoFilePath);
    video.stream.pipe(writeStream);

    // writeStream.on('finish', () => {
    //   res.status(200).json({
    //     message: 'Download complete!',
    //     videoFilePath: videoFilePath
    //   });
    // });

    res.status(200).json(video)

    writeStream.on('error', (err) => {
      console.error('Error during file write:', err);
      res.status(500).send('Error saving video');
    });

  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).send('Error downloading video');
  }
  })




// router.route("/info").get(async (req, res) => {
//   try {
//     if (!ytdl.validateURL(req.query.link)) {
//       return res.status(400).json({ error: "Invalid YouTube URL" });
//     }

//     ytdl
//       .getInfo(req.query.link, options)
//       .then((info) => {
//         return res.status(200).json({
//           videoName: info.videoDetails.title,
//           videoFormat: info.formats,
//         });
//       })
//       .catch((err) => {
//         console.error(err);
//       });
//   } catch (error) {
//     if (error.statusCode === 410) {
//       res.status(410).json({ error: 'The requested video is no longer available.' });
//     } else {
//       console.error('An error occurred:', error);
//       res.status(500).json({ error: 'An error occurred while processing your request.' });
//     }
//   }
// });

// router.route("/download").get(async (req, res) => {
//   try {
//     const videoURL = req.query.link;
//     const videoQuailty = req.query.videoQ;
//     const audioQuailty = req.query.audioQ;

    
//     if (!ytdl.validateURL(videoURL)) {
//       return res.status(400).json({ error: "Invalid YouTube URL" });
//     }

//     const info = await ytdl.getInfo(videoURL, options);
//     const videoFormat = ytdl.chooseFormat(info.formats, {
//       quality: videoQuailty,
//     });
//     const audioFormat = ytdl.chooseFormat(info.formats, {
//       quality: audioQuailty,
//     });

//     if (!videoFormat || !audioFormat) {
//       return res
//         .status(500)
//         .json({ error: "Video or audio format not available" });
//     }

//     const videoFile = path.join(__dirname, "temp_video.mp4");
//     const audioFile = path.join(__dirname, "temp_audio.mp4");
//     const outputFilePath = path.join(
//       __dirname,
//       `${info.videoDetails.title}.mp4`
//     );

//     const videoStream = ytdl.downloadFromInfo(info, { format: videoFormat });
//     const audioStream = ytdl.downloadFromInfo(info, { format: audioFormat });

//     const videoPromise = new Promise((resolve, reject) => {
//       const outputStream = fs.createWriteStream(videoFile);
//       videoStream.pipe(outputStream);
//       outputStream.on("finish", resolve);
//       outputStream.on("error", reject);
//     });

//     const audioPromise = new Promise((resolve, reject) => {
//       const outputStream = fs.createWriteStream(audioFile);
//       audioStream.pipe(outputStream);
//       outputStream.on("finish", resolve);
//       outputStream.on("error", reject);
//     });

//     await Promise.all([videoPromise, audioPromise]);

//     ffmpeg()
//       .input(videoFile)
//       .input(audioFile)
//       .on("start", () => console.log("Starting ffmpeg process..."))
//       .on("error", (err) => {
//         console.error("ffmpeg error:", err.message);
//         res.status(500).json({ error: "Failed to process video" });
//       })
//       .on("end", () => {
//         console.log("File created successfully");
//         res.download(outputFilePath, (err) => {
//           if (err) console.error("Download error:", err);

//           fs.unlinkSync(videoFile);
//           fs.unlinkSync(audioFile);
//           fs.unlinkSync(outputFilePath);
//         });
//       })
//       .save(outputFilePath);
//   } catch (err) {
//     console.error("Download processing error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

  


  module.exports = router;