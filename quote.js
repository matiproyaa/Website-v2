const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

(function () {

    emailjs.init("ClZV07kpW_Z4pce_u");

    const chainSelect = document.getElementById("chainBrand");
    const quoteTotalEl = document.getElementById("quoteTotal");
    const labourSavedEl = document.getElementById("labourSaved");
    const extraCheckboxes = document.querySelectorAll(".extra-item input");
    const redirectPage = document.getElementById("redirectPage");
    /*let redirect = 0;*/

    function updateQuote() {

        let total = 0;
        let labourSaved = 0;

        const selectedChain = chainSelect.selectedOptions[0];

        if (selectedChain && selectedChain.dataset.price) {
            total += parseFloat(selectedChain.dataset.price);
        }

        extraCheckboxes.forEach(box => {
            if (box.checked) {
                total += parseFloat(box.dataset.cost);
                labourSaved += parseFloat(box.dataset.laboursave);
            }
        });

        quoteTotalEl.innerText = `Estimated Quote Total: \u00A3${total} VAT Included`;
        //labourSavedEl.innerText = labourSaved > 0
        //    ? `Labour saved by adding extras now: \u00A3${labourSaved}`
        //    : "";
    }

    //if (redirect == 1) {
    //    setTimeout(() => { }, 2000);
    //    window.location.href = "index.html";
    //}

    chainSelect.addEventListener("change", updateQuote);

    extraCheckboxes.forEach(box => {
        box.addEventListener("change", updateQuote);
    });

    window.sendEmail = function () {

        const name = document.getElementById("customerName").value;
        const email = document.getElementById("customerEmail").value;
        const number = document.getElementById("customerNumber").value;
        const carReg = document.getElementById("carReg").value;

        if (!name || !email  || !number || !carReg || !chainSelect.value) {
            const status = document.getElementById("statusMessage");
            status.innerText = "Please complete all required fields.";
            status.style.color = "red";
            return;
        }

        const extrasArr = [];
        extraCheckboxes.forEach(box => {
            if (box.checked) {
                extrasArr.push(
                    `${box.value}`
                );
            }
        });

        const templateParams = {
            name: name,
            email: email,
            number: number,
            car_reg: carReg,
            chain_brand: chainSelect.value,
            extras: extrasArr.length ? extrasArr.join(", ") : "None",
            time: new Date().toLocaleString()
        };

        emailjs.send("service_eogyylh", "template_8z21655", templateParams)
            .then(function () {
                const status = document.getElementById("statusMessage");
                status.innerText = "Quote request sent successfully! Redirecting...";
                status.style.color = "green";

                setTimeout(() => {
                    window.location.href = "index.html";
                }, 2000);
            })
            .catch(function (error) {
                const status = document.getElementById("statusMessage");
                status.innerText = "Failed to send. Please try again.";
                status.style.color = "red";
                console.error(error);
            });

    };


})();