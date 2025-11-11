const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync('proto/cart.proto', {
    keepCase: true,
    longs: String,
    enums: String,
    arrays: true,
});

const cartProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();

const carts = {};

function calculateCartTotals(cart) {
    let total = 0;
    let itemCount = 0;
    
    cart.items.forEach(item => {
        item.subtotal = item.productPrice * item.quantity;
        total += item.subtotal;
        itemCount += item.quantity;
    });
    
    return { total, itemCount };
}

function getOrCreateCart(userId) {
    if (!carts[userId]) {
        carts[userId] = {
            userId: userId,
            items: [],
            total: 0,
            itemCount: 0,
        };
    }
    return carts[userId];
}

server.addService(cartProto.CartService.service, {
    AddItem: (call, callback) => {
        const { userId, productId, productName, productPrice, quantity } = call.request;
        
        const cart = getOrCreateCart(userId);
        
        const existingItem = cart.items.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                productId,
                productName,
                productPrice,
                quantity,
                subtotal: 0,
            });
        }
        
        const totals = calculateCartTotals(cart);
        cart.total = totals.total;
        cart.itemCount = totals.itemCount;
        
        callback(null, cart);
    },
    
    RemoveItem: (call, callback) => {
        const { userId, productId } = call.request;
        
        const cart = getOrCreateCart(userId);
        
        cart.items = cart.items.filter(item => item.productId !== productId);
        
        const totals = calculateCartTotals(cart);
        cart.total = totals.total;
        cart.itemCount = totals.itemCount;
        
        callback(null, cart);
    },
    
    GetCart: (call, callback) => {
        const { userId } = call.request;
        
        const cart = getOrCreateCart(userId);
        
        const totals = calculateCartTotals(cart);
        cart.total = totals.total;
        cart.itemCount = totals.itemCount;
        
        callback(null, cart);
    },
    
    ClearCart: (call, callback) => {
        const { userId } = call.request;
        
        carts[userId] = {
            userId: userId,
            items: [],
            total: 0,
            itemCount: 0,
        };
        
        callback(null, carts[userId]);
    },
    
    UpdateItemQuantity: (call, callback) => {
        const { userId, productId, quantity } = call.request;
        
        const cart = getOrCreateCart(userId);
        
        const item = cart.items.find(item => item.productId === productId);
        
        if (item) {
            if (quantity <= 0) {
                cart.items = cart.items.filter(i => i.productId !== productId);
            } else {
                item.quantity = quantity;
            }
        }
        
        const totals = calculateCartTotals(cart);
        cart.total = totals.total;
        cart.itemCount = totals.itemCount;
        
        callback(null, cart);
    },
});

server.bindAsync('127.0.0.1:3003', grpc.ServerCredentials.createInsecure(), () => {
    console.log('Cart Service running at http://127.0.0.1:3003');
    server.start();
});

