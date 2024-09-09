/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Box, Button, ButtonGroup, IconButton, Modal, TextField, Tooltip, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { deleteMainBanner, getMainBanners, resetMainBannerState } from '../../../Features/MainBanner/MainBannerSlice'
import CloseIcon from '@mui/icons-material/Close';



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    minWidth: '300px',
    maxWidth: '1000px',
    // bgcolor: 'background.paper',
    bgcolor: 'transparent',
}

const MainBannerList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [showImage, setShowImage] = useState(false)
    const [detailedData, setDetailedData] = useState('')
    const [searchInput, setSearchInput] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const { mainBanners, responseStatus, responseMessage } = useSelector(state => state.mainBanners)

    const handleSearchInputChange = (e) => {
        setSearchInput(e.target.value);
        setCurrentPage(1);
    };

    const filteredData = list?.filter(item =>
        item?.mainBannerImageUrl?.toLowerCase().includes(searchInput.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math?.ceil(filteredData?.length / itemsPerPage);

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

    const handleDetail = (data) => {
        setDetailedData(data)
        setShowImage(true)
    }

    const handleDelete = (imageId) => {
        const isConfirmed = window?.confirm("Are you sure you want to delete this image ?")

        if (isConfirmed) {
            setTimeout(() => {
                setFullPageLoading(true)
                dispatch(deleteMainBanner(imageId))
            }, 500)
        }
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)
    },[])

    useEffect(() => {
        dispatch(getMainBanners());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(mainBanners?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'Main Banner deleted successfully'){
            dispatch(getMainBanners())
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetMainBannerState())
                navigate('/ecom-project/main-banner')
            }, 1000);
        }
    },[mainBanners, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>MAIN BANNER LIST</h6>
                            <Button type='button' variant="outlined" className='px-4 border-primary text-primary' size='small' onClick={()=>setTimeout(() => {
                                navigate('/ecom-project/main-banner-add')
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
                                        <th className='p-2 text-nowrap'>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(currentItems) && currentItems?.map((val,key)=>(
                                                <tr key={key}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap' role='button' onClick={()=>handleDetail(val)}>
                                                        <Avatar
                                                            alt={val?.mainBannerImageUrl}
                                                            src={val?.mainBannerImageUrl}
                                                            sx={{ width: 50, height: 50 }}
                                                        />
                                                    </td>
                                                    <td className='p-2 text-nowrap'>
                                                        <Tooltip title="Delete" onClick={()=>handleDelete(val?._id)}>
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

            <Modal
                open={showImage}
                onClose={()=>setShowImage(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description">
                        <CloseIcon sx={{ color: '#fff', my: 1, float: 'right', cursor: 'pointer' }} onClick={()=>setShowImage(false)} />
                        <img src={detailedData?.mainBannerImageUrl} className='w-100' alt={detailedData?.mainBannerImageUrl} />
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default MainBannerList