const USER_ID = 'user-1';

function newBook(book) {
    const div = document.createElement('div');
    div.className = 'column is-4';
    div.innerHTML = `
        <div class="card is-shady">
            <div class="card-image">
                <figure class="image is-4by3">
                    <img
                        src="${book.photo}"
                        alt="${book.name}"
                        class="modal-button"
                    />
                </figure>
            </div>
            <div class="card-content">
                <div class="content book" data-id="${book.id}">
                    <div class="book-meta">
                        <p class="is-size-4">R$${book.price.toFixed(2)}</p>
                        <p class="is-size-6">Disponível em estoque: 5</p>
                        <h4 class="is-size-3 title">${book.name}</h4>
                        <p class="subtitle">${book.author}</p>
                    </div>
                    <div class="field has-addons">
                        <div class="control">
                            <input class="input" type="text" placeholder="Digite o CEP" />
                        </div>
                        <div class="control">
                            <a class="button button-shipping is-info" data-id="${book.id}"> Calcular Frete </a>
                        </div>
                    </div>
                    <button class="button button-add-cart is-warning is-fullwidth" 
                            data-id="${book.id}" 
                            data-name="${book.name}" 
                            data-price="${book.price}">
                        Adicionar ao Carrinho
                    </button>
                    <button class="button button-buy is-success is-fullwidth" style="margin-top: 10px;">Comprar Agora</button>
                </div>
            </div>
        </div>`;
    return div;
}

function calculateShipping(id, cep) {
    fetch('http://localhost:3000/shipping/' + cep)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            swal('Frete', `O frete é: R$${data.value.toFixed(2)}`, 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao consultar frete', 'error');
            console.error(err);
        });
}

function addToCart(productId, productName, productPrice, quantity = 1) {
    fetch(`http://localhost:3000/cart/${USER_ID}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            productId: parseInt(productId),
            productName,
            productPrice: parseFloat(productPrice),
            quantity,
        }),
    })
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            updateCartCount(data.itemCount);
            swal('Carrinho', 'Produto adicionado ao carrinho!', 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao adicionar ao carrinho', 'error');
            console.error(err);
        });
}

function getCart() {
    return fetch(`http://localhost:3000/cart/${USER_ID}`)
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        });
}

function removeFromCart(productId) {
    fetch(`http://localhost:3000/cart/${USER_ID}/items/${productId}`, {
        method: 'DELETE',
    })
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            updateCartCount(data.itemCount);
            showCart();
        })
        .catch((err) => {
            swal('Erro', 'Erro ao remover do carrinho', 'error');
            console.error(err);
        });
}

function updateItemQuantity(productId, quantity) {
    fetch(`http://localhost:3000/cart/${USER_ID}/items/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            quantity: parseInt(quantity),
        }),
    })
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            updateCartCount(data.itemCount);
            showCart();
        })
        .catch((err) => {
            swal('Erro', 'Erro ao atualizar quantidade', 'error');
            console.error(err);
        });
}

function clearCart() {
    fetch(`http://localhost:3000/cart/${USER_ID}`, {
        method: 'DELETE',
    })
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            updateCartCount(0);
            showCart();
            swal('Carrinho', 'Carrinho limpo com sucesso!', 'success');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao limpar carrinho', 'error');
            console.error(err);
        });
}

function updateCartCount(count) {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = count;
    }
}

function showCart() {
    getCart()
        .then((cart) => {
            const cartItemsContainer = document.getElementById('cart-items');
            const cartTotal = document.getElementById('cart-total');
            const modal = document.getElementById('cart-modal');

            updateCartCount(cart.itemCount);

            if (cart.items && cart.items.length > 0) {
                cartItemsContainer.innerHTML = cart.items
                    .map(
                        (item) => `
                    <div class="box">
                        <div class="columns is-vcentered">
                            <div class="column is-6">
                                <strong>${item.productName}</strong><br>
                                <small>R$ ${item.productPrice.toFixed(2)}</small>
                            </div>
                            <div class="column is-3">
                                <div class="field has-addons">
                                    <p class="control">
                                        <button class="button is-small" onclick="updateItemQuantity(${item.productId}, ${item.quantity - 1})">-</button>
                                    </p>
                                    <p class="control">
                                        <input class="input is-small" type="text" value="${item.quantity}" readonly style="width: 50px; text-align: center;">
                                    </p>
                                    <p class="control">
                                        <button class="button is-small" onclick="updateItemQuantity(${item.productId}, ${item.quantity + 1})">+</button>
                                    </p>
                                </div>
                            </div>
                            <div class="column is-2">
                                <strong>R$ ${item.subtotal.toFixed(2)}</strong>
                            </div>
                            <div class="column is-1">
                                <button class="button is-danger is-small" onclick="removeFromCart(${item.productId})">🗑️</button>
                            </div>
                        </div>
                    </div>
                `
                    )
                    .join('');
                cartTotal.textContent = cart.total.toFixed(2);
            } else {
                cartItemsContainer.innerHTML = '<p class="has-text-centered">Carrinho vazio</p>';
                cartTotal.textContent = '0.00';
            }

            modal.classList.add('is-active');
        })
        .catch((err) => {
            swal('Erro', 'Erro ao carregar carrinho', 'error');
            console.error(err);
        });
}

function closeCart() {
    const modal = document.getElementById('cart-modal');
    modal.classList.remove('is-active');
}

document.addEventListener('DOMContentLoaded', function () {
    const books = document.querySelector('.books');

    getCart().then((cart) => {
        updateCartCount(cart.itemCount);
    }).catch(console.error);

    document.getElementById('cart-button').addEventListener('click', showCart);
    document.getElementById('close-cart').addEventListener('click', closeCart);
    document.querySelector('.modal-background').addEventListener('click', closeCart);
    
    document.getElementById('clear-cart').addEventListener('click', () => {
        swal({
            title: 'Limpar Carrinho',
            text: 'Tem certeza que deseja limpar o carrinho?',
            icon: 'warning',
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                clearCart();
            }
        });
    });

    document.getElementById('checkout-cart').addEventListener('click', () => {
        getCart().then((cart) => {
            if (cart.items && cart.items.length > 0) {
                swal('Compra Finalizada', `Sua compra no valor de R$ ${cart.total.toFixed(2)} foi realizada com sucesso!`, 'success');
                clearCart();
                closeCart();
            } else {
                swal('Carrinho Vazio', 'Adicione produtos ao carrinho antes de finalizar a compra', 'warning');
            }
        });
    });

    fetch('http://localhost:3000/products')
        .then((data) => {
            if (data.ok) {
                return data.json();
            }
            throw data.statusText;
        })
        .then((data) => {
            if (data) {
                data.forEach((book) => {
                    books.appendChild(newBook(book));
                });

                document.querySelectorAll('.button-shipping').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const id = e.target.getAttribute('data-id');
                        const cep = document.querySelector(`.book[data-id="${id}"] input`).value;
                        calculateShipping(id, cep);
                    });
                });

                document.querySelectorAll('.button-add-cart').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        const productId = e.target.getAttribute('data-id');
                        const productName = e.target.getAttribute('data-name');
                        const productPrice = e.target.getAttribute('data-price');
                        addToCart(productId, productName, productPrice, 1);
                    });
                });

                document.querySelectorAll('.button-buy').forEach((btn) => {
                    btn.addEventListener('click', (e) => {
                        swal('Compra de livro', 'Sua compra foi realizada com sucesso', 'success');
                    });
                });
            }
        })
        .catch((err) => {
            swal('Erro', 'Erro ao listar os produtos', 'error');
            console.error(err);
        });
});
