<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * ExpressionEngine Table Fieldtype
 *
 */
class Table_ft extends EE_Fieldtype {

    var $info = array(
        'name'		=> 'Table',
        'version'	=> '1.0'
    );

    public $has_array_data = TRUE;

    const TABLE_PREFIX = 'table_';
    const TAG_PREFIX = 'table:';

    public function __construct()
    {
        parent::__construct();
        ee()->lang->loadfile('table');
    }

    /**
     * Make Grid compatible. // removed for now
     *
     * @param $name
     * @return bool
    public function accepts_content_type($name)
    {
        return ($name == 'channel' || $name == 'grid');
    }

    public function grid_display_field($data)
    {
        return $this->display_field($data);
    }
*/

    /**
     * Display the field
     *
     * @param $data
     * @return string
     */
    public function display_field($data)
    {
        ee()->load->library('table_lib');

        $vars = array(
            'field_id' => $this->field_id,
            'table_rows' => FALSE,
            'table_num_rows' => 0,
            'table_num_cols' => 0,
            'celltypes' => ee()->table_lib->get_celltypes(),
            'settings' => $this->settings,
        );

        $field_id = $this->field_id;
        $table_post_data = ee()->input->post('table_cell_'.$field_id);
        $entry_id = $this->content_id();

        /**
         * If we have POST data here it might be a result of a save with validation errors
         */
        if($table_post_data) {

            $table_num_cols = 0;
            $table_num_rows = count($table_post_data);
            if($table_num_rows > 0) {
                $table_num_cols = count($table_post_data[1]);   // get number of cols for first row
            }

            // convert POST data to the format we get it from the db
            $table_rows = array();
            for($j=1; $j <= count($table_post_data); $j++) {

                $first_cell = $table_post_data[$j][1];
                reset($first_cell);
                $row_type = key($first_cell);

                $row_data = array(
                    'entry_id' => $entry_id,
                    'row' => $j,
                    'row_type' => $row_type,
                );

                $col_data = $table_post_data[$j];

                for($c = 1; $c <= count($col_data); $c++) {
                    $row_data['col_'.$c] = $col_data[$c][$row_type];                             // @todo fix this when each cell can have different types?
                }

                $table_rows[] = $row_data;
            }

            $vars['table_rows'] = $table_rows;
            $vars['table_num_rows'] = $table_num_rows;
            $vars['table_num_cols'] = $table_num_cols;

        } else {

            if($entry_id > 0) {
                // entry is saved so we look up the saved data

                $field_name = ee()->table_lib->get_field_name($field_id);

                $q = ee()->db->where('entry_id', $entry_id)->order_by('row')->get(Table_ft::TABLE_PREFIX.$field_name);

                $table_rows = $q->result_array();

                $table_num_rows = $q->num_rows();
                $table_num_cols = 0;

                // count columns
                if($table_num_rows > 0) {
                    $col_id = 1;
                    while(isset($table_rows[0]['col_'.$col_id])) {
                        $table_num_cols++;
                        $col_id++;
                    }
                }

                $vars['table_rows'] = $table_rows;

                $vars['table_num_rows'] = $table_num_rows;
                $vars['table_num_cols'] = $table_num_cols;
            }
        }

        // Make sure that Assets is installed
        if (array_key_exists('assets', $this->EE->addons->get_installed()))
        {
            require_once PATH_THIRD.'assets/helper.php';

            $assets_helper = new Assets_helper;
            $assets_helper->include_sheet_resources();
        }

        ee()->cp->add_to_head('<link rel="stylesheet" href="'.ee()->table_lib->get_theme_url().'css/table.min.css">');

        $dynamic_js_vars = array(
            'field_id' => $field_id,
            'factories' => ee()->table_lib->get_js_cell_factories(),
        );

        $dynamic_js = ee()->load->view('table_dynamic_js', $dynamic_js_vars, TRUE);
        ee()->cp->add_to_head($dynamic_js);
        ee()->cp->add_to_head('<script type="text/javascript" src="'.ee()->table_lib->get_theme_url().'js/table.min.js'.'"></script>');
        return ee()->load->view('table_publish_view', $vars, TRUE);
    }


