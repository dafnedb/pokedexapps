import type { APIRoute } from "astro";
import { deletePokemon } from "../../../services/pokemon";

export const DELETE: APIRoute = async (context) => {
  try {
    const pokemonId = context.params.id;
    if (!pokemonId || isNaN(parseInt(pokemonId))) {
      throw new Error('Invalid Pokemon ID');
    }await deletePokemon(parseInt(pokemonId));
    return new Response(JSON.stringify({ message: 'Pokemon deleted successfully' }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 200
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      status: 400
    });
  }
}