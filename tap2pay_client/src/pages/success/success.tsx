import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchWrapper } from '../../helper/fetcher';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import CryptoJS from 'crypto-js';

const secretKey = '12345678';

const Success: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const paymentId = searchParams.get('paymentId');
    const PayerID = searchParams.get('PayerID');
    const cart = searchParams.get('cart');
    const totalAmount = searchParams.get('totalAmount');

    const token = searchParams.get('token');


    const executePayment = async () => {
        try {
            searchParams.delete('paymentId');
            searchParams.delete('PayerID');
            searchParams.delete('cart');
            searchParams.delete('totalAmount');
            const response = await fetchWrapper('/paypal/execute-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ paymentId, cart, totalAmount, PayerID }),
            });
            if (response.code === 200) {
                navigate('/success', { replace: true });
                toast.success(response.message);
            }
            setIsLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // useEffect(() => {
    //     if (PayerID) {
    //         executePayment();
    //     }
    // }, [searchParams]);
    useEffect(() => {
    if (token) {
        // 🔁 Handle subscription execution
        (async () => {
            try {
                const response = await fetchWrapper(`/subscription/execute?token=${token}`);
                if (response?.agreement?.state === 'Active') {
                    toast.success('Subscription successful!');
                } else {
                    toast.error('Subscription failed or inactive.');
                }
            } catch (err) {
                console.error(err);
                toast.error('Error during subscription execution.');
            } finally {
                setIsLoading(false);
            }
        })();
    } else if (PayerID) {
        // 🛒 Normal one-time payment
        executePayment();
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
                    <Button variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
                        Go to Dashboard
                    </Button>
                </Box>
            )}
        </div>
    );
};

export default Success;
