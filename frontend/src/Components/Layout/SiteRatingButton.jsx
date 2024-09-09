import { Avatar, Box, Button, Modal, Rating, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import FullPageLoader from '../Loaders/FullPageLoader'
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';


const style = {
    position: 'absolute',
    top: '45%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 300,
    maxWidth: 600,
    width: '100%',
    borderRadius: '15px',
    bgcolor: '#000000e8',
    boxShadow: 24,
    p: 4,
}

const SiteRatingButton = () => {

    const [ratingCategorize, setRatingCategorize] = useState({
        numberOfUserGivenOneRating: 0,
        percentageOfUserGivenOneRating: 0,
        numberOfUserGivenTwoRating: 0,
        percentageOfUserGivenTwoRating: 0,
        numberOfUserGivenThreeRating: 0,
        percentageOfUserGivenThreeRating: 0,
        numberOfUserGivenFourRating: 0,
        percentageOfUserGivenFourRating: 0,
        numberOfUserGivenFiveRating: 0,
        percentageOfUserGivenFiveRating: 0,
    })

    const [ratingList, setRatingList] = useState([])
    const [showRatingModal, setShowRatingModal] = useState(false)
    const [fullPageLoading, setFullPageLoading] = useState(false)

    const calculatePercentages = (count, total) => {
        return total > 0 ? ((count / total) * 100).toFixed(2) : 0;
    };
    
    useEffect(() => {
        if (ratingList.length > 0) {
            const totalUsers = ratingList.length;

            const oneRatingCount = ratingList.filter(rating => rating.rating === '1').length;
            const twoRatingCount = ratingList.filter(rating => rating.rating === '2').length;
            const threeRatingCount = ratingList.filter(rating => rating.rating === '3').length;
            const fourRatingCount = ratingList.filter(rating => rating.rating === '4').length;
            const fiveRatingCount = ratingList.filter(rating => rating.rating === '5').length;

            setRatingCategorize({
                numberOfUserGivenOneRating: oneRatingCount,
                percentageOfUserGivenOneRating: calculatePercentages(oneRatingCount, totalUsers),
                numberOfUserGivenTwoRating: twoRatingCount,
                percentageOfUserGivenTwoRating: calculatePercentages(twoRatingCount, totalUsers),
                numberOfUserGivenThreeRating: threeRatingCount,
                percentageOfUserGivenThreeRating: calculatePercentages(threeRatingCount, totalUsers),
                numberOfUserGivenFourRating: fourRatingCount,
                percentageOfUserGivenFourRating: calculatePercentages(fourRatingCount, totalUsers),
                numberOfUserGivenFiveRating: fiveRatingCount,
                percentageOfUserGivenFiveRating: calculatePercentages(fiveRatingCount, totalUsers),
            });
        }
    }, [ratingList]);

    const fetchRatings = () => {
        setFullPageLoading(true)
        fetch(`${process.env.REACT_APP_BACKEND_URL}/rating`)
        .then(response => response.json())
        .then(data => {
            setRatingList(data?.data)
            setTimeout(() => {
                setFullPageLoading(false)
                setShowRatingModal(true)
            }, 500)
        })
        .catch((err)=>console.log(err)
        )
    }

    return (
        <>
            { fullPageLoading && <FullPageLoader /> }
            <div className='site-rating-button'>
                <center>
                    <Button type='button' variant='contained' size='small' className='bg-button-primary rounded-0' onClick={fetchRatings}><i className="fa-solid fa-star"></i>&nbsp;&nbsp;Reviews</Button>
                </center>
            </div>

            <Modal
                open={showRatingModal}
                onClose={()=>setShowRatingModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <CloseIcon sx={{ color: '#fff', my: 1, float: 'right', cursor: 'pointer' }} onClick={()=>setShowRatingModal(false)} />
                        <div className="row">
                            <div className="container">
                                <div className="row">
                                    <div className='text-white fs-4 mb-4'>Explore Our Customers Reviews</div>
                                    <div className="col-md-2"></div>
                                    <div className="col-md-8 text-white" style={{ fontSize: '14px' }}>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div><i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i> 5</div>
                                            <div style={{ height: '5px', border: '1px solid #fff', width: '200px', borderRadius: '50px' }}><div style={{ height: '4px', backgroundColor: '#fff', width: `${ratingCategorize?.percentageOfUserGivenFiveRating}%`, borderRadius: '50px' }}>&nbsp;</div></div>
                                            <div>{ratingCategorize?.numberOfUserGivenFiveRating}</div>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div><i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i> 4</div>
                                            <div style={{ height: '5px', border: '1px solid #fff', width: '200px', borderRadius: '50px' }}><div style={{ height: '4px', backgroundColor: '#fff', width: `${ratingCategorize?.percentageOfUserGivenFourRating}%`, borderRadius: '50px' }}>&nbsp;</div></div>
                                            <div>{ratingCategorize?.numberOfUserGivenFourRating}</div>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div><i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i> 3</div>
                                            <div style={{ height: '5px', border: '1px solid #fff', width: '200px', borderRadius: '50px' }}><div style={{ height: '4px', backgroundColor: '#fff', width: `${ratingCategorize?.percentageOfUserGivenThreeRating}%`, borderRadius: '50px' }}>&nbsp;</div></div>
                                            <div>{ratingCategorize?.numberOfUserGivenThreeRating}</div>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div><i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i> 2</div>
                                            <div style={{ height: '5px', border: '1px solid #fff', width: '200px', borderRadius: '50px' }}><div style={{ height: '4px', backgroundColor: '#fff', width: `${ratingCategorize?.percentageOfUserGivenTwoRating}%`, borderRadius: '50px' }}>&nbsp;</div></div>
                                            <div>{ratingCategorize?.numberOfUserGivenTwoRating}</div>
                                        </div>
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div><i className="fa-solid fa-star" style={{ fontSize: '12px' }}></i> 1</div>
                                            <div style={{ height: '5px', border: '1px solid #fff', width: '200px', borderRadius: '50px' }}><div style={{ height: '4px', backgroundColor: '#fff', width: `${ratingCategorize?.percentageOfUserGivenOneRating}%`, borderRadius: '50px' }}>&nbsp;</div></div>
                                            <div>{ratingCategorize?.numberOfUserGivenOneRating}</div>
                                        </div>
                                    </div>
                                    <div className="col-md-2"></div>
                                </div>
                            </div>
                        </div>
                        <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
                            {
                                Array?.isArray(ratingList) && ratingList?.length > 0 ?
                                Array?.isArray(ratingList) && ratingList?.map((val,key)=>(
                                    <div key={key} className={`py-3`} style={{ borderBottom: '1px solid lightgrey' }}>
                                        <div className='d-flex align-items-top gap-4'>
                                            <Avatar><PersonIcon /></Avatar>
                                            <div className='text-white'>
                                                <div>{val?.userName}</div>
                                                <div><Rating name="read-only" value={val?.rating} size="small" readOnly /></div>
                                                <small>{val?.review}</small>
                                                {
                                                    val?.ratingProductOneImageUrl ?
                                                        <div className='mt-2 d-flex flex-wrap align-items-center gap-3'>
                                                            <img role='button' src={val?.ratingProductOneImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOneImageUrl} />
                                                            <img role='button' src={val?.ratingProductTwoImageUrl} style={{ height: '80px' }} alt={val?.ratingProductTwoImageUrl} />
                                                            <img role='button' src={val?.ratingProductThreeImageUrl} style={{ height: '80px' }} alt={val?.ratingProductThreeImageUrl} />
                                                            <img role='button' src={val?.ratingProductFourImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOnFourageUrl} />
                                                            <img role='button' src={val?.ratingProductFiveImageUrl} style={{ height: '80px' }} alt={val?.ratingProductOneFivegeUrl} />
                                                        </div>
                                                    : ''
                                                }
                                            </div>
                                        </div>
                                    </div>
                                ))
                                :
                                <><center><h6>No Ratings</h6></center></>
                            }
                        </div>
                    </Typography>
                </Box>
            </Modal>
        </>
    )
}

export default SiteRatingButton