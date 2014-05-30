<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once 'table_cell.php';

/**
 * Created by PhpStorm.
 * User: bjorn
 * Date: 30/05/14
 * Time: 13:27
 */


class Table_text_cell extends Table_cell {

    public static $TYPE = 'text';

    /**
     * Get number of characters in text content
     *
     * @return int
     */
    public function getNumChars()
    {
        return strlen($this->raw_content);
    }


    public function getNumWords() {
        return str_word_count($this->raw_content);
    }
}