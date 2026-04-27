document.addEventListener("DOMContentLoaded", function () {
    console.log("res.js loaded"); 

    const form = document.getElementById("reservationForm");
    const messageBox = document.getElementById("messageBox");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("submit handler fired"); 

        const formData = new FormData(form);
        formData.append("action", "reservation");

        try {
            const response = await fetch("../api.php", {   
                method: "POST",
                body: formData
            });

            console.log("HTTP status:", response.status); 
            if (!response.ok) {
                showMessage("HTTP error: " + response.status, "error");
                return;
            }

            const data = await response.json();
            console.log("Response JSON:", data); 

            if (data.status === "success") {
                showMessage(data.message, "success");
                form.reset();
            } else {
                showMessage(data.message || "Reservation failed.", "error");
            }
        } catch (err) {
            console.error(err);
            showMessage("Network/JS error: " + err, "error");
        }
    });

    function showMessage(message, type) {
        messageBox.innerHTML = message;
        messageBox.style.display = "block";
        messageBox.style.backgroundColor =
            type === "success" ? "#d4edda" : "#f8d7da";
        messageBox.style.color =
            type === "success" ? "#155724" : "#721c24";
        messageBox.style.border =
            type === "success" ? "1px solid #c3e6cb" : "1px solid #f5c6cb";
        messageBox.style.padding = "15px";
        messageBox.style.borderRadius = "10px";
        messageBox.scrollIntoView({ behavior: "smooth" });
    }
});

$(document).ready(function() {
    
    $("#reservationForm, #messageBox").hide().fadeIn(800);

    $("#reservationForm input, #reservationForm textarea").focus(function() {
        $(this).css("outline", "2px solid #ff6600");
    }).blur(function() {
        $(this).css("outline", "none");
    });

    $("#reservationForm input, #reservationForm textarea").on("input", function() {
        $("#messageBox").fadeOut(300);
    });
});