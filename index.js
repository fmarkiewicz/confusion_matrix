const BASIC_CALCULATIONS = ['Accuracy', 'Overall error rate', 'False negative rate',
    'False positive rate', 'Sensitivity', 'Specifity'];

var matrix = [],
    matrix_container = $('.matrix-container');

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
        $('<th>').attr('scope', 'row').addClass('table-dark').text(i).appendTo(_tr);

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

function applyListener(k) {
    $('.matrix-container input').change( function() {
        let _this = $(this),
            _x = _this.attr('x')*1,
            _y = _this.attr('y')*1;

        matrix[_y][_x] = _this.val()*1;

        console.table(matrix);
        calcAcurracyAndOER(k);
    });
};

function calcAcurracyAndOER(k) {
    $('.accuracy').html('');
    $('.OER').html('');

    let _TP_TN = 0,
        _FN_FP = 0,
        _N = 0;

    for(let i = 0; i < k; i++) {
        _TP_TN += matrix[i][i];

        for(let j = 0; j < k; j++) {
            _N += matrix[i][j];
            if(j !== i) _FN_FP += matrix[i][j];
        }
    }

    let _tr_OER = $('<tr>').addClass('table-primary').addClass('OER');
    $('<th>').attr('scope', 'row').text('Overall error rate').appendTo(_tr_OER);
    $('<td>').text(_FN_FP / _N).appendTo(_tr_OER);
    _tr_OER.appendTo(matrix_container);

    let _tr_accuracy = $('<tr>').addClass('table-primary').addClass('accuracy');
    $('<th>').attr('scope', 'row').text('Accuracy').appendTo(_tr_accuracy);
    $('<td>').text(_TP_TN / _N).appendTo(_tr_accuracy);
    _tr_accuracy.appendTo(matrix_container);
};

$('.k-var').change( function() {
    let k = this.value*1;
    if (k >= 10) {
        matrix_container.addClass('table-sm');
    } else {
        matrix_container.removeClass('table-sm');
    }
    clearMatrix();

    matrix = Array(k).fill(null).map(() => Array(k).fill(0));
    console.table(matrix);

    makeTHead(k);
    
    makeTBody(k);
    applyListener(k);

    
});