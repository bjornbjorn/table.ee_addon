<script type="text/javascript">

    /**
     * Only create the factory once
     */
    if(!TableCellFactory) {

<?php
foreach($factories as $factory) {
    echo $factory;
}
?>

        var TableCellFactory = {

            /**
             * Create content for a cell
             *
             * @param cell_type: String, ie. text
             * @param field_id database id of the field
             * @param row_num the row number
             * @param col_num the column number
             * @param value_obj object with values for the cell type
             */
            getNewCellContent: function(cell_type, field_id, row_num, col_num, value_obj) {
                return window['factory_'+cell_type+'_cell'].makeCell(field_id, row_num, col_num, value_obj);
            },

            /**
             * Get an Assets thumbnail img tag
             *
             * @param file_id
             * @returns {string}
             */
            getAssetsImgThumb: function(file_id) {
                var thumb_url = Assets.siteUrl + '?ACT=' + Assets.actions.view_thumbnail+'&file_id='+file_id+'&size=100x100&hash='+Math.random();
                return '<img data-assets_file_id="'+file_id+'" src="'+thumb_url+'"/>';
            }
        };

    }

    $(document).ready(
        function(e) { var table__table__<?php echo $field_id?> = new Table(<?php echo $field_id?>, TableCellFactory);}
    );
</script>