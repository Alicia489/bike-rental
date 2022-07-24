import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';
import Chip from '@mui/material/Chip';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { imagePath } from '../../utils/utilServices';
import "./bikecard.scss";
import { useDispatch } from 'react-redux';
import { clearFilteredBikes, setSelectedBike } from '../../modules/ManagersDashboard/bikesSlice';
import { showLoader } from '../Loader/loaderSlice';
import { useNavigate } from 'react-router-dom';

export default function BikeCard(props) {
  let { model, color, location, rating, availableToRent, imageUrl } = props.data;
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const reserveClicked = () => {
    dispatch(setSelectedBike(props.data))
    dispatch(clearFilteredBikes())
    navigate('/reserve')
  }

  return (
    <Card className='bikeCardContainer'>
      <CardActionArea>
        <CardMedia
          component="img"
          height="160"
          image={imageUrl}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {model}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Color: {color}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Location: <b>{location}</b>
          </Typography>
          <Rating name="read-only" value={rating} size="large" readOnly />
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button disabled={!availableToRent}
          size="small" fullWidth color="primary" onClick={() => reserveClicked()}>
          Reserve
        </Button>
      </CardActions>
    </Card>
  );
}
