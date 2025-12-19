const calcularFreteBtn = document.getElementById('calcularFrete');
if (calcularFreteBtn) {
  calcularFreteBtn.addEventListener('click', async () => {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const resultado = document.getElementById('resultadoFrete');

    if (cep.length !== 8) {
      resultado.textContent = 'Por favor, digite um CEP válido.';
      return;
    }

    try {
      // Exemplo de API pública de frete (não oficial)
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();

      // Aqui você usaria uma API real de frete, substituindo a lógica
      // Exemplo fictício de cálculo
      const frete = (Math.floor(Math.random() * 20) + 10); // R$ 10 a R$ 30

      resultado.innerHTML = `
        CEP: ${data.cep} <br>
        Cidade: ${data.localidade} <br>
        Estado: ${data.uf} <br>
        Frete estimado: R$ ${frete},00
      `;
    } catch (error) {
      resultado.textContent = 'Erro ao calcular frete. Tente novamente.';
      console.error(error);
    }
  });
}


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
  btn.onclick = function(e) {
    e.preventDefault();
    modal.style.display = "flex";
  }
}

// Close modal
if (span && modal) {
  span.onclick = function() {
    modal.style.display = "none";
  }
}

// Close modal when clicking outside
window.onclick = function(event) {
  if (modal && event.target == modal) {
    modal.style.display = "none";
  }
}

// Switch tabs
if (tabLogin && tabRegister && loginForm && registerForm) {
  tabLogin.addEventListener('click', (e) => {
      e.preventDefault();
      tabLogin.classList.add('active');
      tabRegister.classList.remove('active');
      loginForm.classList.add('active');
      registerForm.classList.remove('active');
  });

  tabRegister.addEventListener('click', (e) => {
      e.preventDefault();
      tabRegister.classList.add('active');
      tabLogin.classList.remove('active');
      registerForm.classList.add('active');
      loginForm.classList.remove('active');
  });

}

// Local Database & Session Logic
const DB_KEY = 'magosBurgerUsers';
const SESSION_KEY = 'magosBurgerCurrentUser';

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
    alert('Você saiu da sua conta.');
}

// Update UI based on auth state
function updateUI() {
    const user = getCurrentUser();
    const loginBtnLink = document.getElementById('openLoginBtn'); // The <a> tag
    const loginLi = document.querySelector('.menu-entra'); // The parent <li>

    if (user && loginBtnLink && loginLi) {
        // Logged In
        loginBtnLink.innerHTML = `Olá, ${user.name.split(' ')[0]}`; // First name only
        loginLi.classList.add('logged-in');
        
        // Remove old event listeners by cloning
        // Note: This removes ANY listener on the node.
        const newBtn = loginBtnLink.cloneNode(true);
        loginBtnLink.parentNode.replaceChild(newBtn, loginBtnLink);

        // Add Logout listener
        newBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if(confirm(`Olá ${user.name}, deseja sair da sua conta?`)) {
                logoutUser();
            }
        });

    } else if (loginBtnLink && loginLi) {
        // Logged Out
        loginBtnLink.innerHTML = `Entrar ou Cadastrar`;
        loginLi.classList.remove('logged-in');

        // Restore modal listener logic
        // We need to re-attach the modal opening logic because we cloned the node
        const modal = document.getElementById("authModal");
        
        // Remove old listeners (if any from logout step)
        const newBtn = loginBtnLink.cloneNode(true);
        loginBtnLink.parentNode.replaceChild(newBtn, loginBtnLink);
        
        // Re-attach modal listener
        if (modal) {
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                modal.style.display = "flex";
            });
        }
    }
}

// Registration Logic
const regFormElement = document.querySelector('#registerForm form');
if (regFormElement) {
    regFormElement.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const passwordConfirm = document.getElementById('regPasswordConfirm').value;

        if (password !== passwordConfirm) {
            alert('As senhas não coincidem!');
            return;
        }

        const users = getUsers();
        
        // Check if email already exists
        if (users.some(u => u.email === email)) {
            alert('Este e-mail já está cadastrado.');
            return;
        }

        const newUser = { name, email, password };
        users.push(newUser);
        saveUsers(users);

        // Auto-login
        setCurrentUser(newUser);
        
        alert('Cadastro realizado com sucesso!');
        document.getElementById('authModal').style.display = 'none';
        regFormElement.reset();
        updateUI();
    });
}

