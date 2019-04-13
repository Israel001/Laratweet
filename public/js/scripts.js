$(function () {
    $('.form').submit(function (el) {
        $('.form__buttons').prop('disabled', true);
        $('.form__buttons').addClass('disabled');
        $('.form__buttons').html('Processing....');
        $('input, textarea').prop('readonly', true);
        el.preventDefault();
        let value = $('#name').val();
        let pattern = /[a-z][A-Z]$/i;
        let check = value !== '' ? pattern.test(value) : null;
        console.log(check);
        if (check !== null && check !== true) {
            $('.name-error').html(`<strong> Please enter a proper name </strong>`);
            $('.name-error-hide').hide();
            $('.name').css('border', '1px solid #FF7730');
        } else {
            let url = el.target.action;
            let formData = $(this).serialize();
            $.post(url, formData, function (response) {
                if(response.toLowerCase().indexOf("html") >= 0) {
                    console.log(response);
                    window.location.replace("http://laratweet.local:8080/login");
                } else {
                    $('.form__buttons').prop('disabled', false);
                    $('.form__buttons').html('Register');
                    $('input, textarea').prop('readonly', false);
                    console.log(response);
                }
            });
        }
    });
});

$( document ).ajaxError(function( event, xhr ) {
    $('.form__buttons').prop('disabled', false);
    $('.form__buttons').html('Register');
    $('input, textarea').prop('readonly', false);
    let response = JSON.parse(xhr.responseText);
    if (response.errors != null || undefined) {
        const errors = response.errors;
        if (errors.password != null) {
            if (errors.password[0] != null) {
                $('.password-error').html(`<strong> ${errors.password[0]} </strong>`);
                $('.password-error-hide').hide();
                $('.password').css('border', '1px solid #FF7730');
            }
            if (errors.password[1] != null) {
                $('.password-confirm-error').html(`<strong> ${errors.password[1]} </strong>`);
                $('.password-confirm-error-hide').hide();
                $('.password-confirm').css('border', '1px solid #FF7730');
            }
        } else if (errors.email != null) {
            $('.email-error').html(`<strong> ${errors.email[0]} </strong>`);
            $('.email-error-hide').hide();
            $('.email').css('border', '1px solid #FF7730');
        } else if (errors.username != null) {
            $('.username-error').html(`<strong> ${errors.username[0]} </strong>`);
            $('.username-error-hide').hide();
            $('.username').css('border', '1px solid #FF7730');
        }
    }
    if (response.exception != null || undefined) {
        $('.username-error').html(`<strong> ${response.message} </strong>`);
        $('.username-error-hide').hide();
        $('.username').css('border', '1px solid #FF7730');
    }
    console.log(response);
});

$(document).ready(function() {
    $("button").click(function() {
        $(this).css('outline', 'none');
    })
});

let year = new Date().getFullYear();
document.getElementById('date').textContent = year;
