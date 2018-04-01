var matrix = [],
    matrix_container = $('.matrix-container');

function createInput(x, y) {
    return $('<input>').attr('type', 'number').attr('min', '0').attr('x', x).attr('y', y).addClass('form-control');
};

function createTRowWithName(name = '', className = '', rowColor = '', fieldColor = '') {
    let _tr = $('<tr>').addClass(rowColor).addClass(className),
        _th = $('<th>').attr('scope', 'row').text(name).addClass(fieldColor).appendTo(_tr);
    return _tr;
};

function createTdWithValue(value) {
    return $('<td>').text(formatCalc(value));
}

function formatCalc(num) {
    return num.toFixed(2);
};

function makeTHead(k) {
    let _thead = $('<thead>').addClass('thead-dark'),
        _tr = $('<tr>');
        $('<th>').attr('scope', 'col').text('Pred\\Real').appendTo(_tr);
    for(let i = 1; i <= k; i++) {
        $('<th>').attr('scope', 'col').text(i).appendTo(_tr);
    }

    _tr.appendTo(_thead);
    _thead.appendTo(matrix_container);
};

function makeTBody(k) {
    let _tbody = $('<tbody>');

    for(let i = 1; i <= k; i++) {
        let _tr = createTRowWithName(i, '', '', '');

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
    $('.matrix-container input').keyup( function() {
        let _this = $(this),
            _x = _this.attr('x')*1,
            _y = _this.attr('y')*1;

        matrix[_y][_x] = _this.val()*1;

        calcRest(k);
        calcAcurracyAndOER(k);
    });
};

function calcAcurracyAndOER(k) {
    $('.accuracy, .OER').remove();

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

    let _tr_OER = createTRowWithName('Overall error rate', 'OER', 'table-primary');
    createTdWithValue(_FN_FP / _N).appendTo(_tr_OER);
    _tr_OER.appendTo(matrix_container);

    let _tr_accuracy = createTRowWithName('Accuracy', 'accuracy', 'table-primary');
    createTdWithValue(_TP_TN / _N).appendTo(_tr_accuracy);
    _tr_accuracy.appendTo(matrix_container);
};

function calcRest(k) {
    // i -> class
    // m -> row positin of matrix
    // n -> column position o matrix
    
    $('.FNR, .FPR, .sens, .spec').remove();

    let _tr_FN = createTRowWithName("False negative rate", "FNR", "table-success", ""),
        _tr_FP = createTRowWithName("False positive rate", "FPR", "table-success", ""),
        _tr_sensitivity = createTRowWithName("Sensitivity", "sens", "table-success", ""),
        _tr_specifity = createTRowWithName("Specifity", "spec", "table-success", "");

    // for every class
    for(let i = 0; i < k; i++) {
        let _TP = matrix[i][i],
            _TN = 0,
            _FP = 0,
            _FN = 0;
        //calculate from matrix
        for(let m = 0; m < k; m++) {
            for (let n = 0; n < k; n++) {

                if (m === n && m !== i) {
                    _TN += matrix[m][n];
                }

                if (n === i && m !== i) {
                    _FN += matrix[m][n];
                }

                if (n !== i && m !== n) {
                    _FP += matrix[m][n];
                }

            }
        }

        createTdWithValue(_FN/(_FN+_TN)).appendTo(_tr_FN);
        createTdWithValue(_FP/(_FP+_TP)).appendTo(_tr_FP);
        createTdWithValue(_TP/(_TP+_FN)).appendTo(_tr_sensitivity);
        createTdWithValue(_TN/(_TN+_FP)).appendTo(_tr_specifity);

        _tr_FN.appendTo(matrix_container);
        _tr_FP.appendTo(matrix_container);
        _tr_sensitivity.appendTo(matrix_container);
        _tr_specifity.appendTo(matrix_container);

    }        
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

    makeTHead(k);
    
    makeTBody(k);
    applyListener(k);

});