package com.miaoyurun.hodgepodge.java.schedule.task;

import net.javacrumbs.shedlock.spring.annotation.SchedulerLock;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class ScheduleTask {
    @Scheduled(cron = "0/10 * * * * ?")
    @SchedulerLock(name = "doTask", lockAtMostFor = "PT1M", lockAtLeastFor = "PT5S")
    public void doTask() {
        System.out.println("do task");
    }
}
