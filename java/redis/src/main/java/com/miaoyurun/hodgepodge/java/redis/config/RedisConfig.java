package com.miaoyurun.hodgepodge.java.redis.config;

import org.springframework.boot.autoconfigure.cache.RedisCacheManagerBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;

import java.time.Duration;

@Configuration
public class RedisConfig {
    @Bean
    public RedisCacheManagerBuilderCustomizer redisCacheManagerBuilderCustomizer() {
        return (builder) -> {
            String cacheName = "user::get";
            int ttl = 30;

            RedisCacheConfiguration configuration = RedisCacheConfiguration.defaultCacheConfig();
            configuration = configuration.entryTtl(Duration.ofSeconds(ttl));

            // 可以多次调用为不同的缓存名称设置不同的配置
            builder.withCacheConfiguration(cacheName, configuration);
        };
    }
}
