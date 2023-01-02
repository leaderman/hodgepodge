package io.github.leaderman.azure.speech;

import com.microsoft.cognitiveservices.speech.*;
import io.github.leaderman.hodgepodge.common.Config;

import java.util.List;
import java.util.concurrent.ExecutionException;

public class SpeechSynthesisSample4 {
    public static void main(String[] args) {
        String subscription = Config.get("azure.speech.subscription");
        String region = Config.get("azure.speech.region");

        SpeechConfig config = SpeechConfig.fromSubscription(subscription, region);

        String locale = "zh-CN";

        try (
                SpeechSynthesizer synthesizer = new SpeechSynthesizer(config);

                SynthesisVoicesResult result = synthesizer.getVoicesAsync(locale).get()
        ) {
            List<VoiceInfo> voiceInfos = result.getVoices();

            for (VoiceInfo info : voiceInfos) {
                System.out.println("name: " + info.getName());
                System.out.println("locale: " + info.getLocale());
                System.out.println("shortName: " + info.getShortName());
                System.out.println("localName: " + info.getLocalName());
                System.out.println("styleList: " + info.getStyleList());
                System.out.println("gender: " + info.getGender());

                System.out.println("++++++++++++++++++++++++++++++++++++++++++++++++");
            }
        } catch (ExecutionException | InterruptedException e) {
            throw new RuntimeException(e);
        }
    }
}
