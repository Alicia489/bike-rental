import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

import "./reserve.scss";
import { clearSelectedBike, selectBikeSelected } from '../ManagersDashboard/bikesSlice';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation } from './reserveSlice';
import { selectCurrentUser } from '../Home/sessionSlice';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { useNavigate } from 'react-router-dom';
import { showModal } from '../../components/Modal/modalSlice';

function ReserveBike() {
    const selectedBike = useSelector(selectBikeSelected);
    const currentUser = useSelector(selectCurrentUser);
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!Object.keys(selectedBike).length) {
            navigate('/bikes');
        }
    }, [])

    const reserveNow = () => {
        let data = {
            fromDate: selectedBike.fromDate,
            toDate: selectedBike.toDate,
            bikeId: selectedBike.id,
            userId: currentUser.uid,
            model: selectedBike.model,
            location: selectedBike.location,
            color: selectedBike.color,
            imageUrl: selectedBike.imageUrl,
            userEmail: currentUser.email
        }

        dispatch(showLoader());
        dispatch(createReservation(data)).then(() => {
            dispatch(hideLoader());
            dispatch(clearSelectedBike())
            dispatch(showModal({
                heading: 'Bike reserved successfully!',
                message: '',
                type: '',
                buttons: [
                    {
                        text: 'Ok',
                        action: () => { }
                    }
                ]
            }))
            navigate("/my-account")
        })
    }

    return (
        <div className="reservation-container">
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    {/* Bike details */}
                    <Grid item sm={5} md={6}>

                        <Card>
                            <CardMedia
                                component="img"
                                alt="green iguana"
                                // height="140"
                                image={selectedBike.imageUrl}
                            />
                        </Card>
                    </Grid>

                    {/* reservation details */}
                    <Grid item sm={7} md={6}>
                        <h3>Available from <br></br>{selectedBike.fromDate} to {selectedBike.toDate}</h3>
                        <Grid container>
                            <Grid item xs={6} md={6}>
                                <p>Model: {selectedBike.model}</p>
                            </Grid>

                            <Grid item xs={6} md={6}>
                                <p>Color: {selectedBike.color}</p>
                            </Grid>

                            <Grid item xs={12} md={12}>
                                <Rating name="read-only" value={selectedBike.rating} size={"large"} readOnly />
                            </Grid>
                            <Grid item xs={6} md={6}>
                                <p>Location: <b>{selectedBike.location}</b></p>
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button size="large" variant="contained" onClick={() => reserveNow()}>
                                    Reserve now
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
        </div>
    );
}

export default ReserveBike;