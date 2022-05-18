function processPokemonRespByType(data) {
    console.log(data[0]);
    for (i = 0; i < data[0].pokemon.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data[0].pokemon[i].pokemon.id}">` + data[0].pokemon[i].pokemon.name + "</a></div>")
    }

}

function processPokemonRespByHabitat(data) {
    for (i = 0; i < data.pokemon_species.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data[0].pokemon_species[i].id}">` + data[0].pokemon_species[i].name + "</a></div>")
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
        url: `https://cryptic-wildwood-03560.herokuapp.com/pokemon_by_type/${type_num}/`,
        success: processPokemonRespByType
    })
}

function display_by_habitat(habitat_num) {
    $("main").empty()
    $.ajax({
        type: "get",
        url: `https://cryptic-wildwood-03560.herokuapp.com/pokemon_by_habitat/${habitat_num}/`,
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

function insertSearchEventToTheTimeLine(data){
    let now = new Date(Date.now());
    let formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    $.ajax({
        url: "https://infinite-atoll-62449.herokuapp.com/timeline/insert",
        type: "put",
        data: {
            text: ` Client has serched for ${data}`,
            time: `at time ${formatted}`,
            hits: 1
        },
        success: function(res){
            console.log(res)
        }
    })
}


function setup() {
    $("#poke_type").change(() => {
        poke_type = $("#poke_type option:selected").val();
        display_by_type($("#poke_type option:selected").val())
        insertSearchEventToTheTimeLine(poke_type)
    })

    $("#poke_habitat").change(() => {
        poke_habitat = $("#poke_habitat option:selected").val();
        display_by_habitat($("#poke_habitat option:selected").val())
        insertSearchEventToTheTimeLine(poke_habitat)
    })

    $("#find_pokemon_by_name").click(search_by_name)
}

$(document).ready(setup)