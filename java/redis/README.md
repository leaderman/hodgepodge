# TTL

默认不支持 TTL。

需要使用 `RedisCacheManagerBuilderCustomizer` 配置和定制 Redis 缓存的行为，特别是在需要为不同缓存名称设置不同过期策略的情况下。

# 注意事项

在同一个 Spring Bean 内部调用使用 @Cacheable 注解的缓存方法时，这个缓存不会生效。

这是因为 Spring 的缓存注解（包括 @Cacheable、@CachePut、@CacheEvict 等）依赖于 Spring 的 AOP 代理机制来工作。当一个方法被调用时，只有通过代理的调用才能触发与缓存相关的逻辑。
