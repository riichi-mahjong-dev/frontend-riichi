import { createSignal, onCleanup } from "solid-js";

const pinTileSVGs = [
  // 1-pin (bright blue)
  `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="60" rx="6" ry="6" fill="#fff" stroke="#444" stroke-width="3"/>
    <circle cx="20" cy="30" r="6" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
  </svg>`,

  // 2-pin (blue + teal)
  `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="60" rx="6" ry="6" fill="#fff" stroke="#444" stroke-width="3"/>
    <circle cx="13" cy="22" r="5" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
    <circle cx="27" cy="40" r="5" fill="#0ea5e9" stroke="#0369a1" stroke-width="1"/>
  </svg>`,

  // 3-pin (red, blue, green)
  `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="60" rx="6" ry="6" fill="#fff" stroke="#444" stroke-width="3"/>
    <circle cx="20" cy="15" r="5" fill="#ef4444" stroke="#991b1b" stroke-width="1"/>
    <circle cx="20" cy="30" r="5" fill="#3b82f6" stroke="#1e40af" stroke-width="1"/>
    <circle cx="20" cy="45" r="5" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
  </svg>`,

  // 5-pin (red dora center + rainbow edge pins)
  `<svg viewBox="0 0 40 60" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="60" rx="6" ry="6" fill="#fff" stroke="#444" stroke-width="3"/>
    <circle cx="10" cy="15" r="4" fill="#a78bfa" stroke="#6b21a8" stroke-width="1"/>
    <circle cx="30" cy="15" r="4" fill="#facc15" stroke="#a16207" stroke-width="1"/>
    <circle cx="20" cy="30" r="4" fill="#ef4444" stroke="#991b1b" stroke-width="1.5"/>
    <circle cx="10" cy="45" r="4" fill="#0ea5e9" stroke="#0369a1" stroke-width="1"/>
    <circle cx="30" cy="45" r="4" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
  </svg>`,
];

const PinTileLoader = () => {
  const [index, setIndex] = createSignal(0);

  const interval = setInterval(() => {
    setIndex((i) => (i + 1) % pinTileSVGs.length);
  }, 600);

  onCleanup(() => clearInterval(interval));

  return (
    <div
      class="w-10 h-16 transition-transform duration-300 ease-in-out"
      innerHTML={pinTileSVGs[index()]}
    />
  );
};

export default PinTileLoader;
