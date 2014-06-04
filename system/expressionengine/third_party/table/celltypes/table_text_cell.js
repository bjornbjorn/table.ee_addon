var factory_text_cell = {

    /**
     * Get HTML for a text cell
     *
     * @param row_num
     * @param col_num
     * @returns {string}
     */
    makeCell: function(field_id, row_num, col_num, text_value) {

        if(text_value !== undefined) {
            return '<textarea>'+text_value+'</textarea>';
        }
        else {
            return '<textarea></textarea>';
        }
    },

    /**
     * Update the cell (this is typically needed when col/row info changes, ie. when cells are moved etc.)
     *
     * Perform anything that is needed to update the cell when the row/col information changes.
     *
     * @param row row number
     * @param col column number
     * @param tabindex the preferred tab index for the cell
     * @param element_name the name the data element should have (often the input/hidden field - used to get the information stored in the cell from $_POST)
     * @param cell_ref a reference to the .table_cell object
     */
    updateCell: function(row, col, tabindex, element_name, cell_ref) {
        var textarea =  cell_ref.children().first();    // get the <textarea>
        textarea.attr('tabindex', tabindex);            // set tabindex
        textarea.attr('name', element_name);            // set element name
    }
};