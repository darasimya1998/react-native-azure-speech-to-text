"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AzureSTT = void 0;
require("react-native-get-random-values");
require("node-libs-react-native/globals");
const react_native_live_audio_stream_1 = __importDefault(require("react-native-live-audio-stream"));
const microsoft_cognitiveservices_speech_sdk_1 = require("microsoft-cognitiveservices-speech-sdk");
class AzureSTT {
    constructor(options) {
        this.recognizer = null;
        this.apiKey = options.apiKey;
        this.region = options.region;
    }
    // Initializes the speech recognizer with microphone input
    initializeRecognizer() {
        const speechConfig = microsoft_cognitiveservices_speech_sdk_1.SpeechConfig.fromSubscription(this.apiKey, this.region);
        const audioConfig = microsoft_cognitiveservices_speech_sdk_1.AudioConfig.fromDefaultMicrophoneInput(); // This uses default mic input for speech recognition
        this.recognizer = new microsoft_cognitiveservices_speech_sdk_1.SpeechRecognizer(speechConfig, audioConfig);
    }
    // Starts recognizing speech from the microphone and returns the result
    recognizeOnceAsync() {
        if (this.recognizer === null) {
            this.initializeRecognizer();
        }
        return new Promise((resolve, reject) => {
            if (this.recognizer !== null) {
                this.recognizer.recognizeOnceAsync((result) => {
                    if (result.reason === microsoft_cognitiveservices_speech_sdk_1.ResultReason.RecognizedSpeech) {
                        resolve(result.text); // Return the recognized text
                    }
                    else {
                        reject(new Error('Speech recognition failed'));
                    }
                }, (err) => {
                    reject(new Error(`Speech recognition error: ${err}`));
                });
            }
            else {
                reject(new Error('Recognizer is not initialized'));
            }
        });
    }
    // Start listening to the microphone stream using AudioRecord
    startListening() {
        const options = {
            sampleRate: 16000,
            numberOfChannels: 1,
            bitsPerChannel: 16,
            bufferSize: 1024, // Buffer size to control the chunk of data passed
        };
        react_native_live_audio_stream_1.default.init(options);
        react_native_live_audio_stream_1.default.start(); // Start recording the audio stream
        // Handling the audio data for custom processing
        react_native_live_audio_stream_1.default.on('data', (data) => {
            // Process the audio data here
            console.log('Audio data received', data);
            // Optionally, send this audio data to Azure for real-time processing
        });
    }
    // Stop listening to the microphone stream
    stopListening() {
        react_native_live_audio_stream_1.default.stop(); // Stop recording the audio stream
    }
    // Recognize speech continuously by listening to the microphone stream
    startContinuousRecognition() {
        if (!this.recognizer) {
            this.initializeRecognizer();
            return;
        }
        this.recognizer.startContinuousRecognitionAsync(() => {
            console.log('Continuous recognition started.');
        }, (err) => {
            console.error('Error starting continuous recognition:', err);
        });
        // Handling the recognition results
        this.recognizer.recognizing = (s, e) => {
            console.log('Recognizing:', e.result.text);
        };
        this.recognizer.recognized = (s, e) => {
            if (e.result.reason === microsoft_cognitiveservices_speech_sdk_1.ResultReason.RecognizedSpeech) {
                console.log('Recognized:', e.result.text);
            }
            else if (e.result.reason === microsoft_cognitiveservices_speech_sdk_1.ResultReason.NoMatch) {
                console.log('No speech could be recognized');
            }
        };
    }
    // Stop the continuous recognition process
    stopContinuousRecognition() {
        if (this.recognizer) {
            this.recognizer.stopContinuousRecognitionAsync(() => {
                console.log('Continuous recognition stopped.');
            }, (err) => {
                console.error('Error stopping continuous recognition:', err);
            });
        }
    }
}
exports.AzureSTT = AzureSTT;
