package com.seguros.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.Enumeration;

@Slf4j
public class ApiKeyFilter implements Filter {

    // API Key fija para pruebas
    private static final String VALID_API_KEY = "123456";

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        //  Dejar pasar el preflight de CORS sin exigir API key
        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
            return;
        }

        // Log de todos los headers para depuración
        log.info(" Todos los headers recibidos:");
        Enumeration<String> headerNames = httpRequest.getHeaderNames();
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                log.info("  {}: {}", headerName, httpRequest.getHeader(headerName));
            }
        }

        // Obtener API Key del header
        String apiKey = httpRequest.getHeader("x-api-key");

        log.info(" API Key recibida: '{}'", apiKey);
        log.info(" API Key esperada: '{}'", VALID_API_KEY);

        // Validación
        if (apiKey == null || !apiKey.equals(VALID_API_KEY)) {
            log.warn(" API Key inválida o no proporcionada");
            httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpResponse.getWriter().write("API Key inválida o no proporcionada");
            return;
        }

        log.info(" API Key válida, continuando...");
        chain.doFilter(request, response);
    }
}