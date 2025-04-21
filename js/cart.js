class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
        this.renderCart();
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({ ...product, quantity: 1 });
        }
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, newQuantity);
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(el => {
            el.textContent = count;
        });
    }

    calculateTotal() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    renderCart() {
        const cartItemsContainer = document.querySelector('.cart-items');
        if (!cartItemsContainer) return;

        const emptyCartMessage = document.querySelector('.empty-cart-message');
        const cartSummary = document.querySelector('.cart-summary');
        const checkoutBtn = document.querySelector('.checkout-btn');

        if (this.items.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="index.html" class="btn-primary">Continue Shopping</a>
                </div>
            `;
            if (checkoutBtn) checkoutBtn.disabled = true;
            return;
        }

        cartItemsContainer.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>RM${item.price.toFixed(2)}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="increase-quantity">+</button>
                    </div>
                </div>
                <button class="remove-item">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');

        if (cartSummary) {
            const subtotal = this.calculateTotal();
            const shipping = subtotal > 0 ? 5.99 : 0;
            const total = subtotal + shipping;

            document.querySelector('.subtotal').textContent = `RM${subtotal.toFixed(2)}`;
            document.querySelector('.shipping').textContent = `RM${shipping.toFixed(2)}`;
            document.querySelector('.total-amount').textContent = `RM${total.toFixed(2)}`;

            this.items.forEach(item => {
                const itemElement = document.querySelector(`.cart-item[data-id="${item.id}"]`);
                if (itemElement) {
                    const decreaseBtn = itemElement.querySelector('.decrease-quantity');
                    const increaseBtn = itemElement.querySelector('.increase-quantity');
                    const removeBtn = itemElement.querySelector('.remove-item');

                    decreaseBtn.addEventListener('click', () => {
                        this.updateQuantity(item.id, item.quantity - 1);
                    });

                    increaseBtn.addEventListener('click', () => {
                        this.updateQuantity(item.id, item.quantity + 1);
                    });

                    removeBtn.addEventListener('click', () => {
                        this.removeItem(item.id);
                    });
                }
            });

            if (checkoutBtn) checkoutBtn.disabled = false;
        }
    }
}

const cart = new Cart();

document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('RM', '')),
                image: productCard.querySelector('img').src
            };
            cart.addItem(product);
        });
    });

    const featuredAddToCartButtons = document.querySelectorAll('.featured-product .add-to-cart-btn');
    featuredAddToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.featured-product');
            const product = {
                id: productCard.dataset.id,
                name: productCard.querySelector('h3').textContent,
                price: parseFloat(productCard.querySelector('.price').textContent.replace('RM', '')),
                image: productCard.querySelector('img').src
            };
            cart.addItem(product);
        });
    });
}); 