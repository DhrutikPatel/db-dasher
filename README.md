# 📊 Table Visualization App

This project is a responsive, interactive React-based dashboard that allows users to view, filter, sort, and analyze tabular data with integrated chart visualizations.

---

## 🚀 Features

### ✅ Data Table
- **Complex Filtering** using dynamic queries (`region:North sales>5000 isActive:true`)
- **Column-wise Sorting** via inline sort buttons
- **Pagination** with user-defined rows per page (including custom integer input)
- **CSV Download** of currently filtered and paginated data

### 📊 Chart Visualizations
- **Bar Chart** for top sales
- **Line Chart** for transactions
- **Pie Chart** for users by region
- Real-time updates based on filtered data

### 💄 UI/UX
- **Bootstrap** styling for clean, responsive layout
- Query filter, row count input, and CSV download are aligned inline for intuitive use

---

## ⚙️ Tech Stack

- **React** (Functional Components with Hooks)
- **Bootstrap** (Layout and styling)
- **Recharts** (Charts and graphs)
- **JavaScript** (Core logic for filtering, sorting, pagination)

---

## 🧠 Implementation Notes

- **Dynamic Query Parser**: The search box supports structured filters like `sales>1000`, `region:West`, or `isActive:true`.
- **Sorting**: Triggered per column using buttons beside headers.
- **Pagination**: Manual page selection with custom row count input, all handled in memory.
- **Data Generation**: Mock data is generated dynamically to simulate large dataset behavior.
- **CSV Export**: Dynamically creates downloadable CSV of the filtered table view.

---

## 📦 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/DhrutikPatel/db-dasher
   cd db-dasher
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm start
   ```

---

## 🔗 Deployment

I have deployed this app on:
- [Render](https://render.com/)