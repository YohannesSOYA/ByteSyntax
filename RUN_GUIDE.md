# How to Run ByteSyntax

This guide provides instructions on how to start both the Backend and Frontend of the project.

## 1. Backend (FastAPI)

The backend is built with FastAPI.

**Preparation:**
1. Open a terminal and navigate to the `Backend` directory:
   ```powershell
   cd Backend
   ```
2. Ensure your virtual environment is active. If you haven't created one, you can do so with:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```
3. Install the required dependencies:
   ```powershell
   pip install -r requirements.txt
   ```

**Running the Server:**
Run the following command to start the backend with auto-reload enabled:
```powershell
uvicorn main:app --reload
```
- **API URL:** `http://127.0.0.1:8000`
- **Interactive Documentation (Swagger):** `http://127.0.0.1:8000/docs`

---

## 2. Frontend (Vite + React)

The frontend is a React application powered by Vite.

**Preparation:**
1. Open a second terminal and navigate to the `Frontend` directory:
   ```powershell
   cd Frontend
   ```
2. Install the node dependencies:
   ```powershell
   npm install
   ```

**Running the Development Server:**
Run the following command to start the frontend:
```powershell
npm run dev
```
- **Frontend URL:** Usually `http://localhost:5173` (check the terminal output for the exact URL).

---

## Serving Frontend via Backend (Alternative)
The backend `main.py` is configured to serve the frontend as static files at:
- `http://127.0.0.1:8000/frontend/dashboard-demo.html`
- `http://127.0.0.1:8000/frontend/index.html` (if available)
