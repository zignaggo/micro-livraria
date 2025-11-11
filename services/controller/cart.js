const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('proto/cart.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const CartService = grpc.loadPackageDefinition(packageDefinition).CartService;
const client = new CartService('127.0.0.1:3003', grpc.credentials.createInsecure());

module.exports = client;

