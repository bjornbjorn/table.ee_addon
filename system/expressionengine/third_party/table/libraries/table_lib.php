<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once PATH_THIRD.'table/celltypes/table_text_cell.php';
require_once PATH_THIRD.'table/celltypes/table_title_image_cell.php';

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

    /**
     * Parse tagdata (called form channel:entries)
     *
     * @param $entry_id entry_id
     * @param $field_id the id of the field
     * @param $field_name the field name (ie. blog_table)
     * @param $tagdata the tagdata (content inside the tag pair)
     */
    public function parse_tagdata($entry_id, $field_id, $field_name, $tagdata, $params)
    {
        $row_limit = isset($params['row_limit']) ? $params['row_limit'] : FALSE;
        $row_offset = isset($params['row_offset']) ? $params['row_offset'] : FALSE;
        $col_limit = isset($params['col_limit']) ? $params['col_limit'] : FALSE;
        $col_offset = isset($params['col_offset']) ? ($params['col_offset'] + 1) : 1;

        $table_name = Table_ft::TABLE_PREFIX.$field_name;
        $num_cols = 0;
        $row_num = 0;

        ee()->db->where('entry_id', $entry_id);
        if($row_limit) {
            ee()->db->limit($row_limit);
        }
        if($row_offset) {
            ee()->db->offset($row_offset);
        }

        $q = ee()->db->order_by('row')->get($table_name);
        if($q->num_rows() > 0) {

            $rows = array();
            foreach($q->result_array() as $row) {
                $row_num++;
                $row_type = $row['row_type'];
                $col = array();
                $i=$col_offset;
                $col_counter = 0;
                while(isset($row['col_'.$i]) && ($col_limit == FALSE || $col_counter < $col_limit)) {
                    $col_counter++;
                    $raw_content = $row['col_'.$i];

                    $cell = FALSE;
                    switch($row_type) {
                        case Table_text_cell::$TYPE:
                                $cell = new Table_text_cell($row_num, $field_id, $col_counter, $raw_content);
                            break;

                        case Table_title_image_cell::$TYPE:
                                $cell = new Table_title_image_cell($row_num, $field_id, $col_counter, $raw_content);
                            break;

                    }

                    $col[] =
                        array(
                            Table_ft::TAG_PREFIX.'col:num' => $cell->col,
                            Table_ft::TAG_PREFIX.'col:content' => $cell->get_cell_frontend_content(),
                            Table_ft::TAG_PREFIX.'col:content_raw' => $cell->raw_content,
                            Table_ft::TAG_PREFIX.'col:content:num_words' => $cell->get_num_words(),
                            Table_ft::TAG_PREFIX.'col:content:num_chars' => $cell->get_num_chars()
                        );

                    $i++;
                }

                $num_cols = $col_counter;

                $rows[] = array(
                    Table_ft::TAG_PREFIX.'row:num' => $row_num,
                    Table_ft::TAG_PREFIX.'row:total_cols' => $num_cols,
                    Table_ft::TAG_PREFIX.'row:type' => $row_type,
                    Table_ft::TAG_PREFIX.'col' => $col
                );
            }

            $mobile_tables = array();

            // go through all cols

            for($col_index = 1; $col_index < $num_cols; $col_index++) {
                $mobile_rows = array();

                foreach($rows as $row) {
                    $mobile_row = $row;
                    $mobile_row[Table_ft::TAG_PREFIX.'row:total_cols'] = 2;
                    $mobile_row[Table_ft::TAG_PREFIX.'col'] = array(
                        $row[Table_ft::TAG_PREFIX.'col'][0],
                        $row[Table_ft::TAG_PREFIX.'col'][$col_index]
                    );
                    $mobile_rows[] = $mobile_row;
                }

                $mobile_tables[] = array( Table_ft::TAG_PREFIX.'mobile:rows' => $mobile_rows );
            }

            $vars = array(
                Table_ft::TAG_PREFIX.'total_rows' => count($rows),
                Table_ft::TAG_PREFIX.'total_cols' => $num_cols,
                Table_ft::TAG_PREFIX.'rows' => $rows,
                Table_ft::TAG_PREFIX.'mobile:tables' => $mobile_tables
            );

            $tagdata = ee()->TMPL->parse_variables($tagdata, array($vars));

        }

        return $tagdata;
    }

}