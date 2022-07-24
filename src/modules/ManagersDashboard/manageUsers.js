import * as React from 'react';
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
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '../../components/Loader/loaderSlice';
import { getUsersByRole, selectAllManagers, selectAllUsers, removeUser } from '../Home/sessionSlice';
import { showModal } from '../../components/Modal/modalSlice';
import AddUserModal from './addUserModal';
import ViewReservationsModal from './viewReservationsModal';

function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

export default function ManageUsers(props) {
    const { type } = props; //usertype
    const [openModal, setOpenModal] = React.useState(false);
    const [editMode, setEditMode] = React.useState(false);
    const [resUserId, setResUserId] = React.useState(null);
    const [editData, setEditData] = React.useState(null);
    const dispatch = useDispatch();
    const [openReservationsModal, setResModal] = React.useState(false);
    const users = useSelector(type === "manager" ? selectAllManagers : selectAllUsers);

    React.useEffect(() => {
        getAllUsersForType()
    }, [])

    const getAllUsersForType = () => {
        dispatch(showLoader())
        dispatch(getUsersByRole(type)).then(res => dispatch(hideLoader()))
    }

    const modalClose = () => {
        setEditMode(false)
        setEditData(null)
        setOpenModal(false)
    }

    const closeResModal = () => {
        setResModal(false);
        setResUserId(null);
    }

    const deleteUser = (id) => {
        dispatch(showLoader())
        dispatch(removeUser(id)).then(res => {
            dispatch(hideLoader())
            getAllUsersForType()
        })
    }

    const editUser = (data) => {
        setEditData(data)
        setEditMode(true)
        setOpenModal(true)
    }

    const seeReservations = (uid) => {
        setResUserId(uid);
        setResModal(true);
    }

    return (
        <div>
            {/* Reservations modal */}
            {openReservationsModal && 
            <ViewReservationsModal 
            from={"users"}
            open={openReservationsModal}
            userId={resUserId}
            onClose={() => closeResModal()}/>}

            {/* Add user modal */}
            {openModal && <AddUserModal
                open={openModal}
                editMode={editMode}
                onClose={() => modalClose()}
                data={editData}
                role={type} />}

            <Button className='spacing-2' variant="outlined" startIcon={<AddIcon />} onClick={() => setOpenModal(true)}>
                Add {type}
            </Button>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            {type === 'user' && <TableCell></TableCell>}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow
                                key={user.uid}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {index + 1}
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.fullName}</TableCell>
                                <TableCell align="right">
                                    <IconButton aria-label="delete" onClick={() => deleteUser(user.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>

                                <TableCell align="right">
                                    <IconButton aria-label="icon" onClick={() => editUser(user)}>
                                        <EditIcon />
                                    </IconButton>
                                </TableCell>
                                {type === 'user' && <TableCell>
                                    <Button variant="text" onClick={() => seeReservations(user.uid)}>See reservations</Button>
                                </TableCell>}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
