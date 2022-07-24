import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { getAllReservations, getAllReservationsByBike, selectReservations } from '../Reserve/reserveSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate2 } from '../../utils/utilServices';

export default function ViewReservationsModal(props) {
    const { open, userId, onClose, from } = props; //userId contained bikeId when coming from bikes
    const dispatch = useDispatch()
    const reservations = useSelector(selectReservations);

    useEffect(() => {
        getReservations()
    }, [])

    const handleClose = () => {
        onClose()
    };

    const getReservations = () => {
        dispatch(showLoader())
        if (from === 'users') {
            dispatch(getAllReservations(userId)).then(res => dispatch(hideLoader()))
        } else {
            dispatch(getAllReservationsByBike(userId)).then(res => dispatch(hideLoader()))
        }
    }

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"View all reservations"}
                </DialogTitle>
                <DialogContent>
                    {
                        reservations.map(item => (
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{from === 'users' ? item.model : item.userEmail}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {formatDate2(item.fromDate.toDate())} to {formatDate2(item.toDate.toDate())}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
