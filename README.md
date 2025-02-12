# React Native Azure Speech-to-Text

`react-native-azure-speech-to-text` is a React Native library that integrates with Microsoft Azure Speech-to-Text (STT) services. This package enables real-time speech recognition using Azure Cognitive Services and `react-native-live-audio-stream`.

## Features
- Supports single-shot and continuous speech recognition.
- Streams microphone audio to Azure Speech API in real-time.### `.startListening()`
- Works on both Android and iOS.
- Uses `react-native-live-audio-stream` for audio processing.
- Easy-to-use API for integrating Azure Speech recognition into your app.

## Installation

### Prerequisites
- React Native 0.60+
- An active Azure Speech API subscription
- Microphone access permissions for iOS and Android

### Install the package and dependencies
```sh
npm install react-native-azure-speech-to-text 
```
```sh
yarn add react-native-azure-speech-to-text 
```

### Link native modules (if needed)
For React Native versions below 0.60, you may need to manually link dependencies:
```sh
npx react-native link react-native-live-audio-stream
```

## Usage

### Import and initialize
```typescript
import { AzureReactNativeSpeechService } from 'react-native-azure-speech-to-text';

const stt = new AzureReactNativeSpeechService({
  apiKey: 'YOUR_AZURE_API_KEY',
  region: 'YOUR_AZURE_REGION',
});
```
### Start and stop listening to microphone stream
```typescript
stt.startListening();
// To stop listening
stt.stopListening();
```

### Start continuous recognition
```typescript
stt.startContinuousRecognition();

// Stop recognition after 10 seconds
setTimeout(() => {
  stt.stopContinuousRecognition();
}, 10000);
```

## API Reference

### `new AzureReactNativeSpeechService(options)`
Initializes a new Azure Speech-to-Text instance.

**Options:**
- `apiKey` (string) – Your Azure Speech API key.
- `region` (string) – Your Azure region (e.g., 'eastus').

### `.startListening()`
Starts capturing microphone audio stream.

### `.stopListening()`
Stops capturing microphone audio.

### `.startContinuousRecognition()`
Starts continuous speech recognition.

### `.stopContinuousRecognition()`
Stops continuous speech recognition.

## Troubleshooting

### Speech recognition not working
- Verify your Azure API key and region.
- Ensure your device has an active internet connection.
- Check if microphone permissions are granted.

### Real-time audio issues
- Make sure `react-native-live-audio-stream` is correctly installed and linked.
- Ensure the app has necessary permissions to access the microphone.

### Metro bundler issues
Add the following resolver to `metro.config.js`:
```js
resolver: {
  extraNodeModules: require('node-libs-react-native'),
  sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
},
```

## License
MIT License. See [LICENSE](LICENSE) for details.