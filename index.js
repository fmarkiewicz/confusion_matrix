var matrix = [];
var matrix_container = $('.matrix-container')

function createInput(x, y) {
    return $('<input>').attr('type', 'number').attr('min', '0').attr('x', x).attr('y', y).addClass('form-control');
};

function makeTHead(k) {
    let _thead = $('<thead>').addClass('thead-dark'),
        _tr = $('<tr>');
        $('<th>').attr('scope', 'col').text('#').appendTo(_tr);
    for(let i = 1; i <= k; i++) {
        $('<th>').attr('scope', 'col').text(i).appendTo(_tr);
    }

    _tr.appendTo(_thead);
    _thead.appendTo(matrix_container);
};

function makeTBody(k) {
    let _tbody = $('<tbody>');

    for(let i = 1; i <= k; i++) {
        let _tr = $('<tr>');
        $('<th>').attr('scope', 'row').text(i).appendTo(_tr);

        for(let j = 1; j <= k; j++) {
            let _td = $('<td>');
            createInput(j - 1, i - 1).appendTo(_td);
            _td.appendTo(_tr);
        }

        _tr.appendTo(_tbody);
    }   
    _tbody.appendTo(matrix_container);
};

function clearMatrix() {
    matrix_container.html('');
};

function applyListener() {
    $('.matrix-container input').change( function() {
        let _this = $(this),
            _x = _this.attr('x')*1,
            _y = _this.attr('y')*1;

        matrix[_y][_x] = _this.val()*1;

        console.table(matrix);
    });
};

$('.k-var').change( function() {
    let k = this.value*1;

    clearMatrix();

    matrix = Array(k).fill(null).map(() => Array(k).fill(0));
    console.table(matrix);

    makeTHead(k);
    makeTBody(k);
    applyListener();
});