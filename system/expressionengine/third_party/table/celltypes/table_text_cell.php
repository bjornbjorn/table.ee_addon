<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once 'table_cell.php';

/**
 * A Standard text cell
 */


class Table_text_cell extends Table_cell {

    public static $TYPE = 'text';

    public static $TYPE_HUMAN = 'Text';

    public static $ICON_CSS_CLASS = 'icon-align-left';

    public static $REQUIRED = TRUE;

    /**
     * Get parsed content for this cell
     *
     * @return string/HTML
     */
    public function replace_tag($tagdata = '', $params = '') {
        $raw_content = $this->raw_content;
        $html = str_replace('{content}', $raw_content, $tagdata);

        return $html;
    }


    /**
     * Get number of characters in text content
     *
     * @return int
     */
    public function get_num_chars()
    {
        return strlen($this->raw_content);
    }

    public function get_num_words() {
        return str_word_count($this->raw_content);
    }
}

$celltypes[] = new Table_text_cell();