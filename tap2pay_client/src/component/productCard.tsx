import React, { useState } from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

const ProductCard = ({ product, onQuantityChange }: any) => {
  const [quantity, setQuantity] = useState(0);

  const increase = () => {
    setQuantity(q => {
      const newQty = q + 1;
      onQuantityChange(product, newQty);
      return newQty;
    });
  };

  const decrease = () => {
    setQuantity(q => {
      const newQty = Math.max(q - 1, 0);
      onQuantityChange(product, newQty);
      return newQty;
    });
  };

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h6">{product.name}</Typography>
        <Typography variant="subtitle1">${product.price.toFixed(2)}</Typography>

        <Box mt={2} display="flex" alignItems="center">
          <Button variant="outlined" onClick={decrease}>-</Button>
          <Typography mx={2}>{quantity}</Typography>
          <Button variant="outlined" onClick={increase}>+</Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
