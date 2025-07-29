import { createSignal, onCleanup, onMount, JSX, Show } from "solid-js";

type DropdownProps = {
  trigger: (toggle: () => void) => JSX.Element;
  children: JSX.Element;
  align?: "left" | "right";
};

export default function Dropdown(props: DropdownProps) {
  const [open, setOpen] = createSignal(false);

  const toggle = () => setOpen(prev => !prev);
  const close = () => setOpen(false);

  // Click outside to close
  let dropdownRef: HTMLDivElement | undefined;

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
          class={`absolute mt-2 z-50 bg-white rounded-lg shadow-lg ring-1 ring-black/10 w-96 ${
            props.align === "right" ? "right-0" : "left-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {props.children}
        </div>
      </Show>
    </div>
  );
}
