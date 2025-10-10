<?php

if (!function_exists('__paginate')) {
    /**
     * Get pagination parameters from request
     * 
     * @return array [perPage, columns, pageName, page]
     */
    function __paginate($request): array
    {
        $pageSize = $request->input('page.pageSize', 10);
        $currentPage = $request->input('page.currentPage', 1);

        return [
            $pageSize,       // perPage
            ['*'],           // columns
            'page',          // pageName
            $currentPage     // page
        ];
    }
}
