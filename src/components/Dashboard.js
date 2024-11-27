import React, { useState, useMemo } from 'react';
import { Chess } from 'chess.js';
import { useNavigate, Navigate } from 'react-router-dom'; // Import useHistory hook
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBBtn,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBRange,
    MDBRadio, 
    MDBBtnGroup,
    MDBInputGroup
  } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

function WelcomeDashboard() {
    const history = useNavigate();
    const [basicModal, setBasicModal] = useState(false);
    const { t, i18n } = useTranslation();
    const [color, setColor] = useState('random');
    const [elo, setElo] = useState('1200'); // default elo
    
    const isAuthenticated = !!Cookies.get('auth');
    if (!isAuthenticated) {
        Cookies.remove('auth');
        history('/'); 
        return <Navigate to="/" />;
    }
    const username = JSON.parse(Cookies.get('auth')).username;

    const toggleOpen = () => setBasicModal(!basicModal);

    const handleLogout = () => {
        Cookies.remove('auth');
        history('/');
    };

    const handleNewGame = async () => {
        try {
            if (!elo || !color) {
                return;
            }
            const gameData = await axios.post(`${process.env.REACT_APP_PICHESS_BACKEND_URL}game/create`, {
                elo, 
                color
            }, { headers: {"Authorization" : `Bearer ${JSON.parse(Cookies.get('auth')).token}`}});
            // save game params in session
            const expirationTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            Cookies.set('currentGame', JSON.stringify(gameData), { expires: expirationTime });
            history('/play');
        } catch (error) {
            console.error('Request failed:', error.response ? error.response.data : error.message);
        }
    };


    return (
        <>
            <MDBNavbar dark bgColor='dark'>
                <MDBContainer fluid>
                    <MDBNavbarBrand href='#'>
                        <img
                            src='images/background-chess-title.png'
                            height='60'
                            alt=''
                            loading='lazy'
                        />
                    </MDBNavbarBrand>
                    <div className="text-center">
                        <button type="button" className="btn btn-danger mt-3" onClick={handleLogout}>{t("logout")}</button>
                    </div>
                </MDBContainer>
            </MDBNavbar>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto', background: '#222' }}>
                    <div className="text-center">
                        <img src="images/background-chess-title.png" alt="chess" style={{margin: '3em auto', width: '70%'}} />
                    </div>
                    <MDBContainer className="p-3">
                        <h2 className="mb-4 text-center">{t("welcome")} {username}</h2>
                        <MDBBtn className='mb-4 d-block' size='lg' rounded color='primary' style={{ height:'50px',width: '100%' }} onClick={toggleOpen}>
                            {t("new_game")}
                        </MDBBtn>
                    </MDBContainer>
                </div>
            </div>
            <MDBModal open={basicModal} onClose={() => setBasicModal(false)} tabIndex='-1'>
                <MDBModalDialog centered>
                    <MDBModalContent>
                        <MDBModalHeader>
                        <MDBModalTitle>Créer une nouvelle partie</MDBModalTitle>
                        <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                        <MDBModalBody>
                            <label htmlFor='color' className='form-label d-block'>Couleur : { color }</label>
                            <MDBInputGroup className='mb-3'>
                                <MDBBtnGroup onChange={(e) => setColor(e.target.id)}>
                                    <MDBRadio btn btnColor='secondary' id='white' name='color' wrapperTag='span' label='Blancs' />
                                    <MDBRadio btn btnColor='secondary' wrapperClass='mx-2' id='black' name='color' wrapperTag='span' label='Noirs' />
                                    <MDBRadio btn btnColor='secondary' id='random' name='color' wrapperTag='span' label='Aléatoire' defaultChecked />
                                </MDBBtnGroup>
                            </MDBInputGroup>

                            <label htmlFor='color' className='form-label d-block'>Niveau ELO : { elo }</label>
                            <MDBInputGroup className='mb-3'>
                                <MDBRange
                                    className='w-100'
                                    defaultValue={1200}
                                    min='600'
                                    max='2600'
                                    step='100'
                                    id='elo'
                                    onChange={(e) => setElo(e.target.value)}
                                />
                            </MDBInputGroup>
                        </MDBModalBody>
                        
                        <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={toggleOpen}>
                            Annuler
                        </MDBBtn>
                        <MDBBtn color='success' onClick={handleNewGame}>Créer</MDBBtn>
                        </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
        </>
    );
}

export default WelcomeDashboard;