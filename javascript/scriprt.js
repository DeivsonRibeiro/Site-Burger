const calcularFreteBtn = document.getElementById("calcularFrete");
if (calcularFreteBtn) {
  calcularFreteBtn.addEventListener("click", async () => {
    const cep = document.getElementById("cep").value.replace(/\D/g, "");
    const resultado = document.getElementById("resultadoFrete");

    if (cep.length !== 8) {
      resultado.textContent = "Por favor, digite um CEP válido.";
      return;
    }

    try {
      // Exemplo de API pública de frete (não oficial)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      // Aqui você usaria uma API real de frete, substituindo a lógica
      // Exemplo fictício de cálculo
      const frete = Math.floor(Math.random() * 20) + 10; // R$ 10 a R$ 30

      resultado.innerHTML = `
        CEP: ${data.cep} <br>
        Cidade: ${data.localidade} <br>
        Estado: ${data.uf} <br>
        Frete estimado: R$ ${frete},00
      `;
    } catch (error) {
      resultado.textContent = "Erro ao calcular frete. Tente novamente.";
      console.error(error);
    }
  });
}

// Hamburger Menu Logic
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideMenu = document.getElementById("sideMenu");
const sideMenuOverlay = document.getElementById("sideMenuOverlay");
const closeSideMenu = document.getElementById("closeSideMenu");
const sideOpenLogin = document.getElementById("sideOpenLogin");

function toggleSideMenu() {
  if (sideMenu && sideMenuOverlay && hamburgerBtn) {
    hamburgerBtn.classList.toggle("active");
    sideMenu.classList.toggle("active");
    sideMenuOverlay.classList.toggle("active");
  }
}

if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", toggleSideMenu);
}

if (closeSideMenu) {
  closeSideMenu.addEventListener("click", toggleSideMenu);
}

if (sideMenuOverlay) {
  sideMenuOverlay.addEventListener("click", toggleSideMenu);
}

// Open login modal from side menu
if (sideOpenLogin) {
  sideOpenLogin.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSideMenu(); // Close side menu first
    const authModal = document.getElementById("authModal");
    if (authModal) {
      authModal.style.display = "flex";
    }
  });
}

// Open coupon modal from side menu
const sideOpenCoupon = document.getElementById("sideOpenCoupon");
if (sideOpenCoupon) {
  sideOpenCoupon.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSideMenu();
    const couponModal = document.getElementById("couponModal");
    if (couponModal) {
      couponModal.style.display = "flex";
    }
  });
}

// Open cart modal from side menu
const sideOpenCart = document.getElementById("sideOpenCart");
if (sideOpenCart) {
  sideOpenCart.addEventListener("click", (e) => {
    e.preventDefault();
    toggleSideMenu();
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.style.display = "flex";
      renderCart();
    }
  });
}

// Close side menu when any link is clicked (for # links)
const sideLinks = document.querySelectorAll(".side-menu-list a");
sideLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!link.id || !link.id.startsWith("sideOpen")) {
      // Only close if it's not a modal opener (which already calls toggleSideMenu)
      // Actually, most links should just close it.
      if (sideMenu.classList.contains("active")) {
        toggleSideMenu();
      }
    }
  });
});

// Modal Login/Cadastro Logic
const modal = document.getElementById("authModal");
const btn = document.getElementById("openLoginBtn");
const span = document.getElementsByClassName("close-btn")[0];

// Tab buttons
const tabLogin = document.getElementById("tabLogin");
const tabRegister = document.getElementById("tabRegister");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

// Open modal
if (btn && modal) {
  btn.onclick = function (e) {
    e.preventDefault();
    modal.style.display = "flex";
  };
}

// Close modal
const closeAuthBtn = document.getElementById("closeAuthModal");
if (closeAuthBtn && modal) {
  closeAuthBtn.onclick = function () {
    modal.style.display = "none";
  };
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (modal && event.target == modal) {
    modal.style.display = "none";
  }
  if (sideMenuOverlay && event.target == sideMenuOverlay) {
    toggleSideMenu();
  }
});

// Switch tabs
if (tabLogin && tabRegister && loginForm && registerForm) {
  tabLogin.addEventListener("click", (e) => {
    e.preventDefault();
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  });

  tabRegister.addEventListener("click", (e) => {
    e.preventDefault();
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  });
}

