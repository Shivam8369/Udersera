import React from 'react';

function PurchaseHistory() {
  // Dummy data for purchase history
  const dummyPurchaseData = [
    {
      id: 1,
      courseName: 'React for Beginners',
      purchaseDate: '2024-12-01',
      amount: '₹500',
    },
    {
      id: 2,
      courseName: 'Advanced Node.js',
      purchaseDate: '2024-11-20',
      amount: '₹700',
    },
    {
      id: 3,
      courseName: 'Python Data Science',
      purchaseDate: '2024-11-15',
      amount: '₹800',
    },
    {
      id: 4,
      courseName: 'Full Stack Web Development',
      purchaseDate: '2024-11-05',
      amount: '₹1200',
    },
    {
      id: 5,
      courseName: 'Machine Learning Basics',
      purchaseDate: '2024-10-25',
      amount: '₹900',
    },
  ];

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
            </tr>
          </thead>
          <tbody>
            {dummyPurchaseData.map((purchase, index) => (
              <tr
                key={purchase.id}
                className={`${
                  index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-700'
                } border-b-2 border-richblack-700 hover:bg-gray-600 transition duration-150` }
              >
                <td className='px-6 py-4 text-white font-semibold'>{purchase.courseName}</td>
                <td className='px-6 py-4 text-gray-300'>{purchase.purchaseDate}</td>
                <td className='px-6 py-4 text-gray-300'>{purchase.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PurchaseHistory;
