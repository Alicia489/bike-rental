import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { getUsersByRole, signUp, updateUser } from '../Home/sessionSlice';
import { showModal } from '../../components/Modal/modalSlice';

const TEMP_PASSWORD = 'password123';

export default function AddUserModal(props) {
    const { open, onClose, role, data, editMode } = props;
    const [email, setEmail] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const dispatch = useDispatch()

    useEffect(() => {
        if (editMode) {
            setEmail(data.email)
            setFullName(data.fullName)
        }
    }, [])

    const handleClose = () => {
        clearInputs();
        onClose();
    };

    const clearInputs = () => {
        setEmail("")
        setFullName("")
    }

    const add = () => {
        dispatch(showLoader())
        let data = {
            email,
            fullName,
            password: TEMP_PASSWORD,
            role
        }
        dispatch(signUp(data)).then(res => {
            dispatch(hideLoader())

            dispatch(getUsersByRole(role))

            dispatch(showModal({
                heading: 'User/Manager added successfully',
                message: '',
                type: '',
                buttons: [
                    {
                        text: 'Ok',
                        action: () => { }
                    },
                ]
            }))
            handleClose()
        })
    }

    const editUser = () => {
        let newData = { fullName }

        dispatch(showLoader())
        dispatch(updateUser({ id: data.id, data: newData })).then(res => {
            dispatch(hideLoader())
            dispatch(getUsersByRole(role))
            handleClose();
        })
    }

    const handleSubmit = () => {
        if (!editMode) {
            add()
        } else {
            editUser();
        }
    }

    return (
        <div>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add a new {role}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter the following details to add {role}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="em"
                        inputProps={{
                            readOnly: editMode
                        }}
                        label="Email Address"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        variant="standard"
                    />

                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Full name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>{editMode ? "Edit" : "Add"} {role}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
