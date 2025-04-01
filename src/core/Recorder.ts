import { AudioWave } from "./AudioWave";

export class Recorder {
  wave?: AudioWave;
  stream?: MediaStream;
  recorder?: MediaRecorder;
  running: boolean;
  data: Uint8Array;
  context: AudioContext;
  analyser: AnalyserNode;

  constructor(canvas: HTMLCanvasElement | null) {
    this.running = false;
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    if (canvas) {
      this.wave = new AudioWave(canvas);
    }
  }

  async start(onStream?: (data: Blob) => void) {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // 连接音频流
    const source = this.context.createMediaStreamSource(this.stream);
    source.connect(this.analyser);

    // 录音设置
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (e) => {
      onStream?.(e.data);
    };

    // 开始录音
    this.running = true;
    this.recorder.start();
    this.draw();
  }

  stop() {
    this.running = false;
    this.recorder?.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  draw() {
    if (!this.wave || !this.running) return;
    requestAnimationFrame(this.draw.bind(this));
    this.analyser.getByteTimeDomainData(this.data);
    this.wave.draw(this.data);
  }
}
