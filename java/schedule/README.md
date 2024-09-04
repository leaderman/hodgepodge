# 分布式锁

通过使用 ShedLock，可以在 Spring Boot 应用中管理分布式定时任务的执行，确保任务不会在多个实例中同时运行。

要结合任务实际运行时间的长短，设置锁的最长持有时间（lockAtMostFor） 和最短持有时间（lockAtLeastFor）。