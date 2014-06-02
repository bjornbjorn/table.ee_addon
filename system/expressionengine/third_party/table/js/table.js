    var Table;


    /**
     * smart resize function
     *
     */
    (function($,sr){

        // debouncing function from John Hann
        // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        var debounce = function (func, threshold, execAsap) {
            var timeout;

            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap)
                        func.apply(obj, args);
                    timeout = null;
                }

                if (timeout)
                    clearTimeout(timeout);
                else if (execAsap)
                    func.apply(obj, args);

                timeout = setTimeout(delayed, threshold || 100);
            };
        };
        // smartresize
        jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    })(jQuery,'smartresize');



    (function($){

        console.log("Creating Table");

        Table = function(field_id) {

            var obj = $(this);
            var current_table = $('#table__table__'+field_id);

            /**
             * Find the closest number in an array to the number provided
             *
             * @param num number to find closest to
             * @param arr array of numbers
             * @return object with "position" (array index) and "closest" (number) (ie. position: 1, closest: 100)
             */
            obj.closest = function(num, arr) {
                var closest = null;
                var counter = -1;

                $.each(arr, function() {
                    if (closest === null || Math.abs(this - num) < Math.abs(closest - num)) {
                        closest = this;
                        counter++;
                    }
                });

                return {position: counter, closest: closest};
            };


            obj.updateFieldContainerWidth = function() {
                $('.table__table__container').width(
                    $('#publish').width() - 36
                );
            };


            /**
             * Add a row reoder "flip" to the table + delete icon
             * @param row
             */
            obj.addRowActions = function(row_num) {
                current_table.append('<div class="drag-row icon-reorder" style="top:'+((row_num-1) * cell_height)+'px" data-row="'+row_num+'"></div>');
                current_table.append('<div class="table__table__delete-row icon-remove-circle" style="top: '+((row_num*cell_height)-(cell_height/2)-5)+'px" data-row="'+row_num+'"></div>');
            };

            /**
             * Add a column reoder "flip" to the table
             * @param col_num
             */
            obj.addColActions = function(col_num) {
                current_table.append('<div class="drag-col icon-reorder" style="left:'+((col_num*cell_width)-19)+'px" data-col="'+col_num+'"></div>');
                current_table.append('<div class="table__table__delete-col icon-remove-circle" style="left: ' + (((col_num*cell_width) - (cell_width/2) - 8 )  +'px" data-col="'+col_num+'"></div>'));
            };


            /**
             * Add 'transitions' class to elements that should have it after init
             */
            obj.addTransitionsClass = function() {
                $('#table__table__'+field_id+' .table__cell').addClass('transitions');
            };

            /**
             * Get the current suggested table height (w/o header)
             */
            obj.getTableHeight = function() {
                return num_rows * cell_height;
            };

            obj.getTableWidth = function() {
                return num_cols * cell_width;
            };




            /**
             * Update the cell content data for a Title/Image cell
             *
             * @param row
             * @param col
             */
            obj.updateTitleImageCellData = function(row, col, cell_data_name, cell_ref) {

                if(cell_data_name === undefined) {
                    cell_data_name = 'table_cell_'+field_id+'['+row+']['+col+']';
                }
                if(typeof cell_ref == "undefined") {
                    cell_ref = $('#table__table__'+field_id+' .table__cell[data-row="'+row+'"][data-col="'+col+'"]');
                }

                var hidden_input = cell_ref.find('input[type=hidden]');
                hidden_input.attr('name', cell_data_name);

                // update the value of the hidden with the current values of the content
                var assets_file_id = cell_ref.find('img').data('assets_file_id');
                var title_text = cell_ref.find('input[type=text]').val();

                hidden_input.val( JSON.stringify( {assets_file_id: assets_file_id, title_text: title_text} ));

            };

            /**
             * Update all table cells w/correct tabindex etc. - this is needed after
             * dragging around rows/cols and adding/removing rows/cols
             */
            obj.updateTableCells = function() {

                /**
                 * Update table cell tabs indexes
                 */
                var tabindex = 0;
                for(var row=1; row < (num_rows+1); row++) {
                    for(var col=1; col < (num_cols+1); col++) {
                        tabindex++;
                        var current_cell = $('#table__table__'+field_id+' .table__cell[data-row="'+row+'"][data-col="'+col+'"]');
                        var rowtype = current_cell.data('row-type');
                        var cell_data_name = 'table_cell_'+field_id+'['+row+']['+col+']['+rowtype+']';
                        var cell_inited = current_cell.data('inited') !== 0;

                        switch(rowtype) {
                            case 'text':

                                if(!cell_inited) {

                                    var text_value = current_cell.data('init-cell-value');

                                    var cell_content = $.getNewTextCellContent(field_id, row, col, text_value);
                                    current_cell.attr('inited', 1);
                                    current_cell.data('inited', 1);
                                    current_cell.html(cell_content);
                                }

                                var current_cell_first_child =  current_cell.children().first();
                                current_cell_first_child.attr('tabindex', tabindex);
                                current_cell_first_child.attr('name', cell_data_name);
                                break;

                            case 'title_image':

                                if(!cell_inited) {

                                    var init_cell_value = current_cell.data('init-cell-value');

                                    var title_image_cell_content = $.getNewTitleImageCellContent(field_id, row, col, init_cell_value.assets_file_id, init_cell_value.title_text);
                                    current_cell.attr('inited', 1);
                                    current_cell.data('inited', 1);
                                    current_cell.html(title_image_cell_content);
                                }

                                obj.updateTitleImageCellData(row, col, cell_data_name, current_cell);
                                break;
                        }


                    }
                }
            };

            /**
             * Get the table
             *
             * @returns {*|jQuery|HTMLElement}
             */
            obj.getTable = function() {
                return $('#table__table__'+field_id);
            };

            obj.getTableLeftBar = function() {
                return $('#table__table__'+field_id+' .table__table__left__bar');
            };

            /**
             * Get all table cells
             *
             * @returns {*|jQuery|HTMLElement}
             */
            obj.getTableCells = function() {
                return $('#table__table__'+field_id+' .table__cell');
            };

            /**
             * Get column by column number
             *
             * @param col_num
             */
            obj.getTableCol = function(col_num) {
                return $('#table__table__'+field_id+' .table__cell[data-col='+col_num+']');
            };

            /**
             * Get row by row number
             *
             * @param row_num
             */
            obj.getTableRow = function(row_num) {
                return $('#table__table__'+field_id+' .table__cell[data-row="'+(row_num)+'"]');
            };

            /**
             * Get a specific row dragger by row number, or all row draggers if row_num not specified
             *
             * @param row_num (can be empty)
             */
            obj.getTableRowDragger = function(row_num) {
                if(row_num !== undefined) {
                    return $('#table__table__'+field_id+' .drag-row[data-row="'+row_num+'"]');
                } else {
                    return $('#table__table__'+field_id+' .drag-row');
                }
            };

            /**
             * Get col dragger by column number, or all column draggers if col_num not specified
             *
             * @param col_num (can be empty)
             */
            obj.getTableColDragger = function(col_num) {
                if(col_num !== undefined) {
                    return $('#table__table__'+field_id+' .drag-col[data-col="'+col_num+'"]');
                } else {
                    return $('#table__table__'+field_id+' .drag-col');
                }
            };


            /**
             * Get row delete link by row number, or all if row number not defined
             *
             * @param row_num
             * @returns {*|jQuery|HTMLElement}
             */
            obj.getTableRowDeleteLink = function(row_num) {
                if(row_num !== undefined) {
                    return $('#table__table__'+field_id+' .table__table__delete-row[data-row="'+row_num+'"]');
                } else {
                    return $('#table__table__'+field_id+' .table__table__delete-row');
                }
            };

            /**
             * Get col delete link by col number, or all if col number not defined
             *
             * @param col_num
             * @returns {*|jQuery|HTMLElement}
             */
            obj.getTableColDeleteLink = function(col_num) {
                if(col_num !== undefined) {
                    return $('#table__table__'+field_id+' .table__table__delete-col[data-col="'+col_num+'"]');
                } else {
                    return $('#table__table__'+field_id+' .table__table__delete-col');
                }
            };


            /**
             * Will update a table row and its action icons to the correct postions
             * @param row_num the row number
             * @param move_index change the row number of this row (ie. -1 will move the row one up)
             */
            obj.updateTableRow = function(row_num, move_index) {

                var new_row_num = row_num;
                var current_row = obj.getTableRow(row_num);
                var current_drag_row = obj.getTableRowDragger(row_num);
                var current_row_delete_link = obj.getTableRowDeleteLink(row_num);

                if(move_index !== undefined) {
                    new_row_num = row_num + move_index;
                    current_row.data('row', new_row_num);
                    current_row.attr('data-row', new_row_num);
                    current_drag_row.data('row', new_row_num);
                    current_drag_row.attr('data-row', new_row_num);
                    current_row_delete_link.data('row', new_row_num);
                    current_row_delete_link.attr('data-row', new_row_num);
                }

                var row_position = row_positions[new_row_num-1];
                current_drag_row.css('top', row_position + 'px' );
                current_row.css('top', row_position + 'px' );

                current_row_delete_link.css('top', (row_position + (cell_height/2)-5) + 'px');
            };


            /**
             * Will update a table column and its action icons to the correct positions
             *
             * @param col_num the column number
             * @param move_index change the col number of this column (ie. -1 will move the col to the left)
             */
            obj.updateTableCol = function(col_num, move_index) {

                var new_col_num = col_num;
                var current_col = obj.getTableCol(col_num);
                var current_drag_col = obj.getTableColDragger(col_num);
                var current_col_delete_link = obj.getTableColDeleteLink(col_num);

                if(move_index !== undefined) {
                    new_col_num = col_num + move_index;
                    current_col.data('col', new_col_num);
                    current_col.attr('data-col', new_col_num);
                    current_drag_col.data('col', new_col_num);
                    current_drag_col.attr('data-col', new_col_num);
                    current_col_delete_link.data('col', new_col_num);
                    current_col_delete_link.attr('data-col', new_col_num);
                }

                var col_position = col_positions[new_col_num-1];
                current_col.css('left', col_position + 'px');
                current_drag_col.css('left', (col_position - 19) + 'px');
                current_col_delete_link.css('left', col_position + ((cell_width/2)-8) +'px');

            };


            /**
             * Update row positions array
             */
            obj.updateRowPositionsCache = function() {
                row_positions = [];
                for(var i=0; i < num_rows; i++) {
                    var row_position = i*cell_height;
                    row_positions.push( row_position );
                }
            };


            /**
             *  Update col position array
             */
            obj.updateColPositionCache = function() {
                col_positions = [];
                for(var i=0; i < num_cols; i++) {
                    var col_position = i*cell_width;
                    col_positions.push( col_position );
                }
            };


            /**
             * Add a standard Text row to the table
             */
            obj.addNewTableRow = function(row_type) {

                if(row_type === undefined) {
                    row_type = 'text';
                }

                current_table.css('height', obj.getTableHeight() + cell_height);
                var new_row_num = num_rows+1;
                var new_row_position = (num_rows*cell_height);

                obj.addRowActions(new_row_num);

                /**
                 * If we are adding the first row, and we don't have any cols yet, add a single col
                 */
                if(num_cols === 0) {
                    num_cols = 1;
                    obj.addColActions(1);
                    col_positions = [0];
                }

                for(var i=0; i < num_cols; i++ ) {
                    var new_col_num = i+1;
                    var cell_content = '';
                    switch(row_type) {
                        case 'title_image':
                            cell_content = $.getNewTitleImageCellContent(new_row_num, new_col_num);
                            break;
                        case 'text':
                            cell_content = $.getNewTextCellContent(new_row_num, new_col_num);
                            break;
                    }

                    current_table.append(
                        '<div style="top:'+new_row_position+'px; left:'+(i*cell_width)+'px" class="table__cell transitions" data-row-type="'+row_type+'" data-row="'+new_row_num+'" data-col="'+new_col_num+'">'+cell_content+'</div>'
                    );
                }

                row_positions.push(new_row_position);
                num_rows++;

                obj.getTableLeftBar().css('height', (obj.getTableHeight() + 20) + 'px' );

                obj.updateTableCells();
            };


            var cell_width = 200;
            var cell_height = 150;
            var num_cols = current_table.data('init-num-cols');
            var num_rows = current_table.data('init-num-rows');
            var row_positions = [0];
            var col_positions = [];

            var dragging = false;       // is currently dragging? true/false
            var drag_row = false;       // row number being dragged
            var drag_col = false;       // col number being dragged
            var last_drag_x = false;    // last X position used for row when dragging
            var last_drag_y = false;    // last Y position used for col when dragging

            /**
             * Initiate the table. Will move cells around to their correct
             * initial positions.
             *
             */
            current_table.height(obj.getTableHeight());
            if(num_cols > 0) {
                current_table.width(obj.getTableWidth());
            }

            var x = 0;
            var y = 0;

            if(num_rows > 0) {
                obj.addRowActions(1); // add for 1st
            }

            obj.getTableCells().each(function(e) {
                if(x >= num_cols) {
                    x = 0;
                    y++;

                    obj.addRowActions(y+1);

                    row_positions.push(y*cell_height);
                }
                $(this).css('left', x*cell_width);
                $(this).css('top', y*cell_height);

                if(y === 0) {
                    col_positions.push(x*cell_width);            // as long as we are on first row, store col positions
                    obj.addColActions(x+1);
                }

                x++;
            });

            obj.getTableLeftBar().css('height', ((num_rows*cell_height) + 20) + 'px' );

            obj.updateTableCells();


            // add transitions class after we have positioned them
            setTimeout(obj.addTransitionsClass, 500);


            /**
             * Global click handler
             */
          /*  $(document).on('click', function(e) {
        */
                /**
                 * If the add row dropdown is displaying hide it
                 */
          /*      if($('.table__table__add-row-dropdown').is(':visible')) {
                    $('.table__table__add-row-dropdown').hide();
                }
            });

        */

            /**
             * Add row button click handler
             */
            $('.table__table__add-row[data-field_id='+field_id+']').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();

                var dropdown = $('.table__table__add-row-dropdown[data-field_id='+field_id+']');

                if(dropdown.is(':visible')) {
                    dropdown.hide();
                } else {
                    dropdown.show();
                }
            });


            $('.table__table__add-row-dropdown[data-field_id='+field_id+'] .table__table__add-text-row').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $('.table__table__add-row-dropdown[data-field_id='+field_id+']').hide();

                obj.addNewTableRow();
            });

            $('.table__table__add-row-dropdown[data-field_id='+field_id+'] .table__table__add-title-image-row').on('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                $('.table__table__add-row-dropdown[data-field_id='+field_id+']').hide();

                obj.addNewTableRow('title_image');
            });

            $(document).on('click', '.table__table__cell__add-image-button[data-field_id='+field_id+']', function(e) {
                e.preventDefault();

                var add_image_controls_div = $(this).parent();
                var thumb_image_div = add_image_controls_div.parent().find('.table__table__cell-thumbnail');
                var remove_image_controls_div = add_image_controls_div.parent().find('.table__table__cell-remove-image-controls');
                var assets_sheet = new Assets.Sheet({

                    // optional settings (these are the default values):
                    multiSelect: false,
                    filedirs:    'all', // or array of filedir IDs
                    kinds:       ['image'], // or array of file kinds ("image", "flash", etc)

                    // onSelect callback (required):
                    onSelect:    function(files) {

                        if(files.length > 0) {
                            add_image_controls_div.hide();
                            var file_id = files[0].id;
                            var img_tag = $.getAssetsImgThumb(file_id);
                            thumb_image_div.html(img_tag);
                            remove_image_controls_div.fadeIn();
                        }
                    }
                });

                assets_sheet.show();
            });


            $(document).on('click', '.table__table__cell__remove-image-button[data-field_id='+field_id+']', function(e) {
                e.preventDefault();
                var remove_image_controls_div = $(this).parent();
                var add_image_controls_div = remove_image_controls_div.parent().find('.table__table__cell-add-image-controls');
                var thumb_image_div = remove_image_controls_div.find('.table__table__cell-thumbnail');
                thumb_image_div.html('');
                remove_image_controls_div.hide();
                add_image_controls_div.fadeIn();

            });


            /**
             * Add col button click handler
             */
            $('.table__table__add-col[data-field_id='+field_id+']').on('click', function(e) {
                e.preventDefault();

                if(num_rows === 0) {
                    alert("Add a row first");
                    return;
                }

                $('#table__table__'+field_id+' .table__table__add-row-dropdown[data-field_id='+field_id+']').hide();    // just in case it is showing

                current_table.css('width', obj.getTableWidth() + cell_width);
                var new_col_num = num_cols+1;
                var new_col_position = (num_cols*cell_width);

                obj.addColActions(new_col_num);
                for(var i=0; i < num_rows; i++) {
                    var new_row_num = i+1;

                    // find the row type based on the first column
                    var row_type = $('#table__table__'+field_id+' .table__cell[data-row="'+new_row_num+'"][data-col=1]').data('row-type');
                    var cell_content = '';
                    switch(row_type) {
                        case 'title_image':
                            cell_content = $.getNewTitleImageCellContent(field_id, new_row_num, new_col_num);
                            break;
                        case 'text':
                            cell_content = $.getNewTextCellContent(field_id, new_row_num, new_col_num);
                            break;
                    }
                    current_table.append(
                        '<div style="top:'+(i*cell_height)+'px; left:'+new_col_position+'px" class="table__cell transitions" data-row-type="'+row_type+'" data-row="'+new_row_num+'" data-col="'+new_col_num+'">'+cell_content+'</div>'
                    );
                }

                col_positions.push(new_col_position);
                num_cols++;

                obj.updateTableCells();
            });


            /**
             * Delete row button click handler
             */
            $(document).on('click','#table__table__'+field_id+' .table__table__delete-row', function(e) {
                var row = $(this).data('row');
                var the_table_row = obj.getTableRow(row);
                var the_table_row_dragger = obj.getTableRowDragger(row);
                var the_table_row_delete_link = obj.getTableRowDeleteLink(row);

                the_table_row.addClass('table__cell-pending-delete');
                if(confirm('Sure you want to delete the row?')) {

                    // remove the row + elements
                    the_table_row.remove();
                    the_table_row_dragger.remove();
                    the_table_row_delete_link.remove();

                    num_rows--;
                    current_table.css('height', cell_height*num_rows);
                    obj.updateRowPositionsCache();

                    // move all rows below the deleted row one up
                    for(var i=row; i <= num_rows; i++) {
                        obj.updateTableRow(i+1, -1);
                    }

                    obj.getTableLeftBar().css('height', (obj.getTableHeight() + 20) + 'px' );

                    obj.updateTableCells();

                } else {
                    the_table_row.removeClass('table__cell-pending-delete');
                }
            });


            $(document).on('click', '#table__table__'+field_id+' .table__table__delete-col', function(e) {

                var col = $(this).data('col');
                var the_table_col = obj.getTableCol(col);
                var the_table_col_dragger = obj.getTableColDragger(col);
                var the_table_col_delete_link = obj.getTableColDeleteLink(col);

                the_table_col.addClass('table__cell-pending-delete');
                if(confirm('Sure you want to delete the column?')) {

                    the_table_col.remove();
                    the_table_col_dragger.remove();
                    the_table_col_delete_link.remove();

                    num_cols --;
                    current_table.css('width', cell_width*num_cols);
                    obj.updateColPositionCache();

                    for(var i=col; i <= num_cols; i++) {
                        obj.updateTableCol(i+1, -1);
                    }

                } else {
                    the_table_col.removeClass('table__cell-pending-delete');
                }
            });


            /**
             * drag-row mouse handler
             */
            $(document).on('mousedown', '#table__table__'+field_id+' .drag-row', function(e) {
                e.preventDefault();
                e.stopPropagation();

                $(this).addClass('active__dragging__link');
                var row = $(this).data('row');
                var drag_element = obj.getTableRow(row);
                drag_element.removeClass('transitions').addClass('table__dragging__element');

                obj.getTableRowDeleteLink().fadeOut();

                $('#table__table__'+field_id+' .drag-row').not('.active__dragging__link').fadeOut(400, function(e) {
                    if(!dragging) {
                        $(this).show(); // if dragging completed before the fadeout completes then we need to show() it again here since the .show() in the mouseup event won't do its job as it is called before fadeOut() completes.
                    }
                });

                dragging = true;
                drag_row = row;
                drag_col = false;
                return false;
            });


            /**
             * drag-col mouse handler
             */
            $(document).on('mousedown', '#table__table__'+field_id+' .drag-col', function(e) {
                e.preventDefault();
                e.stopPropagation();

                $(this).addClass('active__dragging__link');
                obj.getTableColDeleteLink().fadeOut();

                var col = $(this).data('col');


                obj.getTableCol(col).removeClass('transitions').addClass('table__dragging__element');

                $('#table__table__'+field_id+' .drag-col').not('.active__dragging__link').fadeOut(400, function(e) {
                    if(!dragging) {
                        $(this).show(); // if dragging completed before the fadeout completes then we need to show() it again here since the .show() in the mouseup event won't do its job as it is called before fadeOut() completes.
                    }
                });

                dragging = true;
                drag_col = col;
                drag_row = false;

                return false;
            });

            $(document).on('mousemove', function(e) {
                e.preventDefault();

                if(dragging) {

                    if(drag_row) {
                        last_drag_y = e.pageY - current_table.offset().top;

                        var drag_link = $('.drag-row.active__dragging__link');

                        /**
                         * Move the row being dragged
                         */
                        drag_link.css('top', last_drag_y+'px');
                        drag_link.css('left', '-20px');
                        drag_link.css('position', 'absolute');

                        $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                            $(this).css('top', last_drag_y + 'px');
                        });

                        var closest_row = obj.closest(last_drag_y, row_positions);
                        var new_row_index = closest_row.position+1;

                        /**
                         * We are moving down, so move the one beneath up
                         */
                        if((closest_row.position+1) > drag_row) {

                            var should_move_row = closest_row.position+1;
                            var should_move_row_to_y = closest_row.closest - cell_height;

                            obj.getTableRow(should_move_row).each(function(e) {
                                $(this).css('top', (should_move_row_to_y) + 'px');
                                $(this).attr('data-row', should_move_row-1);
                                $(this).data('row', should_move_row-1);
                            });

                            /**
                             * Update row information for the row we are currently dragging
                             */
                            $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                                $(this).attr('data-row', new_row_index+1);
                                $(this).data('row', new_row_index+1);
                            });

                            drag_row = new_row_index+1;


                        } else if((closest_row.position+1) < drag_row) {

                            var should_move_row_down = closest_row.position+1;
                            var should_move_row_down_to_y = should_move_row_down*cell_height;

                            obj.getTableRow(should_move_row_down).each(function(e) {
                                $(this).css('top', (should_move_row_down_to_y) + 'px');
                                $(this).attr('data-row', should_move_row_down+1);
                                $(this).data('row', should_move_row_down+1);
                            });

                            /**
                             * Update row information for the row being dragged
                             */

                            $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                                $(this).attr('data-row', new_row_index);
                                $(this).data('row', new_row_index);
                            });

                            drag_row = new_row_index;
                        }

                    } else if(drag_col) {

                        last_drag_x = e.pageX - current_table.offset().left - cell_width;

                        var drag_col_link = $('.drag-col.active__dragging__link');

                        /**
                         * Move the row being dragged
                         */
                        drag_col_link.css('top', '-20px');
                        drag_col_link.css('left', (last_drag_x+cell_width-19)+'px');
                        drag_col_link.css('position', 'absolute');

                        /**
                         * Move the column being dragged
                         */
                        $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                            $(this).css('left', last_drag_x + 'px');
                        });

                        var closest_col = obj.closest(last_drag_x, col_positions);
                        var new_col_index = closest_col.position+1;

                        if(new_col_index > drag_col) {

                            var should_move_over_col_to_x = (closest_col.position-1) * cell_width;

                            /**
                             * Move the col we are over left
                             */
                            obj.getTableCol(new_col_index).each(function(e) {
                                $(this).css('left', (should_move_over_col_to_x) + 'px');
                                $(this).attr('data-col', new_col_index-1);
                                $(this).data('col', new_col_index-1);
                            });

                            $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                                $(this).attr('data-col', new_col_index);
                                $(this).data('col', new_col_index);
                            });

                            drag_col = new_col_index;


                        } else if(new_col_index < drag_col) {

                            var should_move_over_col_right_to =  (closest_col.position+1) * cell_width;

                            /**
                             * Move the col we are over right
                             */
                            obj.getTableCol(new_col_index).each(function(e) {
                                $(this).css('left', (should_move_over_col_right_to) + 'px');
                                $(this).attr('data-col', new_col_index+1);
                                $(this).data('col', new_col_index+1);
                            });

                            $('#table__table__'+field_id+' .table__dragging__element').each(function(e) {
                                $(this).attr('data-col', new_col_index);
                                $(this).data('col', new_col_index);
                            });

                            drag_col = new_col_index;

                        }
                    }
                }

                return false;
            });

            $(document).on('mouseup', function(e) {
                e.preventDefault();
                dragging = false;

                $('.active__dragging__link').removeClass('active__dragging__link');

                if(drag_row) {  // we were dragging a row, so find the closest spot for it

                    obj.getTableRowDeleteLink().fadeIn();

                    var closest_row = obj.closest(last_drag_y, row_positions);
                    var row_y = closest_row.closest;
                    $('.table__dragging__element').css('top', row_y+'px');

                    /**
                     * Go through all drag rows and position them correctly + set data-row based on position in HTML
                     */
                    var row_counter = 1;
                    obj.getTableRowDragger().each(function(e) {
                        $(this).css('top', ((row_counter-1) * cell_height) + 'px' );
                        $(this).attr('data-row', row_counter);
                        $(this).data('row', row_counter);
                        row_counter++;

                        $(this).show();
                    });


                } else if(drag_col) {

                    obj.getTableColDeleteLink().fadeIn();

                    var closest_col = obj.closest(last_drag_x, col_positions);
                    var row_x = closest_col.closest;
                    $('.table__dragging__element').css('left', row_x+'px');

                    var col_counter = 1;
                    obj.getTableColDragger().each(function(e) {
                        $(this).css('left', ((col_counter * cell_width)-19) + 'px' );
                        $(this).attr('data-col', col_counter);
                        $(this).data('col', col_counter);
                        col_counter++;

                        $(this).show();
                    });

                }

                obj.getTableCells().removeClass('table__dragging__element').addClass('transitions');

                obj.updateTableCells();

                drag_row = false;
                drag_col = false;

                return false;
            });


            obj.updateFieldContainerWidth();
            $(window).smartresize(obj.updateFieldContainerWidth);

        };

    })(jQuery);