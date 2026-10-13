//This part of code is for the hamburger menu in the navbar. 
const menubar = document.getElementById('menu');
const navLinks = document.querySelector('.nav-links');

menubar.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});
 // Load last 4 digits
const last4 = sessionStorage.getItem("last4");
document.getElementById("last4").textContent = last4 || "????";