import React, {useEffect} from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import "./styles/base.scss";
import "./styles/styles.css";
import Header from './components/header';
import Footer from './components/footer';
import Loader from './components/Loader';
import GenericModal from './components/Modal';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './modules/Home';
import BikesListing from './modules/BikesListing';
import ReserveBike from './modules/Reserve';
import MyAccount from './modules/MyAccount';
import ManagersDashboard from './modules/ManagersDashboard';
import { Util } from './utils/util';
import { useDispatch } from 'react-redux';
import { setUserDetails } from './modules/Home/sessionSlice';

const PrivateManagerWrapper = ({ children }) => {
  if (Util.getAuthToken() && Util.getUserRole() === "manager") {
    return children
  }

  return <Navigate to="/" replace />
};

const PrivateUserWrapper = ({ children }) => {
  if (Util.getAuthToken() && Util.getUserRole() === "user") {
    return children
  }

  return <Navigate to="/" replace />
};

const Public = ({ children }) => {
  let toRoute = Util.getUserRole() === "user" ? "/bikes" : '/managers/dashboard'
  return !Util.getAuthToken() ? children : <Navigate to={toRoute} replace />
};


function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (Util.getAuthToken()) {
      dispatch(setUserDetails(Util.getUserDetails()))
    }
  }, [])

  return (
    <div className="App">
      <Header />

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Public><Home /></Public>} />
        <Route path="/bikes" element={<PrivateUserWrapper><BikesListing /></PrivateUserWrapper>} />
        <Route path="/reserve" element={<PrivateUserWrapper><ReserveBike /></PrivateUserWrapper>} />
        <Route path="/my-account" element={<PrivateUserWrapper><MyAccount /></PrivateUserWrapper>} />
        <Route path="/managers/dashboard" element={<PrivateManagerWrapper><ManagersDashboard /></PrivateManagerWrapper>} />
      </Routes>

      {/* <Footer /> */}
      <Loader />
      <GenericModal />
    </div>
  );
}

export default App;