    /**
     * Called TWICE when a field is edited. We use this to rename the field table
     * if the field is renamed
     *
     * @param $data
     * @return array|void
     */
    public function settings_modify_column($data)
    {
        $field_name = ee()->input->post('field_name');
        $old_field_name = $data['field_name'];
        $table_name = Table_ft::TABLE_PREFIX.$field_name;

        /**
         * If the field was renamed, rename the table
         */
        $old_table_name = Table_ft::TABLE_PREFIX.$old_field_name;
        if(ee()->db->table_exists($old_table_name)) {
            ee()->load->dbforge();
            ee()->dbforge->rename_table($old_table_name, $table_name);
        }
    }


    /**
     * Display individual settings
     *
     * @return string|void
     */
    public function display_settings($data)
    {
        ee()->load->library('table_lib');

        ee()->table->set_heading(array(
            'data' => lang('table_options'),
            'colspan' => 2
        ));

        $celltypes = ee()->table_lib->get_celltypes();
        $celltype_checkboxes_html = '';
        foreach($celltypes as $celltype) {

                $checkbox_config = array(
                    'name' => 'available_celltypes[]',
                    'value' => $celltype::$TYPE,
                    'checked' => $celltype::$REQUIRED || isset($data['available_celltypes']) && is_array($data['available_celltypes']) && in_array($celltype::$TYPE, $data['available_celltypes'])
                );

                if($celltype::$REQUIRED) {
                    $checkbox_config['disabled'] = '';
                }

                $celltype_checkboxes_html .= '<div class="table__table__options-field">'.form_checkbox($checkbox_config)
                .
                '<span>'.form_label($celltype::$TYPE_HUMAN . ($celltype::$REQUIRED ? ' (Required)':'') , $celltype::$TYPE).'</span></div>';

        }

        ee()->table->add_row(
            lang('table_options_select_available_fields'),
            $celltype_checkboxes_html
        );

        ee()->cp->add_to_head('<link rel="stylesheet" href="'.ee()->table_lib->get_theme_url().'css/table_options.min.css">');

        $html = ee()->table->generate();
        return $html;
    }

    // Only called when being rendered in a Grid field cell:
    /*public function grid_display_settings($data)
    {
        return array($this->display_settings($data));
    }*/

    public function save_settings($data)
    {
        if(isset($this->settings['col_id'])) {
            $col_id = $this->settings['col_id'];

            $grid_post = ee()->input->post('grid');
            $grid_col = $grid_post['cols']['col_id_'.$col_id];

            if(isset($grid_col['col_settings'])) {
                if(isset($grid_col['col_settings']['available_celltypes'])) {
                    $available_celltypes = $grid_col['col_settings']['available_celltypes'];
                }
            }
        } else {
            $available_celltypes = ee()->input->post('available_celltypes');
        }

        return array(
            'available_celltypes' => $available_celltypes,
        );
    }

    public function post_save_settings($data)
    {
        /**
         * Create the table for this field if it does not exist.
         */
        $field_name = $data['field_name'];
        $table_name = Table_ft::TABLE_PREFIX.$field_name;

        /**
         * hack to flush the cache of table names or else we will get SQL when renaming a field. This might stop
         * working in future versions of EE if the data_cache array is made private. But ->cache_off() does not work
         * so will have to do for now ..
         * @todo fix
         */
        ee()->db->data_cache = array();
        if(!ee()->db->table_exists($table_name))
        {
            ee()->load->dbforge();

            $id_field_name = Table_ft::TABLE_PREFIX.$field_name.'_id';
            $table_fields = array(
                $id_field_name => array(
                    'type' => 'int',
                    'constraint' => '10',
                    'unsigned' => TRUE,
                    'auto_increment' => TRUE),

                'entry_id' => array(
                    'type' => 'int',
                    'constraint' => '10',
                    'null' => FALSE),

                'row' => array(
                    'type' => 'int',
                    'constraint' => '10',
                    'null' => FALSE),

                'row_type' => array(
                    'type' => 'varchar',
                    'constraint' => '255',
                    'null' => FALSE
                ),
            );

            $this->EE->dbforge->add_field($table_fields);
            $this->EE->dbforge->add_key($id_field_name, TRUE);
            $this->EE->dbforge->create_table($table_name);
        }
    }


