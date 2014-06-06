<?php  if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Table_lib {

    private $cells_loaded = FALSE;
    protected $js_factories;
    protected $celltypes;

    public function __construct() {
        $this->load_cells();
    }

    /**
     * Load all available cells in celltypes directory
     */
    public function load_cells() {

        if(!$this->cells_loaded) {
            $this->cells_loaded = TRUE;
            /**
             * Require celltypes PHP files + Fetch cell factories from the js
             */
            $factories = array();
            $celltypes_dir = PATH_THIRD.'/table/celltypes/';
            $celltypes = array();
            if ($handle = opendir($celltypes_dir)) {
                while (false !== ($file = readdir($handle)))
                {
                    $ext = strtolower(substr($file, strrpos($file, '.') + 1));
                    if ($file != "." && $file != "..")
                    {
                        if($ext == 'js') {
                            $factories[] = file_get_contents($celltypes_dir.$file);
                        } else if($ext == 'php') {
                            require_once($celltypes_dir.$file);
                        }
                    }
                }
                closedir($handle);
            }

            $this->celltypes = $celltypes;
            $this->js_factories = $factories;
        }
    }

    /**
     * Get js code for the cell factories as an array of js methods
     *
     * @return array
     */
    public function get_js_cell_factories() {
        return $this->js_factories;
    }

    /**
     * Get array of celltype objects
     *
     * @return array
     */
    public function get_celltypes() {
        return $this->celltypes;
    }

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
        $orderby = isset($params['orderby']) ? $params['orderby'] : FALSE;

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

            $tagdata = ee()->TMPL->parse_switch($tagdata, $row_num);

            $row_arr = $q->result_array();
            if($orderby == 'random')
            {
                shuffle($entry_data);
            }

            foreach($row_arr as $row) {
                $row_num++;
                $row_type = $row['row_type'];
                $col = array();
                $i=$col_offset;
                $col_counter = 0;
                while(isset($row['col_'.$i]) && ($col_limit == FALSE || $col_counter < $col_limit)) {
                    $col_counter++;
                    $raw_content = $row['col_'.$i];

                    $celltype_class = 'Table_'.$row['row_type'].'_cell';
                    $cell = new $celltype_class($row_num, $field_id, $col_counter, $raw_content);


                    $col[] =
                        array(
                            Table_ft::TAG_PREFIX.'col:num' => $cell->col,
                            /*Table_ft::TAG_PREFIX.'col:content' => array(
                                array(
                                    'html' => $cell->get_cell_frontend_content(),
                                    'celltype' => $row_type,

                                )
                            ),*/
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
                Table_ft::TAG_PREFIX.'row' => $rows,
                Table_ft::TAG_PREFIX.'mobile:tables' => $mobile_tables
            );

            $row_pattern = '{'.Table_ft::TAG_PREFIX.'row}(.*?){\/'.Table_ft::TAG_PREFIX.'row}';

            preg_match_all('/'.$row_pattern.'/msU', $tagdata, $matches);
            if($matches && count($matches[0]) > 0) {

                $row_tagchunk = $matches[1][0];

                $tagdata = str_replace($row_tagchunk, '#table__table__col#', $tagdata );

                $tagdata = ee()->TMPL->parse_variables($tagdata, array($vars));

                $row_num=0;
                foreach($row_arr as $row) {
                    $row_num++;
                    $pos = strpos($tagdata, '#table__table__col#');
                    if ($pos !== false) {
                        $i=$col_offset;
                        $col_counter = 0;
                        $all_cols_data = '';

                        while(isset($row['col_'.$i]) && ($col_limit == FALSE || $col_counter < $col_limit)) {
                            $col_counter++;
                            $raw_content = $row['col_'.$i];

                            $celltype_class = 'Table_'.$row['row_type'].'_cell';
                            $cell = new $celltype_class($row_num, $field_id, $col_counter, $raw_content);

                            $col_pattern = '{'.Table_ft::TAG_PREFIX.'col}(.*?){\/'.Table_ft::TAG_PREFIX.'col}';
                            preg_match('/'.$col_pattern.'/msU', $row_tagchunk, $col_matches);
                            if($col_matches) {

                                /**
                                 * Parse celltype tag pairs like {table:image}
                                 */
                                $content_pattern = '{'.Table_ft::TAG_PREFIX.$row['row_type'].'}(.*?){\/'.Table_ft::TAG_PREFIX.$row['row_type'].'}';

                                preg_match('/'.$content_pattern.'/msU', $col_matches[1], $content_matches);
                                if($content_matches) {

                                    // replace tags with the content for the current cell type (cell->replace_tag)
                                    $col_content = str_replace($content_matches[0], $cell->replace_tag($content_matches[1]), $col_matches[1]);

                                    // clear any unparsed celltype tags
                                    $col_content = preg_replace('/{(.*)}(.*)?{\/(.*)}/msU', '', $col_content);
                                    $all_cols_data .= $col_content;


                                } else {
                                    $all_cols_data .= '';
                                }
                            }

                            $i++;
                        }

                        $row_tagdata_full = str_replace($col_matches[0], $all_cols_data, $row_tagchunk);

                        $tagdata = substr_replace($tagdata, $row_tagdata_full, $pos, strlen('#table__table__col#'));
                    }
                }
            }


/*
            $col_content_pattern = '#{table:rows}(.*?){table:col:content}(.*?){/table:col:content}(.*?){/table:rows}#mi';
            preg_match_all($col_content_pattern, $tagdata, $matches);

            var_dump($matches);die();

            for($row_counter=0; $row_counter < count($matches[0]); $row_counter++) {
               $col_content_match = $matches[0][$row_counter];
                $col_content_tagchunk = $matches[1][$row_counter];

                var_dump($row_arr);
                $row_type = $row_arr[$row_counter]['row_type'];
                $col_content_tagchunk .= $row_type;
                $tagdata = preg_replace($col_content_pattern, $col_content_tagchunk, $tagdata, 1);
            }


*/




        }



        return $tagdata;
    }

}