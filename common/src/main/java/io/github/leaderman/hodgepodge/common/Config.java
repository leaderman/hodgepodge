package io.github.leaderman.hodgepodge.common;

import org.apache.commons.collections4.CollectionUtils;

import java.io.IOException;
import java.util.*;

public class Config {
    private static final String CONFIG_PROPERTIES = "config.properties";

    private static final Properties PROPERTIES = new Properties();

    static {
        try {
            PROPERTIES.load(Config.class.getClassLoader().getResourceAsStream(CONFIG_PROPERTIES));
        } catch (IOException e) {
            throw new ExceptionInInitializerError(e);
        }
    }

    public static void set(String key, String value) {
        PROPERTIES.setProperty(key, value);
    }

    public static String get(String key) {
        return PROPERTIES.getProperty(key);
    }

    public static Map<String, String> list() {
        Set<String> keys = PROPERTIES.stringPropertyNames();
        if (CollectionUtils.isEmpty(keys)) {
            return Collections.emptyMap();
        }

        Map<String, String> properties = new HashMap<>(PROPERTIES.size());
        for (String key : keys) {
            properties.put(key, PROPERTIES.getProperty(key));
        }

        return properties;
    }
}
