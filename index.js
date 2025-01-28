require('dotenv').config(); // Load environment variables from .env
const { PvRecorder } = require("@picovoice/pvrecorder-node");

const { Porcupine } = require('@picovoice/porcupine-node');
// Paths to your .ppn and .pv files
const keywordFilePath = './porcupine/Trống-Cơm_vn_mac_v3_0_0.ppn'; // Replace with your .ppn file path
const porcupineModelFilePath = './porcupine/porcupine_params_vn.pv'; // Replace with your .pv file path
// Get the access key from the environment variable
const accessKey = process.env.PORCUPINE_ACCESS_KEY;

let isInterrupted = false;

async function micDemo() {
  // Initialize Porcupine
  let porcupine = new Porcupine(
    accessKey,
    [keywordFilePath],
    [0.5],
    porcupineModelFilePath
  );

  const frameLength = porcupine.frameLength;

  const recorder = new PvRecorder(frameLength, 0);
  recorder.start();
  console.log(`Start Listening...`);
  while (!isInterrupted) {
    const pcm = await recorder.read();
    let index = porcupine.process(pcm);
    if (index !== -1) {
      console.log(`Detected Trong Com`);
    }
  }

  console.log("Stopping...");
  recorder.release();
}
// Clean up on exit
process.on("SIGINT", function () {
  isInterrupted = true;
});

(async function () {
  try {
      await micDemo();
  } catch (e) {
      console.error(e.toString());
  }
})();