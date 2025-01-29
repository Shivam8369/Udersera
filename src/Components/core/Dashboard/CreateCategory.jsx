import React, { useState } from 'react'
import { createCategory } from '../../../services/operations/courseDetailsAPI'
import { useSelector } from 'react-redux'
import { toast } from 'react-hot-toast'

const CreateCategory = () => {
    const { token } = useSelector((state) => state.auth)
    const [loading, setLoading] = useState(false)
    const [category, setCategory] = useState({
        name: '',
        description: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Form validation
        if (!category.name.trim()) {
            toast.error("Category name is required")
            return
        }
        if (!category.description.trim()) {
            toast.error("Category description is required")
            return
        }

        setLoading(true)
        try {
            const res = await createCategory(
                {
                    name: category.name.trim(),
                    description: category.description.trim()
                },
                token
            );
            console.log("response of create-category:",res);

            if (res) {
                toast.success("Category created successfully")
                // Reset form
                setCategory({
                    name: '',
                    description: ''
                })
            } 
        } catch (error) {
            console.log("2");
            console.error("Category creation error:", error)
            toast.error("Something went wrong. Please try again later")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='text-pure-greys-50 text-xl p-5'>
            <form onSubmit={handleSubmit}>
                <div className='flex flex-col gap-2'>
                    <label htmlFor="categoryName">Category Name</label>
                    <input
                        value={category.name}
                        onChange={(e) => setCategory({ ...category, name: e.target.value })}
                        type="text"
                        id="categoryName"
                        className="form-style"
                        placeholder='Enter category name'
                        disabled={loading}
                    />
                </div>
                <div className='flex flex-col gap-2 mt-10'>
                    <label htmlFor="categoryDescription">Category Description</label>
                    <textarea
                        value={category.description}
                        onChange={(e) => setCategory({ ...category, description: e.target.value })}
                        id="categoryDescription"
                        className="form-style"
                        placeholder='Enter category description'
                        disabled={loading}
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className={`mt-10 rounded-md bg-yellow-50 px-6 py-3 text-center text-[13px] font-bold text-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.18)] transition-all duration-200 hover:scale-95 hover:shadow-none disabled:bg-richblack-500 sm:text-[16px] ${loading ? 'cursor-not-allowed opacity-70' : ''}`}
                >
                    {loading ? 'Creating...' : 'Create'}
                </button>
            </form>
        </div>
    )
}

export default CreateCategory