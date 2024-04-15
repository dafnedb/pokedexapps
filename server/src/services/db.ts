import Datastore from "nedb-promise-ts";
import type {Pokemon} from "./pokemon"

const db = Datastore.create({filename: "./data/db", autoload: true});

const savePokemon = async (pokemon : Pokemon) => {
    return db.insert(pokemon);
}
const findPokemon = async (id: number) => {
    return db.findOne({id});
}

const findPokemonByName = async (name:string) => {
    return db.findOne({name});
}

const pokemonList = async (page?: number) => {
        const pageSize = 10; // Define el tamaño de la página
        const skip = page ? (page - 1) * pageSize : 0; // Calcula el número de documentos a saltar según la página
    
        const query = db.find({}).skip(skip).limit(pageSize); // Consulta la base de datos, saltando los documentos necesarios y limitando el número de resultados
    
        return query;
}