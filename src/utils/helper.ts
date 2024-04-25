import fs from "fs";
import { join } from "path";
import { spawn } from "child_process";
export const __dirPath = __dirname.substring(
  0,
  __dirname.indexOf("src\\utils")
);

export const getPublicPath = (...paths: string[]) =>
  join(__dirPath, "public", ...paths);

export const createDirIfNotExists = (...paths: string[]) => {
  const path = getPublicPath(...paths);

  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
};

export const checkRTSPUrl = (url: string) => {
  return new Promise((resolve, reject) => {
    // Spawn a process to execute an RTSP client (like ffprobe) to check if the URL is reachable
    const rtspProcess = spawn("ffprobe", [
      "-rtsp_transport",
      "tcp",
      "-timeout",
      "5000000",
      "-i",
      url,
    ]);

    // Listen for process exit event
    rtspProcess.on("exit", (code, signal) => {
      if (code === 0) {
        resolve(true); // URL is reachable
      } else {
        resolve(false); // URL is not reachable
      }
    });

    // Listen for process error event
    rtspProcess.on("error", (err) => {
      console.error("Error executing RTSP client:", err);
      reject(false);
    });
  });
};

export const createStreamVideo2 = async (rtspUrl: string, output: string) => {
  const options2 = [
    "-v",
    "verbose",
    "-i",
    rtspUrl,

    "-vf",
    "scale=1920:1080",
    "-vcodec",
    "libx264",
    "-preset",
    "ultrafast", // Use ultrafast preset for fastest encoding
    "-r",
    "25",
    "-b:v",
    "100k", // Adjust the bitrate as needed
    "-crf",
    "31",
    "-acodec",
    "aac",
    "-sc_threshold",
    "0",
    "-f",
    "hls",
    "-hls_time",
    "1",
    "-segment_time",
    "1",
    "-hls_list_size",
    "1",
    `public/${output}`,
  ];
  const ffmpegProcess = spawn(`ffmpeg`, options2);

  ffmpegProcess.stdout.on("data", (data: any) => {
    console.log("stdout image =>>>>>>>>>>", data);
  });

  ffmpegProcess.stderr.on("data", (data: any) => {
    console.log(`data from stderr =>>>>>>>>>> ${data}`);
  });

  ffmpegProcess.on("error", (data: any) => {
    ffmpegProcess.kill();
    return {
      pid: ffmpegProcess.pid,
      success: false,
      streamUrl: `http://localhost:8010/${output}`,
    };
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });

  return {
    success: true,
    pid: ffmpegProcess.pid,
    streamUrl: `http://localhost:8010/${output}`,
  };
};

export const createStreamVideo = async (rtspUrl: string, output: string) => {
  // Set the video output path
  const videoOutputPath = `public/${output}`;

  // Duration of each segment in seconds
  const segmentDuration = 3;

  // Number of segments to keep before starting over
  const segmentWrap = 8;

  // Interval for sending images to the API in seconds
  const imageSendInterval = 5;

  // Options for ffmpeg command
  const options = [
    "-v",
    "verbose",
    "-i",
    rtspUrl,
    "-vf",
    "scale=1920:1080",
    "-vcodec",
    "libx264",
    "-preset",
    "ultrafast",
    "-r",
    "25",
    "-b:v",
    "100k",
    "-crf",
    "31",
    "-acodec",
    "aac",
    "-sc_threshold",
    "0",
    "-f",
    "hls",
    "-hls_time",
    segmentDuration.toString(), // Duration of each segment
    "-segment_time",
    segmentDuration.toString(), // Duration of each segment
    "-segment_wrap",
    segmentWrap.toString(), // Number of segments to keep before starting over
    videoOutputPath, // Set the video output path
  ];

  const ffmpegProcess = spawn(`ffmpeg`, options);

  let lastImageSentTime = 0;

  ffmpegProcess.stdout.on("data", async (data: Buffer) => {
    const currentTime = new Date().getTime() / 1000;

    console.log("--------->", data);
    // if (currentTime - lastImageSentTime >= imageSendInterval) {
    //   console.log("--------->send image");

    //   // const imageBuffer = Buffer.from(data, "binary");
    //   // try {
    //   //   const response = await axios.post(
    //   //     "https://example.com/api/image",
    //   //     imageBuffer,
    //   //     {
    //   //       headers: {
    //   //         "Content-Type": "image/jpeg",
    //   //         Authorization: "Bearer YOUR_ACCESS_TOKEN",
    //   //       },
    //   //     }
    //   //   );
    //   //   console.log("Image sent successfully:", response.data);
    //   //   lastImageSentTime = currentTime; // تحديث الوقت الأخير الذي تم فيه إرسال الصورة
    //   // } catch (error) {
    //   //   console.error("Failed to send image:", error);
    //   // }
    // }
  });

  ffmpegProcess.stderr.on("data", (data: any) => {
    // var imageName = "image_" + Date.now() + "_.jpg";
    // fs.writeFileSync(imageName, data);
    console.log("stderr errors ", data);

    // const currentTime = new Date().getTime() / 1000;
    // // if (currentTime - lastImageSentTime >= imageSendInterval) {
    // //   const imageBuffer = Buffer.from(data, "binary");
    // //   fs.writeFile("./image_test.jpg", data, (err) => {
    // //     if (err) {
    // //       console.error("Error writing image:", err);
    // //       return;
    // //     }
    // //   });
    //   console.log("--------->send image", imageBuffer);
    //   lastImageSentTime = currentTime;
    //}
    // console.log(imageBuffer);
    //console.error(`stderr: ${data}`);
  });

  ffmpegProcess.on("error", (err: any) => {
    console.error(`error: ${err.message}`);
  });

  ffmpegProcess.on("close", (code: number) => {
    console.log(`child process exited with code ${code}`);
  });

  return {
    success: true,
    pid: ffmpegProcess.pid,
    streamUrl: `http://localhost:8010/${output}`,
  };
};

export const findAndKillProcess = async (pid: number) => {
  const processExists = await process.kill(pid, 0);
  if (processExists) {
    await process.kill(pid, "SIGTERM");
  }

  return true;
};
