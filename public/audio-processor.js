class PCMWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = [];
    this.batchSize = 512;
  }

  process(inputs) {
    const input = inputs[0];
    if (!input?.length) return true;
    const mono = input[0];
    if (!mono || mono.length === 0) return true;
    
    this.buffer.push(...mono);

    while (this.buffer.length >= this.batchSize) {
      const chunk = this.buffer.splice(0, this.batchSize);
      const arr = new Float32Array(chunk);
      this.port.postMessage(arr.buffer, [arr.buffer]);
    }
    return true;
  }
}

registerProcessor('pcm-worklet', PCMWorkletProcessor);
