<script type="text/javascript">

    $(document).ready(
        function(e) { var table__table__<?php echo $field_id?> = new Table(<?php echo $field_id?>);}
    );


    /**
     * Only define these functions once
     */
if(!jQuery.getNewTextCellContent) {

    /**
     * Get HTML for a text cell
     *
     * @param row_num
     * @param col_num
     * @returns {string}
     */
    jQuery.getNewTextCellContent = function(field_id, row_num, col_num, text_value) {

        if(text_value !== undefined) {
            return '<textarea>'+text_value+'</textarea>';
        }
        else {
            return '<textarea></textarea>';
        }
    };


    /**
     * Get HTML for a title image cell
     *
     * @param row_num
     * @param col_num
     * @returns {string}
     */
    jQuery.getNewTitleImageCellContent = function(field_id, row_num, col_num, assets_file_id, title_text) {

        var html = '<input type="hidden"><input type="text" value="'+(title_text !== undefined ? title_text : '')+'">';

        if(assets_file_id === undefined) {
            html += '<div class="table__table__cell-add-image-controls"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add image</a></div><div class="table__table__cell-remove-image-controls" style="display:none"><div class="table__table__cell-thumbnail"></div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove image</a></div>';
        } else {
            html += '<div class="table__table__cell-add-image-controls" style="display:none"><a href="#" class="table__table__cell__add-image-button" data-field_id="'+field_id+'">Add image</a></div><div class="table__table__cell-remove-image-controls"><div class="table__table__cell-thumbnail">'+ $.getAssetsImgThumb(assets_file_id) +'</div><a href="#" class="table__table__cell__remove-image-button" data-field_id="'+field_id+'">Remove image</a></div>';
        }

        return html;
    };

    /**
     * Get an Assets thumbnail URL
     *
     * @param file_id
     * @returns {string}
     */
    jQuery.getAssetsImgThumb = function(file_id) {
        var thumb_url = Assets.siteUrl + '?ACT=' + Assets.actions.view_thumbnail+'&file_id='+file_id+'&size=100x100&hash='+Math.random();
        return '<img data-assets_file_id="'+file_id+'" src="'+thumb_url+'"/>';
    };


}
</script>