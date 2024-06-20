<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Initiate PayPal Payment</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <style>
        body {
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            margin-bottom: 20px;
        }
        label {
            font-weight: bold;
        }
        button {
            width: 100%;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>PayPal Payment</h1>
    <form action="PaypalServlet" method="post">
        <input type="hidden" name="action" value="create" />
        <div class="form-group">
            <label for="total">Total Amount</label>
            <input type="number" step="0.01" id="total" name="total" class="form-control" placeholder="Enter total amount" required>
        </div>
        <div class="form-group">
            <label for="currency">Currency</label>
            <input type="text" id="currency" name="currency" class="form-control" value="USD" required>
        </div>
        <div class="form-group">
            <label for="description">Description</label>
            <input type="text" id="description" name="description" class="form-control" placeholder="Enter payment description" required>
        </div>
        <button type="submit" class="btn btn-primary">Pay Now</button>
    </form>
</div>
<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.9.2/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
</body>
</html>
