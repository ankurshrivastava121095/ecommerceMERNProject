/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import AdminNavbar from '../../../Components/Layout/AdminNavbar'
import AdminBottomNavigation from '../../../Components/Layout/AdminBottomNavigation'
import { Avatar, Button, ButtonGroup, IconButton, Switch, TextField, Tooltip } from '@mui/material'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import { useDispatch, useSelector } from 'react-redux'
import Swal from 'sweetalert2';
import FullPageLoader from '../../../Components/Loaders/FullPageLoader'
import { deleteProduct, getProducts, resetProductState } from '../../../Features/Product/ProductSlice'
import AdminAuth from '../../../Components/Authentication/AdminAuth'
import { changeUserStatus, getAllUsers, resetUserState } from '../../../Features/User/UserSlice'


const UserList = () => {
    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { pathname } = useLocation()

    const [fullPageLoading, setFullPageLoading] = useState(true)
    const [list, setList] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchedRecord, setSearchedRecord] = useState('')

    const { users, responseStatus, responseMessage } = useSelector(state => state.users)

    const handleSearchFilter = () => {
        setFullPageLoading(true)
        localStorage.setItem(`${pathname}SearchFilter`, searchedRecord)
        localStorage.removeItem(pathname)
        localStorage.setItem(pathname, JSON.stringify({ page: 1 }))
        dispatch(getAllUsers());
    }

    const handleUserStatusChange = (userId) => {
        setFullPageLoading(true)
        setTimeout(() => {
            dispatch(changeUserStatus(userId))
        }, 500)
    }

    useEffect(()=>{
        setTimeout(() => {
            setFullPageLoading(false)
        }, 1000);
        window.scrollTo(0, 0)

        localStorage.removeItem(`${pathname}SearchFilter`)
        localStorage.removeItem(pathname)
    },[])

    useEffect(() => {
        dispatch(getAllUsers());
    }, [dispatch]);

    useEffect(()=>{
        if(responseStatus == 'success' && responseMessage == 'Get All'){
            setList(users?.data)
            setTimeout(() => {
                setFullPageLoading(false)
            }, 1000);
        }
        if(responseStatus == 'success' && responseMessage == 'User status changed successfully'){
            dispatch(getAllUsers())
        }
        if(responseStatus == 'rejected' && responseMessage != '' && responseMessage != null){
            setFullPageLoading(false)
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: responseMessage
            });
            setTimeout(() => {
                dispatch(resetUserState())
                navigate('/ecom-project/users')
            }, 1000);
        }
    },[users, responseStatus, responseMessage])

    return (
        <>
            <AdminAuth />
            { fullPageLoading && <FullPageLoader /> }
            <AdminNavbar />
            <div className="container mt-5">
                <div className="row pt-5">
                    <div className="col-md-12">
                        <div className='d-flex align-items-center justify-content-between mb-3'>
                            <h6>USER LIST</h6>
                        </div>
                        <div className='bg-white p-3 custom-box-shadow'>
                            <TextField
                                type='search' 
                                id="outlined-basic" 
                                label="Search here" 
                                className='w-100 mb-3'
                                sx={{ maxWidth: '300px' }}
                                onChange={e => setSearchedRecord(e.target.value)}
                                value={searchedRecord}
                                size='small'
                                variant="standard"
                                InputProps={{
                                    endAdornment: (
                                        <SearchIcon sx={{ cursor: 'pointer' }} onClick={handleSearchFilter} />
                                    ),
                                }}
                            />
                            <div style={{ overflowX: 'auto' }}>
                                <table className='table table-bordered table-hover'>
                                    <thead>
                                        <th className='p-2 text-nowrap'>#</th>
                                        <th className='p-2 text-nowrap'>MAKE ADMIN</th>
                                        <th className='p-2 text-nowrap'>NAME</th>
                                        <th className='p-2 text-nowrap'>EMAIL</th>
                                        <th className='p-2 text-nowrap'>MOBILE/WHATSAPP</th>
                                        <th className='p-2 text-nowrap'>ALTERNATE NUMBER</th>
                                        <th className='p-2 text-nowrap'>PINCODE</th>
                                        <th className='p-2 text-nowrap'>CITY</th>
                                        <th className='p-2 text-nowrap'>STATE</th>
                                        <th className='p-2 text-nowrap'>COUNTRY</th>
                                        <th className='p-2 text-nowrap'>ROLE</th>
                                    </thead>
                                    <tbody>
                                        {
                                            Array?.isArray(list) && list?.map((val,key)=>(
                                                <tr key={key}>
                                                    <td className='p-2 text-nowrap'>{key+1}.</td>
                                                    <td className='p-2 text-nowrap'><Switch size="small" color="success" checked={val?.role == 'Admin' ? 'checked' : ''} onClick={()=>handleUserStatusChange(val?._id)} /></td>
                                                    <td className='p-2 text-nowrap'>
                                                        {
                                                            val?.role == 'Admin' ?
                                                            <>{val?.name}</>
                                                            :
                                                            <><Link to={`/ecom-project/user-detail/${val?._id}`} className='text-decoration-none text-primary fw-bold'>{val?.name}</Link></>
                                                        }
                                                    </td>
                                                    <td className='p-2 text-nowrap'>{val?.email}</td>
                                                    <td className='p-2 text-nowrap'>{val?.mobileNumber}</td>
                                                    <td className='p-2 text-nowrap'>{val?.alternateNumber || '-'}</td>
                                                    <td className='p-2 text-nowrap'>{val?.pincode}</td>
                                                    <td className='p-2 text-nowrap'>{val?.city}</td>
                                                    <td className='p-2 text-nowrap'>{val?.state}</td>
                                                    <td className='p-2 text-nowrap'>{val?.country}</td>
                                                    <td className='p-2 text-nowrap'>{val?.role}</td>
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
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage - 1
                                            setCurrentPage(currentPage - 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getAllUsers())
                                        }} disabled={ currentPage == 1 ? true : false }><ChevronLeftIcon /></Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary'>{currentPage}</Button>
                                        <Button sx={{ width: '60px' }} className='border-primary text-primary' onClick={()=>{
                                            const isPathExist = localStorage.getItem(pathname)
                                            if (isPathExist) {
                                                localStorage.removeItem(pathname)
                                            }
                                            const newPage = currentPage + 1
                                            setCurrentPage(currentPage + 1)
                                            localStorage.setItem(pathname, JSON.stringify({ page: newPage }))
                                            setFullPageLoading(true)
                                            dispatch(getAllUsers())
                                        }} disabled={ users?.totalRecords <= 12 * currentPage ? true : false }><ChevronRightIcon /></Button>
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

export default UserList