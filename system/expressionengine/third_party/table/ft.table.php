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

    var $has_array_data = TRUE;

    public function __construct()
    {
        parent::__construct();
    }

    public function display_field($data)
    {
        $vars = array(
            'field_id' => $this->field_id,
        );
        ee()->load->library('table_lib');

        ee()->cp->add_to_head('<link rel="stylesheet" href="'.ee()->table_lib->get_theme_url().'css/table.min.css">');
        ee()->cp->add_to_head('<script type="text/javascript" src="'.ee()->table_lib->get_theme_url().'js/table.min.js'.'"></script>');
        return ee()->load->view('table_publish_view', $vars, TRUE);
    }

}