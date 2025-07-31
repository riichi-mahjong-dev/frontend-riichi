import { Component } from "solid-js";

interface ShimmerBoxProps {
  class?: string;
}

const ShimmerBox: Component<ShimmerBoxProps> = (props) => {
  return (
    <div
      class={`relative overflow-hidden bg-gray-200 rounded-md ${props.class ?? ""}`}
    >
      <div class="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
};

export default ShimmerBox;

