function loadEvents() {
    $.ajax({
        url: "https://infinite-atoll-62449.herokuapp.com/timeline/getAllEvents",
        type: "get",
        success: (data) => {
            console.log("time line GET request sent")
            for (i = 0; i < data.length; i++) {

                $("main").append(
                    `
                <p> 
                    Event  Text - ${data[i].text}
                <br> 
                    Event  time - ${data[i].time}
                <br> 
                    Event  Hits - ${data[i].hits}
                <br> 
                    <button class="likeButton" id="${data[i]["_id"]}">Like!</button>
                </p>
                
                `
                )
            }
        }
    })
}

function increamentHitsByOne(){
    x = this.id
    $.ajax({
        url:`https://infinite-atoll-62449.herokuapp.com/timeline/inreaseHits/${x}`,
        type:"get",
        success: (e)=>{console.log(e)}
    })
}
function setup() {
    loadEvents()

    $("body").on('click', '.likeButton', increamentHitsByOne)
}

$(document).ready(setup)