import React, { useEffect } from 'react';
import "./myaccount.scss";
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import ReservationCard from './reservationCard';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { getAllReservations, selectReservations } from '../Reserve/reserveSlice';
import { selectCurrentUser } from '../Home/sessionSlice';

function MyAccount() {
    const dispatch = useDispatch()
    const reservations = useSelector(selectReservations);
    const currentUser = useSelector(selectCurrentUser);

    useEffect(() => {
        if (currentUser) {
            getBikes()
        }
    }, [currentUser])

    const getBikes = () => {
        dispatch(showLoader())
        dispatch(getAllReservations(currentUser.uid)).then(res => dispatch(hideLoader()))
    }

    return (
        <div className="my-account-container">
            <Container maxWidth="lg">
                <h2>Account details</h2>
                <Grid container spacing={2}>
                    {/* <Grid item md={6} className="text-right">
                        <p>Name:</p>
                    </Grid>
                    <Grid item md={6} className="text-left">
                        <p>User name</p>
                    </Grid> */}
                    <Grid item md={6} className="text-right">
                        <p>Email address:</p>
                    </Grid>
                    <Grid item md={6} className="text-left">
                        <p>a@b.com</p>
                    </Grid>
                    {/* <Grid item md={12} className="">
                        <Button size="large" variant="contained">Edit account details</Button>
                    </Grid> */}
                </Grid>

                <h2>My reservations</h2>
                <Grid container spacing={2}>
                    {
                        reservations.map((item, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <ReservationCard data={item} key={index}/>
                            </Grid>
                        ))
                    }
                </Grid>

            </Container>
        </div>
    );
}

export default MyAccount;