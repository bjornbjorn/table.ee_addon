<a href="#" class="table__table__add-row">
    <i class="icon-plus-sign-alt"></i> Add row
</a>
<a href="#" class="table__table__add-col">
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
                    $cell_value = $table_row['col_'.$col_num];

                    ?>
                    <div data-row="<?php echo $row_num?>" data-col="<?php echo $col_num?>" class="table__cell">
                        <textarea name="table_cell_<?php echo $field_id?>[<?php echo $row_num?>][<?php echo $col_num?>]"><?php echo $cell_value?></textarea>
                    </div>
                    <?php
                    $col_num++;
                }

                $row_num++;
            }
        }
        ?>
    </div>

</div>