// Local Database & Session Logic
const DB_KEY = "magosBurgerUsers";
const SESSION_KEY = "magosBurgerCurrentUser";
const CART_KEY = "magosBurgerCart";

// Helper: Get users from localStorage
function getUsers() {
  const users = localStorage.getItem(DB_KEY);
  return users ? JSON.parse(users) : [];
}

// Helper: Save users to localStorage
function saveUsers(users) {
  localStorage.setItem(DB_KEY, JSON.stringify(users));
}

// Helper: Get current session user
function getCurrentUser() {
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
}

// Helper: Set current session user
function setCurrentUser(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

// Helper: Logout
function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  updateUI();
  showToast("Você saiu da sua conta.", "info");
}

// Helper: Get Cart
function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

// Helper: Save Cart
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Helper: Add to Cart
async function addToCart(product) {
  const cart = getCart();
  cart.push(product);
  saveCart(cart);
  updateCartCount(); // Update count

  const goToCart = await showConfirm(
    "Produto adicionado! O que deseja fazer?",
    "Finalizar Pedido",
    "Continuar Comprando"
  );

  if (goToCart) {
    // Open Cart Modal
    const cartModal = document.getElementById("cartModal");
    if (cartModal) {
      cartModal.style.display = "flex";
      renderCart();
    }
  } else {
    showToast(
      "Produto adicionado ao carrinho! Continue aproveitando.",
      "success"
    );
  }
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.length;
  const countSpan = document.getElementById("cartCount");
  if (countSpan) {
    countSpan.textContent = count;
    countSpan.style.display = count > 0 ? "inline-flex" : "none";
  }
}

// Update UI based on auth state
function updateUI() {
  const user = getCurrentUser();
  const loginBtnLink = document.getElementById("openLoginBtn"); // The <a> tag
  const loginLi = document.querySelector(".menu-entra"); // The parent <li>

  if (user && loginBtnLink && loginLi) {
    // Logged In
    loginBtnLink.innerHTML = `Olá, ${user.name.split(" ")[0]}`; // First name only
    loginLi.classList.add("logged-in");

    // Remove old event listeners by cloning
    const newBtn = loginBtnLink.cloneNode(true);
    loginBtnLink.parentNode.replaceChild(newBtn, loginBtnLink);

    // Add Logout listener
    newBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      const confirmed = await showConfirm(
        `Olá ${user.name}, deseja sair da sua conta?`
      );
      if (confirmed) {
        logoutUser();
      }
    });
  } else if (loginBtnLink && loginLi) {
    // Logged Out
    loginBtnLink.innerHTML = "Entrar ou Cadastrar";
    loginLi.classList.remove("logged-in");

    // Restore modal listener logic
    const modal = document.getElementById("authModal");
    const newBtn = loginBtnLink.cloneNode(true);
    loginBtnLink.parentNode.replaceChild(newBtn, loginBtnLink);

    if (modal) {
      newBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "flex";
      });
    }
  }
  updateCartCount(); // Ensure count is correct on load/update
}

// Registration Logic
const regFormElement = document.querySelector("#registerForm form");
if (regFormElement) {
  regFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("regName").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPassword").value;
    const passwordConfirm = document.getElementById("regPasswordConfirm").value;

    if (password !== passwordConfirm) {
      showToast("As senhas não coincidem!", "error");
      return;
    }

    const users = getUsers();

    // Check if email already exists
    if (users.some((u) => u.email === email)) {
      showToast("Este e-mail já está cadastrado.", "error");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      joinedAt: new Date().toLocaleString("pt-BR"),
    };
    users.push(newUser);
    saveUsers(users);

    // Auto-login
    setCurrentUser(newUser);

    showToast("Cadastro realizado com sucesso!", "success");
    document.getElementById("authModal").style.display = "none";
    regFormElement.reset();
    updateUI();
  });
}

// Login Logic
const loginFormElement = document.querySelector("#loginForm form");
if (loginFormElement) {
  loginFormElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const users = getUsers();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      showToast(`Bem-vindo de volta, ${user.name}!`, "success");
      document.getElementById("authModal").style.display = "none";
      loginFormElement.reset();
      updateUI(); // Refresh UI
    } else {
      showToast("E-mail ou senha incorretos.", "error");
    }
  });
}

