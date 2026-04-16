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

## 6. Huong dan chay local

### Backend

```bash
cd backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Mo trinh duyet tai:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend docs: [http://localhost:8000/docs](http://localhost:8000/docs)

## 7. Huong dan Docker

Tai thu muc goc du an:

```bash
docker compose up --build
```

Truy cap:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend health check: [http://localhost:8000/health](http://localhost:8000/health)

Dung he thong:

```bash
docker compose down
```

## 8. Ket noi Databricks

Ung dung doc bien moi truong trong `backend/.env`:

```env
DATABRICKS_HOST=dbc-77dd6648-56bb.cloud.databricks.com
DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/71873e4747976257
DATABRICKS_TOKEN=<your_databricks_token>
DATABRICKS_TABLE=duanck.ckcloud.reorder_output
```

Bang du lieu su dung duy nhat:

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
