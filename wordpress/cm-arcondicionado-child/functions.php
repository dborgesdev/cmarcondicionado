<?php
/**
 * CM Ar-Condicionado - Child Theme Functions
 * Desenvolvido por Smart Local
 */

// 1. Redireciona acessos single/arquivos do WP para o Front-end (caso acessem links do WP vindos do Google)
add_action('template_redirect', 'smart_local_redirecionar_para_frontend');
function smart_local_redirecionar_para_frontend() {
    // Se não for a tela de login, o painel admin, ou chamadas de API, joga para o front-end
    if (!is_admin() && !$file && !defined('REST_REQUEST')) {
        $slug = get_post_field('post_name', get_post());
        $post_type = get_post_type();
        
        // Se for um post do blog, joga para a rota interna correspondente no React
        if (is_single() && $post_type == 'post') {
            wp_redirect('https://cmarcondicionado.com.br/' . $slug, 301);
            exit;
        }
        
        // Fallback para qualquer outra página residual
        wp_redirect('https://cmarcondicionado.com.br', 301);
        exit;
    }
}

/**
 * 6. Personaliza a listagem administrativa de Peças
 * CPT: peca
 * ACF: codigo_referencia
 */

// Adiciona as colunas Imagem e Código.
add_filter('manage_peca_posts_columns', 'smart_local_peca_admin_columns');

function smart_local_peca_admin_columns($columns) {
    $new_columns = array();

    foreach ($columns as $key => $label) {
        $new_columns[$key] = $label;

        if ($key === 'cb') {
            $new_columns['peca_image'] = 'Imagem';
        }

        if ($key === 'title') {
            $new_columns['peca_code'] = 'Código';
        }
    }

    return $new_columns;
}

// Preenche as colunas personalizadas.
add_action(
    'manage_peca_posts_custom_column',
    'smart_local_peca_admin_column_content',
    10,
    2
);

function smart_local_peca_admin_column_content($column, $post_id) {
    if ($column === 'peca_image') {
        if (has_post_thumbnail($post_id)) {
            echo get_the_post_thumbnail(
                $post_id,
                array(70, 70),
                array(
                    'style' => 'width:70px;height:70px;object-fit:cover;border-radius:4px;'
                )
            );
        } else {
            echo '<span style="color:#999;">Sem imagem</span>';
        }
    }

    if ($column === 'peca_code') {
        $code = get_post_meta($post_id, 'codigo_referencia', true);

        if ($code !== '') {
            echo '<strong>' . esc_html($code) . '</strong>';
        } else {
            echo '<span style="color:#999;">—</span>';
        }
    }
}

// Estiliza as colunas.
add_action('admin_head-edit.php', 'smart_local_parts_admin_columns_style');

function smart_local_parts_admin_columns_style() {
    $screen = get_current_screen();

    if (
        !is_object($screen) ||
        $screen->post_type !== 'peca'
    ) {
        return;
    }

    echo '<style>
        .wp-list-table .column-peca_image {
            width: 90px;
        }

        .wp-list-table .column-peca_code {
            width: 140px;
        }

        .wp-list-table .column-peca_image img {
            display: block;
        }
    </style>';
}

/**
 * Pesquisa administrativa por código da peça.
 *
 * Mantém a pesquisa nativa do WordPress por título,
 * conteúdo e resumo, acrescentando codigo_referencia.
 *
 * Utiliza posts_search e EXISTS para evitar JOINs
 * desnecessários e resultados duplicados.
 */
add_filter('posts_search', 'smart_local_peca_search_by_code', 10, 2);

function smart_local_peca_search_by_code($search_sql, $query) {
    if (
        !is_admin() ||
        !$query->is_main_query() ||
        $query->get('post_type') !== 'peca'
    ) {
        return $search_sql;
    }

    $search_term = $query->get('s');

    if (
        !is_string($search_term) ||
        trim($search_term) === '' ||
        $search_sql === ''
    ) {
        return $search_sql;
    }

    global $wpdb;

    $like = '%' . $wpdb->esc_like(trim($search_term)) . '%';

    $code_sql = $wpdb->prepare(
        "EXISTS (
            SELECT 1
            FROM {$wpdb->postmeta} AS code_meta
            WHERE code_meta.post_id = {$wpdb->posts}.ID
              AND code_meta.meta_key = %s
              AND code_meta.meta_value LIKE %s
        )",
        'codigo_referencia',
        $like
    );

    // Acrescenta a busca por código à condição nativa.
    // O WP já inclui as regras de busca e permissões
    // pertinentes à consulta administrativa.
    $prefix = ' AND (';

    if (strpos($search_sql, $prefix) === 0) {
        $native_condition = substr($search_sql, strlen(' AND '));

        return ' AND (' . $native_condition . ' OR ' . $code_sql . ')';
    }

    return $search_sql;
}

/**
 * Torna a coluna Código ordenável.
 */
add_filter(
    'manage_edit-peca_sortable_columns',
    'smart_local_peca_sortable_columns'
);

function smart_local_peca_sortable_columns($columns) {
    $columns['codigo_referencia'] = 'part_code';
    return $columns;
}

/**
 * Ordena as peças pelo campo ACF codigo_referencia.
 */
add_action('pre_get_posts', 'smart_local_peca_order_by_code');

function smart_local_peca_order_by_code($query) {
    if (
        !is_admin() ||
        !$query->is_main_query() ||
        $query->get('post_type') !== 'peca'
    ) {
        return;
    }

    if ($query->get('orderby') === 'codigo_referencia') {
        $query->set('meta_key', 'codigo_referencia');
        $query->set('orderby', 'meta_value');
    }
}



/**
 * Permite que Editores utilizem o WP REST Cache.
 */
add_filter('wp_rest_cache/settings_capability', function ($capability) {
    return 'edit_posts';
});
