/* ===== Starfield (two-layer parallax) ===== */
const c1 = document.getElementById('starfield');
const c2 = document.getElementById('starfield2');
const ctx1 = c1.getContext('2d');
const ctx2 = c2.getContext('2d');
function resize(){ c1.width = c2.width = innerWidth; c1.height = c2.height = innerHeight; }
addEventListener('resize', resize); resize();

function makeStars(n, speed){
  const arr=[]; for(let i=0;i<n;i++){
    arr.push({x:Math.random()*c1.width, y:Math.random()*c1.height, z:Math.random()*1, s:speed*(.5+Math.random()), r:Math.random()*1.4});
  } return arr;
}
let layer1 = makeStars(220, .25); // slow far layer
let layer2 = makeStars(120, .6);  // fast near layer

function drawLayer(ctx, stars, drift){
  ctx.clearRect(0,0,c1.width,c1.height);
  for(const st of stars){
    st.x += st.s*drift.x; st.y += st.s*drift.y;
    if(st.x<0) st.x=c1.width; if(st.x>c1.width) st.x=0; if(st.y<0) st.y=c1.height; if(st.y>c1.height) st.y=0;
    ctx.beginPath(); ctx.arc(st.x, st.y, st.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${0.5+st.z*0.5})`; ctx.fill();
  }
}
let drift={x:.2,y:.05};
function loop(){ drawLayer(ctx1, layer1, drift); drawLayer(ctx2, layer2, {x:drift.x*1.6, y:drift.y*1.6}); requestAnimationFrame(loop); }
loop();

// subtle parallax on mouse move
addEventListener('mousemove', e=>{
  const cx = e.clientX/innerWidth - .5; const cy = e.clientY/innerHeight - .5;
  drift = {x: .2 + cx*.3, y: .05 + cy*.2};
});

/* ===== Reveal on scroll ===== */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('visible'); io.unobserve(en.target);} });
},{threshold:.2});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

/* ===== Magnetic tilt for cards ===== */
function addTilt(el){
  el.addEventListener('pointermove', e=>{
    const b = el.getBoundingClientRect();
    const px = (e.clientX - b.left)/b.width - .5; const py = (e.clientY - b.top)/b.height - .5;
    el.style.transform = `perspective(800px) rotateX(${(-py*4).toFixed(2)}deg) rotateY(${(px*4).toFixed(2)}deg) translateY(-6px)`;
  });
  el.addEventListener('pointerleave', ()=>{ el.style.transform=''; });
}
document.querySelectorAll('.card').forEach(addTilt);

/* ===== Smooth details toggles (auto height) ===== */
function toggleDetails(id, btn){
  const box = document.getElementById(id);
  const open = box.classList.contains('open');
  if(!open){
    box.style.maxHeight = '0px';
    box.classList.add('open');
    requestAnimationFrame(()=>{ box.style.maxHeight = box.scrollHeight + 'px'; });
    btn.textContent = 'Hide details';
  }else{
    box.style.maxHeight = box.scrollHeight + 'px';
    requestAnimationFrame(()=>{ box.style.maxHeight = '0px'; });
    box.addEventListener('transitionend', ()=> box.classList.remove('open'), {once:true});
    btn.textContent = 'View details';
  }
}
document.querySelectorAll('[data-toggle]').forEach(btn=>{
  btn.addEventListener('click', ()=> toggleDetails(btn.getAttribute('data-toggle'), btn));
});

/* ===== Animate skill rings when visible ===== */
const ringObserver = new IntersectionObserver((ents)=>{
  ents.forEach(en=>{
    if(en.isIntersecting){
      en.target.querySelectorAll('.progress').forEach(c=>{
        const p = +c.dataset.p; const circ = 2*Math.PI*42; const off = circ*(1-p/100);
        c.s
