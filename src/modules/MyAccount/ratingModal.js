import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Rating from '@mui/material/Rating';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { getAllReservations, rateBike, updateHasRated } from '../Reserve/reserveSlice';
import { showModal } from '../../components/Modal/modalSlice';
import { selectCurrentUser } from '../Home/sessionSlice';

export default function RatingModal(props) {
    const { open, onClose, bikeId, resId } = props;
    const [rating, setRating] = React.useState(5);
    const currentUser = useSelector(selectCurrentUser);
    const dispatch = useDispatch()

    const handleClose = () => {
        onClose();
    };

    const submitRating = () => {
        dispatch(showLoader());
        dispatch(rateBike({id: bikeId, rating: rating})).then(res => {
            dispatch(updateHasRated(resId)).then(res => {
                dispatch(getAllReservations(currentUser.uid))
                dispatch(hideLoader())
            })
            dispatch(showModal({
                heading: 'Thanks for you feedback!',
                message: '',
                type: '',
                buttons: [
                    {
                        text: 'Ok',
                        action: () => { }
                    },
                ]
            }))
            handleClose();
        })
    }

    return (
        <div>
            <Dialog
                // fullScreen={fullScreen}
                open={open}
                onClose={handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">
                    {"Rate your experience"}
                </DialogTitle>
                <DialogContent>
                    <Rating
                        name="simple-controlled"
                        size={"large"}
                        value={rating}
                        onChange={(event, newValue) => {
                            setRating(newValue);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button onClick={() => submitRating()} autoFocus>
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
