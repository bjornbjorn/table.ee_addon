var factory_text_cell = {

    /**
     * Get HTML for a text cell
     *
     * @param row_num
     * @param col_num
     * @returns {string}
     */
    makeCell: function(field_id, row_num, col_num, value_obj) {

        if(value_obj !== undefined && value_obj.text !== undefined) {
            return '<textarea>'+value_obj.text+'</textarea>';
        }
        else {
            return '<textarea></textarea>';
        }
    }
};