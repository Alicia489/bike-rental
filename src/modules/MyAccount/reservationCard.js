import React, { useEffect } from 'react';
import { formatDate2, imagePath } from '../../utils/utilServices';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import { useDispatch, useSelector } from 'react-redux';
import { getAllReservations, removeReservation } from '../Reserve/reserveSlice';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { showModal } from '../../components/Modal/modalSlice';
import RatingModal from './ratingModal';
import { selectCurrentUser } from '../Home/sessionSlice';

function ReservationCard(props) {
    const { model, location, fromDate, toDate, hasRated, bikeId, id, imageUrl } = props.data;
    // const [resStatus, setResStatus] = React.useState(''); // past, upcoming & active
    const [openRateModal, setOpenModal] = React.useState(false);
    const currentUser = useSelector(selectCurrentUser);

    const dispatch = useDispatch()

    // useEffect(() => {
    //     // if toDate > today => past reservation => prompt rating modal, if not already rated
    //     if (toDate.toDate() < new Date()) {
    //         setResStatus('past')
    //     } else if (fromDate.toDate() > new Date()) {
    //         setResStatus('upcoming')
    //     } else {
    //         setResStatus('active')
    //     }
    // }, [])

    const getResStatus = () => {
        if (toDate.toDate() < new Date()) {
            return 'past'
        } else if (fromDate.toDate() > new Date()) {
            return 'upcoming'
        } else {
            return 'active'
        } 
    }


    const cancelReservation = () => {
        dispatch(showLoader());
        dispatch(removeReservation(props.data.id)).then(res => {
            dispatch(hideLoader())
            dispatch(getAllReservations(currentUser.uid))
            dispatch(showModal({
                heading: 'Reservation cancelled!',
                message: '',
                type: '',
                buttons: [
                    {
                        text: 'Ok',
                        action: () => { }
                    },
                ]
            }))
        })
    }

    const showRateModal = () => {
        setOpenModal(true)
    }

    return (
        <div className="reservation-card-container">
            <RatingModal
                open={openRateModal}
                bikeId={bikeId} resId={id}
                onClose={() => setOpenModal(false)} />
            <Grid container spacing={2}>
                <Grid item sm={3} md={4}>
                    <img src={imageUrl} alt="bike" className="w-100" />
                    <Chip label={getResStatus().toUpperCase()} className={getResStatus()} />
                </Grid>
                <Grid item sm={9} md={8} className="text-left">
                    <p>{model}</p>
                    <p>{location}</p>
                    <p>{formatDate2(fromDate.toDate())} to {formatDate2(toDate.toDate())}</p>

                    {getResStatus() === 'upcoming' &&
                        <Button variant="contained" onClick={() => cancelReservation()}>
                            Cancel reservation
                        </Button>}

                    {getResStatus() === 'past' && !hasRated &&
                        <Button variant="outlined" onClick={() => showRateModal()}>
                            Rate your experience
                        </Button>}
                </Grid>
            </Grid>
        </div>
    );
}

export default ReservationCard;