import React, { useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddBikeModal from './addBikeModal';
import { useDispatch, useSelector } from 'react-redux';
import { getAllBikes, removeBike, selectBikes } from './bikesSlice';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import ViewReservationsModal from './viewReservationsModal';
import { getUsersByRole } from '../Home/sessionSlice';

export default function ManageBikes() {
  const dispatch = useDispatch();
  const bikes = useSelector(selectBikes);
  const [editMode, setEditMode] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);
  const [editData, setEditData] = React.useState(null);
  const [resBikeId, setResBikeId] = React.useState(null);
  const [openReservationsModal, setResModal] = React.useState(false);


  useEffect(() => {
    getBikes()
    dispatch(getUsersByRole("manager"))
  }, [])

  const getBikes = () => {
    dispatch(showLoader())
    dispatch(getAllBikes()).then(res => dispatch(hideLoader()))
  }

  const deleteBike = (id) => {
    dispatch(showLoader())
    dispatch(removeBike(id)).then(res => {
      dispatch(hideLoader())
      getBikes()
    })
  }

  const editBike = (row) => {
    setEditData(row)
    setEditMode(true)
    setOpenModal(true)
  }

  const modalClose = () => {
    setEditData(null)
    setEditMode(false)
    setOpenModal(false)
  }

  const seeUsersForBike = (id) => {
    setResModal(true);
    setResBikeId(id);
  }

  const closeResModal = () => {
    setResModal(false);
    setResBikeId(null);
}

  return (
    <div>
      {/* Reservations modal */}
      {openReservationsModal &&
        <ViewReservationsModal
          from={"bikes"}
          open={openReservationsModal}
          userId={resBikeId}
          onClose={() => closeResModal()} />}

      {openModal && <AddBikeModal
        open={openModal}
        editMode={editMode}
        onClose={() => modalClose()}
        data={editData} />}
      <Button className='spacing-2' variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
        Add bike
      </Button>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Model</TableCell>
              <TableCell align="right">Location</TableCell>
              <TableCell align="right">Rating</TableCell>
              <TableCell align="right">Color</TableCell>
              <TableCell align="right">Renting status</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bikes.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.model}
                </TableCell>
                <TableCell align="right">{row.location}</TableCell>
                <TableCell align="right">{row.rating}</TableCell>
                <TableCell align="right">{row.color}</TableCell>
                <TableCell align="right">{row.availableToRent ? "Available" : "Unavailable"}</TableCell>

                <TableCell>
                  <Button variant="text" onClick={() => seeUsersForBike(row.id)}>See users</Button>
                </TableCell>

                <TableCell align="right">
                  <IconButton aria-label="delete" onClick={() => deleteBike(row.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

                <TableCell align="right">
                  <IconButton aria-label="delete" onClick={() => editBike(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
