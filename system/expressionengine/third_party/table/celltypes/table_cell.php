<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');


/**
 * Class Table_cell
 *
 * Generic cell type, all cell types inherit from this one
 *
 */
class Table_cell {

    /**
     * @var row number (1 .. number of rows in table)
     */
    protected $row;

    /**
     * @var column number (1 .. number of columns in table)
     */
    protected $col;

    /**
     * @var the raw content (may be in JSON format)
     */
    protected $raw_content;

    /**
     * @var the cell type
     */
    public static $TYPE;

    public function __construct($row, $col, $raw_content) {
        $this->row = $row;
        $this->col = $col;
        $this->raw_content = $raw_content;
    }

    /**
     * Get parsed content for this cell
     *
     * @return string/HTML
     */
    public function getContent() {
        return $this->raw_content;
    }

    /**
     * Get raw content for this cell
     * @return string/JSON
     */
    public function getRawContent() {
        return $this->raw_content;
    }

    public function getCol() { return $this->col; }
    public function getRow() { return $this->row; }

    /**
     * Get number of characters in cell
     *
     * @return int
     */
    public function getNumChars()
    {
        return 0;
    }

    /**
     * Get number of words in cell
     *
     * @return int
     */
    public function getNumWords()
    {
        return 0;
    }

}