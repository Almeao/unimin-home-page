
const tl = gsap.timeline();


// 3. Reveal Main Wrapper



// Animate the .main_logo: fade in and scale up slightly, with a bit of bounce

tl.from(".main_logo", {
opacity: 0,
scale: 0.5,
y: -40,
duration: 0.3,
ease: "back.out(1.2)"
}, "-=0.3");



// Unique text animation for .heading_2: each letter "pops" into place with a bounce, staggered

const heading2 = document.querySelector('.heading_2 h2');
const heading2Text = heading2.innerText;
heading2.innerHTML = '';

heading2Text.split('').forEach((char, idx) => {
const span = document.createElement('span');
span.classList.add('heading2-char');
span.textContent = (char === ' ') ? '\u00A0' : char;
heading2.appendChild(span);
});

const heading2Chars = document.querySelectorAll('.heading2-char');

tl.from(heading2Chars, {
scale: 0,
opacity: 0,
y: 40,
rotation: 27,
duration: 0.2,
ease: "back.out(2.2)",
stagger: 0.01
}, "-=0.2");


// Attempt to animate the .heading_3 element (not .heading_2 h3!)

const heading3 = document.querySelector('.heading_3 h2');
if (heading3) {
const heading3Text = heading3.innerText;
heading3.innerHTML = '';

heading3Text.split('').forEach((char, idx) => {
const span = document.createElement('span');
span.classList.add('heading3-char');
span.textContent = (char === ' ') ? '\u00A0' : char;
heading3.appendChild(span);
});

const heading3Chars = heading3.querySelectorAll('.heading3-char');

tl.from(heading3Chars, {
scale: 0,
opacity: 0,
y: 40,
rotation: 27,
duration: 0.6,
ease: "back.out(2.2)",
stagger: 0.01
}, "-=0.2");
}



