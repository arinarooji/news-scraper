$(document).ready(() => {
    console.log("Client-side JavaScript");

    //Post comment click event listener
    $('.comment-btn').on('click', (event) => {
        event.preventDefault();
        let $btn = event.target;

        console.log($($btn).data('id'));

        //AJAX put request
        //...

    });


});