import { JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
};

export default function Modal(props: ModalProps) {
  const stopPropagation = (e: Event) => e.stopPropagation();

  return (
    <Show when={props.open}>
      <Portal>
        <div
          class="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={props.onClose}
        >
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative z-50 animate-fade-in"
            onClick={stopPropagation}
          >
            {props.title && (
              <h2 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                {props.title}
              </h2>
            )}
            <button
              class="absolute top-2 right-3 text-gray-400 hover:text-gray-600"
              onClick={props.onClose}
            >
              ✕
            </button>
            {props.children}
          </div>
        </div>
      </Portal>
    </Show>
  );
}
