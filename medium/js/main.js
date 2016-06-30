let editor = new MediumEditor('.editor')
editor.subscribe('editableInput', (e) => {
    $('#content').text(editor.getContent())
})

$('#submit').click(() => {
    $('#content').text(editor.getContent())
})

$('#load').click(() => {
    editor.setContent('<p>dsdsdssfsfss <a href="http://lencse.github.io/jaystack-temp/medium/">dsdsds</a>&nbsp;dsds</p>')
})

