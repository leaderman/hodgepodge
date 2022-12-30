package io.github.leaderman.azure.speech;

import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import io.github.leaderman.hodgepodge.common.Config;

import java.util.concurrent.ExecutionException;

public class SpeechSynthesisSample2 {
    public static void main(String[] args) {
        String subscription = Config.get("azure.speech.subscription");
        String region = Config.get("azure.speech.region");

        SpeechConfig config = SpeechConfig.fromSubscription(subscription, region);

        String language = "en-CA";
        config.setSpeechSynthesisLanguage(language);

        String voice = "zh-CN-XiaochenNeural";
        config.setSpeechSynthesisVoiceName(voice);

        String text = "你好，世界！";
        String output = "/tmp/outputaudio.wav";

        try (
                AudioConfig audioConfig = AudioConfig.fromWavFileOutput(output);
                SpeechSynthesizer synthesizer = new SpeechSynthesizer(config, audioConfig);

                SpeechSynthesisResult result = synthesizer.SpeakTextAsync(text).get()
        ) {
            if (result.getReason() == ResultReason.SynthesizingAudioCompleted) {
                System.out.println("Speech synthesized to speaker for text [" + text + "]");
            } else if (result.getReason() == ResultReason.Canceled) {
                SpeechSynthesisCancellationDetails cancellation = SpeechSynthesisCancellationDetails.fromResult(result);
                System.out.println("CANCELED: Reason=" + cancellation.getReason());

                if (cancellation.getReason() == CancellationReason.Error) {
                    System.out.println("CANCELED: ErrorCode=" + cancellation.getErrorCode());
                    System.out.println("CANCELED: ErrorDetails=" + cancellation.getErrorDetails());
                }
            }
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
