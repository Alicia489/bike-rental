import React, { useEffect } from 'react';
import Grid from '@mui/material/Grid';
import BikeCard from '../../components/BikeCard';
import Container from '@mui/material/Container';
import "./bikelisting.scss";
import SearchFilters from './searchFilters';
import { useDispatch, useSelector } from 'react-redux';
import { clearFilteredBikes, getAllBikes, selectFilteredBikes } from '../ManagersDashboard/bikesSlice';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';

let initialFilters = {
  color: '',
  location: '',
  model: '',
  rating: null
}

function BikesListing() {
  const dispatch = useDispatch();
  const bikes = useSelector(selectFilteredBikes);
  const [filters, setFilters] = React.useState(initialFilters)

  useEffect(() => {
    getBikes()
  }, [])

  const getBikes = () => {
    dispatch(showLoader())
    dispatch(getAllBikes()).then(res => dispatch(hideLoader()))
  }

  const clearFilters = () => {
    setFilters(initialFilters);
    dispatch(clearFilteredBikes())
  }

  return (
    <div className="bike-listing-container">
      {filters.color} {filters.location}
      <Container maxWidth="lg">
        <SearchFilters onFilterChange={(field, value) => setFilters({ ...filters, [field]: value })}
          onClearFilters={() => clearFilters()} />
        <Grid container spacing={2}>
          {
            bikes
              .filter(e => filters.location ? e.location === filters.location : true)
              .filter(e => e.color ? e.color.toLowerCase().includes(filters.color.toLowerCase()) : true)
              .filter(e => e.model ? e.model.toLowerCase().includes(filters.model.toLowerCase()) : true)
              .filter(e => e.rating !== null ? e.rating >= filters.rating : true)
              .map((bike, index) => {
                return (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <BikeCard data={bike} />
                  </Grid>
                )
              })
          }
        </Grid>
      </Container>
    </div>
  );
}

export default BikesListing;