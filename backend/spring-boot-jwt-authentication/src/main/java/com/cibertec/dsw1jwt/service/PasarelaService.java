package com.cibertec.dsw1jwt.service;

import org.springframework.stereotype.Service;

@Service
public class PasarelaService {

    public String crearPago(Double monto, String concepto) {
        // Aquí conectas Stripe/MercadoPago
        return "https://checkout.stripe.com/pay/SESSION_ID";
    }

    public String obtenerTransaccionId(String url) {
        return "txn_123456"; // simulado
    }

    public String extraerId(String payload) {
        return "txn_123456";
    }

    public String verificarEstado(String payload) {
        return "APROBADO";
    }
}