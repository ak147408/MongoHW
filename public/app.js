// articles come as json
$.getJSON("/articles", function (data) {
    // loop thru each article
    for (var i = 0; i < data.length; i++) {
        // information display
        $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});


// click event for when a p tag is clicked
$(document).on("click", "p", function () {
    // delete thhe notes from the notes section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");

    // ajax call for the article
    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
        // information fro the note
        .then(function (data) {
            console.log(data);
            //title of article
            $("#notes").append("<h2>" + data.title + "</h2>");
            // new title input
            $("#notes").append("<input id='titleinput' name='title' >");
            // new note body text area
            $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
            // button fro new note and id
            $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
            //places the title and body of note in text area
            if (data.note) {

                $("#titleinput").val(data.note.title);

                $("#bodyinput").val(data.note.body);
            }
        });
});


$(document).on("click", "#savenote", function () {
    //grabs the ID associated with the article
    var thisId = $(this).attr("data-id");

    // post request to change output
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),

            body: $("#bodyinput").val()
        }
    })

        .then(function (data) {

            console.log(data);

            $("#notes").empty();
        });


    $("#titleinput").val("");
    $("#bodyinput").val("");
});
