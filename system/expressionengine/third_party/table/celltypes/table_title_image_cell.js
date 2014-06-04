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
    }

};