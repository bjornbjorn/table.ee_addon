var factory_image_cell = {

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

        html = '<input type="hidden">';

        if(value_obj.assets_file_id === undefined && value_obj.file_id === undefined) {
            html += '<div class="table__table__cell-add-image-controls"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add file</a></div><div class="table__table__cell-remove-image-controls" style="display:none"><div class="table__table__cell-thumbnail"></div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove file</a></div>';
        } else if(value_obj.assets_file_id) {
            html += '<div class="table__table__cell-add-image-controls" style="display:none"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add file</a></div><div class="table__table__cell-remove-image-controls"><div class="table__table__cell-thumbnail">'+ TableCellFactory.getAssetsImgThumb(value_obj.assets_file_id) +'</div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove file</a></div>';
        } else if(value_obj.file_id) {
            html += '<div class="table__table__cell-add-image-controls" style="display:none"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add file</a></div><div class="table__table__cell-remove-image-controls"><div class="table__table__cell-thumbnail">'+ TableCellFactory.getFileImgThumb(value_obj.file_id) +'</div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove file</a></div>';
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

        // current selected assets file
        var img_tag = cell_ref.find('img');

        var assets_file_id = img_tag.data('assets_file_id');
        var ee_file_id = img_tag.data('file_id');

        var add_image_button = cell_ref.find('.table__table__cell__add-image-button');
        add_image_button.attr('tabindex', tabindex);

        var remove_image_button = cell_ref.find('.table__table__cell__remove-image-button');
        remove_image_button.attr('tabindex', tabindex);

        if(assets_file_id) {
            hidden_input.val( JSON.stringify( {assets_file_id: assets_file_id} ));
        } else if(ee_file_id) {
            hidden_input.val( JSON.stringify( {file_id: ee_file_id} ));
        } else {
            hidden_input.val('');
        }
    }

};