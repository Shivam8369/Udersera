import React from 'react';
import { useEffect, useState } from 'react';
import { getPaymentHistory } from '../../../services/operations/studentFeaturesAPI';
import { useSelector } from "react-redux"

function PurchaseHistory() {
  const [purchaseData, setPurchaseData] = useState([]);
  const { token } = useSelector((state) => state.auth)

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      const history = await getPaymentHistory(token);
      if (history) {
        console.log("history", history);
        setPurchaseData(history);
      }
    };
    fetchPurchaseHistory();
  }, []);

  const formattedDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };

  return (
    <div className='p-6 bg-gray-900 text-richblack-50 rounded-lg'>
      <h2 className='text-3xl font-bold mb-6'>Purchase History</h2>
      <div className='overflow-x-auto'>
        <table className='min-w-full bg-richblack-800 rounded-lg'>
          <thead>
            <tr className='bg-gray-700 text-left'>
              <th className='px-6 py-3 text-lg font-medium text-gray-300'>Course Name</th>
              <th className='px-6 py-3 text-lg font-medium text-gray-300'>Purchase Date</th>
              <th className='px-6 py-3 text-lg font-medium text-gray-300'>Amount</th>
              <th className='px-6 py-3 text-lg font-medium text-gray-300'>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchaseData.map((purchase, index) => (
              <tr
                key={purchase._id}
                className={`${index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                  } border-b-2 border-richblack-700 hover:bg-gray-600 transition duration-150`}
              >
                <td className='px-6 py-4 text-white font-semibold'>
                  {purchase.courses.map(course => course.courseName).join(', ')}
                </td>
                <td className='px-6 py-4 text-gray-300'>
                  {formattedDate(purchase.createdAt)}
                </td>
                <td className='px-6 py-4 text-gray-300'>
                  ₹{purchase.amount}
                </td>
                <td className='px-6 py-4 text-gray-300'>
                  {purchase.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseHistory;