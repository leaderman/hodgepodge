package io.github.leaderman.azure.speech;

import com.microsoft.cognitiveservices.speech.*;
import io.github.leaderman.hodgepodge.common.Config;
import io.github.leaderman.hodgepodge.common.File;

import java.io.IOException;
import java.util.concurrent.ExecutionException;

public class SpeechSynthesisSample3 {
    public static void main(String[] args) {
        String subscription = Config.get("azure.speech.subscription");
        String region = Config.get("azure.speech.region");

        SpeechConfig config = SpeechConfig.fromSubscription(subscription, region);

        String text;
        try {
            text = File.text("ssml.xml");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        try (
                SpeechSynthesizer synthesizer = new SpeechSynthesizer(config);

                SpeechSynthesisResult result = synthesizer.SpeakSsmlAsync(text).get()
        ) {
            if (result.getReason() == ResultReason.SynthesizingAudioCompleted) {
                System.out.println("Speech synthesized to speaker for ssml [" + text + "]");
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
