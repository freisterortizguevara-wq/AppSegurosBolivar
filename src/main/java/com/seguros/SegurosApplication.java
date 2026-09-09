package com.seguros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class SegurosApplication {

    public static void main(String[] args) {
        SpringApplication.run(SegurosApplication.class, args);
        System.out.println("🚀 Seguros Bolívar Backend iniciado en http://localhost:8080");
    }
}