export class AudioWave {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  draw(data: Uint8Array) {
    const { canvas, ctx } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";
    ctx.beginPath();
    const sliceWidth = canvas.width / data.length;
    let x = 0;

    for (let i = 0; i < data.length; i++) {
      let v = data[i] / 128.0;
      let y = (v * canvas.height) / 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      x += sliceWidth;
    }
    ctx.stroke();
  }

  drawBuffer(data: ArrayBuffer) {
    const { canvas, ctx } = this;
    const audioData = new Float32Array(data);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 0.5;
    ctx.strokeStyle = "black";

    ctx.beginPath();

    const step = Math.ceil(audioData.length / canvas.width);
    const amp = canvas.height / 2;

    for (let i = 0; i < canvas.width; i++) {
      const min = Math.min(...audioData.slice(i * step, (i + 1) * step));
      const max = Math.max(...audioData.slice(i * step, (i + 1) * step));
      ctx.moveTo(i, (1 + min) * amp);
      ctx.lineTo(i, (1 + max) * amp);
    }

    ctx.stroke();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
