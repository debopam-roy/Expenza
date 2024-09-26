import React from 'react';
import { FaTrash } from 'react-icons/fa6';
import { GrLocation } from 'react-icons/gr';
import { AiOutlineAlignLeft } from 'react-icons/ai';
import { MdOutlinePayments } from 'react-icons/md';
import { FaSackDollar } from 'react-icons/fa6';
import { HiPencilAlt } from 'react-icons/hi';
import { HiOutlineCalendar } from 'react-icons/hi2';

const TransactionCard = ({
    t_id,
    t_desc,
    t_amount,
    t_date,
    t_category,
    t_mode,
    t_location,
    onEdit,
    onDelete,
}) => {
    let cardBackground;
    if (t_category === 'Investment')
        cardBackground =
            'bg-blueBackgroundColor-light dark:bg-blueBackgroundColor-dark';
    else if (t_category === 'Salary')
        cardBackground =
            'bg-greenBackgroundColor-light dark:bg-greenBackgroundColor-dark';
    else if (t_category === 'Expense')
        cardBackground =
            'bg-pinkBackgroundColor-light dark:bg-pinkBackgroundColor-dark';

    const handleEditClick = async () => {
        onEdit({
            t_id,
            t_desc,
            t_amount,
            t_date,
            t_category,
            t_mode,
            t_location,
            onEdit,
            onDelete,
        });
    };
    const handleDeleteClick = async () => {
        onDelete(t_id);
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
                            {t_category}
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
                        <div className="flex space-x-3 items-baseline mb-4">
                            <FaSackDollar className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Amount:
                            </p>
                            <p className="text-backgroundColor-light">
                                ₹{t_amount}
                            </p>
                        </div>

                        <div className="flex space-x-3 items-baseline mb-4">
                            <MdOutlinePayments className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Payment Mode:
                            </p>
                            <p className="text-backgroundColor-light">
                                {t_mode}
                            </p>
                        </div>

                        <div className="flex space-x-3 items-center mb-4">
                            <AiOutlineAlignLeft className="w-8 h-8 text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Description:
                            </p>
                            <p className="truncate w-full text-backgroundColor-light">
                                {t_desc}
                            </p>
                        </div>
                        <div className="flex space-x-3 items-center mb-4">
                            <GrLocation className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Location:
                            </p>
                            <p className="text-backgroundColor-light">
                                {t_location}
                            </p>
                        </div>
                        <div className="flex space-x-3 items-center mb-4">
                            <HiOutlineCalendar className="text-backgroundColor-light" />
                            <p className="text-backgroundColor-light font-semibold">
                                Date:
                            </p>
                            <p className="text-backgroundColor-light">
                                {t_date}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionCard;
