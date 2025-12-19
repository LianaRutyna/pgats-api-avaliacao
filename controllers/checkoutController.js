const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');

// Simulação de banco de dados de produtos em memória
const products = [
  { id: 1, name: 'Produto 1', price: 100 },
  { id: 2, name: 'Produto 2', price: 200 },
];

// Simulação de banco de dados de checkout em memória
const orders = [];

router.post('/', authMiddleware, (req, res) => {
  const { productId, quantity, payment } = req.body;
  
  // Validações
  if (!productId || !quantity || !payment) {
    return res.status(400).json({ error: 'productId, quantity, and payment are required' });
  }

  // Verifica se o produto existe
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Cria ordem de checkout
  const order = {
    id: orders.length + 1,
    userId: req.user.id,
    productId,
    quantity,
    payment,
    totalPrice: product.price * quantity,
    createdAt: new Date(),
  };

  orders.push(order);

  return res.status(201).json(order);
});

module.exports = router;
