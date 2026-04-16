# Huong dan chay Retail Forecast App

Tai lieu nay huong dan chay du an `retail-forecast-app` theo 2 cach:

1. Chay bang Docker (de va nhanh nhat)
2. Chay local thu cong (backend + frontend)

---

## 1) Chay bang Docker (khuyen dung)

### Yeu cau

- Da cai Docker Desktop
- Docker daemon dang chay

### Cac buoc

Mo terminal tai thu muc goc du an `retail-forecast-app`, chay:

```bash
docker compose up --build
```

Sau khi build xong, truy cap:

- Frontend: <http://localhost:3000>
- Backend docs: <http://localhost:8000/docs>
- Health check: <http://localhost:8000/health>

Dung he thong:

```bash
docker compose down
```

---

## 2) Chay local thu cong

### 2.1 Chay Backend (FastAPI)

Tai terminal 1:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend se chay tai:

- <http://localhost:8000>
- Swagger docs: <http://localhost:8000/docs>

### 2.2 Chay Frontend (React + Vite)

Tai terminal 2:

```powershell
cd frontend
npm install
npm run dev
```

Frontend se chay tai:

- <http://localhost:3000>

---

## 3) Cau hinh Databricks bat buoc

File `backend/.env` phai co day du:

```env
DATABRICKS_HOST=dbc-77dd6648-56bb.cloud.databricks.com
DATABRICKS_HTTP_PATH=/sql/1.0/warehouses/71873e4747976257
DATABRICKS_TOKEN=your_databricks_token
```

Luu y:

- Khong commit token that su len GitHub.
- Bang du lieu duoc su dung: `duanck.ckcloud.reorder_output`.

---

## 4) Kiem tra nhanh API

Sau khi backend chay, co the test:

- `GET /health`
- `GET /api/stats`
- `GET /api/reorder`
- `GET /api/forecast`

Bang trinh duyet:

- <http://localhost:8000/health>
- <http://localhost:8000/api/stats>

---

## 5) Loi thuong gap va cach xu ly

### Loi: `npm is not recognized`

Nguyen nhan: Chua cai Node.js hoac chua vao PATH.

Cach xu ly:

1. Cai Node.js LTS tai <https://nodejs.org>
2. Mo lai terminal
3. Kiem tra:

```powershell
node -v
npm -v
```

### Loi: Khong ket noi duoc Databricks

- Kiem tra lai 3 bien trong `backend/.env`
- Dam bao token con han
- Dam bao SQL Warehouse dang hoat dong

### Loi CORS / frontend khong goi duoc API

- Neu chay local: backend phai chay cong `8000`
- Neu chay docker: dung `docker compose up --build` va truy cap frontend cong `3000`

---

## 6) Lenh nhanh hay dung

```powershell
# Docker
docker compose up --build
docker compose down

# Backend local
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000

# Frontend local
cd frontend
npm run dev
```
