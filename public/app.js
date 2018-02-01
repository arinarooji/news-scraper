//The web page must first load
$(document).ready(() => {
    
    //VIEW & ADD NOTES
    //"Article Notes" click event listener
    $(".notes-btn").on("click", (event) => {
        event.preventDefault();
        let $btn = event.target;
        let $id = $($btn).data("id");

        //Update comment-modal post button with current article details
        $(".modal-post-btn").attr("data-id", $id);

        //Clear all previous notes on modal
        $(".notes-output").empty();

        //GET this article's notes
        $.get("/notes"+ $id, (data, status) => {
            //for each comment, create a <p> tag and append to the modal
            data.comments.forEach(comment => {
                let $newElement = $("<p>").html(comment.comment);
                $(".notes-output").append($newElement);
            });
        });
    });

    //POST NOTE
    //"Post Note" click event listener (located on modal)
    $(".modal-post-btn").on("click", (event) => {
        event.preventDefault();

        //Reference the following elements on the DOM
        let $comment = $("#comment-input").val().trim();
        let $id = $(".modal-post-btn").data("id");

        //If the element value is blank, use the default values
        let commentInput = ($comment !== "")? $comment : "I love The Daily Bugle!"

        //Create a new commentData object to pass to the specified POST url
        let commentData = {id: $id, comment: commentInput};

        //AJAX POST request
        //Post the commentData to the /comment route
        $.post({ url: "/comment", data: commentData });
    });

    //SAVE ARTICLE
    //"Save Article" click event listener
    $(".save-btn").on("click", event => {
        event.preventDefault();
        let $btn = event.target;

        let $id = $($btn).data("id");
        let saveData = {id: $id};

        //AJAX PUT request
        //Update the specified article's saved status to true
        $.ajax({ url: "/save" + $id, type: 'PUT', data: saveData });
    });

    //REMOVE ARTICLE (REVERT "SAVED:" TO FALSE)
    //"Remove Article" click event listener
    $(".remove-btn").on("click", event => {
        event.preventDefault();
        let $btn = event.target;

        let $id = $($btn).data("id");
        let saveData = {id: $id};

        //AJAX PUT request
        //Update the specified article's saved status to true
        $.ajax({ url: "/remove" + $id, type: 'PUT', data: saveData });
    });

});