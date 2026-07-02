// ===== ItalianCoffee - script.js =====

// ----- 1) Menu hamburguer (DOM + evento click) -----
const menuToggle = document.getElementById('menu-toggle');
const navbar = document.getElementById('navbar');

menuToggle.addEventListener('click', function () {
    navbar.classList.toggle('active');
});

// fecha o menu mobile ao clicar em um link
navbar.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
        navbar.classList.remove('active');
    });
});

// ----- 2) Carrinho de compras (arrays/objetos + localStorage + eventos) -----
const CART_KEY = 'italiancoffee_cart';

// carrega o carrinho salvo (array de objetos) ou cria um novo
let cart = JSON.parse(localStorage.getItem(CART_KEY)) || [];

const cartCountEl = document.getElementById('cart-count');
const cartIcon = document.getElementById('cart-icon');

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function getCartTotal() {
    return cart.reduce(function (total, item) {
        return total + item.price;
    }, 0);
}

function updateCartUI() {
    cartCountEl.textContent = cart.length;
}

function addToCart(name, price) {
    cart.push({ name: name, price: price });
    saveCart();
    updateCartUI();
}

document.querySelectorAll('.add-to-cart').forEach(function (button) {
    button.addEventListener('click', function () {
        const name = button.dataset.name;
        const price = parseFloat(button.dataset.price);
        addToCart(name, price);
    });
});

cartIcon.addEventListener('click', function () {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio.');
        return;
    }

    const itemsText = cart
        .map(function (item) {
            return '- ' + item.name + ' (R$ ' + item.price.toFixed(2) + ')';
        })
        .join('\n');

    alert('Seu carrinho:\n' + itemsText + '\n\nTotal: R$ ' + getCartTotal().toFixed(2));
});

updateCartUI();

// ----- 3) Formulário de contato (validação + alteração dinâmica de conteúdo) -----
const contactForm = document.getElementById('contact-form');
const formFeedback = document.getElementById('form-feedback');

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

contactForm.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (name === '' || email === '' || message === '') {
        formFeedback.textContent = 'Por favor, preencha todos os campos.';
        formFeedback.style.color = '#e74c3c';
        return;
    }

    if (!isValidEmail(email)) {
        formFeedback.textContent = 'Digite um e-mail válido.';
        formFeedback.style.color = '#e74c3c';
        return;
    }

    // salva a mensagem localmente (array de objetos no localStorage)
    const messages = JSON.parse(localStorage.getItem('italiancoffee_messages')) || [];
    messages.push({ name: name, email: email, message: message, date: new Date().toISOString() });
    localStorage.setItem('italiancoffee_messages', JSON.stringify(messages));

    formFeedback.style.color = '#d3ad7f';
    formFeedback.textContent = 'Obrigado, ' + name + '! Sua mensagem foi enviada com sucesso.';
    contactForm.reset();
});

// ----- 4) Frase do dia (fetch em API externa) -----
const dailyQuoteEl = document.getElementById('daily-quote');

fetch('https://dummyjson.com/quotes/random')
    .then(function (response) {
        if (!response.ok) {
            throw new Error('Falha ao buscar a frase do dia');
        }
        return response.json();
    })
    .then(function (data) {
        dailyQuoteEl.textContent = '"' + data.quote + '" — ' + data.author;
    })
    .catch(function () {
        dailyQuoteEl.textContent = 'O café é a pausa perfeita para os pequenos grandes momentos.';
    });
