import { A, createAsync, query } from "@solidjs/router";
import { ErrorBoundary, Suspense } from "solid-js";

const getPokemon = query(async (name: string) => {
  "use server";

  const pokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const dataPokemon = await pokemon.json();
  return dataPokemon;
}, "pokemon");

export default function Home() {
  const pokemon = createAsync<{weight: string}>(() => getPokemon("ditto"));

  return (
    <main class="text-center mx-auto text-gray-700 p-4">
      <p class="mt-8">
        Visit{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>
      </p>
        <Suspense fallback={<div>Loading...</div>}>
          {pokemon()?.weight}
        </Suspense>
      
      <p class="my-4">
        <span>Home</span>
        {" - "}
        <A href="/about" class="text-sky-600 hover:underline">
          About Page
        </A>{" "}
      </p>
    </main>
  );
}
