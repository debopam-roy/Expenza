import React, { useEffect, useState, useRef } from 'react';
import TransactionCard from '../components/TransactionCard';
import Navbar from '../components/Navbar';
import { useMutation, useQuery } from '@apollo/client';
import { GET_TRANSACTIONS } from '../graphql/queries/transaction.query';
import {
    CREATE_TRANSACTION,
    UPDATE_TRANSACTION,
    DELETE_TRANSACTION,
} from '../graphql/mutations/transaction.mutation';
import toast from 'react-hot-toast';
import Lottie from 'lottie-react';
import empty_list_dark from '../assets/empty_list_dark.json';
import empty_list_light from '../assets/empty_list_light.json';
import {
    AiOutlineSortAscending,
    AiOutlineSortDescending,
} from 'react-icons/ai';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);

const Home = () => {
    const formRef = useRef(null);
    const cardsRef = useRef(null);

    const [transactions, setTransactions] = useState([]);
    const [transactionForm, setTransactionForm] = useState({
        description: '',
        mode: 'Card',
        category: 'Savings',
        amount: '',
        location: '',
        date: '',
        transactionId: '',
    });
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: '₹',
                data: [],
                backgroundColor: [],
                borderColor: [],
                borderWidth: 1,
                borderRadius: 50,
                spacing: 3,
                cutout: '90%',
                radius: '50%',
            },
        ],
    });
    const chartOptions = {
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    boxWidth: 25,
                    padding: 15,
                    color: '#FFF',
                    fontSize: '300px',
                },
            },
        },
    };
    const [buttonLabel, setButtonLabel] = useState('Submit');

    // Queries and Mutations

    const { loading: transactionsLoading, data: transactionsData } =
        useQuery(GET_TRANSACTIONS);
    const [createTransaction] = useMutation(CREATE_TRANSACTION);
    const [updateTransaction] = useMutation(UPDATE_TRANSACTION);
    const [deleteTransaction] = useMutation(DELETE_TRANSACTION);

    useEffect(() => {
        if (transactionsData && transactionsData.fetchTransactions) {
            setTransactions(transactionsData.fetchTransactions);
        }
    }, [transactionsData]);

    // Update chart data when transactions change
    useEffect(() => {
        if (transactions.length > 0) {
            const categorySums = transactions.reduce((acc, transaction) => {
                const { category, amount } = transaction;
                acc[category] = (acc[category] || 0) + amount;
                return acc;
            }, {});

            const categories = Object.keys(categorySums);
            const amounts = Object.values(categorySums);
            const backgroundColors = categories.map((category) => {
                switch (category) {
                    case 'Savings':
                        return 'rgba(75, 192, 192)';
                    case 'Expense':
                        return 'rgba(255, 99, 132)';
                    case 'Investment':
                        return 'rgba(54, 162, 235)';
                    default:
                        return 'rgba(0, 0, 0, 0.5)'; // Fallback color
                }
            });

            setChartData({
                labels: categories,
                datasets: [
                    {
                        label: '₹',
                        data: amounts,
                        backgroundColor: backgroundColors,
                        borderColor: backgroundColors,
                    },
                ],
            });
        }
    }, [transactions]);

    // Reset form
    const resetForm = () => {
        setTransactionForm({
            description: '',
            mode: 'Card',
            category: 'Savings',
            amount: '',
            location: '',
            date: '',
            transactionId: '',
        });
        setButtonLabel('Submit');
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setTransactionForm((prevForm) => ({
            ...prevForm,
            [id]: value,
        }));
    };

    // Handle form submission (Create/Update)
    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const {
            description,
            mode,
            category,
            amount,
            location,
            date,
            transactionId,
        } = transactionForm;

        if (isNaN(amount) || parseFloat(amount) <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            if (buttonLabel === 'Submit') {
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
                });

                if (response?.data) {
                    const newTransaction = response.data.createTransaction;
                    setTransactions((prevTransactions) => [
                        ...prevTransactions,
                        { ...newTransaction, date },
                    ]);
                    resetForm();
                    toast.success('Transaction submitted successfully');
                    cardsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (buttonLabel === 'Update') {
                const response = await updateTransaction({
                    variables: {
                        transactionDetails: {
                            transaction_id: transactionId,
                            amount: parseFloat(amount),
                            category,
                            date,
                            description,
                            location,
                            mode,
                        },
                    },
                });

                if (response?.data) {
                    setTransactions((prevTransactions) =>
                        prevTransactions.map((transaction) =>
                            transaction._id === transactionId
                                ? {
                                      ...transaction,
                                      amount: parseFloat(amount),
                                      category,
                                      description,
                                      location,
                                      date,
                                  }
                                : transaction
                        )
                    );
                    resetForm();
                    toast.success('Transaction updated successfully');
                    cardsRef.current?.scrollIntoView({ behavior: 'smooth' });
                }
            }
        } catch (err) {
            console.error(
                `Error during transaction ${buttonLabel.toLowerCase()}:`,
                err
            );
            toast.error(`Transaction ${buttonLabel.toLowerCase()} failed`);
        }
    };

    // Handle transaction editing
    const handleEdit = (transaction) => {
        setTransactionForm({
            description: transaction.description,
            mode: transaction.mode,
            category: transaction.category,
            amount: transaction.amount,
            location: transaction.location,
            date: transaction.date,
            transactionId: transaction._id,
        });
        setButtonLabel('Update');
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Handle transaction deletion
    const handleDelete = async (transactionId) => {
        const prevTransactions = [...transactions];

        try {
            const response = await deleteTransaction({
                variables: { transactionId },
            });

            if (response?.data) {
                setTransactions(
                    prevTransactions.filter(
                        (transaction) => transaction._id !== transactionId
                    )
                );
                toast.success('Transaction deleted successfully');
            }
        } catch (error) {
            console.error('Error during transaction deletion:', error);
            setTransactions(prevTransactions);
            toast.error('An error occurred while deleting the transaction');
        }
    };

    const handleSortAscending = () => {
        const sortedTransactions = [...transactions].sort(
            (a, b) => a.amount - b.amount
        );
        setTransactions(sortedTransactions);
    };

    const handleSortDescending = () => {
        const sortedTransactions = [...transactions].sort(
            (a, b) => b.amount - a.amount
        );
        setTransactions(sortedTransactions);
    };

    return (
        <div>
            <Navbar />

            <div className="flex flex-col md:flex-row md:py-4 px-4">
                <div className="flex-1">
                    <Doughnut
                        // className="bg-white"
                        data={chartData}
                        options={chartOptions}
                    />
                </div>
                <div className="flex-1" ref={formRef}>
                    <div className="mx-2 min-h-fit my-10 md:my-0 md:min-h-screen flex items-start md:items-center justify-center">
                        <div
                            id="cardContainer"
                            className="p-8 bg-cardBackgroundColor-light dark:bg-cardBackgroundColor-dark rounded-lg shadow-lg sm:w-full sm:max-w-md"
                        >
                            <form
                                id="transaction_form"
                                className="space-y-10"
                                onSubmit={handleFormSubmit}
                            >
                                <div className="flex flex-col mt-8 space-y-4">
                                    <div>
                                        <label
                                            htmlFor="description"
                                            className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                        >
                                            Description
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            id="description"
                                            value={transactionForm.description}
                                            onChange={handleInputChange}
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
                                                value={transactionForm.mode}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            >
                                                <option>Card</option>
                                                <option>Cash</option>
                                                <option>UPI</option>
                                            </select>
                                        </div>

                                        <div className="w-1/3">
                                            <label
                                                htmlFor="category"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Category
                                            </label>
                                            <select
                                                id="category"
                                                value={transactionForm.category}
                                                onChange={handleInputChange}
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            >
                                                <option>Savings</option>
                                                <option>Investment</option>
                                                <option>Expense</option>
                                            </select>
                                        </div>

                                        <div className="w-1/3">
                                            <label
                                                htmlFor="amount"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Amount
                                            </label>
                                            <input
                                                required
                                                type="tel"
                                                id="amount"
                                                value={transactionForm.amount}
                                                onChange={handleInputChange}
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
                                                value={transactionForm.location}
                                                onChange={handleInputChange}
                                                placeholder="Enter location"
                                                className="w-full mt-1 px-4 py-2 text-suggestionColor-light dark:text-suggestionColor-dark bg-textInputBackgroundColor-light dark:bg-textInputBackgroundColor-dark border border-textInputBorderColor-light dark:border-textInputBorderColor-dark rounded-lg shadow-sm focus:ring-2"
                                            />
                                        </div>

                                        <div className="w-1/2">
                                            <label
                                                htmlFor="date"
                                                className="block text-sm font-medium text-suggestionColor-light dark:text-suggestionColor-dark"
                                            >
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                id="date"
                                                value={transactionForm.date}
                                                onChange={handleInputChange}
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
                                    {buttonLabel}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-row justify-center" ref={cardsRef}>
                <div className="flex items-baseline px-10 my-4">
                    <div className="flex-1">
                        <p className="text-xl font-libre_baskerville text-suggestionColor-light dark:text-suggestionColor-dark">
                            Your Transactions:
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <AiOutlineSortAscending
                            className="text-xl text-suggestionColor-light cursor-pointer dark:text-suggestionColor-dark"
                            onClick={handleSortAscending}
                        />
                        <AiOutlineSortDescending
                            className="text-xl text-suggestionColor-light cursor-pointer dark:text-suggestionColor-dark"
                            onClick={handleSortDescending}
                        />
                    </div>
                </div>

                <ul className="flex flex-wrap md:ps-16 justify-center md:justify-start gap-0.5 md:gap-2 w-screen">
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction._id}
                                {...transaction}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="flex justify-center items-center w-full h-full">
                            <Lottie
                                animationData={
                                    document.documentElement.classList.contains(
                                        'dark'
                                    )
                                        ? empty_list_dark
                                        : empty_list_light
                                }
                                loop={true}
                                speed={0.5}
                                className="w-72"
                            />
                        </div>
                    )}
                </ul>
            </div>
            <p className=" p-4 text-center"> Made in India . Made with ♥️</p>
        </div>
    );
};

export default Home;
