import React from 'react'
import { useParams } from 'react-router'
import { useState } from 'react';
import { categories } from '../services/apis';
import { apiConnector } from '../services/apiconnector';
import { useEffect } from 'react';
import CourseSlider from '../Components/core/Catalog/CourseSlider';
import { getCatalogPageData } from '../services/operations/pageAndComponentData';
import CatalogCard from '../Components/core/Catalog/CatalogCard';

const Catalog = () => {

    const Catalog = useParams();
    const [Desc, setDesc] = useState([]);
    const [CatalogPageData, setCatalogPageData] = useState(null);
    const [categoryID, setCategoryID] = useState(null);
    const [activeOption, setActiveOption] = useState(1);


    const fetchSublinks = async () => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            const category_id = result.data.data.filter((item) => item.name.toLowerCase() === Catalog.catalog)[0]._id;
            setCategoryID(category_id);
            setDesc(result.data.data.filter((item) => item.name.toLowerCase() === Catalog.catalog)[0].description);
            console.log("desc", result.data.data.filter((item) => item.name.toLowerCase() === Catalog.catalog)[0].description);

        } catch (error) {
            console.log("could not fetch sublinks");
            console.log(error);
        }
    }
    useEffect(() => {
        fetchSublinks();
    }, [Catalog])

    useEffect(() => {
        const fetchCatalogPageData = async () => {
            const result = await getCatalogPageData(categoryID);
            setCatalogPageData(result);
            console.log("page data", CatalogPageData);
        }
        if (categoryID) {
            fetchCatalogPageData();
        }
    }, [categoryID])


    return (
        <>
            <div className=" box-content bg-richblack-800 px-4">
                <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
                    <p className='text-sm text-richblack-300'>Home / Catalog / <span className='text-yellow-25'>{Catalog.catalog}</span> </p>
                    <p className='text-3xl text-richblack-5'>{Catalog?.catalog}</p>
                    <p className='max-w-[870px] text-richblack-200'>{Desc}</p>
                </div>
            </div>

            <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2 className='Courses to get you started'> Courses to get you started </h2>
                <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                    <button onClick={() => { setActiveOption(1) }} className={activeOption === 1 ? `px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer` : `px-4 py-2 text-richblack-50 cursor-pointer`}>Most Populer</button>
                    <button onClick={() => { setActiveOption(2) }} className={activeOption === 1 ? 'px-4 py-2 text-richblack-50 cursor-pointer' : 'px-4 py-2 border-b border-b-yellow-25 text-yellow-25 cursor-pointer'}>New</button>
                </div>
                <CourseSlider Courses={CatalogPageData?.selectedCourses} />
            </div>

            <div className=' mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
                <h2 className='section_heading mb-6 text-white md:text-3xl text-xl'> Similar to {Catalog.catalog}</h2>
                <CourseSlider Courses={CatalogPageData?.differentCourses} />
            </div>

            <div className=' mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent'>
                <h2 className='section_heading text-white mb-6 md:text-3xl text-xl'> Frequently BoughtTogether </h2>
                <div className='grid grid-cols-2 gap-3 lg:gap-6 lg:grid-cols-2 pr-4'>
                    {
                        CatalogPageData?.mostSellingCourses?.map((item, index) => (
                            <CatalogCard key={index} course={item} Height={"h-[100px] lg:h-[400px]"} />
                        ))
                    }
                </div>
            </div>

        </>
    )
}

export default Catalog