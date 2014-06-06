<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once 'table_cell.php';

/**
 * Title / Image cell
 */


class Table_title_image_cell extends Table_cell {

    public static $TYPE = 'title_image';

    public static $TYPE_HUMAN = 'Title + Image';

    public static $ICON_CSS_CLASS = 'icon-picture';

    public function replace_tag($tagdata = '', $params = '')
    {
        if($tagdata == '') {
            return $tagdata;
        }

        $raw_content = parent::replace_tag($tagdata, $params);
        $content_obj = json_decode($raw_content);

        if(isset($content_obj->title_text)) {
            $tagdata =  str_replace('{title_text}', $content_obj->title_text, $tagdata);
        }

        if(isset($content_obj->assets_file_id)) {
            ee()->load->add_package_path(PATH_THIRD.'assets/');
            require_once PATH_THIRD.'assets/sources/ee/file.ee.php';
            require_once PATH_THIRD.'assets/helper.php';
            ee()->load->library('Assets_lib');
            $assets_file = ee()->assets_lib->get_file_by_id($content_obj->assets_file_id);
            $assets_helper = new Assets_helper();
            $tagdata = $assets_helper->parse_file_tag(array($assets_file), $tagdata);
        }

        return $tagdata;
    }

}

$celltypes[] = new Table_title_image_cell();