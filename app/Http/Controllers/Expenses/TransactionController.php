<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\PaginationService;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    private $paginationService;
    public function __construct(PaginationService $paginationService) {
        $this->paginationService = $paginationService;
    }

    public function getTableData(Request $request) {
        $transactions = Transaction::latest()->paginate($request->input('per_page', 10));
        return response()->json($this->paginationService->formatResponse($transactions, []));
    }
}
