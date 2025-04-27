const productsGrid = document.getElementById('products-grid');
const filterButtons = document.querySelectorAll('.filter-btn');
const themeToggle = document.getElementById('theme-toggle');
const themeStyle = document.getElementById('theme-style');
const body = document.body;

body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

async function loadProductData() {
    try {
        const response = await fetch('xml/products.xml');
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
        return xmlDoc;
    } catch (error) {
        console.error('Error loading product data:', error);
        return null;
    }
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const name = product.querySelector('name').textContent;
    const price = product.querySelector('price').textContent;
    const stock = product.querySelector('stock').textContent
    const image = product.querySelector('image').textContent;
    const description = product.querySelector('description').textContent;
    const productId = product.querySelector('id').textContent;

    let specsHtml = '';
    const specs = product.querySelector('specs');
    if (specs) {
        const specsList = Array.from(specs.children).map(spec =>
            `<li>${spec.tagName}: ${spec.textContent}</li>`
        ).join('');
        specsHtml = `
            <div class="specs">
                <h4>Specifications:</h4>
                <ul>${specsList}</ul>
            </div>
        `;
    }

    card.innerHTML = `
        <img src="${image}" alt="${name}" class="product-image">
        <div class="product-info">
            <h3>${name}</h3>
            <p class="description">${description}</p>
            <p class="price">RM${price}</p>
            <p class="stock">Stock: ${stock}</p>
            ${specsHtml}
            <div class="product-actions">
                <button class="add-to-cart-btn" data-product-id="${productId}">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="buy-now-btn" data-product-id="${productId}">
                    <i class="fas fa-bolt"></i> Buy Now
                </button>
            </div>
        </div>
    `;

    return card;
}

async function filterProducts(category) {
    const xmlDoc = await loadProductData();
    if (!xmlDoc) return;

    productsGrid.innerHTML = '';
    const categories = xmlDoc.getElementsByTagName('category');

    Array.from(categories).forEach(categoryElement => {
        const categoryName = categoryElement.getAttribute('name');
        if (category === 'all' || categoryName === category) {
            const products = categoryElement.getElementsByTagName('product');
            Array.from(products).forEach(product => {
                const card = createProductCard(product);
                productsGrid.appendChild(card);
            });
        }
    });
}

function toggleTheme() {
    const isTheme1 = themeStyle.href.includes('theme1.css');
    const newTheme = isTheme1 ? 'theme2' : 'theme1';

    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';

    themeStyle.href = `css/${newTheme}.css`;
    themeToggle.textContent = newTheme === 'theme1' ? '🌓' : '☀️';

    localStorage.setItem('theme', newTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    filterProducts('all');

    const filterButtons = document.querySelectorAll('.filter-btn, .category-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const category = button.getAttribute('data-category');
            filterProducts(category);
        });
    });

    themeToggle.addEventListener('click', toggleTheme);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeStyle.href = `css/${savedTheme}.css`;
        themeToggle.textContent = savedTheme === 'theme1' ? '🌓' : '☀️';
    }

    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.toLowerCase();
            const products = document.querySelectorAll('.product-card');

            products.forEach(product => {
                const name = product.querySelector('h3').textContent.toLowerCase();
                const description = product.querySelector('.description').textContent.toLowerCase();

                if (name.includes(searchTerm) || description.includes(searchTerm)) {
                    product.style.display = '';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            const sortValue = sortSelect.value;
            const productsGrid = document.getElementById('products-grid');
            const products = Array.from(productsGrid.children);

            products.sort((a, b) => {
                const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                const nameA = a.querySelector('h3').textContent;
                const nameB = b.querySelector('h3').textContent;

                switch (sortValue) {
                    case 'price-asc':
                        return priceA - priceB;
                    case 'price-desc':
                        return priceB - priceA;
                    case 'name-asc':
                        return nameA.localeCompare(nameB);
                    case 'name-desc':
                        return nameB.localeCompare(nameA);
                    default:
                        return 0;
                }
            });

            products.forEach(product => productsGrid.appendChild(product));
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.add-to-cart-btn')) {
        const button = e.target.closest('.add-to-cart-btn');
        const productId = button.dataset.productId;
        addToCart(productId);
    } else if (e.target.closest('.buy-now-btn')) {
        const button = e.target.closest('.buy-now-btn');
        const productId = button.dataset.productId;
        buyNow(productId);
    }
});

function addToCart(productId) {
    alert(`Product ${productId} added to cart!`);
}

function buyNow(productId) {
    alert(`Proceeding to checkout for product ${productId}`);
}
