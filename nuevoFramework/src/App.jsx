/*import { createSignal } from 'solid-js'
import solidLogo from './assets/solid.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = createSignal(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} class="logo" alt="Vite logo" />
        </a>
        <a href="https://solidjs.com" target="_blank">
          <img src={solidLogo} class="logo solid" alt="Solid logo" />
        </a>
      </div>
      <h1>Vite + Solid</h1>
      <div class="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count()}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p class="read-the-docs">
        Click on the Vite and Solid logos to learn more
      </p>
    </>
  )
}

export default App
*/
import { createSignal, onCleanup, onMount } from "solid-js";

const BASE_URL = "http://localhost:4321/api";

function App() {
  const [list, setList] = createSignal([]);
  const [page, setPage] = createSignal(1);
  const [count, setCount] = createSignal(0);
  const [error, setError] = createSignal("");

  const pageCount = Math.ceil(count() / 5);

  onMount(() => {
    fetch(`${BASE_URL}/pokemon.json?page=${page()}`)
      .then((res) => res.json())
      .then((data) => {
        setList(data.listaPks.list);
        setCount(data.listaPks.count);
      });

    return () => {
      
    };
  });

  async function addPokemon(event) {
    event.preventDefault();

    const form = event.target;
    const data = new FormData(form);
    const pokemon = {
      id: parseInt(data.get("id")),
      name: data.get("name"),
    };

    await fetch(`${BASE_URL}/pokemon.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pokemon),
    });

    form.reset();
    if (page() === pageCount && list().length < 5) {
      setList((current) => [...current, pokemon]);
    }
    setCount((current) => current + 1);
  }

  async function deletePokemon(id) {
    await fetch(`${BASE_URL}/pokemon/${id}.json`, {
      method: "DELETE",
    });

    setList((current) => current.filter((pokemon) => pokemon.id !== id));
    setCount((current) => current - 1);

    if (page() >= pageCount) {
      setPage((prevPage) => prevPage - 1);
    }
  }

  return (
    <main class="container mx-auto flex flex-col">
      <h1 class="text-5xl text-red-600 font-extrabold text-center">Pokedex</h1>
      <form onSubmit={addPokemon}>
        <h2 class="text-2xl text-red-700 font-bold">Agregar nuevo pokemon</h2>
        <input
          type="number"
          name="id"
          placeholder="ID"
          class="my-1 w-full p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="text"
          name="name"
          placeholder="Name"
          class="my-1 w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          class="w-full p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 hover:bg-red-700"
        >
          Agregar
        </button>
      </form>
      <ul class="mt-4 border-4 border-red-700">
        <li class="flex items-center justify-between border-b border-gray-300 p-2 bg-red-700">
          <span class="text-lg text-white font-extrabold w-1/3">ID</span>
          <span class="text-lg text-white font-extrabold w-1/3 text-center">Name</span>
          <span class="text-lg text-white font-extrabold w-1/3 text-right">DELETE</span>
        </li>
        {list().map((pokemon) => (
          <li class="flex items-center justify-between border-b border-gray-300 p-2">
            <span class="text-lg text-red-600 font-bold w-1/3">{pokemon.id}</span>
            <span class="text-lg text-red-600 font-bold w-1/3 text-center">{pokemon.name}</span>
            <div class="w-1/3 text-right">
              <button onClick={() => deletePokemon(pokemon.id)} class="font-bold hover:font-extrabold">X</button>
            </div>
          </li>
        ))}
      </ul>
      <div class="flex justify-center gap-2">
        <button
          onClick={() => setPage((prevPage) => Math.max(1, prevPage - 1))}
          disabled={page() === 1}
          class="p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 disabled:opacity-50 hover:bg-red-700"
        >
          Prev
        </button>
        <span class="flex items-center self-stretch">{page()}</span>
        <button
          onClick={() => setPage((prevPage) => Math.min(pageCount, prevPage + 1))}
          disabled={page() === pageCount}
          class="p-2 bg-red-600 text-white rounded-lg mt-2 font-bold uppercase duration-200 disabled:opacity-50 hover:bg-red-700"
        >
          Next
        </button>
      </div>
    </main>
  );
}

export default App;
