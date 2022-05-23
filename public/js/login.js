const res = require("express/lib/response")

function loginsuccess() {
    res.redirect("/profile.ejs");
}


function login() {
    console.log("Login attempt made!")
    $.ajax({
        type: "POST",
        url: `/login`,
        data: {
            username: $("#username").val(),
            password: $("#user_pwd").val(),
        },
        success: loginsuccess,
    })
}


function setup() {
    $("body").on('click', '.submit', login)
}

$(document).ready(setup)