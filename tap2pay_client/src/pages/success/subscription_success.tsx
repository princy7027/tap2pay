import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchWrapper } from "../../helper/fetcher";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import toast from "react-hot-toast";

const SubscriptionSuccess: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const processSubscription = async () => {
      try {
        debugger
        const response = await fetchWrapper(`/subscription/execute?token=${token}`);
        if (response?.agreement?.state === "Active") {
          toast.success("Subscription successful!");
        } else {
          toast.error("Subscription failed or inactive.");
        }
      } catch (err) {
        toast.success("Subscription successful!");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      processSubscription();
    } else {
      toast.error("No subscription token found.");
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
            Your subscription has been activated!
          </Typography>
          <Button variant="contained" color="primary" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
        </Box>
      )}
    </div>
  );
};

export default SubscriptionSuccess;
