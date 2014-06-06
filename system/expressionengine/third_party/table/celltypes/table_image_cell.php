<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once 'table_cell.php';

/**
 * Title / Image cell
 */


class Table_image_cell extends Table_cell {

    public static $TYPE = 'image';

    public static $TYPE_HUMAN = 'Image';

    public static $ICON_CSS_CLASS = 'icon-picture';

    public function get_cell_frontend_content()
    {
        $raw_content = parent::get_cell_frontend_content();
        $content_obj = json_decode($raw_content);

        $content_html = '';

        if(isset($content_obj->assets_file_id)) {
            ee()->load->add_package_path(PATH_THIRD.'assets/');
            require_once PATH_THIRD.'assets/sources/ee/file.ee.php';
            require_once PATH_THIRD.'assets/helper.php';
            ee()->load->library('Assets_lib');
            $assets_file = ee()->assets_lib->get_file_by_id($content_obj->assets_file_id);
            $assets_helper = new Assets_helper();

            //$content_html .= $assets_helper->parse_file_tag(array($assets_file), $tagdata);
        }
        return $content_html;
    }

}

$celltypes[] = new Table_image_cell();