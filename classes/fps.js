const fps = new (class {
  constructor() {
    this.fps = document.getElementById("fps");
    this.frames = [];
    this.lastFrameTimeStamp = performance.now();
  }

  render() {
    const now = performance.now();
    const delta = now - this.lastFrameTimeStamp;
    this.lastFrameTimeStamp = now;
    const fps = (1 / delta) * 1000;

    this.frames.push(fps);
    if (this.frames.length > 100) {
      this.frames.shift();
    }

    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    this.frames.forEach((frame) => {
      sum += frame;
      min = Math.min(frame, min);
      max = Math.max(frame, max);
    });
    let mean = sum / this.frames.length;

    this.fps.textContent = `
    Frames per Second:
             latest = ${Math.round(fps)}
    avg of last 100 = ${Math.round(mean)}
    min of last 100 = ${Math.round(min)}
    max of last 100 = ${Math.round(max)}
    `.trim();
  }
})();

export default fps;
