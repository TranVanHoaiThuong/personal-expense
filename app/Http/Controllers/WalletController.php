<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class WalletController extends Controller
{
    public function store(Request $request) {
        $validation = Validator::make($request->all(), [
            'amount' => 'required|numeric|min:0',
        ]);

        if($validation->fails()) {
            return back()->withErrors($validation);
        }

        $wallet = new Wallet();
        $wallet->user_id = auth()->user()->id;
        $wallet->amount = $request->amount;
        $wallet->save();

        return redirect()->back()->with([
            'wallet' => $wallet,
            'success' => 'Setup wallet successfully'
        ]);
    }
}
