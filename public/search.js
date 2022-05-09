function processPokemonResp(data) {
    // for each pokemon, check if filtered type matches the actual type
    
    for (i = 0; i < data.pokemon.length; i++){
        $("main").append("<p>"+data.pokemon[i].pokemon.name+"</p>")
    }

}


function display(type_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://pokeapi.co/api/v2/type/${type_num}/`,
        success: processPokemonResp
    })
}


function setup() {
    display($("#poke_type option:selected").val())

    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display($("#poke_type option:selected").val())
    })
}


$(document).ready(setup)