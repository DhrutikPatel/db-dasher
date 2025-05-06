import React, { useState, useMemo } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const sampleData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `User${i + 1}`,
  sales: Math.floor(Math.random() * 10000),
  region: ["North", "South", "East", "West"][i % 4],
  transactions: Math.floor(Math.random() * 200),
  lastActive: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toLocaleDateString(),
  isActive: Math.random() > 0.5
}));

export default function App() {
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const parseQuery = (query, item) => {
    const terms = query.toLowerCase().match(/\w+[<>:]?[^\s]+|\w+/g) || [];
    return terms.every(term => {
      if (term.includes(":")) {
        const [field, value] = term.split(":");
        return item[field]?.toString().toLowerCase().includes(value);
      } else if (term.includes(">")) {
        const [field, value] = term.split(">");
        return parseFloat(item[field]) > parseFloat(value);
      } else if (term.includes("<")) {
        const [field, value] = term.split("<");
        return parseFloat(item[field]) < parseFloat(value);
      } else {
        return Object.values(item).some(val => val.toString().toLowerCase().includes(term));
      }
    });
  };

  const filteredData = useMemo(() => {
    let data = sampleData.filter((item) => parseQuery(query, item));
    data.sort((a, b) => {
      const aField = a[sortField];
      const bField = b[sortField];
      if (aField < bField) return sortOrder === "asc" ? -1 : 1;
      if (aField > bField) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [query, sortField, sortOrder]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const pieData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
      grouped[item.region] = (grouped[item.region] || 0) + 1;
    });
    return Object.entries(grouped).map(([region, count]) => ({ name: region, value: count }));
  }, [filteredData]);

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4">User Sales and Activity Table</h2>
          <div className="mb-3 d-flex justify-content-between">
            {/* Rows per page input */}
            <div className="mb-3">
              <label className="form-label me-2">Rows per page:</label>
              <input
                type="number"
                className="form-control d-inline-block w-auto"
                value={rowsPerPage}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) {
                    setRowsPerPage(val);
                    setCurrentPage(1);
                  }
                }}
                min={1}
              />
            </div>

            {/* Download CSV Button */}
            <div className="mb-3 d-flex justify-content-end">
              <button className="btn btn-primary" onClick={() => {
                const headers = Object.keys(filteredData[0] || {});
                const csvRows = [
                  headers.join(","),
                  ...filteredData.map(row =>
                    headers.map(field => {
                      const val = row[field];
                      if (typeof val === "string" && val.includes(",")) {
                        return `"${val}"`;
                      }
                      return val;
                    }).join(",")
                  )
                ];
                const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "filtered_data.csv";
                link.click();
                URL.revokeObjectURL(url);
              }}>
                Download CSV
              </button>
            </div>
          </div>
          <div className="mb-1">
            Filter Query
            <input
              type="text"
              className="form-control"
              placeholder="Search e.g. region:North sales>5000 isActive:true"
              value={query}
              onChange={(e) => { setCurrentPage(1); setQuery(e.target.value); }}
            />
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>
                    Name <button className="btn btn-sm btn-link" onClick={() => handleSort("name")}>↕</button>
                  </th>
                  <th>
                    Sales <button className="btn btn-sm btn-link" onClick={() => handleSort("sales")}>↕</button>
                  </th>
                  <th>
                    Region <button className="btn btn-sm btn-link" onClick={() => handleSort("region")}>↕</button>
                  </th>
                  <th>
                    Transactions <button className="btn btn-sm btn-link" onClick={() => handleSort("transactions")}>↕</button>
                  </th>
                  <th>
                    Last Active <button className="btn btn-sm btn-link" onClick={() => handleSort("lastActive")}>↕</button>
                  </th>
                  <th>
                    Status <button className="btn btn-sm btn-link" onClick={() => handleSort("isActive")}>↕</button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.sales}</td>
                    <td>{item.region}</td>
                    <td>{item.transactions}</td>
                    <td>{item.lastActive}</td>
                    <td>
                      <span className={`badge bg-${item.isActive ? "success" : "secondary"}`}>
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <nav className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {paginatedData.length} of {filteredData.length} entries
            </div>
            <ul className="pagination mb-0">
              <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                  Previous
                </button>
              </li>
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
              <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
                  Next
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4 mb-4">Top 10 Sales Bar Chart</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={filteredData.slice(0, 10)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#007bff" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-body">
          <h2 className="card-title h4 mb-4">Transactions Over Users (Line Chart)</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <LineChart data={filteredData.slice(0, 20)}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="transactions" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title h4 mb-4">Users by Region (Pie Chart)</h2>
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
