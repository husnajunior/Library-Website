//This part of code is for the hamburger menu in the navbar. 
const menubar = document.getElementById('menu');
const navLinks = document.querySelector('.nav-links');

menubar.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Populate Expiry Months
const monthSelect = document.getElementById('exp-month');
for (let i = 1; i <= 12; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i.toString().padStart(2, '0');
    monthSelect.appendChild(option);
}

// Populate Expiry Years
const yearSelect = document.getElementById('exp-year');
const currentYear = new Date().getFullYear();
for (let i = 0; i < 15; i++) {
    const year = currentYear + i;
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
}

// Save last 4 digits for success.html
function saveCard() {
    const card = document.getElementById("card-number").value.replace(/\s+/g, '');
    const last4 = card.slice(-4);
    sessionStorage.setItem("last4", last4);
}


// Form Submission & Validation
document.getElementById('payment-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // we redirect manually after success

    const cardNumberInput = document.getElementById('card-number');
    const cvvInput = document.getElementById('cvv');
    const expMonth = parseInt(monthSelect.value);
    const expYear = parseInt(yearSelect.value);
    const message = document.getElementById('message');

    const cardNumber = cardNumberInput.value.replace(/\s+/g, '');

    message.textContent = '';
    message.style.color = 'red';


    // Validation: Card Number (16 digits)
    if (!/^\d{16}$/.test(cardNumber)) {
        message.textContent = 'Card number must be exactly 16 digits.';
        return;
    }

    // Validation: Mastercard Prefix (51–55)
    if (!/^(51|52|53|54|55)/.test(cardNumber)) {
        message.textContent = 'Card must be a valid Mastercard (starts with 51–55).';
        return;
    }

    // Validation: Expiry Date
    if (!expMonth || !expYear) {
        message.textContent = 'Please select a valid expiry date.';
        return;
    }

    const now = new Date();
    const thisMonth = now.getMonth() + 1;
    const thisYear = now.getFullYear();

    if (expYear < thisYear || (expYear === thisYear && expMonth < thisMonth)) {
        message.textContent = 'The card has expired.';
        return;
    }

    // Validation: CVV (3 or 4 digits)

    const cvv = cvvInput.value.trim();
    if (!/^\d{3,4}$/.test(cvv)) {
        message.textContent = 'CVV must be 3 or 4 digits.';
        return;
    }

    // Prepare JSON Payload
    const payload = {
        master_card: cardNumber,
        exp_year: expYear,
        exp_month: expMonth,
        cvv_code: cvv
    };

    // Send POST Request to API
    try {
        const response = await fetch(
            'https://mudfoot.doc.stu.mmu.ac.uk/node/api/creditcard',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );

        const data = await response.json();

        if (response.ok) {
            // Save last 4 digits
            saveCard();

            // Redirect to success page
            window.location.href = "success.html";
            return;
        } else {
            message.textContent = data.error || 'Payment failed. Please try again.';
        }
    } catch (error) {
        message.textContent  = 'Network error. Please try again.';
        console.error(error);
    }
});

// Optional: Format Card Number with Spaces
document.getElementById('card-number').addEventListener('input', function (e) {
    let value = e.target.value.replace(/\D/g, '').substring(0, 16);
    value = value.replace(/(.{4})/g, '$1 ').trim();
    e.target.value = value;
});