// Login Logic
const loginFormElement = document.querySelector('#loginForm form');
if (loginFormElement) {
    loginFormElement.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const users = getUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            setCurrentUser(user);
            alert(`Bem-vindo de volta, ${user.name}!`);
            document.getElementById('authModal').style.display = 'none';
            loginFormElement.reset();
            updateUI(); // Refresh UI
        } else {
            alert('E-mail ou senha incorretos.');
        }
    });
}

// Initial check on load
document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

// Customization Modal Logic
const custModal = document.getElementById('customizeModal');
const custClose = document.getElementById('closeCustomize');
const qtyValue = document.getElementById('qtyValue');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const addToOrderBtn = document.getElementById('addToOrderBtn');
const custProductTitle = document.getElementById('custProductTitle');

// We will store the current product details here
let currentProduct = {};

// Open Customization Modal
// This function will be called by the onclick attribute we inject
window.openCustomizeModal = function(element) {
    if (!custModal) return;
    
    // reset state
    if(qtyValue) qtyValue.textContent = '1';
    
    // Reset extra counters
    document.querySelectorAll('.extra-item').forEach(item => {
        const valSpan = item.querySelector('.qty-val-small');
        if(valSpan) valSpan.textContent = '0';
    });
    
    // Find product info from the card
    const card = element.closest('.card');
    const title = card.querySelector('h2').innerText;
    
    currentProduct = {
        name: title,
        quantity: 1,
        extras: []
    };
    
    if(custProductTitle) custProductTitle.innerText = title;
    custModal.style.display = 'flex';
};

if (custClose) {
    custClose.onclick = function() {
        custModal.style.display = 'none';
    };
}

window.addEventListener('click', (event) => {
    if (event.target == custModal) {
        custModal.style.display = 'none';
    }
});

// Quantity Logic (Main Product)
if (btnMinus && btnPlus && qtyValue) {
    btnMinus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent);
        if (val > 1) {
            val--;
            qtyValue.textContent = val;
            currentProduct.quantity = val;
        }
    });
    
    btnPlus.addEventListener('click', () => {
        let val = parseInt(qtyValue.textContent);
        val++;
        qtyValue.textContent = val;
        currentProduct.quantity = val;
    });
}

// Logic for Extra Items (Individual Quantities)
document.querySelectorAll('.extra-item').forEach(item => {
    const minBtn = item.querySelector('.minus');
    const plusBtn = item.querySelector('.plus');
    const valSpan = item.querySelector('.qty-val-small');
    
    if (minBtn && plusBtn && valSpan) {
        minBtn.onclick = () => {
             let val = parseInt(valSpan.textContent);
             if (val > 0) {
                 val--;
                 valSpan.textContent = val;
             }
        };
        
        plusBtn.onclick = () => {
             let val = parseInt(valSpan.textContent);
             val++;
             valSpan.textContent = val;
        };
    }
});

// Add to Order Logic
if (addToOrderBtn) {
    addToOrderBtn.addEventListener('click', () => {
        // Collect extras
        const extras = [];
        document.querySelectorAll('.extra-item').forEach(item => {
            const name = item.getAttribute('data-name');
            const qty = parseInt(item.querySelector('.qty-val-small').textContent);
            if (qty > 0) {
                extras.push(`${name} (x${qty})`);
            }
        });
        
        currentProduct.extras = extras;
        currentProduct.quantity = parseInt(qtyValue.textContent);
        
        // Simulating Add to Cart
        alert('Adicionado ao pedido:\n' + currentProduct.name + '\nQtd: ' + currentProduct.quantity + '\nExtras: ' + (extras.join(', ') || 'Nenhum'));
        
        custModal.style.display = 'none';
    });
}

