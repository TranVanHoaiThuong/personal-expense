<?php

return [
    'required' => 'Trường :attribute không được để trống.',
    'string' => 'Trường :attribute phải là một chuỗi ký tự.',
    'max' => [
        'string' => 'Trường :attribute không được vượt quá :max ký tự.',
        'file' => 'Trường :attribute không được vượt quá :max kilobytes.',
    ],
    'image' => 'Trường :attribute phải là một hình ảnh.',
    'mimes' => 'Trường :attribute phải là một tệp thuộc loại: :values.',
    'email' => 'Trường :attribute phải là một địa chỉ email hợp lệ.',
    'unique' => 'Trường :attribute đã tồn tại trong hệ thống.',
    'confirmed' => 'Xác nhận :attribute không khớp.',
    'min' => [
        'string' => 'Trường :attribute phải có ít nhất :min ký tự.',
        'numeric' => 'Trường :attribute phải lớn hơn hoặc bằng :min.',
        'file' => 'Trường :attribute phải lớn hơn :min kilobytes.',
    ],
    'numeric' => 'Trường :attribute phải là một số.',
    'date' => 'Trường :attribute phải là một ngày hợp lệ.',
    'after' => 'Trường :attribute phải là một ngày sau ngày :date.',
    'before' => 'Trường :attribute phải là một ngày trước ngày :date.',
];