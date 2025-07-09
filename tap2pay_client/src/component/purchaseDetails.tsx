import React, { useEffect } from 'react';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { fetchWrapper } from '../helper/fetcher';
import CryptoJS from 'crypto-js';

const secretKey = '12345678';

const PurchaseDetails: React.FC = () => {
    const [purchaseDetails, setPurchaseDetails] = React.useState([])
    const fetchPurchaseDetails = async () => {
        const response = await fetchWrapper('/paypal/get-purchases');
        setPurchaseDetails(response.results?.details);
    }

    useEffect(() => {
        fetchPurchaseDetails();
    }, []);
    return (
        <Box>
            <TableContainer sx={{ width: '100%', backgroundColor: 'white', borderRadius: '5px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Products</TableCell>
                            <TableCell>Total Quantity</TableCell>
                            <TableCell>PaymentId</TableCell>
                            <TableCell>Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            purchaseDetails.length > 0 ? purchaseDetails.map((item: any) => {
                                const decryptCart = CryptoJS.AES.decrypt(item?.cart.replaceAll(' ', '+'), secretKey);
                                const decryptedCart = JSON.parse(decryptCart.toString(CryptoJS.enc.Utf8));

                            // Extract names and total quantity
                            const productNames = decryptedCart.map((p: any) => p.name).join(', ');
                            const totalQuantity = decryptedCart.reduce((acc: number, p: any) => acc + p.quantity, 0);

                            return (
                                <TableRow key={item._id}>
                                    <TableCell>
                                        <div style={{
                                            maxWidth: '150px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {productNames}
                                        </div>
                                    </TableCell>
                                    <TableCell>{totalQuantity}</TableCell>
                                    <TableCell>{item.paymentId}</TableCell>
                                    <TableCell>${item.amount}</TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    No purchase details found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default PurchaseDetails;
