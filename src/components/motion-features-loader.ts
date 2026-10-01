// Defers framer-motion's animation features (~30 KB) until they can matter: the first pointer,
// key or touch input, or browser idle time after the page has loaded. Initial card entrances
// are CSS animations, so nothing visible depends on these features during page load.
let featuresPromise: Promise<typeof import("./motion-features").default> | null = null;

function whenNeeded() {
  return new Promise<void>((resolve) => {
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      events.forEach((e) => window.removeEventListener(e, finish, true));
      resolve();
    };
    events.forEach((e) => window.addEventListener(e, finish, { capture: true, passive: true, once: true }));
    // A short grace period after load keeps this out of the initial rendering work entirely.
    const idle = () =>
      setTimeout(() => {
        if ("requestIdleCallback" in window) window.requestIdleCallback(finish, { timeout: 3000 });
        else finish();
      }, 2000);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
  });
}

export function loadMotionFeatures() {
  if (!featuresPromise) {
    featuresPromise = whenNeeded()
      .then(() => import("./motion-features"))
      .then((mod) => mod.default)
      .catch((err) => {
        featuresPromise = null;
        throw err;
      });
  }
  return featuresPromise;
}
