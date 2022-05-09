function processPokemonRespByType(data) {
    
    for (i = 0; i < data.pokemon.length; i++){
        $("main").append("<div>"+data.pokemon[i].pokemon.name+"</div>")
    }

}

function processPokemonRespByHabitat(data) {
    console.log(data)
    for (i = 0; i < data.pokemon_species.length; i++){
        $("main").append("<div>"+data.pokemon_species[i].name+"</div>")
    }

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



function setup() {
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display_by_type($("#poke_type option:selected").val())
    })

    $("#poke_habitat").change(() => {
        poke_habitat = $("#poke_habitat option:selected").val();
        display_by_habitat($("#poke_habitat option:selected").val())
    })
}


$(document).ready(setup)