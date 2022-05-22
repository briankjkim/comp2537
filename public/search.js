function processPokemonRespByType(data) {
    console.log(data);
    for (i = 0; i < data.pokemon.length; i++) {
        $("main").append("<div>" + `<a href="/profile/${data.pokemon[i].pokemon.id}">` + data.pokemon[i].pokemon.name + "</a></div>")
    }

}

function processPokemonRespByHabitat(data) {
    for (i = 0; i < data.pokemon_species.length; i++) {
        $("main").append(`<div> <a href="/profile/${data.pokemon_species[i].name}"> + ${data.pokemon[i].pokemon.name} + </a></div>`)
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

function insertSearchEventToTheTimeLine(data) {
    let now = new Date(Date.now());
    let formatted = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();

    $.ajax({
        url: "https://infinite-atoll-62449.herokuapp.com/timeline/insert",
        type: "put",
        data: {
            text: `Client has serched for ${data}`,
            time: `at time ${formatted}`,
            hits: 1
        },
        success: function (res) {
            console.log(res)
        }
    })
}


function setup() {
    $("#poke_type").change(() => {
        display_by_type($("#poke_type option:selected").val());
        insertSearchEventToTheTimeLine($("#poke_type option:selected").text());
    })

    $("#poke_habitat").change(() => {
        display_by_habitat($("#poke_habitat option:selected").val());
        insertSearchEventToTheTimeLine($("#poke_type option:selected").text())
    })

    $("#find_pokemon_by_name").click(() => {
        search_by_name;
        insertSearchEventToTheTimeLine($("#poke_name").val());
    })
}

$(document).ready(setup)