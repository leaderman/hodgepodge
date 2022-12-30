package io.github.leaderman.hodgepodge.common;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Objects;

public class File {
    public static String text(String filename) throws IOException {
        try (
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(
                                Objects.requireNonNull(File.class.getClassLoader().getResourceAsStream(filename)),
                                StandardCharsets.UTF_8))
        ) {
            StringBuilder text = new StringBuilder();

            String line;
            while ((line = reader.readLine()) != null) {
                text.append(line).append("\n");
            }

            return text.toString();
        }
    }
}
