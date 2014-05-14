<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Table_lib {

    /**
     * Get the theme folder url
     *
     * @return string
     */
    public function get_theme_url() {
        return ee()->config->slash_item('theme_folder_url').'third_party/table/';
    }

}