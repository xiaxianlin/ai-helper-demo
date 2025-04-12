import { AudioWave } from "./AudioWave";

type Events = {
  onReady?: () => void;
  onEnd?: () => void;
};

export class LocalPlayer {
  wave?: AudioWave;
  events?: Events;
  buffer?: AudioBuffer;
  context: AudioContext;
  analyser: AnalyserNode;
  running: boolean;
  data: Uint8Array;
  node: AudioBufferSourceNode | null;

  constructor(buffer: ArrayBuffer, canvas: HTMLCanvasElement | null, events?: Events) {
    if (canvas) {
      this.wave = new AudioWave(canvas);
    }
    this.running = false;
    this.events = events;
    this.context = new AudioContext();

    this.analyser = this.context.createAnalyser();
    this.analyser.fftSize = 2048;
    this.data = new Uint8Array(this.analyser.frequencyBinCount);
    this.node = null;

    this.context.decodeAudioData(buffer).then((value) => {
      this.buffer = value;
      this.events?.onReady?.();
    });
  }

  start() {
    if (!this.buffer) return;

    this.node = this.context.createBufferSource();
    this.node.buffer = this.buffer;
    this.node.connect(this.context.destination);
    this.node.connect(this.analyser);

    this.node.onended = () => {
      this.running = false;
      this.events?.onEnd?.();
      this.wave?.clear();
    };

    this.node.start(0);
    this.running = true;
    this.draw();
  }

  stop() {
    if (!this.node) return;
    this.running = false;
    this.node.stop();
    this.node.disconnect();
    this.node = null;
  }

  draw() {
    if (!this.wave || !this.running) return;
    requestAnimationFrame(this.draw.bind(this));
    this.analyser.getByteTimeDomainData(this.data);
    this.wave.draw(this.data);
  }
}
