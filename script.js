/* =========================================
   STAR SPORTS — MAIN JAVASCRIPT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* ---------- ELEMENTS ---------- */

    const menuBtn = document.getElementById("menuBtn");
    const nav = document.getElementById("nav");

    const searchBtn = document.getElementById("searchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    const cartBtn = document.getElementById("cartBtn");
    const cartPanel = document.getElementById("cartPanel");
    const closeCart = document.getElementById("closeCart");

    const wishlistBtn = document.getElementById("wishlistBtn");
    const wishlistPanel = document.getElementById("wishlistPanel");
    const closeWishlist = document.getElementById("closeWishlist");

    const overlay = document.getElementById("panelOverlay");

    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    const wishlistItems = document.getElementById("wishlistItems");
    const wishlistCount = document.getElementById("wishlistCount");

    const checkoutBtn = document.getElementById("checkoutBtn");

    const toast = document.getElementById("toast");

    /* ---------- STORAGE ---------- */

    let cart = JSON.parse(localStorage.getItem("starSportsCart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("starSportsWishlist")) || [];


    /* ---------- HELPERS ---------- */

    function saveCart() {
        localStorage.setItem("starSportsCart", JSON.stringify(cart));
    }

    function saveWishlist() {
        localStorage.setItem(
            "starSportsWishlist",
            JSON.stringify(wishlist)
        );
    }

    function formatPrice(price) {
        return "₹" + Number(price).toLocaleString("en-IN");
    }

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);
    }


    /* ---------- MOBILE MENU ---------- */

    if (menuBtn) {
        menuBtn.addEventListener("click", () => {
            nav.classList.toggle("active");
            menuBtn.classList.toggle("active");
        });
    }

    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            menuBtn?.classList.remove("active");
        });
    });


    /* ---------- PANELS ---------- */

    function openPanel(panel) {
        panel?.classList.add("active");
        overlay?.classList.add("active");
        document.body.classList.add("no-scroll");
    }

    function closePanels() {
        cartPanel?.classList.remove("active");
        wishlistPanel?.classList.remove("active");
        overlay?.classList.remove("active");
        document.body.classList.remove("no-scroll");
    }

    cartBtn?.addEventListener("click", () => {
        renderCart();
        openPanel(cartPanel);
    });

    closeCart?.addEventListener("click", closePanels);

    wishlistBtn?.addEventListener("click", () => {
        renderWishlist();
        openPanel(wishlistPanel);
    });

    closeWishlist?.addEventListener("click", closePanels);

    overlay?.addEventListener("click", closePanels);


    /* ---------- SEARCH ---------- */

    searchBtn?.addEventListener("click", () => {
        searchPanel?.classList.add("active");
        searchInput?.focus();
    });

    closeSearch?.addEventListener("click", () => {
        searchPanel?.classList.remove("active");
        searchInput.value = "";
        filterProducts("");
    });

    searchInput?.addEventListener("input", () => {
        filterProducts(searchInput.value.toLowerCase().trim());
    });

    function filterProducts(searchTerm) {

        const products = document.querySelectorAll(".product-card");
        let found = false;

        products.forEach(product => {

            const name =
                product.dataset.name?.toLowerCase() || "";

            const category =
                product.dataset.category?.toLowerCase() || "";

            if (
                searchTerm === "" ||
                name.includes(searchTerm) ||
                category.includes(searchTerm)
            ) {
                product.style.display = "";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (searchTerm && !found) {
            showToast("No products found");
        }
    }


    /* ---------- PRODUCT DATA ---------- */

    function getProductData(productCard) {

        return {
            id: productCard.dataset.name,
            name: productCard.dataset.name,
            category: productCard.dataset.category,
            price: Number(productCard.dataset.price),
            icon:
                productCard.querySelector(".product-image i")
                    ?.className || "fa-solid fa-basketball"
        };
    }


    /* ---------- ADD TO CART ---------- */

    document.querySelectorAll(".add-cart").forEach(button => {

        button.addEventListener("click", () => {

            const productCard = button.closest(".product-card");

            if (!productCard) return;

            const product = getProductData(productCard);

            const existingProduct = cart.find(
                item => item.id === product.id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                cart.push({
                    ...product,
                    quantity: 1
                });
            }

            saveCart();
            updateCartCount();
            renderCart();

            showToast(`${product.name} added to cart`);
        });
    });


    /* ---------- CART COUNT ---------- */

    function updateCartCount() {

        const totalQuantity = cart.reduce(
            (total, item) => total + item.quantity,
            0
        );

        if (cartCount) {
            cartCount.textContent = totalQuantity;
        }
    }


    /* ---------- RENDER CART ---------- */

    function renderCart() {

        if (!cartItems) return;

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h3>Your cart is empty</h3>
                    <p>Add some sports gear to get started.</p>
                </div>
            `;

            if (cartTotal) {
                cartTotal.textContent = "₹0";
            }

            return;
        }

        cartItems.innerHTML = "";

        let total = 0;

        cart.forEach(item => {

            total += item.price * item.quantity;

            const div = document.createElement("div");

            div.className = "cart-item";

            div.innerHTML = `
                <div class="cart-item-icon">
                    <i class="${item.icon}"></i>
                </div>

                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>

                    <div class="quantity-controls">
                        <button class="qty-minus"
                            data-id="${item.id}">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button class="qty-plus"
                            data-id="${item.id}">
                            +
                        </button>
                    </div>
                </div>

                <button class="remove-cart"
                    data-id="${item.id}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            `;

            cartItems.appendChild(div);
        });

        if (cartTotal) {
            cartTotal.textContent = formatPrice(total);
        }

        addCartControls();
    }


    /* ---------- CART CONTROLS ---------- */

    function addCartControls() {

        document.querySelectorAll(".qty-minus").forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.id;

                const item = cart.find(
                    product => product.id === id
                );

                if (!item) return;

                if (item.quantity > 1) {
                    item.quantity--;
                } else {
                    cart = cart.filter(
                        product => product.id !== id
                    );
                }

                saveCart();
                updateCartCount();
                renderCart();
            });
        });


        document.querySelectorAll(".qty-plus").forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.id;

                const item = cart.find(
                    product => product.id === id
                );

                if (!item) return;

                item.quantity++;

                saveCart();
                updateCartCount();
                renderCart();
            });
        });


        document.querySelectorAll(".remove-cart").forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.id;

                cart = cart.filter(
                    product => product.id !== id
                );

                saveCart();
                updateCartCount();
                renderCart();

                showToast("Item removed from cart");
            });
        });
    }


    /* ---------- WISHLIST ---------- */

    document.querySelectorAll(".product-wishlist").forEach(button => {

        button.addEventListener("click", () => {

            const productCard =
                button.closest(".product-card");

            if (!productCard) return;

            const product = getProductData(productCard);

            const exists = wishlist.some(
                item => item.id === product.id
            );

            if (exists) {

                wishlist = wishlist.filter(
                    item => item.id !== product.id
                );

                button.classList.remove("active");

                showToast("Removed from wishlist");

            } else {

                wishlist.push(product);

                button.classList.add("active");

                showToast("Added to wishlist");
            }

            saveWishlist();
            updateWishlistCount();
            renderWishlist();
        });
    });


    /* ---------- WISHLIST COUNT ---------- */

    function updateWishlistCount() {

        if (wishlistCount) {
            wishlistCount.textContent = wishlist.length;
        }
    }


    /* ---------- UPDATE HEARTS ---------- */

    function updateWishlistButtons() {

        document
            .querySelectorAll(".product-wishlist")
            .forEach(button => {

                const productCard =
                    button.closest(".product-card");

                if (!productCard) return;

                const id = productCard.dataset.name;

                const exists = wishlist.some(
                    item => item.id === id
                );

                if (exists) {
                    button.classList.add("active");
                } else {
                    button.classList.remove("active");
                }
            });
    }


    /* ---------- RENDER WISHLIST ---------- */

    function renderWishlist() {

        if (!wishlistItems) return;

        if (wishlist.length === 0) {

            wishlistItems.innerHTML = `
                <div class="empty-state">
                    <i class="fa-regular fa-heart"></i>
                    <h3>Your wishlist is empty</h3>
                    <p>Save products you love here.</p>
                </div>
            `;

            return;
        }

        wishlistItems.innerHTML = "";

        wishlist.forEach(item => {

            const div = document.createElement("div");

            div.className = "wishlist-item";

            div.innerHTML = `
                <div class="wishlist-item-icon">
                    <i class="${item.icon}"></i>
                </div>

                <div class="wishlist-item-info">
                    <h4>${item.name}</h4>
                    <p>${formatPrice(item.price)}</p>
                </div>

                <button
                    class="wishlist-remove"
                    data-id="${item.id}">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            `;

            wishlistItems.appendChild(div);
        });

        document
            .querySelectorAll(".wishlist-remove")
            .forEach(button => {

                button.addEventListener("click", () => {

                    const id = button.dataset.id;

                    wishlist = wishlist.filter(
                        item => item.id !== id
                    );

                    saveWishlist();
                    updateWishlistCount();
                    updateWishlistButtons();
                    renderWishlist();

                    showToast("Removed from wishlist");
                });
            });
    }


    /* ---------- CATEGORY FILTERS ---------- */

    const filterButtons =
        document.querySelectorAll(".filter-btn");

    const categoryCards =
        document.querySelectorAll(".category-card");


    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn =>
                btn.classList.remove("active")
            );

            button.classList.add("active");

            const category =
                button.dataset.filter || "all";

            applyCategoryFilter(category);
        });
    });


    categoryCards.forEach(card => {

        card.addEventListener("click", () => {

            const category =
                card.dataset.category;

            filterButtons.forEach(btn => {

                btn.classList.remove("active");

                if (
                    btn.dataset.filter === category
                ) {
                    btn.classList.add("active");
                }
            });

            applyCategoryFilter(category);

            document
                .getElementById("shop")
                ?.scrollIntoView({
                    behavior: "smooth"
                });
        });
    });


    function applyCategoryFilter(category) {

        const products =
            document.querySelectorAll(".product-card");

        let found = false;

        products.forEach(product => {

            const productCategory =
                product.dataset.category;

            if (
                category === "all" ||
                productCategory === category
            ) {
                product.style.display = "";
                found = true;
            } else {
                product.style.display = "none";
            }
        });

        if (!found && category !== "all") {
            showToast(`No ${category} products available yet`);
        }
    }


    /* ---------- OFFERS BUTTONS ---------- */

    document.querySelectorAll("[data-offer-category]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const category =
                    button.dataset.offerCategory;

                applyCategoryFilter(category);

                document
                    .getElementById("shop")
                    ?.scrollIntoView({
                        behavior: "smooth"
                    });
            });
        });


    /* ---------- NEWSLETTER ---------- */

    const newsletterForm =
        document.querySelector(".newsletter-form");

    newsletterForm?.addEventListener("submit", event => {

        event.preventDefault();

        const input =
            newsletterForm.querySelector("input");

        if (!input || !input.value.trim()) {
            showToast("Please enter your email");
            return;
        }

        showToast("Thanks for subscribing!");

        input.value = "";
    });


    /* ---------- CHECKOUT / ORDER ---------- */

    checkoutBtn?.addEventListener("click", () => {

        if (cart.length === 0) {
            showToast("Your cart is empty");
            return;
        }

        openOrderModal();
    });


    function openOrderModal() {

        let modal =
            document.getElementById("orderModal");

        if (!modal) {

            modal = document.createElement("div");

            modal.id = "orderModal";

            modal.innerHTML = `
                <div class="order-modal-box">

                    <button class="order-close"
                        id="orderClose">
                        <i class="fa-solid fa-xmark"></i>
                    </button>

                    <div class="order-heading">
                        <i class="fa-solid fa-basket-shopping"></i>
                        <h2>Place Your Order</h2>
                        <p>Enter your details to continue.</p>
                    </div>

                    <form id="orderForm">

                        <label>Full Name</label>
                        <input
                            type="text"
                            id="customerName"
                            placeholder="Your name"
                            required
                        >

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            id="customerPhone"
                            placeholder="Your phone number"
                            required
                        >

                        <label>Payment Preference</label>

                        <select id="paymentMethod">
                            <option value="UPI">UPI</option>
                            <option value="Cash">Cash</option>
                            <option value="Card">Card</option>
                        </select>

                        <label>Order Notes</label>

                        <textarea
                            id="orderNotes"
                            placeholder="Any additional notes..."
                            rows="3"
                        ></textarea>

                        <div class="order-summary">
                            <span>Order Total</span>
                            <strong>${cartTotal?.textContent || "₹0"}</strong>
                        </div>

                        <button
                            type="submit"
                            class="order-submit">
                            Confirm Order
                        </button>

                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            document
                .getElementById("orderClose")
                .addEventListener("click", closeOrderModal);

            modal.addEventListener("click", event => {

                if (event.target === modal) {
                    closeOrderModal();
                }
            });

            document
                .getElementById("orderForm")
                .addEventListener("submit", submitOrder);
        }

        modal.classList.add("active");
    }


    function closeOrderModal() {

        const modal =
            document.getElementById("orderModal");

        modal?.classList.remove("active");
    }


    function submitOrder(event) {

        event.preventDefault();

        const name =
            document.getElementById("customerName").value.trim();

        const phone =
            document.getElementById("customerPhone").value.trim();

        if (!name || !phone) {
            showToast("Please fill in your details");
            return;
        }

        closeOrderModal();
        closePanels();

        showToast("Order details received successfully!");

        /*
          The current GitHub Pages website is a front-end site.
          A real order/payment system can be connected later
          using a backend, database, WhatsApp, or payment gateway.
        */

        cart = [];

        saveCart();
        updateCartCount();
        renderCart();
    }


    /* ---------- ESCAPE KEY ---------- */

    document.addEventListener("keydown", event => {

        if (event.key === "Escape") {

            closePanels();

            searchPanel?.classList.remove("active");

            closeOrderModal();
        }
    });


    /* ---------- CURRENT YEAR ---------- */

    const year =
        document.getElementById("year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }


    /* ---------- INITIAL STATE ---------- */

    updateCartCount();
    updateWishlistCount();
    updateWishlistButtons();
    renderCart();
    renderWishlist();

});
