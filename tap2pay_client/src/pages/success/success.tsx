import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../helper/fetcher";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

const Success: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");

  const type = searchParams.get("type");
  const paymentId = searchParams.get("paymentId");
  const PayerID = searchParams.get("PayerID");
  const cart = searchParams.get("cart");
  const totalAmount = searchParams.get("totalAmount");

  useEffect(() => {
    const processSubscription = async () => {
      try {
        const response = await fetchWrapper(`/subscription/execute?token=${token}`);
        if (response?.agreement?.state === "Active") {
          toast.success("Subscription successful!");
        } else {
          toast.error("Subscription failed or inactive.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error during subscription execution.");
      } finally {
        setIsLoading(false);
      }
    };

    const processPayment = async () => {
      try {
        const response = await fetchWrapper("/paypal/execute-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentId, cart, totalAmount, PayerID }),
        });
        if (response.code === 200) {
          toast.success(response.message);
        } else {
          toast.error("Payment failed.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Payment processing failed.");
      } finally {
        setIsLoading(false);
      }
    };

    // 🔁 Route based on `type`

debugger
    if (type === "subscription" && token) {
      processSubscription();
    } else if (type === "payment" && paymentId && PayerID) {
      processPayment();
    } else {
      toast.error("Invalid payment state. Please contact support.");
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <div>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography variant="h5" gutterBottom>
            Your payment has been successfully processed.
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Box>
      )}
    </div>
  );
};

export default Success;
