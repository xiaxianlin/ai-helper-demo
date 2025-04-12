import { AudioWave } from "./AudioWave";

export class Recorder {
  private wave?: AudioWave;
  private stream?: MediaStream;
  private recorder?: MediaRecorder;
  private running: boolean;
  private data: Uint8Array;
  private context: AudioContext;
  private analyser: AnalyserNode;

  public onstream?: (data: BlobEvent) => void;

  constructor(canvas: HTMLCanvasElement | null) {
    this.running = false;
    this.context = new AudioContext();
    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 1024;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    if (canvas) {
      this.wave = new AudioWave(canvas);
    }
  }

  private draw() {
    if (!this.wave || !this.running) return;
    requestAnimationFrame(this.draw.bind(this));
    this.analyser.getByteTimeDomainData(this.data);
    this.wave.draw(this.data);
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // 连接音频流
    const source = this.context.createMediaStreamSource(this.stream);
    source.connect(this.analyser);

    // 录音设置
    this.recorder = new MediaRecorder(this.stream);
    if (this.onstream) {
      this.recorder.ondataavailable = this.onstream;
    }

    // 开始录音
    this.running = true;
    this.recorder.start(500);
    this.draw();
  }

  stop() {
    this.running = false;
    this.recorder?.stop();
    this.stream?.getTracks().forEach((track) => track.stop());
    this.wave?.clear();
  }
}
