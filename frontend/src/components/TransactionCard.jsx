import React from 'react';
import { FaTrash } from 'react-icons/fa6';
import { GrLocation } from 'react-icons/gr';
import { AiOutlineAlignLeft } from 'react-icons/ai';
import { MdOutlinePayments } from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import { HiPencilAlt } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';

const TransactionCard = ({
    _id: _id,
    description: description,
    amount: amount,
    date: date,
    category: category,
    mode: mode,
    location: location,
    onEdit,
    onDelete,
}) => {
    let cardBackground;
    if (category === 'Investment')
        cardBackground =
            'bg-blueBackgroundColor-light dark:bg-blueBackgroundColor-dark';
    else if (category === 'Savings')
        cardBackground =
            'bg-greenBackgroundColor-light dark:bg-greenBackgroundColor-dark';
    else if (category === 'Expense')
        cardBackground =
            'bg-pinkBackgroundColor-light dark:bg-pinkBackgroundColor-dark';

    const handleEditClick = async () => {
        onEdit({
            _id,
            description,
            amount,
            date,
            category,
            mode,
            location,
            onEdit,
            onDelete,
        });
    };
    const handleDeleteClick = async () => {
        onDelete(_id);
    };

    return (
        <div className="w-80 h-80 flex items-start justify-center flex-col overflow-hidden p-4">
            <div
                id="cardContainer"
                className={`p-4 ${cardBackground} rounded-lg shadow-lg w-full h-full`}
            >
                <div className="flex flex-col justify-evenly space-y-4">
                    <div className="flex space-x-3 items-baseline mb-4 w-full justify-between">
                        <p className="font-semibold text-xl text-backgroundColor-light">
                            {category}
                        </p>

                        <div className="flex space-x-2">
                            <HiPencilAlt
                                className="text-backgroundColor-light cursor-pointer"
                                onClick={handleEditClick}
                            />{' '}
                            <FaTrash
                                className="text-backgroundColor-light cursor-pointer"
                                onClick={handleDeleteClick}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex space-x-3 items-center mb-4">
                            <AiOutlineAlignLeft className="w-8 h-8 text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Description:
                            </p>
                            <p className="truncate w-full text-backgroundColor-light">
                                {description}
                            </p>
                        </div>

                        <div className="flex space-x-3 items-baseline mb-4">
                            <FaSackDollar className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Amount:
                            </p>
                            <p className="text-backgroundColor-light">
                                ₹{amount}
                            </p>
                        </div>

                        <div className="flex space-x-3 items-baseline mb-4">
                            <MdOutlinePayments className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Payment Mode:
                            </p>
                            <p className="text-backgroundColor-light">{mode}</p>
                        </div>

                        <div className="flex space-x-3 items-center mb-4">
                            <HiOutlineCalendar className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Date:
                            </p>
                            <p className="text-backgroundColor-light">{date}</p>
                        </div>

                        <div className="flex space-x-3 items-center mb-4">
                            <GrLocation className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Location:
                            </p>
                            <p className="text-backgroundColor-light">
                                {location}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
