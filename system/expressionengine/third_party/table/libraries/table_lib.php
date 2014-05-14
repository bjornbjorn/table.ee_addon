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


    /**
     * Get the field short name of a specific field id
     *
     * @param $field_id
     * @return field_name or FALSE if not found
     */
    public function get_field_name($field_id) {
        $field_name = FALSE;

        $q = ee()->db
            ->where('site_id', ee()->config->item('site_id'))
            ->where('field_id', $field_id)
            ->get('channel_fields');

        if($q->num_rows() > 0) {
            $field_name = $q->row('field_name');
        }

        return $field_name;
    }

}