package com.yarin.sbt;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SbtApplication {
    public static void main(String[] args) {
        SpringApplication.run(SbtApplication.class, args);
    }
}
