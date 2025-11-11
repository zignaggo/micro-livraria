const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const { SHIPPING_HOST } = require('./host');

const packageDefinition = protoLoader.loadSync('proto/shipping.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const ShippingService = grpc.loadPackageDefinition(packageDefinition).ShippingService;
const client = new ShippingService(`${SHIPPING_HOST}:3001`, grpc.credentials.createInsecure());

module.exports = client;
