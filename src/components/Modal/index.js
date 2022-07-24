import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import { useSelector } from 'react-redux';
import { hideModal, selectModal, selectModalContent } from './modalSlice';
import { useDispatch } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function GenericModal() {
    const showModal = useSelector(selectModal);
    const content = useSelector(selectModalContent);
    const dispatch = useDispatch();

    const action = (button) => {
        button.action();
        dispatch(hideModal())
    }

    return (
        <div>
            <Dialog
                fullWidth={true}
                maxWidth={'xs'}
                open={showModal}
                TransitionComponent={Transition}
                keepMounted
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{content.heading}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        {content.message}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {
                        content.buttons.map((btn, index) => {
                            return (<Button key={index} onClick={() => action(btn)}>{btn.text}</Button>)
                        })
                    }
                </DialogActions>
            </Dialog>
        </div>
    );
}
