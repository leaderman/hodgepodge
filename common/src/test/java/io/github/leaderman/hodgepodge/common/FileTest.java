package io.github.leaderman.hodgepodge.common;

import org.junit.jupiter.api.Test;

import java.io.IOException;

public class FileTest {
    @Test
    public void text() throws IOException {
        String text = File.text("file");
        System.out.println(text);
    }
}
