# 🎟️ Mini Helpdesk  
A lightweight Helpdesk system built with **Laravel** and **Angular**.

---

## ⚙️ Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/imadelcass/mini-helpdesk
cd mini-helpdesk


cd backend
composer install
cp .env.example .env
php artisan key:generate


php artisan migrate --seed
php artisan serve


cd ../frontend
npm install
ng serve
