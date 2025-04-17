<?php

namespace App\Http\Controllers\Expenses;

use App\Http\Controllers\Controller;
use App\Models\ExpenseCategory;
use App\Services\PaginationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    private $paginationService;
    public function __construct(PaginationService $paginationService) {
        $this->paginationService = $paginationService;
    }

    public function getTableData(Request $request) {
        $categories = ExpenseCategory::query()
            ->where(function($q) {
                $q->where('user_id', auth()->id());
                $q->orWhere('user_id', 0);
            })
            ->when($request->search, function($query, $search) {
                $query->where('name', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10));
        
        $data = [];
        foreach($categories->items() as $category) {
            $data[] = [
                'id' => $category->id,
                'name' => $category->name,
                'user_id' => $category->user_id,
                'description' => $category->description,
                'icon' => $this->getCategoryIconUrl($category),
                'created_at' => $category->created_at,
                'updated_at' => $category->updated_at,
            ];
        }
        return response()->json($this->paginationService->formatResponse($categories, $data));
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'file' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:1024',
        ]);
        if($request->id) {
            $expenseCategory = ExpenseCategory::find($request->id);
            $expenseCategory->name = $request->name;
            $expenseCategory->description = $request->description;
            $expenseCategory->save();
        } else {
            $expenseCategory = new ExpenseCategory();
            $expenseCategory->name = $request->name;
            $expenseCategory->description = $request->description;
            $expenseCategory->user_id = auth()->id();
            $expenseCategory->save();
        }

        if($request->hasFile('file')) {
            try {
                $iconFile = $request->file('file');
                $fileName = $iconFile->getClientOriginalName();
                $filePath = 'uploads/expense/category/icons/' . $expenseCategory->id;
                if (!Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->makeDirectory($filePath);
                }
                if ($expenseCategory->icon) {
                    $oldFilePath = $filePath . '/' . $expenseCategory->icon;
                    if (Storage::disk('public')->exists($oldFilePath)) {
                        Storage::disk('public')->delete($oldFilePath);
                    }
                }
                Storage::disk('public')->putFileAs($filePath, $iconFile, $fileName);
                $expenseCategory->icon = $fileName;
                $expenseCategory->save();
            } catch (\Exception $e) {
                $expenseCategory->delete();
                throw $e;
            }
        }
        return response()->json(['success' => true, 'message' => __('expenses.category_created')]);
    }

    private function getCategoryIconUrl(ExpenseCategory $category): string {
        // Default fallback icon
        $fallbackIcon = asset('images/defaults/categories.png');

        if (!$category->icon) {
            return $fallbackIcon;
        }

        if ($category->user_id === 0) {
            return asset('/images/defaults/' . $category->icon);
        }

        // User uploaded icons
        $path = 'uploads/expense/category/icons/' . $category->id . '/' . $category->icon;
        return Storage::disk('public')->exists($path)
            ? Storage::disk('public')->url($path)
            : $fallbackIcon;
    }

    public function destroy($id) {
        $category = ExpenseCategory::find($id);
        DB::beginTransaction();
        try {
            if($category->icon) {
                $filePath = 'uploads/expense/category/icons/' . $category->id;
                if (Storage::disk('public')->exists($filePath)) {
                    Storage::disk('public')->deleteDirectory($filePath);
                }
            }
            $category->delete();
            DB::commit();
            return response()->json(['success' => true, 'message' => __('expenses.category_deleted')]);
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json(['success' => false, 'message' => __('expenses.category_delete_failed', ['message' => $th->getMessage()])]);
        }
    }
}
