// @ts-nocheck
class AudioRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isRecording = false;
    this.bufferSize = 2400; // 100ms at 24kHz
    this.currentBuffer = [];

    this.port.onmessage = (event) => {
      if (event.data.command === "START_RECORDING") {
        this.isRecording = true;
      } else if (event.data.command === "STOP_RECORDING") {
        this.isRecording = false;

        if (this.currentBuffer.length > 0) {
          this.sendBuffer();
        }
      }
    };
  }

  sendBuffer() {
    if (this.currentBuffer.length > 0) {
      const audioData = new Float32Array(this.currentBuffer);
      this.port.postMessage({
        eventType: "audio",
        audioData: audioData,
      });
      this.currentBuffer = [];
    }
  }

  process(inputs) {
    const input = inputs[0];
    if (input.length > 0 && this.isRecording) {
      const audioData = input[0];

      this.currentBuffer.push(...audioData);

      if (this.currentBuffer.length >= this.bufferSize) {
        this.sendBuffer();
      }
    }
    return true;
  }
}

registerProcessor("audio-recorder-processor", AudioRecorderProcessor);
