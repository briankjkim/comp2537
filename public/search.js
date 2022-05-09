type_global = ""

function processPokemonResp(data){
    for (i = 0; i < data.types.length; i++)
        if(data.types[i].type.name == type_global)
            $("main").html(data.id)
}

function display(type_){
    for(i = 1; i <= 151; i++){
        $.ajax({
            type: "get",
            URL: `https://pokeapi.co/api/v2/pokemon/${i}`,
            success: processPokemonResp
        })
    }
    $("main").html()
}


function setup() {


    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display($("#poke_type option:selected").val())
    })
}

$(document).ready(setup)