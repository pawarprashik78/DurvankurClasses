# Durvankar Classes — Full Stack Application

A complete digital management portal for coaching classes.

**Founded by:** Priyanka Tambat  
**Location:** Dwarka, Nashik  
**Contact:** durvankarclasses@gmail.com | +91-9325866940

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS + shadcn/ui |
| Backend | Java 17 + Spring Boot + MongoDB Atlas + JWT Auth |
| Email | Gmail SMTP (Spring Mail) |
| File Upload | Cloudinary |

---

## 📁 Project Structure

```
DurvankurClasses/
├── frontend/          # React Vite app
│   ├── client/src/
│   │   ├── pages/     # Login, Register, Dashboard, Marks, Attendance...
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
└── backend/
    └── Durvankar/     # Spring Boot app
        ├── src/main/java/com/durvankarclasses/
        └── pom.xml
```

---

## 🔐 Roles & Portals

| Role | Access |
|------|--------|
| **Admin** | Manage students, teachers, fees, all reports |
| **Teacher** | Mark attendance, upload notes, post messages |
| **Student** | View marks, attendance, notes, progress |
| **Parent** | Track child's progress, get absence alerts |

---

## 🚀 Local Setup

### Backend
```bash
cd backend/Durvankar
./mvnw spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🌐 Deployment

- **Frontend** → Netlify (root: `frontend/`, build: `npm run build`, publish: `client/dist`)
- **Backend** → Render (root: `backend/Durvankar/`, build: `./mvnw package -DskipTests`, start: `java -jar target/*.jar`)
