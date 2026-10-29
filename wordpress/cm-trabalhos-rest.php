<?php
/**
 * Plugin Name: CM Ar-Condicionado — API de Trabalhos
 * Description: Retorna fotos de galerias Gutenberg e shortcodes clássicos para o CPT trabalho.
 * Version: 1.1.0
 */
if (!defined('ABSPATH')) { exit; }

function cm_trabalhos_media($id) {
    $id = absint($id);
    if (!$id || !wp_attachment_is_image($id)) { return null; }
    $full = wp_get_attachment_image_src($id, 'full');
    if (!$full) { return null; }
    $preview = wp_get_attachment_image_src($id, 'medium_large');
    return array(
        'id' => $id,
        'url' => $full[0],
        'width' => (int) $full[1],
        'height' => (int) $full[2],
        'alt' => (string) get_post_meta($id, '_wp_attachment_image_alt', true),
        'preview_url' => $preview ? $preview[0] : $full[0],
        'srcset' => wp_get_attachment_image_srcset($id, 'full') ?: '',
        'sizes' => wp_get_attachment_image_sizes($id, 'full') ?: '',
    );
}

function cm_trabalhos_gallery_block_ids($blocks) {
    $ids = array();
    foreach ($blocks as $block) {
        $name = $block['blockName'] ?? '';
        if ($name === 'core/gallery') {
            foreach (($block['attrs']['ids'] ?? array()) as $id) {
                $ids[] = absint($id);
            }
        }
        // Modern Gutenberg gallery images are core/image innerBlocks.
        if ($name === 'core/image') {
            $id = absint($block['attrs']['id'] ?? 0);
            if ($id) { $ids[] = $id; }
        }
        if (!empty($block['innerBlocks'])) {
            $ids = array_merge($ids, cm_trabalhos_gallery_block_ids($block['innerBlocks']));
        }
    }
    return $ids;
}

function cm_trabalhos_gallery_shortcode_ids($content) {
    $ids = array();
    if (!has_shortcode($content, 'gallery')) { return $ids; }
    if (preg_match_all('/\\[gallery\\b([^\\]]*)\\]/i', $content, $matches)) {
        foreach ($matches[1] as $raw_attrs) {
            $attrs = shortcode_parse_atts($raw_attrs);
            if (!is_array($attrs)) { continue; }
            if (!empty($attrs['ids'])) {
                foreach (explode(',', $attrs['ids']) as $id) { $ids[] = absint(trim($id)); }
            } elseif (!empty($attrs['include'])) {
                foreach (explode(',', $attrs['include']) as $id) { $ids[] = absint(trim($id)); }
            }
        }
    }
    return $ids;
}

add_action('rest_api_init', function () {
    register_rest_field('trabalho', 'cm_galeria', array(
        'get_callback' => function ($post_arr) {
            $post = get_post((int) $post_arr['id']);
            if (!$post || $post->post_type !== 'trabalho') { return array(); }
            $ids = array_merge(
                cm_trabalhos_gallery_block_ids(parse_blocks($post->post_content)),
                cm_trabalhos_gallery_shortcode_ids($post->post_content)
            );
            $ids = array_values(array_unique(array_filter(array_map('absint', $ids))));
            $images = array();
            foreach ($ids as $id) {
                $image = cm_trabalhos_media($id);
                if ($image) { $images[] = $image; }
            }
            return $images;
        },
        'schema' => array(
            'description' => 'Fotos da galeria do trabalho com URLs e dimensões.',
            'type' => 'array',
            'context' => array('view'),
            'readonly' => true,
            'items' => array('type' => 'object'),
        ),
    ));
});
