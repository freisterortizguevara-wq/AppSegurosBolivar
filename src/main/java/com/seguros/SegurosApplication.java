package com.seguros;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@SpringBootApplication
public class SegurosApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext context = SpringApplication.run(SegurosApplication.class, args);

        // Listar todos los endpoints registrados
        RequestMappingHandlerMapping mapping = context.getBean(RequestMappingHandlerMapping.class);
        System.out.println("📋 ENDPOINTS REGISTRADOS:");
        mapping.getHandlerMethods().forEach((key, value) ->
                System.out.println("  " + key)
        );

        System.out.println(" Seguros Bolívar Backend iniciado en http://localhost:8080");
    }
}