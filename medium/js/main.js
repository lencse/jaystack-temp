$(document).ready(() => {
    let editor = new MediumEditor('.editor')
})

$('#submit').click(() => {
    $('#content').text($('#editor').val())
})

$('.editor').change(() => {
    $('#content').text($('#editor').val())
})

