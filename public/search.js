function processPokemonRespByType(data) {
    for (i = 0; i < data.pokemon.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data.pokemon[i].pokemon.name}">` + data.pokemon[i].pokemon.name + "</a></div>")
    }

}

function processPokemonRespByHabitat(data) {
    // console.log(data)
    for (i = 0; i < data.pokemon_species.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data.pokemon_species[i].name}">` + data.pokemon_species[i].name + "</a></div>")
    }
}

function processPokemonRespByName(data) {
    $("main").append(`
    <div class="image_container">
    <img src="${data.sprites.other["official-artwork"].front_default}">
    </div><a href="/profile/${data.id}">
    ${data.name} </a>`)
}


function display_by_type(type_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/${type_num}/`,
        success: processPokemonRespByType
    })
}

function display_by_habitat(habitat_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon-habitat/${habitat_num}/`,
        success: processPokemonRespByHabitat
    })
}

function search_by_name() {
    $("main").empty()
    search_term = $("#poke_name").val()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon/${search_term}/`,
        success: processPokemonRespByName
    })
}


function setup() {
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display_by_type($("#poke_type option:selected").val())
    })

    $("#poke_habitat").change(() => {
        poke_habitat = $("#poke_habitat option:selected").val();
        display_by_habitat($("#poke_habitat option:selected").val())
    })

    $("#find_pokemon_by_name").click(search_by_name)

}


$(document).ready(setup)