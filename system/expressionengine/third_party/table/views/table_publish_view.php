<a href="#" class="table__table__add-row">
    <i class="icon-plus-sign-alt"></i> Add row
</a>
<a href="#" class="table__table__add-col">
    <i class="icon-plus-sign-alt"></i> Add column
</a>

<div class="table__table__container">

    <div id="table__table__<?php echo $field_id ?>" class="table__table" data-field_id="<?php echo $field_id?>">
        <input type="hidden" name="field_id_<?php echo $field_id?>">
        <div class="table__table__header"></div>
        <div class="table__table__left__bar"></div>

        <div data-row="1" data-col="1" class="table__cell">
            <textarea name="table_cell_<?php echo $field_id?>[1][1]"></textarea>
        </div>

        <div data-row="1" data-col="2" class="table__cell">
            <textarea name="table_cell_<?php echo $field_id?>[1][2]"></textarea>
        </div>

        <div data-row="1" data-col="3" class="table__cell">
            <textarea name="table_cell_<?php echo $field_id?>[1][3]"></textarea>
        </div>

        <div data-row="2" data-col="1" class="table__cell">
            <textarea name="table_cell_<?php echo $field_id?>[2][1]"></textarea>
        </div>

        <div data-row="2" data-col="2" class="table__cell">
            <textarea name="table_cell_<?php echo $field_id?>[2][2]"></textarea>
        </div>

        <div data-row="2" data-col="3" class="table__cell">
            <textarea></textarea>
        </div>

        <div data-row="3" data-col="1" class="table__cell">
            <textarea></textarea>
        </div>

        <div data-row="3" data-col="2" class="table__cell">
            <textarea></textarea>
        </div>

        <div data-row="3" data-col="3" class="table__cell">
            <textarea></textarea>
        </div>

    </div>

</div>