<?php

namespace App\Services;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class PaginationService
{
    public static function getPaginationData(LengthAwarePaginator $paginator): array
    {
        return [
            'total' => $paginator->total(),
            'page_size' => $paginator->perPage(),
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'from' => $paginator->firstItem(),
            'to' => $paginator->lastItem(),
        ];
    }

    public static function formatResponse(LengthAwarePaginator $paginator, array $data = null): array
    {
        return [
            'data' => $data ?? $paginator->items(),
            'pagination' => self::getPaginationData($paginator)
        ];
    }
}