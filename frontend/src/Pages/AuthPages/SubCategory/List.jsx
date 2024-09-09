/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Button, ButtonGroup, IconButton, Switch, TextField, Tooltip } from '@mui/material'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import { deleteSubCategory, getSubCategories, getSubCategoriesByCategory, resetSubCategoryState } from '../../../Features/SubCategory/SubCategorySlice'


const SubCategoryList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id: paramId } = useParams()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { subCategories, responseStatus, responseMessage } = useSelector(state => state.subCategories)

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = list?.filter(item =>
        item?.subCategoryName?.toLowerCase().includes(searchInput.toLowerCase()) ||
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

    const handleSubCategoryStatusChange = (subCategoryId) => {
        setTimeout(() => {
            setFullPageLoading(true)
            dispatch(deleteSubCategory(subCategoryId))
        }, 500)
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        if (paramId) {
            dispatch(getSubCategoriesByCategory(paramId));
        } else {
            dispatch(getSubCategories());
        }
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(subCategories?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Sub Category deleted successfully'){
            dispatch(getSubCategories())
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetSubCategoryState())
                navigate('/ecom-project/sub-categories')
            }, 1000);
        }
    },[subCategories, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>SUB CATEGORY LIST</h6>
                            <Button type='button' variant="outlined" className='px-4 border-primary text-primary' size='small' onClick={()=>setTimeout(() => {
                                navigate('/ecom-project/sub-category-add')
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
                                        <th className='p-2 text-nowrap'>SUB CATEGORY</th>
                                        <th className='p-2 text-nowrap'>CATEGORY</th>
                                        <th className='p-2 text-nowrap'>STATUS</th>
                                        <th className='p-2 text-nowrap'>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(currentItems) && currentItems?.map((val,key)=>(
                                                <tr key={key}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Link to={`/ecom-project/sub-category-edit/${val?._id}`} className='text-decoration-none text-primary fw-bold'>
                                                            <Avatar
                                                                alt={val?.subCategoryImageUrl}
                                                                src={val?.subCategoryImageUrl}
                                                                sx={{ width: 50, height: 50 }}
                                                            />
                                                        </Link>
                                                    </td>
                                                    <td className='p-2 text-nowrap'><Link to={`/ecom-project/sub-category-edit/${val?._id}`} className='text-decoration-none text-primary fw-bold'>{val?.subCategoryName}</Link></td>
                                                    <td className='p-2 text-nowrap'><Link to={`/ecom-project/category-edit/${val?.categoryId}`} className='text-decoration-none text-primary fw-bold'>{val?.categoryName}</Link></td>
                                                    <td className='p-2 text-nowrap'><Switch size="small" color="success" checked={val?.isDeleted == 0 ? 'checked' : ''} onClick={()=>handleSubCategoryStatusChange(val?._id)} /></td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Tooltip title="Edit" onClick={()=>setTimeout(() => {
                                                            navigate(`/ecom-project/sub-category-edit/${val?._id}`)
                                                        }, 500)}>
                                                            <IconButton>
                                                                <EditIcon fontSize='small' className='text-primary' />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Delete" onClick={()=>handleSubCategoryStatusChange(val?._id)}>
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
        </>
    )
}

export default SubCategoryList