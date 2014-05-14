$(document).ready(function(e) {

    var table_width = 600;
    var cell_width = 200;
    var cell_height = 100;
    var num_cols = 3;
    var num_rows = 3;
    var row_positions = [0];
    var col_positions = [];

    var dragging = false;       // is currently dragging? true/false
    var drag_row = false;       // row number being dragged
    var drag_col = false;       // col number being dragged
    var last_drag_x = false;    // last X position used for row when dragging
    var last_drag_y = false;    // last Y position used for col when dragging

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
     * Add a row reoder "flip" to the table
     * @param row
     */
    $.addRowDragger = function(row_num) {
        $('.table__table').append('<div class="drag-row icon-reorder" style="top:'+((row_num-1) * cell_height)+'px" data-row="'+row_num+'"></div>');
        $('.table__table').append('<div class="table__table__delete-row icon-remove-circle" style="top: '+((row_num*cell_height)-(cell_height/2)-5)+'px" data-row="'+row_num+'"></div>');
    };

    /**
     * Add a column reoder "flip" to the table
     * @param col_num
     */
    $.addColDragger = function(col_num) {
        $('.table__table').append('<div class="drag-col icon-reorder" style="left:'+((col_num*cell_width)-19)+'px" data-col="'+col_num+'"></div>');
    };


    /**
     * Add 'transitions' class to elements that should have it after init
     */
    $.addTransitionsClass = function() {
        $('.table__table .table__cell').addClass('transitions');
    };

    /**
     * Update all table cells w/correct tabindex etc. - this is needed after
     * dragging around rows/cols and adding/removing rows/cols
     */
    $.updateTableCells = function() {

        /**
         * Update table cell tabs indexes
         */
        var tabindex = 0;
        for(var row=1; row < (num_rows+1); row++) {
            for(var col=1; col < (num_cols+1); col++) {
                tabindex++;
                $('.table__table .table__cell[data-row="'+row+'"][data-col="'+col+'"] :first-child').attr('tabindex', tabindex);
            }
        }
    };

    /**
     * Update row positions array
     */
    $.updateRowPositionsCache = function() {
        row_positions = [];
        for(var i=0; i < num_rows; i++) {
            row_positions.push( i*cell_height );
        }
    };





    /**
     * Initiate the table. Will move cells around to their correct
     * initial positions.
     *
     */

    var x = 0;
    var y = 0;

    $.addRowDragger(1); // add for 1st

    $('.table__table .table__cell').each(function(e) {
        if(x >= num_cols) {
            x = 0;
            y++;

            $.addRowDragger(y+1);

            row_positions.push(y*cell_height);
        }
        $(this).css('left', x*cell_width);
        $(this).css('top', y*cell_height);

        if(y === 0) {
            col_positions.push(x*cell_width);            // as long as we are on first row, store col positions
            $.addColDragger(x+1);
        }

        x++;
    });


    // add transitions class after we have positioned them
    setTimeout($.addTransitionsClass, 500);


    /**
     * Add row button click handler
     */
    $('.table__table__add-row').on('click', function(e) {
        e.preventDefault();
        $('.table__table').css('height', $('.table__table').height() + cell_height);
        var new_row_num = num_rows+1;
        var new_row_position = (num_rows*cell_height);

        $.addRowDragger(new_row_num);

        for(var i=0; i < num_cols; i++ ) {
            $('.table__table').append(
                '<div style="top:'+new_row_position+'px; left:'+(i*cell_width)+'px" class="table__cell transitions" data-row="'+new_row_num+'" data-col="'+(i+1)+'"><textarea></textarea></div>'
            );
        }

        row_positions.push(new_row_position);
        num_rows++;

        $.updateTableCells();
    });

    /**
     * Add col button click handler
     */
    $('.table__table__add-col').on('click', function(e) {
        e.preventDefault();

        $('.table__table').css('width', $('.table__table').width() + cell_width);
        var new_col_num = num_cols+1;
        var new_col_position = (num_cols*cell_width);

        $.addColDragger(new_col_num);
        for(var i=0; i < num_rows; i++) {
            $('.table__table').append(
                '<div style="top:'+(i*cell_height)+'px; left:'+new_col_position+'px" class="table__cell transitions" data-row="'+(i+1)+'" data-col="'+new_col_num+'"><textarea></textarea></div>'
            );
        }

        col_positions.push(new_col_position);
        num_cols++;

        $.updateTableCells();
    });


    /**
     * Delete row
     */
    $(document).on('click','.table__table__delete-row', function(e) {
        var row = $(this).data('row');
        $('.table__table .table__cell[data-row="'+row+'"]').addClass('table__cell-pending-delete');
        if(confirm('Sure you want to delete the row?')) {
            $('.table__table .table__cell[data-row="'+row+'"]').remove();
            $('.drag-row[data-row="'+row+'"]').remove();
            $('.table__table__delete-row[data-row="'+row+'"]').remove();
        }

        $('.table__table .table__cell[data-row="'+row+'"]').removeClass('table__cell-pending-delete');

        num_rows--;
        $('.table__table').css('height', cell_height*num_rows);
        $.updateRowPositionsCache();
    });


    var start_x = 0;
    var start_y = 0;

    $(document).on('mousedown', '.drag-row', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).addClass('active__dragging__link');
        var row = $(this).data('row');
        var drag_element = $('.table__table .table__cell[data-row='+row+']');
        drag_element.removeClass('transitions').addClass('table__dragging__element');

        $('.drag-row').not('.active__dragging__link').fadeOut();

        dragging = true;
        drag_row = row;
        drag_col = false;
        return false;
    });

    $(document).on('mousedown', '.drag-col', function(e) {
        e.preventDefault();
        e.stopPropagation();

        $(this).addClass('active__dragging__link');

        var col = $(this).data('col');
        $('.table__table .table__cell[data-col='+col+']').removeClass('transitions').addClass('table__dragging__element');

        $('.drag-col').not('.active__dragging__link').fadeOut();

        dragging = true;
        drag_col = col;
        drag_row = false;

        return false;
    });

    $(document).on('mousemove', function(e) {
        e.preventDefault();

        if(dragging) {
            if(drag_row) {
                last_drag_y = e.pageY - $('.table__table').offset().top;

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

                    $('.table__table .table__cell[data-row='+(should_move_row)+']').each(function(e) {
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

                    $('.table__table .table__cell[data-row='+(should_move_row_down)+']').each(function(e) {
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

                last_drag_x = e.pageX - $('.table__table').offset().left - cell_width;

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
                    $('.table__table .table__cell[data-col='+(new_col_index)+']').each(function(e) {
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
                    $('.table__table .table__cell[data-col='+(new_col_index)+']').each(function(e) {
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

            var closest_row = $.closest(last_drag_y, row_positions);
            var row_y = closest_row.closest;
            $('.table__dragging__element').css('top', row_y+'px');

            /**
             * Go through all drag rows and position them correctly + set data-row based on position in HTML
             */
            var row_counter = 1;
            $('.drag-row').each(function(e) {
                $(this).css('top', ((row_counter-1) * cell_height) + 'px' );
                $(this).attr('data-row', row_counter);
                $(this).data('row', row_counter);
                row_counter++;

                $(this).show();
            });


        } else if(drag_col) {

            var closest_col = $.closest(last_drag_x, col_positions);
            var row_x = closest_col.closest;
            $('.table__dragging__element').css('left', row_x+'px');

            var col_counter = 1;
            $('.drag-col').each(function(e) {
                $(this).css('left', ((col_counter * cell_width)-19) + 'px' );
                $(this).attr('data-col', col_counter);
                $(this).data('col', col_counter);
                col_counter++;

                $(this).show();
            });

        }

        $('.table__cell').removeClass('table__dragging__element').addClass('transitions');

        $.updateTableCells();

        drag_row = false;
        drag_col = false;

        return false;
    });


});