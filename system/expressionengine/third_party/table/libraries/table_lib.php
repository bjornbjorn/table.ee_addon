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

    /**
     * @todo make this more dynamic! :-P
     *
     * @param $row_type content type, ie. text
     * @param $raw_content the raw content stored
     */
    public function parse_cell_content($row_type, $raw_content)
    {
        $content_html = $raw_content;
        if($row_type == 'title_image') {
            $content_obj = json_decode($raw_content);
            $content_html = '<h2>'.$content_obj->title_text.'</h2>';
            if($content_obj->assets_file_id) {
                ee()->load->add_package_path(PATH_THIRD.'assets/');
                require_once PATH_THIRD.'assets/sources/ee/file.ee.php';
                require_once PATH_THIRD.'assets/helper.php';
                ee()->load->library('Assets_lib');
                $assets_file = ee()->assets_lib->get_file_by_id($content_obj->assets_file_id);
                $assets_helper = new Assets_helper();
                $tagdata = '<img src="{url}"/>';
                $content_html .= $assets_helper->parse_file_tag(array($assets_file), $tagdata);
            }
        }

        return $content_html;

    }

    /**
     * Parse tagdata (called form channel:entries)
     *
     * @param $entry_id entry_id
     * @param $field_name the field name (ie. blog_table)
     * @param $tagdata the tagdata (content inside the tag pair)
     */
    public function parse_tagdata($entry_id, $field_name, $tagdata)
    {
        $table_name = Table_ft::TABLE_PREFIX.$field_name;
        $num_cols = 0;
        $row_num = 0;
        $q = ee()->db->where('entry_id', $entry_id)->order_by('row')->get($table_name);
        if($q->num_rows() > 0) {

            $rows = array();
            foreach($q->result_array() as $row) {
                $row_num++;
                $row_type = $row['row_type'];
                $col = array();
                $i=1;
                while(isset($row['col_'.$i])) {
                    $raw_content = $row['col_'.$i];
                    $content = $this->parse_cell_content($row_type, $raw_content);
                    $col[] =
                        array(
                            Table_ft::TAG_PREFIX.'col:num' => $i,
                            Table_ft::TAG_PREFIX.'col:content' => $content,
                            Table_ft::TAG_PREFIX.'col:content_raw' => $raw_content
                        );

                    $i++;
                }

                $rows[] = array(
                    Table_ft::TAG_PREFIX.'row_num' => $row_num,
                    Table_ft::TAG_PREFIX.'num_cols' => ($i-1),
                    Table_ft::TAG_PREFIX.'row_type' => $row_type,
                    Table_ft::TAG_PREFIX.'col' => $col
                );

                $num_cols = $i-1;
            }

            $vars = array(
                Table_ft::TAG_PREFIX.'num_rows' => count($rows),
                Table_ft::TAG_PREFIX.'num_cols' => $num_cols,
                Table_ft::TAG_PREFIX.'rows' => $rows
            );

            $tagdata = ee()->TMPL->parse_variables($tagdata, array($vars));

        }

        return $tagdata;
    }

}