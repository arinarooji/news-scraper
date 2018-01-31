//The web page must first load
$(document).ready(() => {

    //"Leave a Comment" click event listener
    $(".comment-btn").on("click", (event) => {
        event.preventDefault();
        let $btn = event.target;

        //Update comment-modal post button with current article details
        $(".modal-post-btn").attr("data-id", $($btn).data("id"));
    });

    $(".modal-post-btn").on("click", (event) => {
        event.preventDefault();

        //AJAX POST request
        //Reference the following elements on the DOM
        let $name = $("#name-input").val().trim();
        let $comment = $("#comment-input").val().trim();
        let $articleId = $(".modal-post-btn").data("id");

        //If the element value is blank, use the default values
        let nameInput = ($name !== "")? $name : "Anonymous"
        let commentInput = ($comment !== "")? $comment : "I love The Daily Bugle!"

        //Create a new commentData object to pass to the specified POST url
        let commentData = {id: $articleId, name: nameInput, comment: commentInput};

        //Post the commentData to the /comment route
        $.post({ url: "/comment", data: commentData });
    });

});