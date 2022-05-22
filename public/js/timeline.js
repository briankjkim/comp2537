function loadEvents() {
    $.ajax({
        url: "https://infinite-atoll-62449.herokuapp.com/timeline/getAllEvents",
        type: "get",
        success: (data) => {
            console.log("timeline GET request sent")
            for (i = 0; i < data.length; i++) {

                $("main").append(
                    `
                <div class="event_container"> 
                    Event  Text - ${data[i].text}
                <br> 
                    Event  time - ${data[i].time}
                <br> 
                    Event  Hits - ${data[i].hits}
                <br>
                    Event uID - ${data[i]._id}
                <br>
                    <button class="likeButton" id="${data[i]["_id"]}">Like!</button>
                <br>
                    <button class="removeButton" id="${data[i]["_id"]}">Delete this, nephew!</button>
                </div>
                
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
        success: (server_response)=>{console.log(server_response)}
    })
}


function removeTimelineEvents(){
    x = this.id
    $.ajax({
        url:`https://infinite-atoll-62449.herokuapp.com/timeline/remove/${x}`,
        type:"get",
        success: (server_response)=>{console.log(server_response)}
    })
}


function setup() {
    loadEvents()

    $("body").on('click', '.likeButton', increamentHitsByOne)
    $("body").on('click', '.removeButton', removeTimelineEvents)

}

$(document).ready(setup)