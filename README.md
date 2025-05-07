# Calori 🍃

Calori is a simple, beautiful, and customizable diet planner. It allows you to create, edit, and manage diets, meals, and foods efficiently.

## 🚀 Project Access

- **Hosted**: The project is available online and can be accessed at [Calori](https://calorii.vercel.app).
- **Locally**: You can also run the project locally with a Docker-based database.

---

## 🛠️ Local Setup

### **Prerequisites**

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### **Steps to Run Locally**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/caloricalori.git
   cd caloricalori
   ```

2. **Start the Database with Docker**
   Ensure Docker is installed and running:
   ```bash
   docker-compose up -d
   ```

3. **Install Dependencies**
   Use your preferred package manager:
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/calori"
   NEXTAUTH_URL="http://localhost:3000"
   ```

5. **Run Database Migrations**
   ```bash
   npx prisma migrate dev
   ```

6. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

7. **Access the Project**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deployment

The project is hosted on [Vercel](https://vercel.com). You can access it directly at [https://calorii.vercel.app](https://calorii.vercel.app).

---

## 🧰 Technologies Used

- **Frontend**: [Next.js](https://nextjs.org)
- **Database**: [PostgreSQL](https://www.postgresql.org) (via Docker)
- **ORM**: [Prisma](https://www.prisma.io)
- **Hosting**: [Vercel](https://vercel.com)
- **State Management**: React Context API
- **Styling**: TailwindCSS
- **Tests**: Jest (in Progress)
---

## 📚 Features

- **Diet Management**:
  - Create, edit, and duplicate diets.
  - Add multiple meals variations and foods.

- **Automatic Macro Calculation**:
  - Automatically calculates carbohydrates, proteins, fats, and calories per gram, per gram per kg, and as a percentage of total kcal.
---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
