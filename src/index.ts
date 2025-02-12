import "react-native-get-random-values";
import "node-libs-react-native/globals";
import AudioRecord, { Options } from "react-native-live-audio-stream";
import {
  SpeechConfig,
  AudioConfig,
  SpeechRecognizer,
  ResultReason,
  AudioInputStream,
  SpeechRecognitionResult,
  SpeechRecognitionEventArgs,
} from "microsoft-cognitiveservices-speech-sdk";

// Define the interface for the AzureSTT class
interface AzureSTTOptions {
  apiKey: string;
  region: string;
  language: string;
}
export class AzureReactNativeSpeechService {
  private apiKey: string;
  private region: string;
  private language: string;
  private recognizer: SpeechRecognizer | null = null;

  constructor(options: AzureSTTOptions) {
    this.apiKey = options.apiKey;
    this.region = options.region;
    this.language = options.language;
  }

  // Initializes the speech recognizer with microphone input
  private initializeRecognizer(): void {
    const speechConfig = SpeechConfig.fromSubscription(
      this.apiKey,
      this.region
    );
    speechConfig.speechRecognitionLanguage = this.language;
    const pushStream = AudioInputStream.createPushStream();
    const options = {
      sampleRate: 16000, // Set sample rate to match the expected input (Azure expects 16000 Hz)
      numberOfChannels: 1,
      bitsPerChannel: 16,
      bufferSize: 1024, // Buffer size to control the chunk of data passed
    };

    AudioRecord.init(options as unknown as Options);

    AudioRecord.start(); // Start recording the audio stream

    // Handling the audio data for custom processing
    AudioRecord.on("data", (data: string) => {
      const pcmData = Buffer.from(data, "base64");
      pushStream.write(pcmData);
    });
    const audioConfig = AudioConfig.fromStreamInput(pushStream); // This uses default mic input for speech recognition
    this.recognizer = new SpeechRecognizer(speechConfig, audioConfig);
  }

  // Starts recognizing speech from the microphone and returns the result
  public startListening(): Promise<string> {
    if (!this.recognizer) {
      this.initializeRecognizer();
    }

    return new Promise((resolve, reject) => {
      if (this.recognizer) {
        this.recognizer.recognizeOnceAsync(
          (result: SpeechRecognitionResult) => {
            if (result.reason === ResultReason.RecognizedSpeech) {
              resolve(result.text); // Return the recognized text
            } else {
              reject(new Error("Speech recognition failed"));
            }
          },
          (err: string) => {
            reject(new Error(`Speech recognition error: ${err}`));
          }
        );
      } else {
        reject(new Error("Recognizer is not initialized"));
      }
    });
  }

  // Stop listening to the microphone stream
  public stopListening(): void {
    AudioRecord.stop(); // Stop recording the audio stream
    this.recognizer?.close();
  }

  // Recognize speech continuously by listening to the microphone stream
  public startContinuousRecognition(
    onRecognizedCallback: (result: SpeechRecognitionResult) => void
  ): void {
    if (!this.recognizer) {
      this.initializeRecognizer();
    }
    if (this.recognizer) {
      this.recognizer.startContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition started.");
        },
        (err) => {
          console.error("Error starting continuous recognition:", err);
        }
      );

      // Handling the recognition results
      this.recognizer.recognizing = (s, e) => {
        console.log("Recognizing:", e.result.text);
      };

      this.recognizer.recognized = (_s, event: SpeechRecognitionEventArgs) => {
        if (event.result.reason === ResultReason.RecognizedSpeech) {
          onRecognizedCallback(event.result);
        } else if (event.result.reason === ResultReason.NoMatch) {
          onRecognizedCallback(event.result);
        }
      };
    }
  }

  // Stop the continuous recognition process
  public stopContinuousRecognition(): void {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log("Continuous recognition stopped.");
        },
        (err) => {
          console.error("Error stopping continuous recognition:", err);
        }
      );
    }
  }
}
