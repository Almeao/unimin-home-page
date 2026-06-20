const ACCENT = "#76a5d1";
const TEXT = "#f0f4f8";

// Main website launch — 26 days from 20 June 2026
const launchDate = new Date("2026-07-16T00:00:00");

function waitForImages() {
  return Promise.all(
    [...document.images].map(
      (img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.onload = img.onerror = resolve;
            })
    )
  );
}

function waitForVideos() {
  return Promise.all(
    [...document.querySelectorAll("video")].map(
      (video) =>
        new Promise((resolve) => {
          if (video.readyState >= 3) {
            resolve();
            return;
          }
          video.addEventListener("canplaythrough", resolve, { once: true });
          video.addEventListener("error", resolve, { once: true });
        })
    )
  );
}

function whenReady() {
  const timeout = new Promise((resolve) => setTimeout(resolve, 10000));

  return Promise.race([
    Promise.all([
      waitForImages(),
      waitForVideos(),
      document.fonts.ready,
      new Promise((resolve) => {
        if (document.readyState === "complete") {
          resolve();
          return;
        }
        window.addEventListener("load", resolve, { once: true });
      }),
    ]),
    timeout,
  ]);
}

function pad(value) {
  return String(value).padStart(2, "0");
}

function getTimeLeft() {
  const diff = launchDate.getTime() - Date.now();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, finished: false };
}

function initCountdown() {
  const units = {
    days: document.querySelector('[data-unit="days"]'),
    hours: document.querySelector('[data-unit="hours"]'),
    minutes: document.querySelector('[data-unit="minutes"]'),
    seconds: document.querySelector('[data-unit="seconds"]'),
  };

  const dateLabel = document.querySelector("[data-launch-date]");
  if (dateLabel) {
    dateLabel.textContent = `Launch date: ${launchDate.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })}`;
  }

  const update = () => {
    const time = getTimeLeft();

    units.days.textContent = pad(time.days);
    units.hours.textContent = pad(time.hours);
    units.minutes.textContent = pad(time.minutes);
    units.seconds.textContent = pad(time.seconds);

    if (time.finished) {
      clearInterval(timer);
      document.querySelector(".subline").textContent =
        "We're live — welcome to UNIMIN India.";
    }
  };

  update();
  const timer = setInterval(update, 1000);
}

function startAnimations() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  tl.from(".eyebrow", { opacity: 0, duration: 0.6 })
    .from(".headline", { opacity: 0, duration: 0.7 }, "-=0.35")
    .from(".subline", { opacity: 0, duration: 0.6 }, "-=0.4")
    .from(".countdown", { opacity: 0, y: 20, duration: 0.7 }, "-=0.3")
    .from(
      ".accent-line",
      { scaleX: 0, opacity: 0, duration: 0.7, ease: "power2.inOut" },
      "-=0.25"
    )
    .from(".footer", { opacity: 0, y: 16, duration: 0.5 }, "-=0.2");
}

function initCustomCursor() {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    return;
  }

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring) {
    return;
  }

  gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

  const dotX = gsap.quickSetter(dot, "x", "px");
  const dotY = gsap.quickSetter(dot, "y", "px");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  dotX(mouseX);
  dotY(mouseY);
  gsap.set(ring, { x: ringX, y: ringY });

  window.addEventListener("mousemove", (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    dotX(mouseX);
    dotY(mouseY);
  });

  gsap.ticker.add(() => {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    gsap.set(ring, { x: ringX, y: ringY });
  });

  const growCursor = () => {
    gsap.to(ring, {
      scale: 2,
      borderColor: TEXT,
      opacity: 0.85,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(dot, { scale: 0.4, duration: 0.35, ease: "power2.out" });
  };

  const shrinkCursor = () => {
    gsap.to(ring, {
      scale: 1,
      borderColor: ACCENT,
      opacity: 0.55,
      duration: 0.35,
      ease: "power2.out",
    });
    gsap.to(dot, { scale: 1, duration: 0.35, ease: "power2.out" });
  };

  document.querySelectorAll(".footer-link").forEach((el) => {
    el.addEventListener("mouseenter", growCursor);
    el.addEventListener("mouseleave", shrinkCursor);
  });

  document.addEventListener("mouseleave", shrinkCursor);
}

function revealPage() {
  document.body.classList.add("is-ready");

  const loader = document.querySelector(".page-loader");
  if (loader) {
    loader.addEventListener("transitionend", () => loader.remove(), {
      once: true,
    });
    setTimeout(() => loader.remove(), 600);
  }

  initCountdown();
  startAnimations();
  initCustomCursor();
}

whenReady().then(revealPage);
