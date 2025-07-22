// ✅ Immediately Invoked Function Expression (IIFE)
// ➤ Ye function turant execute ho jata hai jab page load hota hai
(() => {
    'use strict'; // ✅ JavaScript ko strict mode me run karne ke liye – taaki galtiya easily pakdi ja sakein

    // ✅ Saare forms ko select kar rahe hain jinke paas 'needs-validation' class hai
    // ➤ Ye Bootstrap ka rule hai – is class se pata chalta hai ki form validation chahiye
    const forms = document.querySelectorAll('.needs-validation');

    // ✅ Saare selected forms par loop chala rahe hain
    Array.from(forms).forEach(form => {
        
        // ✅ Jab bhi form submit ho, ye function chalega
        form.addEventListener('submit', event => {

            // ✅ Agar form valid nahi hai (input required fields fill nahi hua ya galat hai)
            if (!form.checkValidity()) {
                event.preventDefault();    // ❌ Form submit hone se rok do
                event.stopPropagation();   // ❌ Event bubble hone se rok do (upar tak na jaye)
            }

            // ✅ Bootstrap class add kar rahe hain taaki error styles (like red border) apply ho jayein
            form.classList.add('was-validated');

        }, false); // Event listener ka third argument – false means bubble phase
    });
})();