// Initial check on load
document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  setupDirectAddButtons();
  updateCartCount(); // explicit call
});

// Customization Modal Logic
const custModal = document.getElementById("customizeModal");
const custClose = document.getElementById("closeCustomize");
const qtyValue = document.getElementById("qtyValue");
const btnMinus = document.getElementById("btnMinus");
const btnPlus = document.getElementById("btnPlus");
const addToOrderBtn = document.getElementById("addToOrderBtn");
const custProductTitle = document.getElementById("custProductTitle");
const custTotalSpan = document.getElementById("custTotal"); // New

// We will store the current product details here
let currentProduct = {};

function updateCustTotal() {
  if (!currentProduct.price) return;

  let extraCost = 0;
  document.querySelectorAll(".extra-item").forEach((item) => {
    const qty = parseInt(item.querySelector(".qty-val-small").textContent);
    const EXTRA_PRICE = 2.0;
    extraCost += qty * EXTRA_PRICE;
  });

  const total = currentProduct.price + extraCost;
  if (custTotalSpan) {
    custTotalSpan.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  }
}

// Open Customization Modal
window.openCustomizeModal = function (element) {
  if (!custModal) return;

  // reset state
  if (qtyValue) qtyValue.textContent = "1";

  // Reset extra counters
  document.querySelectorAll(".extra-item").forEach((item) => {
    const valSpan = item.querySelector(".qty-val-small");
    if (valSpan) valSpan.textContent = "0";
  });

  // Find product info from the card
  const card = element.closest(".card");
  const title = card.querySelector("h2").innerText;
  // Extract price from card text: "Preço: R$ 25,00"
  const priceText = card.querySelector("p:not(.class)").innerText;
  let price = 0;
  const ps = card.querySelectorAll("p");
  ps.forEach((p) => {
    if (p.innerText.includes("Preço:")) {
      const match = p.innerText.match(/R\$\s*([\d,]+)/);
      if (match) {
        price = parseFloat(match[1].replace(",", "."));
      }
    }
  });

  currentProduct = {
    name: title,
    quantity: 1,
    price: price, // Base price
    extras: [],
  };

  if (custProductTitle) custProductTitle.innerText = title;

  updateCustTotal(); // Initial update

  custModal.style.display = "flex";
};

if (custClose) {
  custClose.onclick = function () {
    custModal.style.display = "none";
  };
}

// Logic for Extra Items (Individual Quantities)
document.querySelectorAll(".extra-item").forEach((item) => {
  const minBtn = item.querySelector(".minus");
  const plusBtn = item.querySelector(".plus");
  const valSpan = item.querySelector(".qty-val-small");

  if (minBtn && plusBtn && valSpan) {
    minBtn.onclick = () => {
      let val = parseInt(valSpan.textContent);
      if (val > 0) {
        val--;
        valSpan.textContent = val;
        updateCustTotal(); // Update on change
      }
    };

    plusBtn.onclick = () => {
      let val = parseInt(valSpan.textContent);
      val++;
      valSpan.textContent = val;
      updateCustTotal(); // Update on change
    };
  }
});

// Add to Order Logic (From customization modal)
if (addToOrderBtn) {
  addToOrderBtn.addEventListener("click", () => {
    // Collect extras
    const extras = [];
    let extraCost = 0;
    document.querySelectorAll(".extra-item").forEach((item) => {
      const name = item.getAttribute("data-name");
      const qty = parseInt(item.querySelector(".qty-val-small").textContent);
      // Assuming extras cost R$ 2.00 each for simplicity since it's not in HTML
      const EXTRA_PRICE = 2.0;

      if (qty > 0) {
        extras.push(`${name} (x${qty})`);
        extraCost += qty * EXTRA_PRICE;
      }
    });

    currentProduct.extras = extras;
    currentProduct.totalPrice = currentProduct.price + extraCost;

    addToCart(currentProduct);

    custModal.style.display = "none";
  });
}

