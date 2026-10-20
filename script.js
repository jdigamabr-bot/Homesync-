const deviceCards = document.querySelectorAll(".device-card");
const allOffButton = document.getElementById("allOff");

const brightness = document.getElementById("brightness");
const brightnessValue = document.getElementById("brightnessValue");

const fanSpeed = document.getElementById("fanSpeed");
const fanSpeedValue = document.getElementById("fanSpeedValue");

const acTemp = document.getElementById("acTemp");
const acTempValue = document.getElementById("acTempValue");

const activeCount = document.getElementById("activeCount");
const powerValue = document.getElementById("powerValue");
const energyTotal = document.getElementById("energyTotal");
const energyBar = document.getElementById("energyBar");
const energyPercent = document.getElementById("energyPercent");

const securityToggle = document.getElementById("securityToggle");
const securityStatus = document.getElementById("securityStatus");

// Estimated power ratings for this browser demonstration.
const powerRatings = {
  light: 10,
  fan: 50,
  ac: 120,
  tv: 80
};

function getToggle(card) {
  return card.querySelector(".device-toggle");
}

function updateDevice(card) {
  const toggle = getToggle(card);
  const isOn = toggle.checked;
  const status = card.querySelector(".device-status");

  status.textContent = isOn ? "● On" : "● Off";
  card.classList.toggle("is-on", isOn);

  // Disable appliance adjustments when the appliance is off.
  card.querySelectorAll(".range").forEach((range) => {
    range.disabled = !isOn;
  });

  updateDashboard();
}

function calculatePower() {
  let total = 0;

  deviceCards.forEach((card) => {
    if (!getToggle(card).checked) return;

    const device = card.dataset.device;

    if (device === "light") {
      total += powerRatings.light *
        (Number(brightness.value) / 100);
    } else if (device === "fan") {
      total += powerRatings.fan *
        (Number(fanSpeed.value) / 5);
    } else {
      total += powerRatings[device];
    }
  });

  return Math.round(total);
}

function updateDashboard() {
  let active = 0;

  deviceCards.forEach((card) => {
    if (getToggle(card).checked) active++;
  });

  activeCount.textContent = active;

  const watts = calculatePower();
  powerValue.textContent = watts;
  energyTotal.textContent = `${watts} W`;

  // The dashboard uses a 400 W illustrative scale.
  const percentage = Math.min((watts / 400) * 100, 100);
  energyBar.style.width = `${percentage}%`;
  energyPercent.textContent =
    `${Math.round(percentage)}% of 400 W`;
}

// Appliance on/off switches.
deviceCards.forEach((card) => {
  getToggle(card).addEventListener("change", () => {
    updateDevice(card);
  });
});

// Light brightness.
brightness.addEventListener("input", () => {
  brightnessValue.textContent = `${brightness.value}%`;
  updateDashboard();
});

// Fan speed.
fanSpeed.addEventListener("input", () => {
  fanSpeedValue.textContent = `${fanSpeed.value} / 5`;
  updateDashboard();
});

// Air-conditioner temperature setting.
acTemp.addEventListener("input", () => {
  acTempValue.textContent = `${acTemp.value}°C`;
});

// Switch every appliance off.
allOffButton.addEventListener("click", () => {
  deviceCards.forEach((card) => {
    getToggle(card).checked = false;
    updateDevice(card);
  });
});

// Demonstration security toggle.
securityToggle.addEventListener("change", () => {
  securityStatus.textContent = securityToggle.checked
    ? "Armed (demo)"
    : "Disarmed";

  securityStatus.style.color = securityToggle.checked
    ? "#178e68"
    : "";
});

// Display today's date.
const today = document.getElementById("today");

today.textContent = new Date().toLocaleDateString("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric"
});

// Initialize the dashboard and appliance states.
deviceCards.forEach((card) => updateDevice(card));
