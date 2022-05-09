function processPokemonRespByType(data) {

    for (i = 0; i < data.pokemon.length; i++) {
        $("main").append("<div>" + data.pokemon[i].pokemon.name + "</div>")
    }

}

function processPokemonRespByHabitat(data) {
    // console.log(data)
    for (i = 0; i < data.pokemon_species.length; i++) {
        $("main").append("<div>" + data.pokemon_species[i].name + "</div>")
    }
}

function processPokemonRespByName(data) {

    poke_id = data.id

    $("main").append("<div>" + data.name + "</div><br>")
    $("main").append("<div>" + data.id + "</div><br>")

    sprite_html = `<img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke_id}.png"`

    $("main").append("<div>" + sprite_html + "</div><br>")


}


function display_by_type(type_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/${type_num}/`,
        success: processPokemonRespByType
    })
}

function display_by_habitat(type_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/pokemon-habitat/${type_num}/`,
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