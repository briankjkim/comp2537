pokemonGridImages = ""

function loadPokemonImages() {
    for (i = 1; i <= 9; i++) {
        if (i % 3 == 1) { // only when i = 1, 4, 7
            pokemonGridImages += `<div class="images_group">`
        }

        pokemonGridImages += `<div class="image_container"><img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/60.png"></div>`

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