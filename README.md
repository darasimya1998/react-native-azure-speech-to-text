A React Native package for Azure Speech to Text!
```markdown
# AzureSTT - React Native Speech Recognition with Azure Cognitive Services

`AzureSTT` is a class for integrating Azure Speech-to-Text (STT) capabilities into your React Native application using the Microsoft Cognitive Services Speech SDK and `react-native-live-audio-stream`. This package helps you recognize speech from a microphone stream and process it in real-time.

## Features
- Initialize Azure Speech Recognizer using your API key and region.
- Recognize speech once from the microphone input.
- Continuous speech recognition with real-time feedback.
- Stream audio data using `react-native-live-audio-stream` for custom processing.
- Works seamlessly on both iOS and Android platforms.

## Installation

### 1. Install Dependencies
Install the necessary libraries:

```bash
npm install react-native-get-random-values node-libs-react-native react-native-live-audio-stream microsoft-cognitiveservices-speech-sdk
```

Make sure to link any native dependencies if required by the libraries (especially for `react-native-live-audio-stream`).

### 2. Link the Native Modules
If using React Native versions below 0.60, you may need to link the libraries manually. For newer versions, the libraries should auto-link.

```bash
npx react-native link react-native-live-audio-stream
```

---

## Usage

### 1. Importing and Initializing the AzureSTT Class

```typescript
import { AzureSTT } from 'path-to-your-azure-stt-class';

// Initialize with your Azure Speech API key and region
const stt = new AzureSTT({
  apiKey: 'YOUR_AZURE_API_KEY',
  region: 'YOUR_AZURE_REGION',
});
```

### 2. Recognize Speech Once
To recognize speech once from the microphone, use the `recognizeOnceAsync` method:

```typescript
stt.recognizeOnceAsync()
  .then((text) => {
    console.log('Recognized Text:', text);
  })
  .catch((error) => {
    console.error('Error recognizing speech:', error);
  });
```

### 3. Start Listening to Microphone Stream
For real-time speech recognition, you can start listening to the microphone and processing audio data:

```typescript
stt.startListening();

// Optional: to stop listening
stt.stopListening();
```

### 4. Continuous Recognition
To continuously recognize speech, use `startContinuousRecognition`:

```typescript
stt.startContinuousRecognition();

// Optional: to stop continuous recognition
stt.stopContinuousRecognition();
```

---

## Class Methods

### `recognizeOnceAsync`
- **Description**: Recognizes speech once from the microphone.
- **Returns**: A `Promise<string>` that resolves with the recognized text or rejects with an error.

### `startListening`
- **Description**: Starts listening to the microphone stream and captures audio data.
- **Event Handling**: The `AudioRecord.on('data', (data))` event allows you to process the captured audio data in real-time.

### `stopListening`
- **Description**: Stops listening to the microphone stream.

### `startContinuousRecognition`
- **Description**: Starts continuous speech recognition. The recognizer processes speech continuously and updates the result in real-time.
- **Event Handling**: The recognizer will call the `recognizing` and `recognized` events to provide real-time updates.

### `stopContinuousRecognition`
- **Description**: Stops continuous recognition and ends the process.

---

## Configuration Options

### `AzureSTTOptions`
- **`apiKey`**: Your Azure Speech API key.
- **`region`**: Your Azure region (e.g., 'eastus', 'westeurope').

---

## Example

```typescript
import { AzureSTT } from './AzureSTT';

const stt = new AzureSTT({
  apiKey: 'YOUR_AZURE_API_KEY',
  region: 'YOUR_AZURE_REGION',
});

// Recognize speech once
stt.recognizeOnceAsync()
  .then((text) => {
    console.log('Recognized Text:', text);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

// Start continuous recognition
stt.startContinuousRecognition();

// Stop continuous recognition after 10 seconds
setTimeout(() => {
  stt.stopContinuousRecognition();
}, 10000);
```

---

## Requirements
- React Native version 0.60 or above.
- An active Azure Speech API subscription.
- Permissions to access the microphone on both iOS and Android.

---

## Troubleshooting

- **Speech Recognition Not Working**: Ensure your Azure API key and region are correctly configured. Check the network connectivity and microphone permissions on your device.
- **Real-Time Audio Stream Issues**: If the audio data isn’t being processed correctly, make sure you’ve correctly set up `react-native-live-audio-stream` and have the necessary permissions.
- **metro-config.js**: add a resolver ` resolver: {
    extraNodeModules: require('node-libs-react-native'),
    sourceExts: ['jsx', 'js', 'ts', 'tsx', 'cjs', 'json'],
  },`

---

## License
MIT License. See [LICENSE](LICENSE) for more information.
```