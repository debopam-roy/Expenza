import React, { useState, useEffect } from 'react';
import TransactionCard from '../components/TransactionCard';
import { useQuery, useMutation } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query';
import { CREATE_TRANSACTION } from '../graphql/mutations/transaction.mutation';
import toast from 'react-hot-toast';

const Home = () => {
    const [email, setEmail] = useState('');
    const [transactions, setTransactions] = useState([]);
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState('Card');
    const [category, setCategory] = useState('Savings');
    const [amount, setAmount] = useState('');
    const [location, setLocation] = useState('');
    const [date, setDate] = useState('');

    const { loading, error, data } = useQuery(GET_TRANSACTIONS);
    const [createTransaction, { tr_loading, tr_error, tr_data }] =
        useMutation(CREATE_TRANSACTION);

    useEffect(() => {
        if (data && data.fetchTransactions) {
            setTransactions(data.fetchTransactions);
        }
    }, [data]);

    const handleTransactionSubmit = async (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            toast.error('User not logged in');
        }

        try {
            const response = await createTransaction({
                variables: {
                    transactionDetails: {
                        amount: parseFloat(amount),
                        description,
                        mode,
                        category,
                        date,
                        location,
                    },
                },
                context: {
                    headers: {
                        Authorization: `Bearer ${accessToken}`, // Set the access token in headers
                    },
                },
            });
            if (response && response.data) {
                toast.success('Transaction submitted successfully');
                // Reset form fields
                setDescription('');
                setMode('Card');
                setCategory('Savings');
                setAmount('');
                setLocation('');
                setDate('');
            } else {
                toast.error('Transaction submission failed');
            }
        } catch (err) {
            console.error('Error during transaction submission:', err);
            toast.error('Transaction submission failed');
        }
    };

    const handleEdit = (updatedTransaction) => {
        setTransactions(
            transactions.map((item) =>
                item.t_id === updatedTransaction.t_id
                    ? updatedTransaction
                    : item
            )
        );
    };

    const handleDelete = async (id) => {
        try {
            setTransactions(
                transactions.filter((transaction) => transaction.t_id !== id)
            );
        } catch (err) {
            console.error('Failed to delete transaction', err);
        }
    };

    return (
        <div className="">
            {/* Transaction Form */}
            <div className="flex flex-col md:flex-row py-4 px-4">
                <div className="flex-1">Left side chart</div>
                <div className="flex-1">
                    <div className="min-h-screen flex items-center justify-center">
                        <div
                            id="cardContainer"
                            className="p-8 bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark rounded-lg shadow-lg sm:w-full sm:max-w-md"
                        >
                            <form
                                id="transaction_form"
                                className="space-y-10"
                                onSubmit={handleTransactionSubmit}
                            >
                                <div className="flex flex-col mt-8 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="transaction_desc"
                                            className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                        >
                                            Description
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="transaction_desc"
                                            value={description}
                                            onChange={(e) =>
                                                setDescription(e.target.value)
                                            }
                                            placeholder="Ex: Rent, Groceries, Salary, etc."
                                            className="w-full mt-1 px-4 py-2 bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2 text-suggestionColor-light dark:text-suggestionColor-dark focus:ring-textInputRingColor-light dark:focus:ring-textInputRingColor-dark"
                                        />
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="w-1/3">
                                            <label
                                                htmlFor="payment_mode"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Mode
                                            </label>
                                            <select
                                                id="payment_mode"
                                                value={mode}
                                                onChange={(e) =>
                                                    setMode(e.target.value)
                                                }
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            >
                                                <option>Card</option>
                                                <option>Cash</option>
                                                <option>UPI</option>
                                            </select>
                                        </div>

                                        <div className="w-1/3">
                                            <label
                                                htmlFor="payment_category"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="payment_category"
                                                value={category}
                                                onChange={(e) =>
                                                    setCategory(e.target.value)
                                                }
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            >
                                                <option>Savings</option>
                                                <option>Investment</option>
                                                <option>Expense</option>
                                            </select>
                                        </div>

                                        <div className="w-1/3">
                                            <label
                                                htmlFor="money_input"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Amount
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                id="money_input"
                                                value={amount}
                                                onChange={(e) =>
                                                    setAmount(e.target.value)
                                                }
                                                placeholder="₹ 450.50"
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <div className="w-1/2">
                                            <label
                                                htmlFor="location"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                value={location}
                                                onChange={(e) =>
                                                    setLocation(e.target.value)
                                                }
                                                placeholder="Enter location"
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label
                                                htmlFor="transaction_date"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="transaction_date"
                                                value={date}
                                                onChange={(e) =>
                                                    setDate(e.target.value)
                                                }
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    id="submit-button"
                                    type="submit"
                                    className="w-full py-3 bg-buttonColor-light dark:bg-buttonColor-light uppercase hover:bg-buttonHoverColor-light dark:hover:bg-buttonHoverColor-dark cursor-pointer font-semibold rounded-md shadow-md transition duration-300 text-headlineColor-dark"
                                >
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Render transactions */}
            <div className="flex justify-center items-start">
                <ul className="flex flex-wrap justify-center gap-0.5 md:gap-2 w-full">
                    {transactions.map((transaction) => (
                        <TransactionCard
                            key={transaction.t_id}
                            {...transaction}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Home;
