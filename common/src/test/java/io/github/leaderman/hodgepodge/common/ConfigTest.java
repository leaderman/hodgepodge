package io.github.leaderman.hodgepodge.common;

import org.junit.jupiter.api.Test;

import java.util.Map;

public class ConfigTest {
    @Test
    public void list() {
        Map<String, String> properties = Config.list();
        System.out.println("properties: " + properties.size());

        for (Map.Entry<String, String> entry : properties.entrySet()) {
            System.out.println("key: " + entry.getKey() + ", value: " + entry.getValue());
        }
    }

    @Test
    public void get() {
        String key = "azure.speech.region";
        String value = Config.get(key);

        System.out.println("key: " + key + ", value: " + value);
    }
}
