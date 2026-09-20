/* =========================================================
   STAR SPORTS
   Website JavaScript
   ========================================================= */


/* ---------- MOBILE MENU ---------- */

const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (menuBtn) {

    menuBtn.addEventListener("click", () => {

        navMenu.classList.toggle("active");

        const icon = menuBtn.querySelector("i");

        if (navMenu.classList.contains("active")) {

            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");

        } else {

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

}


/* ---------- CLOSE MOBILE MENU AFTER CLICK ---------- */

const navLinks = document.querySelectorAll(".nav-menu a");

navLinks.forEach(link => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("active");

        if (menuBtn) {

            const icon = menuBtn.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        }

    });

});


/* ---------- SHOPPING CART ---------- */

let cartCount = 0;

const cartCounter = document.querySelector(".cart-count");

const addCartButtons = document.querySelectorAll(".add-cart");

addCartButtons.forEach(button => {

    button.addEventListener("click", () => {

        cartCount++;

        cartCounter.textContent = cartCount;

        /* Button animation */

        button.innerHTML = '<i class="fa-solid fa-check"></i>';

        button.style.background = "#d90429";

        setTimeout(() => {

            button.innerHTML = '<i class="fa-solid fa-plus"></i>';

            button.style.background = "";

        }, 1000);

    });

});


/* ---------- WISHLIST ---------- */

const wishlistButtons = document.querySelectorAll(".wishlist");

wishlistButtons.forEach(button => {

    button.addEventListener("click", () => {

        button.classList.toggle("active");

        const icon = button.querySelector("i");

        if (button.classList.contains("active")) {

            icon.classList.remove("fa-regular");
            icon.classList.add("fa-solid");

        } else {

            icon.classList.remove("fa-solid");
            icon.classList.add("fa-regular");

        }

    });

});


/* ---------- SEARCH BUTTON ---------- */

const searchButton = document.querySelector(
    '.icon-btn[aria-label="Search"]'
);

if (searchButton) {

    searchButton.addEventListener("click", () => {

        const searchTerm = prompt(
            "What sports item are you looking for?"
        );

        if (searchTerm && searchTerm.trim() !== "") {

            alert(
                "Searching Star Sports for: " +
                searchTerm.trim()
            );

        }

    });

}


/* ---------- NEWSLETTER ---------- */

const newsletterForm =
    document.querySelector(".newsletter-form");

if (newsletterForm) {

    newsletterForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const email =
            newsletterForm.querySelector("input").value;

        if (email.trim() !== "") {

            alert(
                "Thank you for subscribing to Star Sports!"
            );

            newsletterForm.reset();

        }

    });

}


/* ---------- SCROLL HEADER EFFECT ---------- */

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        header.style.boxShadow =
            "0 8px 30px rgba(0,0,0,0.08)";

    } else {

        header.style.boxShadow = "none";

    }

});


/* ---------- REVEAL ANIMATION ---------- */

const revealElements = document.querySelectorAll(
    ".category-card, .product-card, .feature, .about-text"
);

const revealObserver = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";
                entry.target.style.transform =
                    "translateY(0)";

                revealObserver.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.12
    }
);


revealElements.forEach(element => {

    element.style.opacity = "0";
    element.style.transform = "translateY(25px)";
    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

    revealObserver.observe(element);

});


/* ---------- CURRENT YEAR ---------- */

const yearElement =
    document.querySelector(".footer-bottom p");

if (yearElement) {

    yearElement.innerHTML =
        `© ${new Date().getFullYear()} Star Sports. All rights reserved.`;

}
