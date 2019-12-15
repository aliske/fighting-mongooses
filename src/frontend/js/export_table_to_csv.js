function exportTableToCSV($table, filename) {
    console.log("Clicked the download button");
    let $rows = $table.find('tr'),

        // Temporary delimiter characters unlikely to be typed by keyboard
        // This is to avoid accidentally splitting the actual contents
        tmpColDelim = String.fromCharCode(11), // vertical tab character
        tmpRowDelim = String.fromCharCode(0), // null character

        // actual delimiter characters for CSV format
        colDelim = '","',
        rowDelim = '"\r\n"',

        // Grab text from table into CSV formatted string
        csv = '"' + $rows.map(function (i, row) {
            let $row = $(row),
                $cols = $row.find('td,th');

            return $cols.map(function (j, col) {
                let $col = $(col),
                    text = $col.text();

                return text.replace('"', '""'); // escape double quotes

            }).get().join(tmpColDelim);

        }).get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim) + '"',

        // Data URI
        csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

    let hiddenElement = document.createElement('a');
    hiddenElement.href = csvData;
    hiddenElement.target = '_blank';
    hiddenElement.download = filename;
    hiddenElement.click();

}