    public function save($data)
    {
        $channel_data_for_field = '';
        $field_id = $this->id();
        if($field_id) {

            $table_data = ee()->input->post('table_cell_'.$field_id);

            if(isset($table_data[1])) { // we have table data
                $num_cols = count($table_data[1]);

                if($num_cols > 0) {
                    $channel_data_for_field = 'y';  // store y if we have table data
                }
            }
        }

        return $channel_data_for_field;
    }


    /**
     * Save the data entered by the user
     *
     * @param $data
     * @return string|void
     */
    public function post_save($data)
    {
        $field_id = $this->id();
        ee()->load->library('table_lib');

        // $field_name = $this->name(); <- here $this->name() contains 'field_id_5' instead of field short name (which you will get while saving field)

        // find field short name

        $field_name = ee()->table_lib->get_field_name($field_id);

        if($field_name) {

            $table_data = ee()->input->post('table_cell_'.$field_id);

            $entry_id = $this->settings['entry_id'];

            $table_name = Table_ft::TABLE_PREFIX.$field_name;
            // delete all rows for this entry_od
            ee()->db->where('entry_id', $entry_id)->delete($table_name);

            /**
             * Data format (example submit) http://pastebin.com/raw.php?i=wdt6PKuN
             */
            if(isset($table_data[1])) { // we have table data
                $num_cols = count($table_data[1]);


                /**
                 * hack to flush the cache of table names - not sure if it is needed here but doing it anyway
                 *
                 * @todo fix
                 */
                ee()->db->data_cache = array();

                $add_fields = array();
                for($i=1; $i <= $num_cols; $i++) {
                    if(!ee()->db->field_exists('col_'.$i, $table_name)) {
                        $add_fields['col_'.$i] = array(
                                'type' => 'TEXT',
                                'null' => TRUE
                        );
                    }
                }

                if(count($add_fields) > 0) {
                    ee()->load->dbforge();
                    ee()->dbforge->add_column($table_name, $add_fields);
                }

                for($j=1; $j <= count($table_data); $j++) {

                    $first_cell = $table_data[$j][1];
                    reset($first_cell);
                    $row_type = key($first_cell);

                    $insert_data = array(
                        'entry_id' => $entry_id,
                        'row' => $j,
                        'row_type' => $row_type,
                    );

                    $col_data = $table_data[$j];

                    for($c = 1; $c <= count($col_data); $c++) {
                        $insert_data['col_'.$c] = $col_data[$c][$row_type];                             // @todo fix this when each cell can have different types?
                    }

                    ee()->db->insert($table_name, $insert_data);
                }
            }
        }
    }


    /**
     * This function is called when an entry is deleted
     *
     * @param $entry_ids
     *
     */
    public function delete($entry_ids)
    {
        $field_id = $this->id();
        ee()->load->library('table_lib');

        // find field short name
        $field_name = ee()->table_lib->get_field_name($field_id);
        if($field_name) {
            $table_name = Table_ft::TABLE_PREFIX.$field_name;
            ee()->db->where_in('entry_id', $entry_ids)->delete($table_name);
        }
    }


    /**
     * Replace Grid template tags
     */
    public function replace_tag($data, $params = '', $tagdata = '')
    {
        if (empty($tagdata))
        {
            return '';
        }

        if(isset($this->row) && isset($this->row['entry_id'])) {
            $entry_id = $this->row['entry_id'];

            // find field short name
            ee()->load->library('table_lib');
            $field_name = ee()->table_lib->get_field_name($this->id());             // @todo: fix this when EE implements a sensible way to get field_name everywhere! (right now this->name() returns different results in each hook!)
            if($field_name) {
                    $tagdata = ee()->table_lib->parse_tagdata($entry_id, $this->id(), $field_name, $tagdata, $params);
                } else {
                    $tagdata = '';
            }
        }

        return $tagdata;
    }


}