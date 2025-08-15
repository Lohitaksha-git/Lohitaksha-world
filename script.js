// === Starfield Animation ===
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function createStars(count) {
  stars = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2,
      speed: Math.random() * 0.5 + 0.2
    });
  }
}
createStars(200);

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > canvas.height) {
      star.y = 0;
      star.x = Math.random() * canvas.width;
    }
  });
  requestAnimationFrame(animateStars);
}
animateStars();

// === Scroll Reveal Animation ===
function revealOnScroll() {
  const reveals = document.querySelectorAll(".reveal, #about .bg-gray-800");
  const triggerBottom = window.innerHeight * 0.85;

  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);

// Optional: Glow flicker effect on title
setInterval(() => {
  const title = document.querySelector("#about h2");
  title.style.textShadow = Math.random() > 0.5
    ? "0 0 15px rgba(255,215,0,0.8), 0 0 30px rgba(255,215,0,0.6)"
    : "0 0 10px rgba(255,215,0,0.6), 0 0 20px rgba(255,215,0,0.4)";
}, 2000);
