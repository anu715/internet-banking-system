import { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css";

function Dashboard() {

    const [user, setUser] = useState({});
    const [amount, setAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [receiverAccountNumber,
        setReceiverAccountNumber] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            window.location.href = "/login";
            return;
        }

        const email = localStorage.getItem("email");

        axios.get(
            `https://internet-banking-backend.onrender.com/api/user/${email}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
            .then((response) => {

                setUser(response.data);

                axios.get(
                    `https://internet-banking-backend.onrender.com/api/transactions/${response.data.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )  .then((res) => {
                        setTransactions(res.data);
                    });

            });

    }, []);

    const loadTransactions = async (userId) => {

        const token = localStorage.getItem("token");

        const response = await axios.get(
            `https://internet-banking-backend.onrender.com/api/transactions/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setTransactions(response.data);
    };

    const depositMoney = async () => {

        const email = localStorage.getItem("email");
        const token = localStorage.getItem("token");

        const response = await axios.post(
            `https://internet-banking-backend.onrender.com/api/deposit/${email}/${amount}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setUser(response.data);

        loadTransactions(response.data.id);

        setAmount("");
    };

    const withdrawMoney = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await axios.post(
                `https://internet-banking-backend.onrender.com/api/withdraw/${user.email}/${withdrawAmount}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(response.data);

            loadTransactions(user.id);

            setWithdrawAmount("");

            alert("Withdraw successful");

        } catch (error) {

            alert(error.response.data);
        }
    };

    const transferMoney = async () => {

        try {

            const senderEmail = localStorage.getItem("email");
            const token = localStorage.getItem("token");

            await axios.post(
                `https://internet-banking-backend.onrender.com/api/transfer?senderEmail=${senderEmail}&receiverAccountNumber=${receiverAccountNumber}&amount=${transferAmount}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const response = await axios.get(
                `https://internet-banking-backend.onrender.com/api/user/${senderEmail}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setUser(response.data);

            loadTransactions(response.data.id);

            setReceiverAccountNumber("");
            setTransferAmount("");

            alert("Transfer successful");

        } catch (error) {

            console.error(error);

            alert(error.response.data);
        }
    };

    const logout = () => {



        localStorage.removeItem("token");
        localStorage.removeItem("email");

        window.location.href = "/login";
    };

    return (

        <div className="bank-dashboard">

            <header className="dashboard-header">

                <div>
                    <h2>TrustBank</h2>
                    <p>Welcome back, {user?.name}</p>
                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </header>

            <section className="balance-card">

                <p>Total Balance</p>

                <h1>₹{user?.balance}</h1>

                <div className="account-row">

                    <div>
                        <span>Account Number</span>
                        <h3>{user?.accountNumber}</h3>
                    </div>

                    <div>
                        <span>Email</span>
                        <h3>{user?.email}</h3>
                    </div>

                </div>

            </section>

            <section className="quick-actions">

                <div className="action-card">

                    <h3>Deposit</h3>

                    <input
                        type="number"
                        placeholder="Deposit amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />

                    <button onClick={depositMoney}>
                        Deposit
                    </button>

                </div>

                <div className="action-card">

                    <h3>Withdraw</h3>

                    <input
                        type="number"
                        placeholder="Withdraw amount"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                    />

                    <button onClick={withdrawMoney}>
                        Withdraw
                    </button>

                </div>

                <div className="action-card">

                    <h3>Transfer</h3>

                    <input
                        type="text"
                        placeholder="Receiver account number"
                        value={receiverAccountNumber}
                        onChange={(e) =>
                            setReceiverAccountNumber(
                                e.target.value
                            )
                        }
                    />

                    <input
                        type="number"
                        placeholder="Transfer amount"
                        value={transferAmount}
                        onChange={(e) =>
                            setTransferAmount(
                                e.target.value
                            )
                        }
                    />

                    <button onClick={transferMoney}>
                        Transfer
                    </button>

                </div>

            </section>

            <section className="transactions-section">

                <h2>Recent Transactions</h2>

                <div className="transaction-list">

                    {transactions.map((t) => (

                        <div
                            className="transaction-item"
                            key={t.id}
                        >

                            <div>
                                <h4>{t.type}</h4>
                                <p>{t.time}</p>
                            </div>

                            <strong>
                                ₹{t.amount}
                            </strong>

                        </div>

                    ))}

                </div>

            </section>

        </div>
    );
}

export default Dashboard;