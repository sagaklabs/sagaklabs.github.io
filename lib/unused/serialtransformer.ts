import { stringToBytes, bytesToString, mergeByteChunks } from '../bitt101/utils';

type StreamController<T = Uint8Array | string> = TransformStreamDefaultController<T>;

export const enum SerialMode {
  Bytes,
  Lines,
  AsciiFile,
};

export class SerialTransformer {

  mode = SerialMode.Lines;
  controller: StreamController;

  lineBuffer = '';
  asciiDecoder = new TextDecoder('ascii');

  bytePackets: Uint8Array[] = [];
  bytesReceived = 0;
  // if not 0, transformer will collect byte input until this many bytes have been read
  bytesTarget = 0;

  private dataReceivedCallback = (data: Uint8Array) => {};

  onData(callbackFn: (data: Uint8Array) => void) {
    this.dataReceivedCallback = callbackFn;
  }

  setMode(mode: SerialMode) {
    if (this.mode !== mode) {

      if (mode === SerialMode.Lines) {
        this.lineBuffer = '';
      }
      else if (mode === SerialMode.Bytes) {
        this.bytePackets = [];
        this.bytesReceived = 0;
        this.bytesTarget = 0;
      }

      this.mode = mode;
    }
  }
  
  clearOut() {
    if (this.mode === SerialMode.Lines)
      this.controller.enqueue('');

    else if (this.mode === SerialMode.Bytes)
      this.controller.enqueue(new Uint8Array(0));
  }

  start(controller: StreamController) {
    this.controller = controller;
  }

  transform(chunk: Uint8Array, controller: StreamController) {
    if (this.mode === SerialMode.Lines)
      this.transformLines(chunk, controller);

    else if (this.mode === SerialMode.Bytes)
      this.transformBytes(chunk, controller);

    this.dataReceivedCallback(chunk);
  }

  flush(controller: StreamController) {
    if (this.mode === SerialMode.Lines)
      this.flushLines(controller);

    else if (this.mode === SerialMode.Bytes)
      this.flushBytes(controller);
  }

  transformLines(chunk: Uint8Array, controller: StreamController<string>) {
    this.lineBuffer += this.asciiDecoder.decode(chunk);
    const lines = this.lineBuffer.split(/\r?\n/);
    this.lineBuffer = lines.pop();
    lines.forEach(line => controller.enqueue(line));
  }

  transformBytes(chunk: Uint8Array, controller: StreamController<Uint8Array>) {
    if (this.bytesTarget > 0) {
      this.bytePackets.push(chunk);
      this.bytesReceived += chunk.byteLength;
      if (this.bytesReceived >= this.bytesTarget) {
        controller.enqueue(mergeByteChunks(this.bytePackets));
        this.bytePackets = [];
        this.bytesReceived = 0;
      }
    }
    else {
      controller.enqueue(chunk);
    }
  }

  flushLines(controller: StreamController<string>) {
    controller.enqueue(this.lineBuffer);
    this.lineBuffer = '';
  }

  flushBytes(controller: StreamController<Uint8Array>) {}
}