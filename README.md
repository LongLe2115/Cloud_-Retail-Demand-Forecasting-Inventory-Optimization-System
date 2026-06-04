# Retail Forecast App

## 1. Gioi thieu du an

Retail Forecast App la ung dung full-stack phuc vu bo phan van hanh ban le theo doi nhu cau du bao, de xuat nhap hang va ra quyet dinh ton kho nhanh hon. Ung dung su dung du lieu da duoc xu ly san tren Databricks SQL Warehouse, khong can thay doi bat ky pipeline ML hay Spark nao.

## 2. Kien truc he thong

- **Frontend (React + Vite + Tailwind):** Hien thi dashboard, bang loc du lieu, bieu do phan tich.
- **Backend (FastAPI):** Cung cap API tong hop KPI, du lieu reorder va xu huong du bao.
- **Databricks SQL Warehouse:** Nguon du lieu duy nhat qua bang `duanck.ckcloud.reorder_output`.
- **Docker Compose:** Dong goi va chay dong thoi frontend + backend.

## 3. Cong nghe su dung

- **Backend:** FastAPI, databricks-sql-connector, python-dotenv
- **Frontend:** React, Vite, Tailwind CSS, Axios, Recharts
- **Deploy:** Docker, Docker Compose

## 4. Tinh nang chinh

- Trang **Dashboard**:
  - Tong ban ghi
  - Tong can nhap hang
  - Nhu cau trung binh
  - So cua hang
  - Bieu do xu huong nhu cau va doanh so
  - Bieu do tong reorder theo hanh dong
- Trang **Trung tam nhap hang**:
  - Bang 100 ban ghi moi nhat
  - Tim kiem/loc theo `store_id`, `action`, `product`
- Trang **Phan tich du bao**:
  - Predicted demand trend
  - Sales vs predicted
  - Top products theo nhu cau du bao

## 5. Cau truc thu muc

```text
retail-forecast-app/
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── db.py
│   │   └── routes/
│   │       ├── stats.py
│   │       ├── reorder.py
│   │       └── forecast.py
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reorder.jsx
│   │   │   └── Forecast.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── ReorderTable.jsx
│   │   │   └── DemandChart.jsx
│   │   └── index.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── README.md
└── .gitignore
```

## 6. Huong dan cai dat va chay du an

Neu ban muon ban huong dan chi tiet hon theo tung buoc (kèm troubleshooting), xem them file `run.md`.

### Yeu cau truoc khi chay

- **Python 3.11** (khuyen dung, giong moi truong Docker). Tranh dung Python 3.13 vi de bi loi khi cai `numpy/databricks-sql-connector` tren Windows.
- **Node.js LTS (>= 18)** de chay frontend.
- **Docker Desktop** (neu chay bang Docker Compose).

### Luu y quan trong ve .env / token

- File `backend/.env` chua token Databricks. **Khong commit len GitHub**.
- Repo da co san `backend/.env.example` de chia se mau cau hinh.

### Backend

Chay tren Windows PowerShell tai thu muc `backend`:

```powershell
cd "D:\Cloud cuối kì\retail-forecast-app\backend"

# (Tuy chon) Xoa venv cu neu can lam sach
Remove-Item -Recurse -Force .venv -ErrorAction SilentlyContinue

# Tao venv bang Python 3.11
py -3.11 -m venv .venv

# Kich hoat venv
& .venv\Scripts\Activate.ps1

# Cai dependencies
python -m pip install -U pip
pip install -r requirements.txt

# Chay server
uvicorn app.main:app --reload --port 8000
```

### Frontend

Mo 1 terminal moi, chay tai thu muc `frontend`:

```powershell
cd "D:\Cloud cuối kì\retail-forecast-app\frontend"
npm install
npm run dev
```

Mo trinh duyet tai:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 7. Huong dan Docker

Tai thu muc goc du an:

```powershell
docker compose up --build
```

Truy cap:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health check: [http://localhost:8000/health](http://localhost:8000/health)

Dung he thong:

```powershell
docker compose down
```

## 8. Ket noi Databricks

Ung dung doc bien moi truong trong `backend/.env`:

```env
DATABRICKS_HOST=tu them
DATABRICKS_HTTP_PATH=tu them
DATABRICKS_TOKEN=tu them
DATABRICKS_TABLE=tu them
```

Luu y:

- `DATABRICKS_TABLE` la ten **day du** theo dang `catalog.schema.table_or_view`.
- Neu vao dashboard bi loi `TABLE_OR_VIEW_NOT_FOUND`, hay cap nhat `DATABRICKS_TABLE` theo dung ten bang/view ban thay tren Databricks.

Bang du lieu su dung (application layer chi query du lieu, khong tao pipeline moi):

- `duanck.ckcloud.reorder_output`

## 9. Screenshot placeholders

- `docs/screenshots/dashboard-overview.png`
- `docs/screenshots/reorder-center.png`
- `docs/screenshots/forecast-analysis.png`
- `docs/screenshots/mobile-responsive.png`

## 10. Gia tri portfolio khi xin viec

- The hien kha nang tich hop he thong Data/ML da co san vao ung dung kinh doanh thuc te.
- Chung minh tu duy full-stack: API, UI, trinh bay KPI, truy van SQL Warehouse.
- Co kha nang dong goi va trien khai bang Docker de demo nhanh cho nha tuyen dung.
- Du an sat bai toan van hanh chuoi ban le: ton kho, du bao, quyet dinh nhap hang.
