import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Admin.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";



function Admin() {

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [transactions, setTransactions] = useState([]);

    const navigate = useNavigate();
    const [auditLogs, setAuditLogs] = useState([]);

    useEffect(() => {

        const role = localStorage.getItem("role");
        const token = localStorage.getItem("token");

        if (role !== "ADMIN") {
            alert("Access denied");
            navigate("/dashboard");
            return;
        }

        axios.get(
            "https://internet-banking-backend.onrender.com/api/users",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {
            setUsers(response.data);
        });

        axios.get(
            "https://internet-banking-backend.onrender.com/api/transactions",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {
            setTransactions(response.data);
        });

        axios.get(
            "https://internet-banking-backend.onrender.com/api/audit-logs",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {
            setAuditLogs(response.data);
        });

    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const totalUsers = users.length;

    const totalBalance = users.reduce(
        (sum, user) => sum + user.balance,
        0
    );
    const chartData = [
        {
            name: "Deposit",
            count: transactions.filter(
                (t) => t.type === "DEPOSIT"
            ).length
        },
        {
            name: "Withdraw",
            count: transactions.filter(
                (t) => t.type === "WITHDRAW"
            ).length
        },
        {
            name: "Transfer",
            count: transactions.filter(
                (t) => t.type === "TRANSFER"
            ).length
        }
    ];
    const freezeUser = async (userId) => {

        const token = localStorage.getItem("token");

        await axios.post(
            `https://internet-banking-backend.onrender.com/api/freeze/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const response = await axios.get(
            "https://internet-banking-backend.onrender.com/api/users",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setUsers(response.data);
    };

    const unfreezeUser = async (userId) => {

        const token = localStorage.getItem("token");

        await axios.post(
            `https://internet-banking-backend.onrender.com/api/unfreeze/${userId}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const response = await axios.get(
            "https://internet-banking-backend.onrender.com/api/users",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setUsers(response.data);
    };

    return (
        <div className="admin-page">

            <header className="admin-header">
                <div>
                    <h1>TrustBank</h1>
                    <p>Admin Panel</p>
                </div>

                <button onClick={() => window.location.href = "/dashboard"}>
                    Dashboard
                </button>
            </header>

            <section className="admin-stats">

                <div className="stat-card">
                    <span>Total Users</span>
                    <h2>{totalUsers}</h2>
                </div>

                <div className="stat-card">
                    <span>Total Bank Balance</span>
                    <h2>₹{totalBalance}</h2>
                </div>

                <div className="stat-card alert-card">
                    <span>System Status</span>
                    <h2>Active</h2>
                </div>

            </section>

            <section className="admin-chart-section">

                <h2>Transaction Analytics</h2>

                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>

            </section>

            <section className="admin-table-section">

                <div className="table-header">
                    <h2>User Management</h2>

                    <input
                        type="text"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <table>
                    <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Account Number</th>
                        <th>Balance</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <div className="user-profile">
                                    <div className="avatar">
                                        {user.name.charAt(0)}
                                    </div>
                                    <span>{user.name}</span>
                                </div>
                            </td>

                            <td>{user.email}</td>


                            <td>{user.accountNumber || "Old Account"}</td>

                            <td>₹{user.balance}</td>

                            <td>
    <span
        style={{
            color: "black",
            fontWeight: "bold"
        }}
    >
        {user.accountStatus}
    </span>
                            </td>

                            <td>
                                {user.accountStatus === "FROZEN" ? (
                                    <button onClick={() => unfreezeUser(user.id)}>
                                        Unfreeze
                                    </button>
                                ) : (
                                    <button onClick={() => freezeUser(user.id)}>
                                        Freeze
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </section>

            <section className="admin-table-section">

                <h2>Audit Logs</h2>

                <table>
                    <thead>
                    <tr>
                        <th>Action</th>
                        <th>Email</th>
                        <th>Details</th>
                        <th>Time</th>
                    </tr>
                    </thead>

                    <tbody>
                    {auditLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.action}</td>
                            <td>{log.email}</td>
                            <td>{log.details}</td>
                            <td>{log.time}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </section>

        </div>
    );
}

export default Admin;