// Logic for Direct "Add to Cart" buttons (non-customizable items)
function setupDirectAddButtons() {
  // Select buttons that are NOT the "Adicionar" inside the modal and NOT the "Calcular"
  document.querySelectorAll(".card button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.target.closest(".card");
      const title = card.querySelector("h2").innerText;

      // Extract Price
      let price = 0;
      const ps = card.querySelectorAll("p");
      ps.forEach((p) => {
        if (p.innerText.includes("Preço:")) {
          const match = p.innerText.match(/R\$\s*([\d,]+)/);
          if (match) {
            price = parseFloat(match[1].replace(",", "."));
          }
        }
      });

      const product = {
        name: title,
        quantity: 1,
        price: price,
        totalPrice: price,
        extras: [],
      };

      addToCart(product);
    });
  });
}

// Coupon Modal Logic
const couponModal = document.getElementById("couponModal");
const openCouponBtn = document.getElementById("openCouponBtn");
const closeCouponBtn = document.getElementById("closeCoupon");
const applyCouponBtn = document.getElementById("applyCouponBtn");
const couponCodeInput = document.getElementById("couponCode");
const couponMessage = document.getElementById("couponMessage");
const closeCouponIcon = document.getElementById("closeCouponIcon");

const VALID_COUPONS = ["MAGOS10", "WELCOME", "BURGER2025"];

if (openCouponBtn && couponModal) {
  openCouponBtn.addEventListener("click", (e) => {
    e.preventDefault();
    couponModal.style.display = "flex";
    if (couponMessage) couponMessage.textContent = "";
    if (couponCodeInput) couponCodeInput.value = "";
  });
}

function closeCoupon() {
  if (couponModal) couponModal.style.display = "none";
}

if (closeCouponBtn) {
  closeCouponBtn.addEventListener("click", closeCoupon);
}
if (closeCouponIcon) {
  closeCouponIcon.addEventListener("click", closeCoupon);
}

if (applyCouponBtn && couponCodeInput && couponMessage) {
  applyCouponBtn.addEventListener("click", () => {
    const code = couponCodeInput.value.trim().toUpperCase();

    if (!code) {
      couponMessage.textContent = "Por favor, digite um código.";
      couponMessage.style.color = "orange";
      return;
    }

    if (VALID_COUPONS.includes(code)) {
      couponMessage.textContent = "Cupom válido! Desconto aplicado.";
      couponMessage.style.color = "#28a745";
      // Save coupon state if needed
    } else {
      couponMessage.textContent = "Cupom inválido ou expirado.";
      couponMessage.style.color = "#dc3545";
    }
  });
}

// Cart Modal Logic
const cartModal = document.getElementById("cartModal");
const openCartBtn = document.getElementById("openCartBtn");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotalSpan = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

