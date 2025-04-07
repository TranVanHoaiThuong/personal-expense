# Personal Expense Management

Ứng dụng quản lý chi tiêu cá nhân được xây dựng trên nền tảng Laravel và React.

## Yêu cầu hệ thống

- PHP >= 8.2
- Composer
- Node.js >= 18
- NPM hoặc Yarn
- SQLite hoặc MySQL/PostgreSQL (tùy chọn)

## Cài đặt

### 1. Clone dự án

```bash
git clone <repository-url> personal-expense
cd personal-expense
```

### 2. Cài đặt các gói PHP thông qua Composer

```bash
composer install
```

### 3. Cài đặt các gói JavaScript thông qua NPM

```bash
npm install
```

### 4. Thiết lập môi trường

Sao chép file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Tạo khóa ứng dụng:

```bash
php artisan key:generate
```

### 5. Cấu hình cơ sở dữ liệu

Mặc định, ứng dụng sử dụng SQLite. Nếu bạn muốn sử dụng SQLite:

```bash
touch database/database.sqlite
```

Nếu bạn muốn sử dụng MySQL hoặc PostgreSQL, hãy cập nhật thông tin kết nối trong file `.env`:

```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=personal_expense
DB_USERNAME=root
DB_PASSWORD=
```

### 6. Chạy migration để tạo cấu trúc cơ sở dữ liệu

```bash
php artisan migrate
```

### 7. Chạy seeder để tạo dữ liệu mẫu

```bash
php artisan db:seed
```

Sau khi chạy seeder, hệ thống sẽ tạo sẵn các tài khoản sau:

- Admin:
  - Email: admin@example.com
  - Username: admin
  - Password: 123

- Manual User:
  - Email: manualuser@example.com
  - Username: manualuser
  - Password: 123

### 8. Liên kết thư mục storage

```bash
php artisan storage:link
```

## Chạy ứng dụng

### Môi trường phát triển

Bạn có thể chạy ứng dụng bằng lệnh:

```bash
composer dev
```

Lệnh này sẽ khởi động đồng thời:
- PHP server (Laravel)
- Queue listener
- Log watcher
- Vite dev server (React)

Hoặc bạn có thể chạy từng dịch vụ riêng biệt:

```bash
# Khởi động Laravel server
php artisan serve

# Khởi động Vite dev server
npm run dev
```

Sau đó, truy cập ứng dụng tại: http://localhost:8000

### Môi trường sản xuất

Để build ứng dụng cho môi trường sản xuất:

```bash
npm run build
```

## Cấu trúc dự án

- `app/` - Chứa mã nguồn PHP của ứng dụng Laravel
- `resources/js/` - Chứa mã nguồn React
- `resources/css/` - Chứa các file CSS
- `database/migrations/` - Chứa các migration để tạo cấu trúc cơ sở dữ liệu
- `database/seeders/` - Chứa các seeder để tạo dữ liệu mẫu
- `routes/` - Chứa các định nghĩa route

## Tính năng

- Đăng nhập/Đăng ký
- Quản lý chi tiêu
- Phân quyền người dùng
- Giao diện thân thiện với người dùng
- Responsive design

## Công nghệ sử dụng

- **Backend**:
  - Laravel 12
  - Inertia.js
  - Spatie Laravel Permission (phân quyền)

- **Frontend**:
  - React 19
  - TypeScript
  - Tailwind CSS
  - Lucide Icons
  - Radix UI

## Phát triển

### Linting và Formatting

Để kiểm tra và sửa lỗi code style:

```bash
# PHP
vendor/bin/pint

# JavaScript/TypeScript
npm run lint
npm run format
```

### Kiểm tra TypeScript

```bash
npm run types
```

## Giấy phép

Dự án này được phân phối dưới giấy phép MIT.
