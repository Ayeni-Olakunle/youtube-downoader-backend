const express = require("express");
let router = express.Router();
const fs = require("fs");
const axios = require("axios");
const path = require("path");
// const fetch = require("node-fetch");
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

// router.route("/download/youtube").get(async (req, res) => {
//   const { url } = req.query;

//   if (!url) {
//     return res.status(400).send("Please provide a valid YouTube URL");
//   }

//   try {
//     const video = await ytdown(url, { format: "mp4", quality: "quality" });

//     const v360p = await fetch(video.data.video, { method: "HEAD" });
//     const v720p = await fetch(video.data.video_hd, { method: "HEAD" });
//     const adio = await fetch(video.data.audio, { method: "HEAD" });

//     const contentLength = v360p.headers.get("content-length");
//     const contentLength1 = v720p.headers.get("content-length");
//     const contentLength3 = adio.headers.get("content-length");

//     res.status(200).json({
//       video: video,
//       v360p: (parseInt(contentLength, 10) / (1024 * 1024)).toFixed(2),
//       v720p: (parseInt(contentLength1, 10) / (1024 * 1024)).toFixed(2),
//       audio: (parseInt(contentLength3, 10) / (1024 * 1024)).toFixed(2),
//     });
//     if (!video) {
//       return res.status(500).send("Video stream not available");
//     }
//   } catch (error) {
//     console.error("Error downloading video:", error);
//     res.status(500).send("Error downloading video");
//   }
// });

router.route("/download/youtube").get(async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send("Please provide a valid YouTube URL");
  }

  try {
    const video = await ytdown(url, { format: "mp4", quality: "quality" });

    const fetchWithDiagnostics = async (url) => {
      const response = await fetch(url, { method: "HEAD" });
      console.log("Headers for:", url, [...response.headers]);
      const contentLength = response.headers.get("content-length");
      return contentLength ? parseInt(contentLength, 10) : 0;
    };

    const v360pSize = await fetchWithDiagnostics(video.data.video);
    const v720pSize = await fetchWithDiagnostics(video.data.video_hd);
    const audioSize = await fetchWithDiagnostics(video.data.audio);

    res.status(200).json({
      video,
      v360p: (v360pSize / (1024 * 1024)).toFixed(2),
      v720p: (v720pSize / (1024 * 1024)).toFixed(2),
      audio: (audioSize / (1024 * 1024)).toFixed(2),
    });
  } catch (error) {
    console.error("Error downloading video:", error);
    res.status(500).send("Error downloading video");
  }
});

router.route("/download").get(async (req, res) => {
  const videoUrl = req.query.url;
  const fileName = "sample.mp4"; // Name of the file for download

  try {
    // Fetch the video stream from the URL
    const response = await axios({
      url: videoUrl,
      method: "GET",
      responseType: "stream",
    });

    // Set headers to prompt download
    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "video/mp4");

    // Pipe the video stream to the client
    response.data.pipe(res);

    // Handle stream end
    response.data.on("end", () => {
      console.log("Video download completed.");
    });

    // Handle errors during streaming
    response.data.on("error", (err) => {
      console.error("Error while downloading the video:", err);
      res.status(500).send("Error occurred while downloading the video.");
    });
  } catch (error) {
    console.error("Error fetching or sending video:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the video." });
  }
});


  


  module.exports = router;