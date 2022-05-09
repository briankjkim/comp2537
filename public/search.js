type_global = ""

function processPokemonResp(data) {
    // for each pokemon, check if filtered type matches the actual type
    for (i = 0; i < data.types.length; i++) {
        if (data.types[i].type.name == type_global)
            $("main").append("<p>"+data.id+"</p>")
    }
}


function display(type_) {
    $("main").empty()
    type_global = type_
    // iterate over first gen pokemons
    for (i = 1; i <= 151; i++) {
        $.ajax({
            type: "get",
            url: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokemonResp
        })
    }

}


function setup() {
    display($("#poke_type option:selected").val())

    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display($("#poke_type option:selected").val())

    })
}


$(document).ready(setup)