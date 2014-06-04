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
        return $this->raw_content;
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