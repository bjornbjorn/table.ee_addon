<script type="text/javascript">

    /**
     * Only create the factory once
     */
    if(!TableCellFactory) {

        /**
         * Global click handler
         */
        $(document).on('click', function(e) {

            /**
             * If the add row dropdown is displaying hide it
             */
            if($('.table__table__add-row-dropdown').is(':visible')) {
                $('.table__table__add-row-dropdown').hide();
            }
        });

        var table_tab_index = 0;

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

            updateCellContent: function(cell_type, row_num, col_num, tabindex, element_name, cell_ref) {
                return window['factory_'+cell_type+'_cell'].updateCell(row_num, col_num, tabindex, element_name, cell_ref);
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
        function(e) {
            table_tab_index++;
            var table__table__<?php echo $field_id?> = new Table(<?php echo $field_id?>, table_tab_index, TableCellFactory, <?php echo $use_assets?'true':'false'?>);}
    );
</script>