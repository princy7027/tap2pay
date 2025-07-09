import React, { useEffect, useState } from "react";
import { fetchWrapper } from "../../helper/fetcher";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Remove, ArrowForward } from "@mui/icons-material";
import CryptoJS from "crypto-js";
import PurchaseDetails from "../../component/purchaseDetails";
import { useNavigate } from "react-router-dom";

const secretKey = "12345678";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const updateQuantity = (product, delta) => {
    setCart((prev) => {
      const currentQty = prev[product._id]?.quantity || 0;
      const newQty = Math.max(currentQty + delta, 0); // Only check for non-negative

      if (newQty === 0) {
        const updated = { ...prev };
        delete updated[product._id];
        return updated;
      }

      return {
        ...prev,
        [product._id]: {
          ...product,
          quantity: newQty,
        },
      };
    });
  };

  const handlePay = async () => {
    setIsLoading(true);
    const cartArray = Object.values(cart);
    const updatedProducts = cartArray.map((item: any) => ({
      productId: item._id,
      quantity: item.quantity,
      price: item.price,
      name: item.name,
    }));
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(updatedProducts), secretKey).toString();
    const totalAmountCiphertext = CryptoJS.AES.encrypt(JSON.stringify(totalAmount.toFixed(2)), secretKey).toString();

    const payload = {
      cart: ciphertext,
      totalAmount: totalAmountCiphertext,
    };
    try {
      const response = await fetchWrapper("/paypal/create-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      window.location.href = response?.results?.url;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = Object.values(cart).reduce((sum: number, item: any) => sum + item.quantity * item.price, 0);

  const fetchProducts = async () => {
    try {
      const response = await fetchWrapper("/paypal/get-products");
      setProducts(response.results?.details);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", {
      replace: true,
    });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    // <Container sx={{ mt: 5 }}>
    <Box>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/subscribe")} sx={{ mr: 2 }}>
              Subscribe for $10/month
            </Button>
            <Button variant="contained" color="error" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Grid item xs={12} md={8}>
                {products.map((product: any) => {
                  const quantity = cart[product._id]?.quantity || 0;
                  return (
                    <Card
                      sx={{
                        mb: 2,
                        borderRadius: 2,
                        p: 2,
                        pb: 0,
                        boxShadow: "0px 3px 10px rgba(0,0,0,0.1)",
                        width: "340px",
                      }}
                    >
                      <CardContent sx={{ p: 0 }}>
                        {/* <Grid container sx={{ mb: 1 }}>
                                            <Grid item xs={12}>
                                                <Typography variant="subtitle2" fontWeight={500}>
                                                    Remaining test: {product.remaining ?? '∞'}
                                                </Typography>
                                            </Grid>
                                        </Grid> */}

                        <Grid
                          item
                          xs={12}
                          sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <Box>
                            <Typography variant="h6" textAlign={"start"}>
                              {product.name}
                            </Typography>
                            <Typography variant="subtitle1" textAlign={"start"}>
                              ${product.price.toFixed(2)}/per product
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => updateQuantity(product, -1)}
                              disabled={quantity <= 0}
                            >
                              <Remove />
                            </IconButton>

                            <TextField
                              type="text"
                              size="small"
                              value={quantity}
                              inputProps={{
                                style: { textAlign: "center" },
                                readOnly: true,
                              }}
                              sx={{
                                width: 60,
                                "& input": {
                                  p: "4px 0",
                                },
                              }}
                            />

                            <IconButton size="small" onClick={() => updateQuantity(product, 1)}>
                              <Add />
                            </IconButton>
                          </Box>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Cart Details
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell>Quantity</TableCell>
                          <TableCell>Price</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.values(cart).map((item: any) => (
                          <TableRow key={item._id}>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.quantity}</TableCell>
                            <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={2}>
                            <strong>Total Amount</strong>
                          </TableCell>
                          <TableCell>
                            <strong>${totalAmount.toFixed(2)}</strong>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{ mt: 2 }}
                    fullWidth
                    disabled={totalAmount === 0}
                    onClick={handlePay}
                  >
                    PAY ${totalAmount.toFixed(2)}
                  </Button>
                </Paper>
              </Grid>
            </Grid>
            <Grid item xs={12} md={4} spacing={3}>
              <PurchaseDetails />
            </Grid>
          </Grid>
        </>
      )}
    </Box>
    // </Container>
  );
};

export default Dashboard;
