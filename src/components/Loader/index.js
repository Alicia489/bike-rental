import React from 'react';
import { useSelector } from 'react-redux';

import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { selectLoader } from './loaderSlice';

function Loader() {
    const showLoader = useSelector(selectLoader);
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={showLoader}
        >
            <CircularProgress color="inherit" />
        </Backdrop>
    );
}

export default Loader;