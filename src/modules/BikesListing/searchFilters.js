import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { colors, locations, models, ratings } from './constants';
import { formatDate, addDays, checkIfDatesOverlap } from '../../utils/utilServices';
import { useDispatch } from 'react-redux';
import { filterBikes } from '../ManagersDashboard/bikesSlice';
import { getAllReservations } from '../Reserve/reserveSlice';
import { setSelectedBike } from '../../modules/ManagersDashboard/bikesSlice';
import MuiAlert from '@mui/material/Alert';


const MAX_DAYS = 400;
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SearchFilters(props) {
    const { onFilterChange, onClearFilters } = props;
    const [fromDate, setFromDate] = React.useState(null);
    const [toDate, setToDate] = React.useState(null);
    const [model, setModel] = React.useState(null);
    const [color, setColor] = React.useState(null);
    const [location, setLocation] = React.useState(null);
    const [rating, setRating] = React.useState(null);
    const dispatch = useDispatch()
    const [open, setOpen] = React.useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    useEffect(() => {
        setFromDate(formatDate("YMD", addDays(new Date(), 1)))
        dispatch(setSelectedBike({ fromDate: formatDate("YMD", new Date()) }))
    }, [])

    const clearFilters = () => {
        onClearFilters()
        document.getElementById('todate').value = ""
        document.getElementById('fromdate').value = ""

        setFromDate(null)
        setToDate(null)
        setModel(null)
        setColor(null)
        setLocation(null)
        setRating(null)
    }

    const search = () => {
        if (fromDate && toDate && (fromDate < toDate)) {
            dispatch(getAllReservations()).then(res => {
                getReservedBikeIds(res.payload)
            })
        } else {
            setOpen(true)
        }
    }

    const getReservedBikeIds = (res) => {
        let bikeIds = []
        res.forEach(item => {
            if (checkIfDatesOverlap(item.fromDate.toDate(), item.toDate.toDate(), new Date(fromDate), new Date(toDate))) {
                if (!bikeIds.includes(item.bikeId)) {
                    bikeIds.push(item.bikeId)
                }
            }
        })

        dispatch(filterBikes(bikeIds));
    }

    return (
        <div className="search-filters-container">
            <h5>Enter from & to dates to get started</h5>
            <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity="warning" sx={{ width: '100%' }}>
                    Invalid date selection. Please try again after changing the date values
                </Alert>
            </Snackbar>
            <Grid container spacing={2} className="pt-2">
                {/* From date */}
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        variant="outlined"
                        id="fromdate"
                        label="From"
                        type="date"
                        inputProps={{
                            min: formatDate("YMD", addDays(new Date(), 1))
                        }}
                        className="date-pick"
                        value={fromDate}
                        onChange={(e) => { setFromDate(e.target.value); dispatch(setSelectedBike({ fromDate: e.target.value })) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    //   error={dateError ? true : false}
                    //   helperText={dateError}
                    />
                </Grid>

                {/* To date */}
                <Grid item xs={6} sm={3} md={2}>
                    <TextField
                        variant="outlined"
                        id="todate"
                        label="From"
                        type="date"
                        className="date-pick"
                        value={toDate}
                        inputProps={{
                            min: formatDate("YMD", addDays(new Date(fromDate), 1)),
                            max: formatDate("YMD", addDays(new Date(fromDate), MAX_DAYS))
                        }}
                        onChange={(e) => { setToDate(e.target.value); dispatch(setSelectedBike({ toDate: e.target.value })) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    //   error={dateError ? true : false}
                    //   helperText={dateError}
                    />
                </Grid>

                <Grid item md={2}>
                    <Button variant="contained" disabled={!fromDate || !toDate} onClick={() => search()}>Search</Button>
                </Grid>

                <Grid item md={2}>
                    <Button variant="text" onClick={() => clearFilters()}>Clear filters</Button>
                </Grid>
            </Grid>

            {/* Color */}
            <Grid container spacing={2} className="pt-2">
                <Grid item xs={3} md={2}>
                    <TextField
                        autoFocus
                        variant="outlined"
                        label="Color"
                        type="text"
                        className="w-100"
                        value={color}
                        onChange={(e) => { setColor(e.target.value); onFilterChange('color', e.target.value) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                {/* Model */}
                <Grid item xs={3} md={2}>
                    <TextField
                        autoFocus
                        variant="outlined"
                        label="Model"
                        type="text"
                        className="w-100"
                        value={model}
                        onChange={(e) => { setModel(e.target.value); onFilterChange('model', e.target.value) }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </Grid>

                {/* Location */}
                <Grid item xs={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Location</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={location}
                            label="Location"
                            onChange={(e) => { setLocation(e.target.value); onFilterChange('location', e.target.value) }}
                        >
                            {
                                locations.map(({ value, name }) => <MenuItem value={value}>{name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Grid>

                {/* Rating */}
                <Grid item xs={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Rating</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={rating}
                            label="Rating"
                            onChange={(e) => { setRating(e.target.value); onFilterChange('rating', e.target.value) }}
                        >
                            {
                                ratings.map(({ value, name }) => <MenuItem value={value}>{name}</MenuItem>)
                            }
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>

    );
}
