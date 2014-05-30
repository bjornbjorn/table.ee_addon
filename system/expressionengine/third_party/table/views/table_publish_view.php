<a href="#" class="table__table__add-row" data-field_id="<?php echo $field_id?>">
    <i class="icon-plus-sign-alt"></i> Add row
</a>

<div style="position:relative; float:left;">
    <div class="table__table__add-row-dropdown" data-field_id="<?php echo $field_id?>">

        <ul class="table__table__row-types">
            <li>
                <a href="#" class="table__table__add-text-row">
                    <i class="icon-align-left"></i> Text
                </a>
            </li>
            <li>
                <a href="#" class="table__table__add-title-image-row">
                    <i class="icon-picture"></i> Header (title / image)
                </a>
            </li>
        </ul>
    </div>

</div>


<a href="#" class="table__table__add-col" data-field_id="<?php echo $field_id?>">
    <i class="icon-plus-sign-alt"></i> Add column
</a>

<div class="table__table__container">

    <div id="table__table__<?php echo $field_id ?>" class="table__table" data-field_id="<?php echo $field_id?>" data-init-num-rows="<?php echo $table_num_rows?>" data-init-num-cols="<?php echo $table_num_cols?>">
        <input type="hidden" name="field_id_<?php echo $field_id?>">
        <div class="table__table__header"></div>
        <div class="table__table__left__bar"></div>

        <?php
        if($table_rows) {
            $row_num = 1;
            foreach($table_rows as $table_row) {
                $col_num = 1;
                while(isset($table_row['col_'.$col_num])) {
                    $row_type = $table_row['row_type'];
                    $cell_value = htmlentities($table_row['col_'.$col_num]);
                    ?>
                    <div data-inited="0" data-row-type="<?php echo $row_type?>" data-row="<?php echo $row_num?>" data-row-type="text" data-col="<?php echo $col_num?>" data-init-cell-value="<?php echo $cell_value?>" class="table__cell"></div>
                    <?php
                    $col_num++;
                }

                $row_num++;
            }
        }
        ?>
    </div>

</div>