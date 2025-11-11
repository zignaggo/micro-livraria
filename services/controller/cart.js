const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { CART_HOST } = require('./host');

const packageDefinition = protoLoader.loadSync('proto/cart.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const CartService = grpc.loadPackageDefinition(packageDefinition).CartService;
const client = new CartService(`${CART_HOST}:3003`, grpc.credentials.createInsecure());

module.exports = client;

