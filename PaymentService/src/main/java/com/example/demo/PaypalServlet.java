package com.example.demo;

import com.example.demo.Services.PaypalService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@WebServlet("/PaypalServlet")
public class PaypalServlet extends HttpServlet {

    private PaypalService paypalService;

    public void init() throws ServletException {
        String clientId = "AYeuWQQx8kyTEfEqwt1hxvC7WXx4q9lP6Pb3z-ZOoc1zvPUZ2c-_XfKeTx0VEGveWyws0ScppR8o25XA";
        String clientSecret = "EETlpSVIy9AkZeJP__MPqMTDjujXy9-9_c9BGt8A5i7hXfFwUhh9T3wdk-Ygi8PgtBPNGZtROxRRPQDo";
        String mode = "sandbox";
        APIContext apiContext = new APIContext(clientId, clientSecret, mode);
        paypalService = new PaypalService(apiContext);
    }
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String action = request.getParameter("action");

        if ("success".equals(action)) {
            handleSuccess(request, response);
        } else if ("cancel".equals(action)) {
            handleCancel(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action.");
        }
    }
    private void handleSuccess(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/success.jsp");
    }

    private void handleCancel(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.sendRedirect(request.getContextPath() + "/cancel.jsp");
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
        String action = request.getParameter("action");

        if ("create".equals(action)) {
            createPayment(request, response);
        } else if ("execute".equals(action)) {
            executePayment(request, response);
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid action.");
        }
    }

    private void createPayment(HttpServletRequest request, HttpServletResponse response) throws IOException {
        try {
            double total = Double.parseDouble(request.getParameter("total"));
            String currency = request.getParameter("currency");
            String description = request.getParameter("description");

            String cancelUrl = request.getRequestURL().toString() + "?action=cancel";
            String successUrl = request.getRequestURL().toString() + "?action=success";

            Payment payment = paypalService.createPayment(
                    total,
                    currency,
                    "paypal",
                    "sale",
                    description,
                    cancelUrl,
                    successUrl
            );

            // Redirect to PayPal approval URL
            String approvalUrl = payment.getLinks().stream()
                    .filter(link -> "approval_url".equals(link.getRel().toLowerCase()))
                    .findFirst()
                    .map(link -> link.getHref())
                    .orElse(null);

            if (approvalUrl != null) {
                response.sendRedirect(approvalUrl);
            } else {
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Approval URL not found in PayPal response.");
            }

        } catch (PayPalRESTException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error creating payment: " + e.getMessage());
        }
    }

    private void executePayment(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String paymentId = request.getParameter("paymentId");
            String payerId = request.getParameter("PayerID");

            Payment payment = paypalService.executePayment(paymentId, payerId);

            if ("approved".equals(payment.getState())) {
                response.sendRedirect(request.getContextPath() + "/success.jsp");
            } else {
                response.sendRedirect(request.getContextPath() + "/failure.jsp");
            }
        } catch (PayPalRESTException e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error executing payment: " + e.getMessage());
        }
    }

}
