pokemonGridImages = ''

function processPokeResp(data) {
    console.log(data)
    pokemonGridImages += ` ${data.name}
      <div class="image_container">
      <a href="/profile/${data.id}">  
      <img src="${data.sprites.other["official-artwork"].front_default}">
      </a>
      </div>`
}

async function loadPokemonImages() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) { // only when i = 1, 4, 7
            pokemonGridImages += `<div class="images_group">`
        }

        // 1- generate a random number for Pokemon ID so that images can be loaded
        pokemonRandomID = Math.floor(Math.random() * 28) + 1

        // 2- initialize an AJAX request to my heroku api server
        await $.ajax({
            type: "GET",
            url: `https://cryptic-wildwood-03560.herokuapp.com/pokemon_by_id/${pokemonRandomID}`,
            success: processPokeResp
        })

        if (i % 3 == 0) { // only when i = 3, 6, 9
            pokemonGridImages += `</div>`
        }
    }
    $("main").html(pokemonGridImages)
}


function setup() {
    loadPokemonImages();
    // event handlers come here
}

$(document).ready(setup)