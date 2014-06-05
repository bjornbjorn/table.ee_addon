<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Class Table_cell
 *
 * Generic cell type, all cell types inherit from this one
 *
 */
class Table_cell {

    /**
     * @var int row number (1 .. number of rows in table)
     */
    protected $row;

    /**
     * @var int column number (1 .. number of columns in table)
     */
    protected $col;

    /**
     * @var string the raw content (may be in JSON format)
     */
    protected $raw_content;

    /**
     * @var string the id of the field this cell belongs to
     */
    protected $field_id;

    /**
     * @var bool if TRUE this celltype cannot be unselected in the field options
     */
    public static $REQUIRED = FALSE;

    /**
     * @var string the cell type
     */
    public static $TYPE = FALSE;

    /**
     * @var string a human readable version of $TYPE
     */
    public static $TYPE_HUMAN = FALSE;

    /**
     * @var string css class to add to the <i> (fontawesome)c
     */
    public static $ICON_CSS_CLASS = FALSE;

    public function __construct($field_id=FALSE, $row=FALSE, $col=FALSE, $raw_content=FALSE) {
        $this->field_id = $field_id;
        $this->row = $row;
        $this->col = $col;
        $this->raw_content = $raw_content;
    }

    public function __get($name) {
        if(isset($this->$name)) {
            return $this->$name;
        }
    }

    public function __set($name, $value) {
        if(isset($this->$name)) {
            return $this->$name;
        }
    }

    /**
     * Get parsed content for this cell
     *
     * @return string/HTML
     */
    public function get_cell_frontend_content() {
        $raw_content = $this->raw_content;

        /**
         * This hook enables devs to modify the raw_content of the cell before it is handed off to the cells
         * get_cell_frontend_content() method
         */
        if (ee()->extensions->active_hook('table_tablecell_get_frontend_content') === TRUE)
        {
            $raw_content = ee()->extensions->call('table_tablecell_get_frontend_content', $this::$TYPE, $this->field_id, $this->row, $this->col, $raw_content, $this);
            if (ee()->extensions->end_script === TRUE) return;
        }

        return $raw_content;
    }

    /**
     * Get HTML for table fieldtype cell
     */
    public function display_cell() {
        return 'Not implemented';
    }

    /**
     * Get number of characters in cell
     *
     * @return int
     */
    public function get_num_chars()
    {
        return 0;
    }

    /**
     * Get number of words in cell
     *
     * @return int
     */
    public function get_num_words()
    {
        return 0;
    }

}