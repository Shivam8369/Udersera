import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { apiConnector } from '../services/apiconnector';
import { categories } from '../services/apis';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CourseSlider from '../Components/core/Catalog/CourseSlider';
import CatalogCard from '../Components/core/Catalog/CatalogCard';
import Spinner from '../Components/common/Spinner';

const Catalog = () => {
    const { catalog } = useParams();
    const [desc, setDesc] = useState('');
    const [catalogPageData, setCatalogPageData] = useState(null);
    const [categoryID, setCategoryID] = useState(null);
    const [activeOption, setActiveOption] = useState(1);
    const [loading, setLoading] = useState(true); // Initialize loading as true

    // Fetch sublinks and category data
    useEffect(() => {
        const fetchSublinks = async () => {
            try {
                setLoading(true); // Set loading to true when fetching starts
                const result = await apiConnector("GET", categories.CATEGORIES_API);
                const categoryData = result.data.data.find(item => item.name.toLowerCase() === catalog);
                if (categoryData) {
                    setCategoryID(categoryData._id);
                    setDesc(categoryData.description);
                }
            } catch (error) {
                console.error("Could not fetch sublinks:", error);
            }
        };

        fetchSublinks();
    }, [catalog]);

    // Fetch catalog page data based on categoryID
    useEffect(() => {
        const fetchCatalogPageData = async () => {
            if (categoryID) {
                try {
                    setLoading(true); // Set loading to true when fetching starts
                    const result = await getCatalogPageData(categoryID);
                    setCatalogPageData(result);
                    console.log("page data:",catalogPageData);
                } catch (error) {
                    console.error("Could not fetch catalog page data:", error);
                } finally {
                    setLoading(false); // Set loading to false when fetching is done
                }
            }
        };

        fetchCatalogPageData();
    }, [categoryID]);

    // Loading state
    if (loading) {
        return (
            <div className='text-white text-center text-2xl h-screen flex justify-center items-center'>
                <Spinner/>
            </div>
        );
    }

    // Conditional rendering if no data is available
    if (!catalogPageData?.success) {
        return (
            <div className='text-white text-center text-2xl h-screen flex justify-center items-center'>
                No Course Available
            </div>
        );
    }

    return (
        <>
            <div className="box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent">
                    <p className='text-sm text-richblack-300'>
                        Home / Catalog / <span className='text-yellow-25'>{catalog}</span>
                    </p>
                    <p className='text-3xl text-richblack-5'>{catalog}</p>
                    <p className='max-w-[870px] text-richblack-200'>{desc}</p>
                </div>
            </div>

            <div className='mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2>Courses to get you started</h2>
                <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                    <button
                        onClick={() => setActiveOption(1)}
                        className={`px-4 py-2 ${activeOption === 1 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'}`}
                    >
                        Most Popular
                    </button>
                    <button
                        onClick={() => setActiveOption(2)}
                        className={`px-4 py-2 ${activeOption === 2 ? 'border-b border-b-yellow-25 text-yellow-25' : 'text-richblack-50'}`}
                    >
                        New
                    </button>
                </div>
                <CourseSlider Courses={catalogPageData?.selectedCourses} />
            </div>

            <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <h2 className='section_heading mb-6 text-white md:text-3xl text-xl'>
                    Similar to {catalog}
                </h2>
                <CourseSlider Courses={catalogPageData?.differentCourses} />
            </div>

            <div className='mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2 className='section_heading text-white mb-6 md:text-3xl text-xl'>
                    Frequently Bought Together
                </h2>
                <div className='grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>
                    {catalogPageData?.mostSellingCourses?.map((item, index) => (
                        <CatalogCard key={index} course={item} Height={"h-[100px] lg:h-[400px]"} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default Catalog;