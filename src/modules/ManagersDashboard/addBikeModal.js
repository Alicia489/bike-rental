import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import { locations } from '../BikesListing/constants';
import "./manageDash.scss";
import { useDispatch } from 'react-redux';
import { createBike, getAllBikes, updateBike } from './bikesSlice';
import { showModal } from '../../components/Modal/modalSlice';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';

export default function AddBikeModal(props) {
    const { open, onClose, data, editMode } = props;
    const [model, setModel] = React.useState("");
    const [imageUrl, setImageUrl] = React.useState("");
    const [color, setColor] = React.useState("");
    const [availableToRent, setAvailableToRent] = React.useState(true);
    const [location, setLocation] = React.useState(""); //dropdown
    const dispatch = useDispatch();

    useEffect(() => {
        if (editMode) {
            setModel(data.model)
            setColor(data.color)
            setLocation(data.location)
        }
    }, [])

    const handleClose = () => {
        clearInputs()
        onClose()
    };

    const clearInputs = () => {
        setModel("")
        setColor("")
        setLocation("")
        setAvailableToRent(true)
    }

    const addBike = () => {
        if (model && color && location) {
            dispatch(showLoader())
            dispatch(createBike({ model, color, location, availableToRent, imageUrl })).then(res => {
                dispatch(hideLoader())
                dispatch(showModal({
                    heading: 'Bike created successfully',
                    message: '',
                    type: '',
                    buttons: [
                        {
                            text: 'Ok',
                            action: () => { }
                        },
                    ]
                }))
                dispatch(getAllBikes())
                handleClose();
            })
        }
    }

    const editBike = () => {
        let newData = { model, color, location, availableToRent }

        dispatch(showLoader())
        dispatch(updateBike({ id: data.id, data: newData })).then(res => {
            dispatch(hideLoader())
            dispatch(getAllBikes())
            handleClose();
        })
    }

    const handleSubmit = () => {
        if (!editMode) {
            addBike()
        } else {
            editBike();
        }
    }

    return (
        <div className="add-bike-modal-container">
            <Dialog open={open} onClose={handleClose} className="add-bike-modal-wrapper">
                <DialogTitle>{editMode ? 'Edit bike' : 'Add a new bike'}</DialogTitle>
                <DialogContent>
                    <DialogContentText className='spacing-2'>
                        Please enter all fields
                    </DialogContentText>
                    <Grid container spacing={2}>
                        <Grid item sm={12}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                label="Model name"
                                type="text"
                                className="w-100"
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item sm={12}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                label="Image URL"
                                type="text"
                                className="w-100"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item sm={6}>
                            <TextField
                                autoFocus
                                variant="outlined"
                                label="Color"
                                type="text"
                                className="w-100"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item sm={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Location</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={location}
                                    label="Location"
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    {
                                        locations.map(({ value, name }, index) => <MenuItem value={value} key={index}>{name}</MenuItem>)
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item sm={12}>
                            <FormControlLabel 
                            control={<Checkbox
                                checked={availableToRent}
                                onChange={(e) => setAvailableToRent(e.target.checked)}
                                inputProps={{ 'aria-label': 'controlled' }}
                              />} 
                            label="Available to rent" />
                        </Grid>

                    </Grid>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={() => handleSubmit()}>
                        {editMode ? 'Save changes' : 'Add bike'}
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
