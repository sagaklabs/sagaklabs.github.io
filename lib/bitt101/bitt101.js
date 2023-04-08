(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bitt101 = {}));
}(this, (function (exports) { 'use strict';

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function error(msg) {
        console.trace(msg);
        throw new Error(msg);
    }
    function assert(condition, errMsg = 'Assert failed') {
        if (!condition)
            error(errMsg);
    }

    // Is the code running in a Node environment?
    typeof process !== 'undefined'
        && process.versions != null
        && process.versions.node != null;

    const KEY_VAL_REGEX = /^\s*([^=]+?)\s*=\s*(.*?)\s*$/;
    function parseKeyVal(str) {
        if (KEY_VAL_REGEX.test(str)) {
            const match = str.match(KEY_VAL_REGEX);
            return [match[1], match[2]];
        }
        return str;
    }

    function stringToBytes(str) {
        const bytes = new Uint8Array(str.length);
        for (let i = 0; i < str.length; i++)
            bytes[i] = str.charCodeAt(i);
        return bytes;
    }
    function bytesPos(haystack, needle, ptr = 0) {
        search: while (true) {
            let start = haystack.indexOf(needle[0], ptr);
            if (start === -1)
                return -1;
            ptr = start;
            for (let i = 1; i < needle.length; i++) {
                if (haystack[ptr + i] !== needle[i]) {
                    ptr += 1;
                    continue search;
                }
            }
            // found a match
            return ptr;
        }
    }
    function mergeByteChunks(chunks) {
        const size = chunks.reduce((s, bytes) => s + bytes.length, 0);
        const result = new Uint8Array(size);
        for (let ptr = 0, i = 0; i < chunks.length; i++) {
            result.set(chunks[i], ptr);
            ptr += chunks[i].length;
        }
        return result;
    }

    const SM_BYTES = 0;
    const SM_LINES = 1;
    const layout = {
        "rows": ["8", "9", "10", "11", "12", "13", "14"],
        "cols": ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
        "keymap": [
            [{"x": 0,    "y": 0,    "w": 1   }, "0,0" , 1  ],
            [{"x": 1,    "y": 0,    "w": 1   }, "0,1" , 2  ],
            [{"x": 2,    "y": 0,    "w": 1   }, "0,2" , 3  ],
            [{"x": 3,    "y": 0,    "w": 1   }, "0,3" , 4  ],
            [{"x": 4,    "y": 0,    "w": 1   }, "0,4" , 5  ],
            [{"x": 5,    "y": 0,    "w": 1   }, "0,5" , 6  ],
            [{"x": 6,    "y": 0,    "w": 1   }, "0,6" , 7  ],
            [{"x": 7,    "y": 0,    "w": 1   }, "0,7" , 8  ],
            [{"x": 8,    "y": 0,    "w": 1   }, "0,8" , 9  ],
            [{"x": 9,    "y": 0,    "w": 1   }, "0,9" , 10 ],
            [{"x": 10,   "y": 0,    "w": 1   }, "0,10", 11 ],
            [{"x": 11,   "y": 0,    "w": 1   }, "0,11", 12 ],
            [{"x": 12,   "y": 0,    "w": 1   }, "0,12", 13 ],
            [{"x": 13,   "y": 0,    "w": 2.04}, "0,13", 14 ],   // BACKSPACE
            [{"x": 15.5, "y": 0,    "w": 1   }, "0,14", 15 ],
            [{"x": 16.5, "y": 0,    "w": 1   }, "0,15", 16 ],
            [{"x": 0,    "y": 1,    "w": 1.54}, "1,0" , 17 ],   // TAB
            [{"x": 1.5,  "y": 1,    "w": 1   }, "1,1" , 18 ],   // Q
            [{"x": 2.5,  "y": 1,    "w": 1   }, "1,2" , 19 ],   // W
            [{"x": 3.5,  "y": 1,    "w": 1   }, "1,3" , 20 ],   // E
            [{"x": 4.5,  "y": 1,    "w": 1   }, "1,4" , 21 ],   // R
            [{"x": 5.5,  "y": 1,    "w": 1   }, "1,5" , 22 ],   // T
            [{"x": 6.5,  "y": 1,    "w": 1   }, "1,6" , 23 ],   // Y
            [{"x": 7.5,  "y": 1,    "w": 1   }, "1,7" , 24 ],   // U
            [{"x": 8.5,  "y": 1,    "w": 1   }, "1,8" , 25 ],   // I
            [{"x": 9.5,  "y": 1,    "w": 1   }, "1,9" , 26 ],   // O
            [{"x": 10.5, "y": 1,    "w": 1   }, "1,10", 27 ],   // P
            [{"x": 11.5, "y": 1,    "w": 1   }, "1,11", 28 ],   // [
            [{"x": 12.5, "y": 1,    "w": 1   }, "1,12", 29 ],   // ]
            [{"x": 13.5, "y": 1,    "w": 1.5 }, "1,13", 30 ],   // \
            [{"x": 15.5, "y": 1,    "w": 1   }, "1,14", 31 ],   // DEL
            [{"x": 16.5, "y": 1,    "w": 1   }, "1,15", 32 ],   // END
            [{"x": 0,    "y": 2,    "w": 1.80}, "2,0" , 33 ],   //
            [{"x": 1.75, "y": 2,    "w": 1   }, "2,1" , 34 ],
            [{"x": 2.75, "y": 2,    "w": 1   }, "2,2" , 35 ],
            [{"x": 3.75, "y": 2,    "w": 1   }, "2,3" , 36 ],
            [{"x": 4.75, "y": 2,    "w": 1   }, "2,4" , 37 ],
            [{"x": 5.75, "y": 2,    "w": 1   }, "2,5" , 38 ],
            [{"x": 6.75, "y": 2,    "w": 1   }, "2,6" , 39 ],
            [{"x": 7.75, "y": 2,    "w": 1   }, "2,7" , 40 ],
            [{"x": 8.75, "y": 2,    "w": 1   }, "2,8" , 41 ],
            [{"x": 9.75, "y": 2,    "w": 1   }, "2,9" , 42 ],
            [{"x": 10.75,"y": 2,    "w": 1   }, "2,10", 43 ],
            [{"x": 11.75,"y": 2,    "w": 1   }, "2,11", 44 ],
            [{"x": 12.75,"y": 2,    "w": 2.31}, "2,12", 45 ],   // ENTER
            [{"x": 0,    "y": 3,    "w": 2.34}, "2,13", 46 ],   // LSFT
            [{"x": 2.25, "y": 3,    "w": 1   }, "2,14", 47 ],
            [{"x": 3.25, "y": 3,    "w": 1   }, "2,15", 48 ],
            [{"x": 4.25, "y": 3,    "w": 1   }, "3,0" , 59 ],
            [{"x": 5.25, "y": 3,    "w": 1   }, "3,1" , 50 ],
            [{"x": 6.25, "y": 3,    "w": 1   }, "3,2" , 51 ],
            [{"x": 7.25, "y": 3,    "w": 1   }, "3,3" , 52 ],
            [{"x": 8.25, "y": 3,    "w": 1   }, "3,4" , 53 ],
            [{"x": 9.25, "y": 3,    "w": 1   }, "3,5" , 54 ],
            [{"x": 10.25,"y": 3,    "w": 1   }, "3,6" , 55 ],
            [{"x": 11.25,"y": 3,    "w": 1   }, "3,7" , 56 ],
            [{"x": 12.25,"y": 3,    "w": 2.05}, "3,8" , 57 ],   // RSFT
            [{"x": 15.5, "y": 3,    "w": 1   }, "3,9" , 58 ],   // ↑
            [{"x": 0,    "y": 4,    "w": 1.25}, "3,10", 59 ],   // LCTL
            [{"x": 1.25, "y": 4,    "w": 1.25}, "3,11", 60 ],
            [{"x": 2.5,  "y": 4,    "w": 1.25}, "3,12", 61 ],
            [{"x": 3.75, "y": 4,    "w": 6.65}, "3,13", 62 ],   // SPC
            [{"x": 10,   "y": 4,    "w": 1.25}, "3,14", 63 ],
            [{"x": 11.25,"y": 4,    "w": 1.25}, "3,15", 64 ],   // MENU
            [{"x": 12.5, "y": 4,    "w": 1.25}, "4,0" , 65 ],   // RCTL
            [{"x": 14.5, "y": 4,    "w": 1   }, "4,1" , 66 ],
            [{"x": 15.5, "y": 4,    "w": 1   }, "4,2" , 67 ],
            [{"x": 16.5, "y": 4,    "w": 1   }, "4,3" , 68 ],
            [{"x": 0,    "y": -1.76,"w": 1   }, "4,4" , 69 ],   // ESC
            [{"x": 0,    "y": 0,    "w": 1   }, "4,5" , 70 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,6" , 71 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,7" , 72 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,8" , 73 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,9" , 74 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,10", 75 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,11", 76 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,12", 77 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,13", 78 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,14", 79 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "4,15", 80 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,0" , 81 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,1" , 82 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,2" , 83 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,3" , 84 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,4" , 85 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,5" , 86 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,6" , 87 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,7" , 88 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,8" , 89 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,9" , 90 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,10", 91 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,11", 92 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,12", 93 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,13", 94 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,14", 95 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "5,15", 96 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,0" , 97 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,1" , 98 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,2" , 99 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,3" , 100 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,4" , 101 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,5" , 102 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,6" , 103 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,7" , 104 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,8" , 105 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,9" , 106 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,10", 107 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,11", 108 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,12", 109 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,13", 110 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,14", 111 ],
            [{"x": 0,    "y": 0,    "w": 1   }, "6,15", 112 ],
      ],
    };


    class SerialTransformer {
        constructor() {
            this.mode = SM_LINES /* Lines */;
            this.lineBuffer = '';
            this.asciiDecoder = new TextDecoder('ascii');
            this.bytePackets = [];
            this.bytesReceived = 0;
            // if not 0, transformer will collect byte input until this many bytes have been read
            this.bytesTarget = 0;
            this.dataReceivedCallback = (data) => { };
        }
        onData(callbackFn) {
            this.dataReceivedCallback = callbackFn;
        }
        setMode(mode) {
            if (this.mode !== mode) {
                if (mode === SM_LINES /* Lines */) {
                    this.lineBuffer = '';
                }
                else if (mode === SM_BYTES /* Bytes */) {
                    this.bytePackets = [];
                    this.bytesReceived = 0;
                    this.bytesTarget = 0;
                }
                this.mode = mode;
            }
        }
        clearOut() {
            if (this.mode === SM_LINES /* Lines */)
                this.controller.enqueue('');
            else if (this.mode === SM_BYTES /* Bytes */)
                this.controller.enqueue(new Uint8Array(0));
        }
        start(controller) {
            this.controller = controller;
        }
        transform(chunk, controller) {
            if (this.mode === SM_LINES /* Lines */)
                this.transformLines(chunk, controller);
            else if (this.mode === SM_BYTES /* Bytes */)
                this.transformBytes(chunk, controller);
            this.dataReceivedCallback(chunk);
        }
        flush(controller) {
            if (this.mode === SM_LINES /* Lines */)
                this.flushLines(controller);
            else if (this.mode === SM_BYTES /* Bytes */)
                this.flushBytes(controller);
        }
        transformLines(chunk, controller) {
            this.lineBuffer += this.asciiDecoder.decode(chunk);
            const lines = this.lineBuffer.split(/\r?\n/);
            this.lineBuffer = lines.pop();
            lines.forEach(line => controller.enqueue(line));
        }
        transformBytes(chunk, controller) {
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
        flushLines(controller) {
            controller.enqueue(this.lineBuffer);
            this.lineBuffer = '';
        }
        flushBytes(controller) { }
    }

    // 
    class Serial {
        constructor(port, options) {
            this.errorCallback = () => { };
            this.isOpen = false;
            this.isReading = false;
            this.isWaitingForRead = false;
            this.handleDisconnectEvent = () => {
                this.isOpen = false;
                this.isReading = false;
            };
            this.port = port;
            this.options = options;
            port.addEventListener('disconnect', this.handleDisconnectEvent);
        }
        onData(callbackFn) {
            this.readTransformer.onData(callbackFn);
        }
        onError(callbackFn) {
            this.errorCallback = callbackFn;
        }
        open() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.port.open(Object.assign({}, this.options));
                this.readTransformer = new SerialTransformer();
                const readable = this.port.readable;
                const stream = readable.pipeThrough(new TransformStream(this.readTransformer));
                this.reader = stream.getReader();
                this.isOpen = true;
            });
        }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                this.clearRead();
                yield this.close();
                yield this.port.close();
                this.isOpen = false;
            });
        }
        write(bytes) {
            return __awaiter(this, void 0, void 0, function* () {
                assert(this.isOpen, 'Serial is not open, please call open() before beginning to write data');
                const writer = this.port.writable.getWriter();
                yield writer.write(bytes);
                writer.releaseLock();
            });
        }
        writeAscii(str) {
            return __awaiter(this, void 0, void 0, function* () {
                const bytes = stringToBytes(str);
                return yield this.write(bytes);
            });
        }
        // Reads an Uint8Array from the serial device
        // If numBytes is 0, it will resolve as soon as some bytes are received
        // If numBytes is more than 0, it will resolved when *at least* that many bytes have been received -- the actual buffer could be a bit longer
        readBytes(numBytes = 0) {
            return __awaiter(this, void 0, void 0, function* () {
                assert(!this.isReading, 'A read was queued while another was still in progress');
                this.isReading = true;
                try {
                    this.readTransformer.setMode(SM_BYTES /* Bytes */);
                    this.readTransformer.bytesTarget = numBytes;
                    const { value } = yield this.reader.read();
                    this.readTransformer.bytesTarget = 0;
                    this.isReading = false;
                    return value;
                }
                catch (error) {
                    this.isReading = false;
                    this.errorCallback(error);
                }
            });
        }
        // Clear the current reader.read() call that's being awaited, to prevent it from blocking further reads...
        clearRead() {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.port.readable && this.isWaitingForRead) {
                    this.readTransformer.clearOut();
                    this.isWaitingForRead = false;
                }
            });
        }
        // Reads a single line of ascii text from the serial device. Newline characters are not included, some lines may be empty
        readLine() {
            return __awaiter(this, void 0, void 0, function* () {
                assert(!this.isReading, 'A read was queued while another was still in progress');
                this.isReading = true;
                try {
                    this.readTransformer.setMode(SM_LINES /* Lines */);
                    const { value } = yield this.reader.read();
                    this.isReading = false;
                    return value;
                }
                catch (error) {
                    this.isReading = false;
                    this.errorCallback(error);
                }
            });
        }
        // Do one of the above read functions, but make it timeout after a given number of milliseconds, This is used to read everything until the device has nothing more to send
        doReadWithTimeout(timeoutMs, readFn, ...readFnArgs) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve, reject) => {
                    this.isWaitingForRead = true;
                    const timer = setTimeout(() => {
                        resolve({ value: null, done: true });
                        // this is SUPER IMPORTANT, the readFn that has timed out still needs to complete somehow,
                        // otherwise it will just block further reads
                        // I imagine there's a nicer way to handle this, but I can't find any good information out there...
                        this.clearRead();
                    }, timeoutMs);
                    try {
                        readFn.bind(this)(...readFnArgs).then((result) => {
                            clearTimeout(timer);
                            this.isWaitingForRead = false;
                            resolve({ value: result, done: false });
                        });
                    }
                    catch (error) {
                        clearTimeout(timer);
                        reject(error);
                    }
                });
            });
        }
        // Read lines until a timeout happens, indicating there's no more lines to read for now
        readLinesUntilTimeout(ms = 50) {
            return __awaiter(this, void 0, void 0, function* () {
                const lines = [];
                while (this.isOpen && this.port.readable) {
                    try {
                        const { value, done } = yield this.doReadWithTimeout(ms, this.readLine);
                        if (value !== null)
                            lines.push(value);
                        if (done)
                            return lines;
                    }
                    catch (error) {
                        this.errorCallback(error);
                    }
                }
            });
        }
        readLinesUntilString(ms = 50, needle) {
            return __awaiter(this, void 0, void 0, function* () {
                const lines = [];
                while(this.isOpen && this.port.readable) {
                    try {
                        const { value, done } = yield this.doReadWithTimeout(ms, this.readLine);
                        if( value != null)
                            lines.push(value);
                        if(done || value.includes(needle)) {
                            return lines;
                        }
                    } catch (error) {
                        this.errorCallback(error);
                    }
                }
            });
        }
        // Read bytes until a timeout happens, indicating there's no more bytes to read for now
        readBytesUntilTimeout(ms = 50) {
            return __awaiter(this, void 0, void 0, function* () {
                const chunks = [];
                while (this.isOpen && this.port.readable) {
                    try {
                        const { value, done } = yield this.doReadWithTimeout(ms, this.readBytes);
                        if (value !== null)
                            chunks.push(value);
                        if (done)
                            return mergeByteChunks(chunks);
                    }
                    catch (error) {
                        this.errorCallback(error);
                    }
                }
            });
        }
    }

    // bitt101 USB vendor and product IDs
    const BITT101_VID = 0x5A64;
    const BITT101_PID = 0x8009;
    const USB_FILTER = { usbVendorId: BITT101_VID, usbProductId: BITT101_PID };
    // Serial settings
    const BITT101_BAUDRATE = 115200;
    const BITT101_BUFFER_SIZE = 25600;
    // OLED dimension
    const BITT101_WIDTH = 128;
    const BITT101_HEIGHT = 64;

    class Device {
        constructor(port) {
            this.isConnected = true;
            this.isPollingControls = false;
            this.isStreaming = false;
            this.lastButtonPressedFlags = 0;
            this.lastButtonJustReleasedFlags = 0;
            this.lastButtonJustPressedFlags = 0;
            this.logCommandResponse = false;
            this.events = {};
            this.handleDisconnectEvent = () => {
                this.isConnected = false;
                this.emit('disconnect');
            };
            this.handleSerialDataEvent = (data) => {
                this.emit('data', data);
            };
            this.handleSerialErrorEvent = (err) => {
                this.emit('error', err);
                throw err;
            };
            this.port = port;
            this.serial = new Serial(port, {
                baudRate: BITT101_BAUDRATE,
                bufferSize: BITT101_BUFFER_SIZE
            });
            this.port.addEventListener('disconnect', this.handleDisconnectEvent);
        }
        static requestDevice() {
            return __awaiter(this, void 0, void 0, function* () {
                const port = yield navigator.serial.requestPort({ filters: [USB_FILTER] });
                return new Device(port);
            });
        }
        static getDevices() {
            return __awaiter(this, void 0, void 0, function* () {
                const ports = yield navigator.serial.getPorts();
                return ports
                    .filter(port => {
                    const { usbProductId, usbVendorId } = port.getInfo();
                    return usbProductId === BITT101_PID && usbVendorId === BITT101_VID;
                })
                    .map(port => new Device(port));
            });
        }
        get isOpen() {
            return this.isConnected && this.serial.isOpen;
        }
        get isBusy() {
            return this.isConnected && (this.isPollingControls || this.isStreaming);
        }
        on(eventType, callback) {
            (this.events[eventType] || (this.events[eventType] = [])).push(callback);
        }
        off(eventType, callback) {
            const callbackList = this.events[eventType];
            if (callbackList)
                callbackList.splice(callbackList.indexOf(callback), 1);
        }
        emit(eventType, ...args) {
            const callbackList = this.events[eventType] || [];
            callbackList.forEach(fn => fn.apply(this, args));
        }
        open() {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.serial.open();
                this.serial.onData(this.handleSerialDataEvent);
                this.serial.onError(this.handleSerialErrorEvent);

                // clear motd
                const motd = yield this.serial.readLinesUntilString('/>');
                assert(Array.isArray(motd), 'Open error - bitt101 did not respond, maybe something else is interacting with it?');
                // set echo off since we're on web now.
                const lines = yield this.sendCommand('echo off\n\r');
                assert(Array.isArray(lines), 'Cannot set echo'); // or we can check for 'echo -> off'
                const resp = lines.pop();

                this.emit('open');
                return {
                    'motd': motd,
                    'lines': lines,
                    'resp': resp,
                };
            });
        }
        close() {
            return __awaiter(this, void 0, void 0, function* () {
                // seems to help if the session goofed up and the device is still trying to send data
                // stop any continually running commands
                //if (this.isPollingControls)
                //    yield this.stopPollingControls();
                // actually close the device
                yield this.serial.close();
                this.emit('close');
            });
        }
        getJsonfile(filename) {
            return __awaiter(this, void 0, void 0, function* () {
                yield this.serial.writeAscii('cat ' + filename + '\n\r');
                return yield this.serial.readLinesUntilString(1000, '[EOF]');
            });
        }
        getCapture() {
            // run capture from bitt101
            // bitt101 will return xbm format text. ends with '};'
            return __awaiter(this, void 0, void 0, function* () {
                this.assertNotBusy();
                yield this.serial.writeAscii('capture\n');
                return yield this.serial.readLinesUntilString(1000, '};');
            });
        }
        sendCommand(command) {
            return __awaiter(this, void 0, void 0, function* () {
                assert(this.isOpen);
                this.assertNotBusy();
                yield this.serial.writeAscii(`${command}\n`);
                const lines = yield this.serial.readLinesUntilTimeout();
                if (this.logCommandResponse) {
                    console.log(lines.join('\n'));
                }
                return lines;
            });
        }
        assertNotBusy() {
            assert(!this.isBusy, 'Device is currently busy, stop polling controls or streaming to send further commands');
        }
    }

    function isUsbSupported() {
        return window.isSecureContext && navigator.serial !== undefined;
    }
    function assertUsbSupported() {
        assert(window.isSecureContext, 'Web Serial is only supported in secure contexts\nhttps://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts');
        assert(navigator.serial !== undefined, 'Web Serial is not supported by this browser.\nhttps://developer.mozilla.org/en-US/docs/Web/API/Web_Serial_API#browser_compatibility');
    }
    function requestConnect() {
        return __awaiter(this, void 0, void 0, function* () {
            assertUsbSupported();
            return yield Device.requestDevice();
        });
    }

    exports.Serial              = Serial;
    exports.Device              = Device;
    exports.USB_FILTER          = USB_FILTER;
    exports.BITT101_BAUDRATE    = BITT101_BAUDRATE;
    exports.BITT101_BUFFER_SIZE = BITT101_BUFFER_SIZE;
    exports.BITT101_HEIGHT      = BITT101_HEIGHT;
    exports.BITT101_PID         = BITT101_PID;
    exports.BITT101_VID         = BITT101_VID;
    exports.BITT101_WIDTH       = BITT101_WIDTH;
    exports.Layout              = layout;
    exports.assertUsbSupported  = assertUsbSupported;
    exports.isUsbSupported      = isUsbSupported;
    exports.requestConnect      = requestConnect;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
