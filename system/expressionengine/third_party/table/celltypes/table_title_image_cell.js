var factory_title_image_cell = {

    /**
     * Get HTML for a title image cell
     *
     * @param row_num
     * @param col_num
     * @returns {string}
     */
    makeCell: function(field_id, row_num, col_num, value_obj) {

        if(value_obj === undefined) {
            value_obj = {};
        }

        var html = '<input type="hidden"><input type="text" value="'+(value_obj.title_text !== undefined ? value_obj.title_text : '')+'">';

        if(value_obj.assets_file_id === undefined) {
            html += '<div class="table__table__cell-add-image-controls"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add image</a></div><div class="table__table__cell-remove-image-controls" style="display:none"><div class="table__table__cell-thumbnail"></div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove image</a></div>';
        } else {
            html += '<div class="table__table__cell-add-image-controls" style="display:none"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add image</a></div><div class="table__table__cell-remove-image-controls"><div class="table__table__cell-thumbnail">'+ TableCellFactory.getAssetsImgThumb(value_obj.assets_file_id) +'</div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove image</a></div>';
        }

        return html;
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

        if(element_name === undefined) {
            cell_data_name = 'table_cell_'+field_id+'['+row+']['+col+']';
        }
        if(typeof cell_ref == "undefined") {
            cell_ref = $('#table__table__'+field_id+' .table__cell[data-row="'+row+'"][data-col="'+col+'"]');
        }

        var hidden_input = cell_ref.find('input[type=hidden]');
        hidden_input.attr('name', element_name);

        var text_input = cell_ref.find('input[type=text]');
        text_input.attr('tabindex', tabindex);

        // update the value of the hidden with the current values of the content
        var assets_file_id = cell_ref.find('img').data('assets_file_id');
        var title_text = text_input.val();

        hidden_input.val( JSON.stringify( {assets_file_id: assets_file_id, title_text: title_text} ));
    }

};