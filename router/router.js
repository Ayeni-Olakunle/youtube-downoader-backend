const express = require("express");
let router = express.Router();
const fs = require("fs");
const path = require("path");
const {
  instagram,
  tikdown,
  twitterdown,
  fbdown2,
  GDLink,
  ytdown,
  pintarest,
} = require("nayan-video-downloader");
// const {
//   instagram,
//   tikdown,
//   twitterdown,
//   fbdown2,
//   GDLink,
//   ytdown,
//   pintarest,
// } = require("nayan-media-downloader");

// router.route("/download/pinterest").get(async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).send("Please provide a valid YouTube URL");
//   }

//   try {
//     const video = await pintarest(url, {
//       format: "mp4",
//       quality: "quality",
//     });
//     res.status(200).json(video);
//     if (!video) {
//       return res.status(500).send("Video stream not available");
//     }
//   } catch (error) {
//     console.error("Error downloading video:", error);
//     res.status(500).send("Error downloading video");
//   }
// });

router.route("/download/google-drive").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await GDLink(url, {
      format: "mp4",
      quality: "quality",
    });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/facebook").get(async (req, res) => {
  const { url } = req.query;
  const key = "Nayan";

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await fbdown2(url, key, {
      format: "mp4",
      quality: "quality",
    });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/twitter").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await twitterdown(url, { format: "mp4", quality: "quality" });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/tiktok").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await tikdown(url, { format: "mp4", quality: "quality" });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/tiktok").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await tikdown(url, { format: "mp4", quality: "quality" });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/instagram").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await instagram(url, { format: "mp4", quality: "quality" });
    res.status(200).json(video);
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download/youtube").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await ytdown(url, { format: "mp4", quality: "quality" });

    const v360p = await fetch(video.data.video, { method: "HEAD" });
    const v720p = await fetch(video.data.video_hd, { method: "HEAD" });
    const adio = await fetch(video.data.audio, { method: "HEAD" });

    const contentLength = v360p.headers.get("content-length");
    const sizeInBytes = parseInt(contentLength, 10);
    const sizeInMB1 = (sizeInBytes / (1024 * 1024)).toFixed(2);

    const contentLength1 = v720p.headers.get("content-length");
    const sizeInBytes2 = parseInt(contentLength1, 10);
    const sizeInMB2 = (sizeInBytes2 / (1024 * 1024)).toFixed(2);

    const contentLength3 = adio.headers.get("content-length");
    const sizeInBytes3 = parseInt(contentLength3, 10);
    const sizeInMB3 = (sizeInBytes3 / (1024 * 1024)).toFixed(2);

    res.status(200).json({
      video: video,
      v360p: sizeInMB1,
      v720p: sizeInMB2,
      audio: sizeInMB3,
    });
    if (!video) {
      return res.status(500).send("Video stream not available");
    }
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download").get(async (req, res) => {
  try {
    const videoUrl = req.query.url;
    const name = req.query.name;
    const type = req.query.type;
    const response = await fetch(videoUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const videoBuffer = Buffer.from(arrayBuffer);

    // Set headers for the response
    res.setHeader("Content-Type", type);
    res.setHeader("Content-Disposition", `attachment; filename=${name}`);

    res.status(200).send(videoBuffer);
  } catch (error) {
    console.error("Error fetching or sending video:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the video." });
  }
});


  


  module.exports = router;