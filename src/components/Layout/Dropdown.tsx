import {
  createSignal,
  onCleanup,
  onMount,
  JSX,
  Show,
  createEffect,
} from "solid-js";

type DropdownProps = {
  trigger: (toggle: () => void) => JSX.Element;
  children: (toggle: () => void) => JSX.Element;
  align?: "left" | "right";
  width?: string; // e.g. "w-64", "w-96"
};

export default function Dropdown(props: DropdownProps) {
  const [open, setOpen] = createSignal(false);
  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  let dropdownRef: HTMLDivElement | undefined;

  // Close on outside click
  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdownRef?.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("click", handleClickOutside);
    onCleanup(() => document.removeEventListener("click", handleClickOutside));
  });

  return (
    <div class="relative inline-block" ref={dropdownRef}>
      {props.trigger(toggle)}

      <Show when={open()}>
        <div
          class={`absolute mt-2 z-50 bg-white rounded-lg shadow-lg ring-1 ring-black/10 
            ${props.align === "right" ? "right-0" : "left-0"} 
            ${props.width ?? "w-64"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {props.children(toggle)}
        </div>
      </Show>
    </div>
  );
}
