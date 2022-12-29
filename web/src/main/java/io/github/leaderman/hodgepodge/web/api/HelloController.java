package io.github.leaderman.hodgepodge.web.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/hello")
public class HelloController {
  @GetMapping("/get")
  public String get() {
    return "hello get";
  }
}
