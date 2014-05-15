$(document).ready(function(e) {

    /**
     * Find the closest number in an array to the number provided
     *
     * @param num number to find closest to
     * @param arr array of numbers
     * @return object with "position" (array index) and "closest" (number) (ie. position: 1, closest: 100)
     */
    $.closest = function(num, arr) {
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

    /**
     * Add a row reoder "flip" to the table + delete icon
     * @param row
     */
    $.addRowActions = function(row_num) {
        $('.table__table').append('<div class="drag-row icon-reorder" style="top:'+((row_num-1) * cell_height)+'px" data-row="'+row_num+'"></div>');
        $('.table__table').append('<div class="table__table__delete-row icon-remove-circle" style="top: '+((row_num*cell_height)-(cell_height/2)-5)+'px" data-row="'+row_num+'"></div>');
    };

    /**
     * Add a column reoder "flip" to the table
     * @param col_num
     */
    $.addColActions = function(col_num) {
        $('.table__table').append('<div class="drag-col icon-reorder" style="left:'+((col_num*cell_width)-19)+'px" data-col="'+col_num+'"></div>');
        $('.table__table').append('<div class="table__table__delete-col icon-remove-circle" style="left: ' + (((col_num*cell_width) - (cell_width/2) - 8 )  +'px" data-col="'+col_num+'"></div>'));
    };


    /**
     * Add 'transitions' class to elements that should have it after init
     */
    $.addTransitionsClass = function() {
        $('.table__table .table__cell').addClass('transitions');
    };

    /**
     * Get the current suggested table height (w/o header)
     */
    $.getTableHeight = function() {
        return num_rows * cell_height;
    };

    /**
     * Update all table cells w/correct tabindex etc. - this is needed after
     * dragging around rows/cols and adding/removing rows/cols
     */
    $.updateTableCells = function() {

        var field_id = $.getTable().data('field_id');

        /**
         * Update table cell tabs indexes
         */
        var tabindex = 0;
        for(var row=1; row < (num_rows+1); row++) {
            for(var col=1; col < (num_cols+1); col++) {
                tabindex++;
                var current_cell_first_child =  $('.table__table .table__cell[data-row="'+row+'"][data-col="'+col+'"] :first-child');

                // set tabindex
                current_cell_first_child.attr('tabindex', tabindex);
                current_cell_first_child.attr('name', 'table_cell_'+field_id+'['+row+']['+col+']');
            }
        }
    };

    /**
     * Get the table
     *
     * @returns {*|jQuery|HTMLElement}
     */
    $.getTable = function() {
        return $('.table__table');
    };

    $.getTableLeftBar = function() {
        return $('.table__table__left__bar');
    };

    /**
     * Get all table cells
     *
     * @returns {*|jQuery|HTMLElement}
     */
    $.getTableCells = function() {
       return $('.table__table .table__cell');
    };

    /**
     * Get column by column number
     *
     * @param col_num
     */
    $.getTableCol = function(col_num) {
        return $('.table__table .table__cell[data-col='+col_num+']');
    };

    /**
     * Get row by row number
     *
     * @param row_num
     */
    $.getTableRow = function(row_num) {
       return $('.table__table .table__cell[data-row="'+(row_num)+'"]');
    };

    /**
     * Get a specific row dragger by row number, or all row draggers if row_num not specified
     *
     * @param row_num (can be empty)
     */
    $.getTableRowDragger = function(row_num) {
        if(row_num !== undefined) {
            return $('.drag-row[data-row="'+row_num+'"]');
        } else {
            return $('.drag-row');
        }
    };

    /**
     * Get col dragger by column number, or all column draggers if col_num not specified
     *
     * @param col_num (can be empty)
     */
    $.getTableColDragger = function(col_num) {
        if(col_num !== undefined) {
            return $('.drag-col[data-col="'+col_num+'"]');
        } else {
            return $('.drag-col');
        }
    };


    /**
     * Get row delete link by row number, or all if row number not defined
     *
     * @param row_num
     * @returns {*|jQuery|HTMLElement}
     */
    $.getTableRowDeleteLink = function(row_num) {
        if(row_num !== undefined) {
            return $('.table__table__delete-row[data-row="'+row_num+'"]');
        } else {
            return $('.table__table__delete-row');
        }
    };

    /**
     * Get col delete link by col number, or all if col number not defined
     *
     * @param col_num
     * @returns {*|jQuery|HTMLElement}
     */
    $.getTableColDeleteLink = function(col_num) {
        if(col_num !== undefined) {
            return $('.table__table__delete-col[data-col="'+col_num+'"]');
        } else {
            return $('.table__table__delete-col');
        }
    };


    /**
     * Will update a table row and its action icons to the correct postions
     * @param row_num the row number
     * @param move_index change the row number of this row (ie. -1 will move the row one up)
     */
    $.updateTableRow = function(row_num, move_index) {

        var new_row_num = row_num;
        var current_row = $.getTableRow(row_num);
        var current_drag_row = $.getTableRowDragger(row_num);
        var current_row_delete_link = $.getTableRowDeleteLink(row_num);

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
    $.updateTableCol = function(col_num, move_index) {

        var new_col_num = col_num;
        var current_col = $.getTableCol(col_num);
        var current_drag_col = $.getTableColDragger(col_num);
        var current_col_delete_link = $.getTableColDeleteLink(col_num);

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
    $.updateRowPositionsCache = function() {
        row_positions = [];
        for(var i=0; i < num_rows; i++) {
            var row_position = i*cell_height;
            row_positions.push( row_position );
        }
    };


    /**
     *  Update col position array
     */
    $.updateColPositionCache = function() {
        col_positions = [];
        for(var i=0; i < num_cols; i++) {
            var col_position = i*cell_width;
            col_positions.push( col_position );
        }
    };


    var the_table = $.getTable();

    var cell_width = 200;
    var cell_height = 100;
    var num_cols = the_table.data('init-num-cols');
    var num_rows = the_table.data('init-num-rows');
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
    the_table.height($.getTableHeight());

    var x = 0;
    var y = 0;

    $.addRowActions(1); // add for 1st

    $.getTableCells().each(function(e) {
        if(x >= num_cols) {
            x = 0;
            y++;

            $.addRowActions(y+1);

            row_positions.push(y*cell_height);
        }
        $(this).css('left', x*cell_width);
        $(this).css('top', y*cell_height);

        if(y === 0) {
            col_positions.push(x*cell_width);            // as long as we are on first row, store col positions
            $.addColActions(x+1);
        }

        x++;
    });

    $.getTableLeftBar().css('height', ((num_rows*cell_height) + 20) + 'px' );



    // add transitions class after we have positioned them
    setTimeout($.addTransitionsClass, 500);


    /**
     * Add row button click handler
     */
    $('.table__table__add-row').on('click', function(e) {
        e.preventDefault();

        var the_table = $.getTable();
        var field_id = the_table.data('field_id');

        the_table.css('height', $.getTableHeight() + cell_height);
        var new_row_num = num_rows+1;
        var new_row_position = (num_rows*cell_height);

        $.addRowActions(new_row_num);

        for(var i=0; i < num_cols; i++ ) {
            the_table.append(
                '<div style="top:'+new_row_position+'px; left:'+(i*cell_width)+'px" class="table__cell transitions" data-row="'+new_row_num+'" data-col="'+(i+1)+'"><textarea></textarea></div>'
            );
        }

        row_positions.push(new_row_position);
        num_rows++;

        $.getTableLeftBar().css('height', ($.getTableHeight() + 20) + 'px' );

        $.updateTableCells();
    });

    /**
     * Add col button click handler
     */
    $('.table__table__add-col').on('click', function(e) {
        e.preventDefault();

        var the_table = $.getTable();
        the_table.css('width', $('.table__table').width() + cell_width);
        var new_col_num = num_cols+1;
        var new_col_position = (num_cols*cell_width);

        $.addColActions(new_col_num);
        for(var i=0; i < num_rows; i++) {
            the_table.append(
                '<div style="top:'+(i*cell_height)+'px; left:'+new_col_position+'px" class="table__cell transitions" data-row="'+(i+1)+'" data-col="'+new_col_num+'"><textarea></textarea></div>'
            );
        }

        col_positions.push(new_col_position);
        num_cols++;

        $.updateTableCells();
    });


    /**
     * Delete row button click handler
     */
    $(document).on('click','.table__table__delete-row', function(e) {
        var row = $(this).data('row');
        var the_table_row = $.getTableRow(row);
        var the_table_row_dragger = $.getTableRowDragger(row);
        var the_table_row_delete_link = $.getTableRowDeleteLink(row);
        var the_table = $.getTable();

        the_table_row.addClass('table__cell-pending-delete');
        if(confirm('Sure you want to delete the row?')) {

            // remove the row + elements
            the_table_row.remove();
            the_table_row_dragger.remove();
            the_table_row_delete_link.remove();

            num_rows--;
            the_table.css('height', cell_height*num_rows);
            $.updateRowPositionsCache();

            // move all rows below the deleted row one up
            for(var i=row; i <= num_rows; i++) {
                $.updateTableRow(i+1, -1);
            }

            $.getTableLeftBar().css('height', ($.getTableHeight() + 20) + 'px' );

            $.updateTableCells();

        } else {
            the_table_row.removeClass('table__cell-pending-delete');
        }
    });


    $(document).on('click', '.table__table__delete-col', function(e) {

        var col = $(this).data('col');
        var the_table_col = $.getTableCol(col);
        var the_table_col_dragger = $.getTableColDragger(col);
        var the_table_col_delete_link = $.getTableColDeleteLink(col);

        the_table_col.addClass('table__cell-pending-delete');
        if(confirm('Sure you want to delete the column?')) {

            the_table_col.remove();
            the_table_col_dragger.remove();
            the_table_col_delete_link.remove();

            num_cols --;
            the_table.css('width', cell_width*num_cols);
            $.updateColPositionCache();

            for(var i=col; i <= num_cols; i++) {
                $.updateTableCol(i+1, -1);
            }

        } else {
            the_table_col.removeClass('table__cell-pending-delete');
        }
    });


    /**
     * drag-row mouse handler
     */
    $(document).on('mousedown', '.drag-row', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).addClass('active__dragging__link');
        var row = $(this).data('row');
        var drag_element = $.getTableRow(row);
        drag_element.removeClass('transitions').addClass('table__dragging__element');

        $.getTableRowDeleteLink().fadeOut();

        $('.drag-row').not('.active__dragging__link').fadeOut(400, function(e) {
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
    $(document).on('mousedown', '.drag-col', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).addClass('active__dragging__link');
        $.getTableColDeleteLink().fadeOut();

        var col = $(this).data('col');


        $.getTableCol(col).removeClass('transitions').addClass('table__dragging__element');

        $('.drag-col').not('.active__dragging__link').fadeOut(400, function(e) {
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

            var the_table = $.getTable();

            if(drag_row) {
                last_drag_y = e.pageY - the_table.offset().top;

                var drag_link = $('.drag-row.active__dragging__link');

                /**
                 * Move the row being dragged
                 */
                drag_link.css('top', last_drag_y+'px');
                drag_link.css('left', '-20px');
                drag_link.css('position', 'absolute');

                $('.table__dragging__element').each(function(e) {
                    $(this).css('top', last_drag_y + 'px');
                });

                var closest_row = $.closest(last_drag_y, row_positions);
                var new_row_index = closest_row.position+1;

                /**
                 * We are moving down, so move the one beneath up
                 */
                if((closest_row.position+1) > drag_row) {

                    var should_move_row = closest_row.position+1;
                    var should_move_row_to_y = closest_row.closest - cell_height;

                    $.getTableRow(should_move_row).each(function(e) {
                        $(this).css('top', (should_move_row_to_y) + 'px');
                        $(this).attr('data-row', should_move_row-1);
                        $(this).data('row', should_move_row-1);
                    });

                    /**
                     * Update row information for the row we are currently dragging
                     */
                     $('.table__dragging__element').each(function(e) {
                        $(this).attr('data-row', new_row_index+1);
                        $(this).data('row', new_row_index+1);
                    });

                    drag_row = new_row_index+1;


                } else if((closest_row.position+1) < drag_row) {

                    var should_move_row_down = closest_row.position+1;
                    var should_move_row_down_to_y = should_move_row_down*cell_height;

                    $.getTableRow(should_move_row_down).each(function(e) {
                        $(this).css('top', (should_move_row_down_to_y) + 'px');
                        $(this).attr('data-row', should_move_row_down+1);
                        $(this).data('row', should_move_row_down+1);
                    });

                    /**
                     * Update row information for the row being dragged
                     */

                    $('.table__dragging__element').each(function(e) {
                        $(this).attr('data-row', new_row_index);
                        $(this).data('row', new_row_index);
                    });

                    drag_row = new_row_index;
                }

            } else if(drag_col) {

                last_drag_x = e.pageX - the_table.offset().left - cell_width;

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
                $('.table__dragging__element').each(function(e) {
                    $(this).css('left', last_drag_x + 'px');
                });

                var closest_col = $.closest(last_drag_x, col_positions);
                var new_col_index = closest_col.position+1;

                if(new_col_index > drag_col) {

                    var should_move_over_col_to_x = (closest_col.position-1) * cell_width;

                    /**
                     * Move the col we are over left
                     */
                    $.getTableCol(new_col_index).each(function(e) {
                        $(this).css('left', (should_move_over_col_to_x) + 'px');
                        $(this).attr('data-col', new_col_index-1);
                        $(this).data('col', new_col_index-1);
                    });

                    $('.table__dragging__element').each(function(e) {
                        $(this).attr('data-col', new_col_index);
                        $(this).data('col', new_col_index);
                    });

                    drag_col = new_col_index;


                } else if(new_col_index < drag_col) {

                    var should_move_over_col_right_to =  (closest_col.position+1) * cell_width;

                    /**
                     * Move the col we are over right
                     */
                    $.getTableCol(new_col_index).each(function(e) {
                        $(this).css('left', (should_move_over_col_right_to) + 'px');
                        $(this).attr('data-col', new_col_index+1);
                        $(this).data('col', new_col_index+1);
                    });

                    $('.table__dragging__element').each(function(e) {
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

            $.getTableRowDeleteLink().fadeIn();

            var closest_row = $.closest(last_drag_y, row_positions);
            var row_y = closest_row.closest;
            $('.table__dragging__element').css('top', row_y+'px');

            /**
             * Go through all drag rows and position them correctly + set data-row based on position in HTML
             */
            var row_counter = 1;
            $.getTableRowDragger().each(function(e) {
                $(this).css('top', ((row_counter-1) * cell_height) + 'px' );
                $(this).attr('data-row', row_counter);
                $(this).data('row', row_counter);
                row_counter++;

                $(this).show();
            });


        } else if(drag_col) {

            $.getTableColDeleteLink().fadeIn();

            var closest_col = $.closest(last_drag_x, col_positions);
            var row_x = closest_col.closest;
            $('.table__dragging__element').css('left', row_x+'px');

            var col_counter = 1;
            $.getTableColDragger().each(function(e) {
                $(this).css('left', ((col_counter * cell_width)-19) + 'px' );
                $(this).attr('data-col', col_counter);
                $(this).data('col', col_counter);

                console.log("showing col " + col_counter);
                col_counter++;

                $(this).show();
            });

        }

        $.getTableCells().removeClass('table__dragging__element').addClass('transitions');

        $.updateTableCells();

        drag_row = false;
        drag_col = false;

        return false;
    });


});