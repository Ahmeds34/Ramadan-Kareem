let maghribTime24 = null;
let countdownInterval = null;

async function getIftarTime() {
    try {
        const today = new Date();
        const date = today.toISOString().split("T")[0];

        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=Cairo&country=Egypt&method=5&date=${date}`
        );

        const data = await response.json();

        let maghrib24 = data.data.timings.Maghrib.split(" ")[0];
        maghribTime24 = maghrib24;

        const [hour, minute] = maghrib24.split(":");
        let hour12 = parseInt(hour);
        const ampm = hour12 >= 12 ? "PM" : "AM";

        hour12 = hour12 % 12;
        hour12 = hour12 ? hour12 : 12;

       document.getElementById("iftarTime").innerHTML =
    `<span class="time-number">${hour12}:${minute}</span>
     <span class="time-period">${ampm}</span>`;
        startCountdown();

    } catch (error) {
        document.getElementById("iftarTime").innerText = "تعذر تحميل الوقت";
    }
}

function startCountdown() {

    let countdownElement = document.getElementById("countdown");

    if (!countdownElement) {
        countdownElement = document.createElement("p");
        countdownElement.id = "countdown";
        countdownElement.style.marginTop = "10px";
        document.querySelector(".time-box").appendChild(countdownElement);
    }

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {

        if (!maghribTime24) return;

        const now = new Date();

        const [hours, minutes] = maghribTime24.split(":");

        const iftar = new Date();
        iftar.setHours(parseInt(hours));
        iftar.setMinutes(parseInt(minutes));
        iftar.setSeconds(0);

        if (now > iftar) {
            iftar.setDate(iftar.getDate() + 1);
        }

        const diff = iftar - now;

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElement.innerText =
            `⏳ متبقي على الإفطار: ${h} ساعة ${m} دقيقة ${s} ثانية`;

    }, 1000);
}

function updateSky() {

    const hour = new Date().getHours();
    const skyIcon = document.getElementById("skyIcon");

    if (hour >= 6 && hour < 18) {
        skyIcon.className = "sky-icon sun";
        document.body.style.background =
            "linear-gradient(to bottom, #4facfe, #00f2fe)";
    } else {
        skyIcon.className = "sky-icon moon";
        document.body.style.background =
            "linear-gradient(to bottom, #0f2027, #203a43, #2c5364)";
    }
}

getIftarTime();
updateSky(); 
