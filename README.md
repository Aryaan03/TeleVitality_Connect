# Team_Mood_Menders

## Project Name

#### TeleVitality Connect (Go + React)

## Project Description

TeleVitality Connect is a comprehensive telemedicine platform designed to transform healthcare delivery by offering a wide range of features that connect patients and healthcare providers seamlessly. The platform aims to improve healthcare accessibility, enhance operational efficiency, and empower both patients and providers with intuitive tools.

TeleVitality Connect integrates advanced functionalities such as patient appointment scheduling, electronic health record (EHR) management, and secure video consultations powered by WebRTC, ensuring a well-rounded virtual care experience. Additionally, features like prescription tracking, billing, and payment gateway integration simplify administrative workflows, enabling providers to focus on delivering quality care.


## Team Members

- Aryaan Shaikh - am.shaikh@ufl.edu --> Front-end Role
- Swaroopa Thimmanagoundla - swaroopathimmana@ufl.edu --> Front-end Role
- Yasir Khan - y.khan@ufl.edu --> Back-end Role
- Ruchita Potamsetti - potamsetvssruchi@ufl.edu --> Back-end Role

## Features

- **User Authentication & Authorization:** Secure, role-based access for patients and doctors using JWT.
- **Profile Management:** Centralized and customizable profiles for both patients and doctors.
- **Appointment Scheduling & Management:** Easy booking, rescheduling, cancellation, and reminders for efficient time management.
- **Secure Video Consultations:** High-quality, real-time video consultations for collaborative care.
- **Password Reset with Email Verification:** Secure password reset flow using SendGrid email verification codes.
- **Book, View, and Cancel Appointments:** Includes file uploads and video links.
- **Doctor Notes & Appointment History:** Doctors can add notes to appointments; both roles can view appointment history.
- **Responsive, Accessible UI:** Modern design with accessibility and mobile-friendly layouts.
- **Comprehensive Testing:** Robust unit and end-to-end tests with Jest, React Testing Library, and Cypress.

---

## Getting Started

### Prerequisites

- Go (>=1.20)
- Node.js (>=18), npm
- PostgreSQL database
- [SendGrid account](https://sendgrid.com/) for email integration

---

### Backend Setup

1. **Configure Environment Variables**

   Create a `.env` file in the `/backend` directory:
   ```
   SENDGRID_API_KEY=your_sendgrid_api_key
   ```

2. **Install Dependencies**

   ```sh
   cd backend
   go mod tidy
   ```

3. **Run the Backend**

   ```sh
   go run main.go
   ```

---

### Frontend Setup

1. **Install Dependencies**

   ```sh
   cd frontend
   npm install
   ```

2. **Run the Frontend (Dev Mode)**

   ```sh
   npm run dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173).

---

### Running the Full Stack

- In development, run both backend and frontend servers.
- In production, build the frontend and serve static assets from the Go backend (see Vite/Go integration docs).

---

### Running Tests

#### **Backend**

```sh
cd backend
go test -v ./handlers
```

#### **Frontend Unit Tests**

```sh
cd frontend
npm test -- --watchAll=false
```

#### **Frontend E2E Tests**

```sh
cd frontend
npx cypress open
```

---

## Usage

- **Register** as a doctor or patient.
- **Login** to access your dashboard.
- **Book or manage appointments** (patients).
- **View, edit, and cancel appointments** (doctors).
- **Reset your password** via email if needed.

---

## Project Structure

```
/backend   # Go API server, handlers, models, tests
/frontend  # React (Vite) app, components, tests
```