function renderCart() {
  const cart = getCart();
  cartItemsContainer.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML =
      '<p style="text-align:center; color: #aaa;">Seu carrinho está vazio.</p>';
    cartTotalSpan.textContent = "R$ 0,00";
    return;
  }

  cart.forEach((item, index) => {
    total += item.totalPrice;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.extras.join(", ")}</p>
            </div>
            <div class="cart-item-actions">
                <span class="cart-price">R$ ${item.totalPrice
                  .toFixed(2)
                  .replace(".", ",")}</span>
                <button class="remove-item-btn" onclick="removeCartItem(${index})">Remover</button>
            </div>
        `;
    cartItemsContainer.appendChild(itemDiv);
  });

  cartTotalSpan.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

window.removeCartItem = function (index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount(); // update count on remove
};

if (openCartBtn && cartModal) {
  openCartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    cartModal.style.display = "flex";
    renderCart();
  });
}

if (closeCartBtn) {
  closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
  });
}

const paymentModal = document.getElementById("paymentModal");
const closePaymentBtn = document.getElementById("closePayment");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");
const cashChangeContainer = document.getElementById("cashChangeContainer");
const pixContainer = document.getElementById("pixContainer");
const cardContainer = document.getElementById("cardContainer");
const changeInput = document.getElementById("changeInput");
const paymentOptions = document.getElementsByName("paymentMethod");

// Handle Payment Selection
paymentOptions.forEach((option) => {
  option.addEventListener("change", (e) => {
    const val = e.target.value;

    // Hide all first
    if (cashChangeContainer) cashChangeContainer.style.display = "none";
    if (pixContainer) pixContainer.style.display = "none";
    if (cardContainer) cardContainer.style.display = "none";

    if (val === "Dinheiro") {
      if (cashChangeContainer) cashChangeContainer.style.display = "block";
    } else if (val === "Pix") {
      if (pixContainer) pixContainer.style.display = "block";
    } else if (val.includes("Cartão")) {
      if (cardContainer) cardContainer.style.display = "block";
    }
  });
});

if (checkoutBtn) {
  checkoutBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) {
      showToast("Seu carrinho está vazio!", "error");
      return;
    }

    // Open Payment Modal instead of direct confirm
    cartModal.style.display = "none";
    paymentModal.style.display = "flex";

    // Reset view (optional: select nothing or default)
    paymentOptions.forEach((opt) => (opt.checked = false));
    if (cashChangeContainer) cashChangeContainer.style.display = "none";
    if (pixContainer) pixContainer.style.display = "none";
    if (cardContainer) cardContainer.style.display = "none";
  });
}

if (closePaymentBtn) {
  closePaymentBtn.addEventListener("click", () => {
    paymentModal.style.display = "none";
  });
}

if (confirmPaymentBtn) {
  confirmPaymentBtn.addEventListener("click", () => {
    let selectedPayment = null;
    for (const option of paymentOptions) {
      if (option.checked) {
        selectedPayment = option.value;
        break;
      }
    }

    if (!selectedPayment) {
      showToast("Por favor, selecione uma forma de pagamento.", "error");
      return;
    }

    let message = `Pedido confirmado!\nForma de Pagamento: ${selectedPayment}`;

    if (selectedPayment === "Dinheiro") {
      const change = changeInput.value;
      if (change) {
        message += `\nTroco para: R$ ${change}`;
      } else {
        message += `\nSem troco.`;
      }
    }

    // Create Order Object
    const currentUser = getCurrentUser();
    const order = {
      id: Date.now(),
      date: new Date().toLocaleString("pt-BR"),
      customer: currentUser ? currentUser.name : "Convidado",
      items: getCart(),
      total: getCart().reduce((acc, item) => acc + item.totalPrice, 0),
      paymentMethod: selectedPayment,
      change:
        selectedPayment === "Dinheiro" && changeInput.value
          ? changeInput.value
          : null,
    };

    // Save to 'Database' (localStorage)
    const orders = JSON.parse(
      localStorage.getItem("magosBurgerOrders") || "[]"
    );
    orders.push(order);
    localStorage.setItem("magosBurgerOrders", JSON.stringify(orders));

    showToast(message + "\nObrigado pela preferência!", "success");

    // Clear Cart
    saveCart([]);
    renderCart();
    updateCartCount();
    paymentModal.style.display = "none";
  });
}

window.addEventListener("click", (event) => {
  if (event.target == cartModal) {
    cartModal.style.display = "none";
  }
  if (event.target == custModal) {
    custModal.style.display = "none";
  }
  if (event.target == couponModal) {
    couponModal.style.display = "none";
  }
  if (event.target == paymentModal) {
    paymentModal.style.display = "none";
  }
  // O fechamento do sideMenuOverlay já está sendo tratado pelo listener comum acima
});

// Modern Toast Notification
function showToast(message, type = "info") {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;

  let icon = "🔔";
  if (type === "success") {
    icon = "✅";
  } else if (type === "error") {
    icon = "❌";
  }

  // allow multiline
  const formattedMessage = message.replace(/\n/g, "<br>");

  toast.innerHTML = `
        <span class="toast-icon">${icon}</span>
        <span>${formattedMessage}</span>
    `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4500);
}

// Modern Confirmation Modal logic
function showConfirm(message, yesText = "Sim", noText = "Não") {
  return new Promise((resolve) => {
    const modal = document.getElementById("confirmModal");
    const msgElem = document.getElementById("confirmMessage");
    const btnYes = document.getElementById("confirmBtnYes");
    const btnNo = document.getElementById("confirmBtnNo");

    if (!modal) {
      return resolve(window.confirm(message));
    }

    msgElem.textContent = message;
    btnYes.textContent = yesText;
    btnNo.textContent = noText;
    modal.style.display = "flex";

    const close = () => {
      modal.style.display = "none";
    };

    const onYes = () => {
      resolve(true);
      close();
    };

    const onNo = () => {
      resolve(false);
      close();
    };

    // Use {once: true} to avoid stacking listeners
    btnYes.addEventListener("click", onYes, { once: true });
    btnNo.addEventListener("click", onNo, { once: true });
  });
}
