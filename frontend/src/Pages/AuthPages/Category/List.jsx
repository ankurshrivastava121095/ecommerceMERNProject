/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Box, Button, ButtonGroup, IconButton, Modal, Switch, TextField, Tooltip, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { deleteCategory, getCategories, resetCategoryState } from '../../../Features/Category/CategorySlice'



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    minWidth: 300,
    width: '100%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
}

const CategoryList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [showOptionModal, setShowOptionModal] = useState(false)
    const [selectedCategoryId, setSelectedCategoryId] = useState('')
    const [selectedOption, setSelectedOption] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { categories, responseStatus, responseMessage } = useSelector(state => state.categories)

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = list?.filter(item =>
        item?.categoryName?.toLowerCase().includes(searchInput.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNavigation = (categoryId) => {
        setSelectedCategoryId(categoryId)
        setShowOptionModal(true)
    }

    const handleCategoryStatusChange = (categoryId) => {
        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(deleteCategory(categoryId))
        }, 500)
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(categories?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Category deleted successfully'){
            dispatch(getCategories())
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetCategoryState())
                navigate('/ecom-project/categories')
            }, 1000);
        }
    },[categories, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>CATEGORY LIST</h6>
                            <Button type='button' variant="outlined" className='px-4 border-primary text-primary' size='small' onClick={()=>setTimeout(() => {
                                navigate('/ecom-project/category-add')
                            }, 500)}><AddIcon fontSize='small' />&nbsp;ADD NEW</Button>
                        </div>
                        <div className='bg-white p-3 custom-box-shadow'>
                            <TextField
                                type='search' 
                                id="outlined-basic" 
                                label="Search here" 
                                className='w-100 mb-3'
                                sx={{ maxWidth: '300px' }}
                                onChange={handleSearchInputChange}
                                value={searchInput}
                                size='small'
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <SearchIcon />
                                    ),
                                }}
                            />
                            <div style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <th className='p-2 text-nowrap'>#</th>
                                        <th className='p-2 text-nowrap'></th>
                                        <th className='p-2 text-nowrap'>CATEGORY</th>
                                        <th className='p-2 text-nowrap'>STATUS</th>
                                        <th className='p-2 text-nowrap'>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(currentItems) && currentItems?.map((val,key)=>(
                                                <tr key={key}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap' role='button' onClick={()=>handleNavigation(val?._id)}>
                                                        <Avatar
                                                            alt={val?.categoryImageUrl}
                                                            src={val?.categoryImageUrl}
                                                            sx={{ width: 50, height: 50 }}
                                                        />
                                                    </td>
                                                    <td className='p-2 text-nowrap' role='button' onClick={()=>handleNavigation(val?._id)}>{val?.categoryName}</td>
                                                    <td className='p-2 text-nowrap'><Switch size="small" color="success" checked={val?.isDeleted == 0 ? 'checked' : ''} onClick={()=>handleCategoryStatusChange(val?._id)} /></td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Tooltip title="Edit" onClick={()=>setTimeout(() => {
                                                            navigate(`/ecom-project/category-edit/${val?._id}`)
                                                        }, 500)}>
                                                            <IconButton>
                                                                <EditIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" onClick={()=>handleCategoryStatusChange(val?._id)}>
                                                            <IconButton>
                                                                <DeleteIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                            <div className='d-flex justify-content-between'>
                                <div>&nbsp;</div>
                                <div>
                                    <ButtonGroup variant="outlined" className='mt-1' aria-label="Basic button group">
                                        <Button onClick={handlePrevPage} sx={{ width: '60px' }} className='border-primary text-primary' disabled={currentPage === 1}><ChevronLeftIcon /></Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary'>{currentPage}</Button>
                                        <Button onClick={handleNextPage} sx={{ width: '60px' }} className='border-primary text-primary' disabled={currentPage === totalPages}><ChevronRightIcon /></Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <AdminBottomNavigation />

            {/* option modal */}
            <Modal
                open={showOptionModal}
                onClose={()=>{
                    setSelectedOption('')
                    setShowOptionModal(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Select any one option
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className='d-flex align-items-start mb-3'>
                            <div style={{ width: '30px' }} onClick={()=>setSelectedOption(1)}><input type="radio" name='selectedOption' value={1} checked={selectedOption == 1 ? 'checked' : ''} /></div>
                            <div onClick={()=>setSelectedOption(1)}>Show Sub Categories of selected Category.</div>
                        </div>
                        <div className='d-flex align-items-start mb-4'>
                            <div style={{ width: '30px' }} onClick={()=>setSelectedOption(2)}><input type="radio" name='selectedOption' value={1} checked={selectedOption == 2 ? 'checked' : ''} /></div>
                            <div onClick={()=>setSelectedOption(2)}>Edit Selected Category.</div>
                        </div>
                        <div className='d-flex align-items-center gap-3'>
                            <Button type='button' variant='contained' size='small' className='px-4' color='error' onClick={()=>{
                                setSelectedOption('')
                                setShowOptionModal(false)
                            }}>Cancel</Button>
                            <Button type='button' variant='contained' size='small' className='bg-button-primary px-4' onClick={()=>{
                                navigate(selectedOption == 1 ? `/ecom-project/sub-categories-by-category/${selectedCategoryId}` : selectedOption == 2 ? `/ecom-project/category-edit/${selectedCategoryId}` : alert('Please select any option'))
                            }}>Done</Button>
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default CategoryList