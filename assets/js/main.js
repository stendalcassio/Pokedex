const pokemonList = document.getElementById("pokemonList");
const loadMoreButton = document.getElementById("loadMoreButton");

const maxRecords = 30;
const limit = 10;
let offset = 0;

function convertPokemonToLi(pokemon) {
  return `
        <li class="pokemon ${pokemon.type}" data-id=${pokemon.number}>
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types
                      .map((type) => `<li class="type ${type}">${type}</li>`)
                      .join("")}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
  pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
    const newHtml = pokemons.map(convertPokemonToLi).join("");
    pokemonList.innerHTML += newHtml;
  });
}

loadPokemonItens(offset, limit);

loadMoreButton.addEventListener("click", () => {
  offset += limit;
  const qtdRecordsWithNexPage = offset + limit;

  if (qtdRecordsWithNexPage >= maxRecords) {
    const newLimit = maxRecords - offset;
    loadPokemonItens(offset, newLimit);

    loadMoreButton.parentElement.removeChild(loadMoreButton);
  } else {
    loadPokemonItens(offset, limit);
  }
});

const pokemonCards = document.getElementById("pokemonList");
const contentDetail = document.getElementById("contentDetail");

pokemonCards.addEventListener("click", (event) => {
  const clickedPokemon = event.target.closest(".pokemon");
  if (clickedPokemon) {
    const pokemonId = clickedPokemon.getAttribute("data-id");
    console.log(`Você clicou no Pokémon com o ID ${pokemonId}`);
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}/`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        const nameSpan = contentDetail.querySelector(".name");
        const numberSpan = contentDetail.querySelector(".number");
        const speciesSpan = contentDetail.querySelector(".Specie");
        const heightSpan = contentDetail.querySelector(".Height");
        const weightSpan = contentDetail.querySelector(".Weight");
        const abilitiesSpan = contentDetail.querySelector(".Abilities");

        contentDetail.style.display = "none";

        const pokemonImage = contentDetail.querySelector(".pokemon-image");
        if (pokemonImage) {
          const imageUrl = data.sprites.other.dream_world.front_default;
          pokemonImage.src = imageUrl;
          pokemonImage.alt = data.name;
        }

        nameSpan.innerHTML = data.name;
        numberSpan.textContent = `#00${data.id}`;
        speciesSpan.innerHTML = data.types
          .map((type) => `<span class="type">${type.type.name}</span>`)
          .join(", ");
        heightSpan.textContent = data.height;
        weightSpan.textContent = data.weight;
        abilitiesSpan.textContent = data.abilities
          .map((ability) => ability.ability.name)
          .join(", ");
          contentDetail.style.display = "block";
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API:", error);
      });
  } else {
    console.error("Atributo 'data-id' não encontrado no card.");
  }
});

const arrow = document.querySelector(".arrow");
const contentDetalhes = document.getElementById("contentDetail");

arrow.addEventListener("click", () => {
  if (contentDetalhes.style.display === "none" || contentDetail.style.display === "") {
    contentDetalhes.style.display = "block";
  } else {
    contentDetail.style.display = "none";
  }
});
