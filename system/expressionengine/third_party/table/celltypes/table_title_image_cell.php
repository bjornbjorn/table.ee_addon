<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

require_once 'table_cell.php';

/**
 * Title / Image cell
 */


class Table_title_image_cell extends Table_cell {

    public static $TYPE = 'title_image';

    public static $TYPE_HUMAN = 'Title + Image';

    public static $ICON_CSS_CLASS = 'icon-picture';

    public function get_cell_frontend_content()
    {
        $content_obj = json_decode($this->raw_content);
        $content_html = isset($content_obj->title_text) ? '<h2 title="'.$content_obj->title_text.'">'.$content_obj->title_text.'</h2>' : '';
        if(isset($content_obj->assets_file_id)) {
            ee()->load->add_package_path(PATH_THIRD.'assets/');
            require_once PATH_THIRD.'assets/sources/ee/file.ee.php';
            require_once PATH_THIRD.'assets/helper.php';
            ee()->load->library('Assets_lib');
            $assets_file = ee()->assets_lib->get_file_by_id($content_obj->assets_file_id);
            $assets_helper = new Assets_helper();

            $force_width = 139;
            $width_ratio = $assets_file->width() / $force_width;
            $force_height = round($assets_file->height() / $width_ratio);

            $tagdata = '<img width="'.$force_width.'" height="'.$force_height.'" title="'.$content_obj->title_text.'" src="{url}"/>';
            $content_html .= $assets_helper->parse_file_tag(array($assets_file), $tagdata);
        }
        return $content_html;
    }

}

$celltypes[] = new Table_title_image_cell();