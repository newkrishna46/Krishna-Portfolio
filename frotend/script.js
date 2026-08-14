const contactForm = document.getElementById("contactForm"); 
const successMessage = document.getElementById("successMessage"); 
contactForm.addEventListener("submit", async function(event) { event.preventDefault(); 
    const name = document.getElementById("name").value; 
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value; 
    try { const response = await fetch("https://krishna-portfolio-1.onrender.com/api/messages", {
         method: "POST", headers: { "Content-Type": "application/json" }, 
         body: JSON.stringify({ name: name, email: email, message: message }) }); 
         const data = await response.json(); 
         if (data.success) { 
            successMessage.style.display = "block"; contactForm.reset();
         }
        else { 
            alert(data.message);
         } } 
         catch (error) { console.error(error); 
            alert("Unable to connect to server."); } });