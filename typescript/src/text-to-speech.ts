import * as sdk from "microsoft-cognitiveservices-speech-sdk";

const audioFile = "/tmp/text-to-speech.wav";
// This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
const speechConfig = sdk.SpeechConfig.fromSubscription(
  process.env.SPEECH_KEY as string,
  "eastus"
);
const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

// The language of the voice that speaks.
speechConfig.speechSynthesisVoiceName = "en-US-AvaMultilingualNeural";

// Create the speech synthesizer.
const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

const text = "Hello, world!";

synthesizer.speakTextAsync(
  text,
  function (result) {
    if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
      console.log("synthesis finished.");
    } else {
      console.error(
        "Speech synthesis canceled, " +
          result.errorDetails +
          "\nDid you set the speech resource key and region values?"
      );
    }
    synthesizer.close();
  },
  function (err) {
    console.trace("err - " + err);
    synthesizer.close();
  }
);
console.log("Now synthesizing to: " + audioFile);
