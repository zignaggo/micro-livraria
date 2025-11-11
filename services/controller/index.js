const express = require('express');
const shipping = require('./shipping');
const inventory = require('./inventory');
const cart = require('./cart');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

/**
 * Retorna a lista de produtos da loja via InventoryService
 */
app.get('/products', (req, res, next) => {
    inventory.SearchAllProducts(null, (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send({ error: 'something failed :(' });
        } else {
            res.json(data.products);
        }
    });
});

/**
 * Consulta o frete de envio no ShippingService
 */
app.get('/shipping/:cep', (req, res, next) => {
    shipping.GetShippingRate(
        {
            cep: req.params.cep,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json({
                    cep: req.params.cep,
                    value: data.value,
                });
            }
        }
    );
});

/**
 * Adiciona um item ao carrinho
 */
app.post('/cart/:userId/items', (req, res, next) => {
    const { userId } = req.params;
    const { productId, productName, productPrice, quantity } = req.body;
    
    cart.AddItem(
        {
            userId,
            productId,
            productName,
            productPrice,
            quantity: quantity || 1,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json(data);
            }
        }
    );
});

/**
 * Remove um item do carrinho
 */
app.delete('/cart/:userId/items/:productId', (req, res, next) => {
    const { userId, productId } = req.params;
    
    cart.RemoveItem(
        {
            userId,
            productId: parseInt(productId),
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json(data);
            }
        }
    );
});

/**
 * Obtém o carrinho do usuário
 */
app.get('/cart/:userId', (req, res, next) => {
    const { userId } = req.params;
    
    cart.GetCart(
        {
            userId,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json(data);
            }
        }
    );
});

/**
 * Limpa o carrinho do usuário
 */
app.delete('/cart/:userId', (req, res, next) => {
    const { userId } = req.params;
    
    cart.ClearCart(
        {
            userId,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json(data);
            }
        }
    );
});

/**
 * Atualiza a quantidade de um item no carrinho
 */
app.put('/cart/:userId/items/:productId', (req, res, next) => {
    const { userId, productId } = req.params;
    const { quantity } = req.body;
    
    cart.UpdateItemQuantity(
        {
            userId,
            productId: parseInt(productId),
            quantity,
        },
        (err, data) => {
            if (err) {
                console.error(err);
                res.status(500).send({ error: 'something failed :(' });
            } else {
                res.json(data);
            }
        }
    );
});

/**
 * Inicia o router
 */
app.listen(3000, () => {
    console.log('Controller Service running on http://127.0.0.1:3000');
});
