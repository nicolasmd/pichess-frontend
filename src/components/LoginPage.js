import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const [error, setError] = useState('');
    const history = useNavigate();
    const { t, i18n } = useTranslation();

    const handleLogin = async () => {
        try {
            if (!email || !password) {
                setError(t('please_enter_username'));
                return;
            }
            const response = await axios.post(`${process.env.REACT_APP_PICHESS_BACKEND_URL}auth/signin`, { email, password });
            const userData = {
                username: response.data.username,
                token: response.data.jwt
            };
            const expirationTime = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
            Cookies.set('auth', JSON.stringify(userData), { expires: expirationTime });

            history('/dashboard');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setError(t('bad_credentials'));
        }
    };

    const handleRegister = () => {
        history('/signup');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto', background: '#222' }}>
                <div className="text-center">
                    <img src="images/background-chess-title.png" alt="chess" style={{margin: '3em auto', width: '70%'}} />
                </div>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">{t("login_title")}</h2>
                    <MDBInput size="lg" wrapperClass='mb-4' label={t("email_address")} id='email' value={email} type='email' onChange={(e) => setEmail(e.target.value)} />
                    <MDBInput size="lg" wrapperClass='mb-4' label={t("password")} id='password' type='password' value={password} onChange={(e) => setPassword(e.target.value)} />

                    {error && <p className="text-danger">{error}</p>}
                    <MDBBtn className='mb-5 d-block' size='lg' rounded color='success' style={{ height:'50px',width: '100%' }} onClick={handleLogin}>
                        {t("sign_in")}
                    </MDBBtn>
                    <div className="text-center">
                        <p>{t("not_a_member")}</p>
                    </div>
                    <MDBBtn className='mb-4 d-block' size='lg' rounded color='primary' style={{ height:'50px',width: '100%' }} onClick={handleRegister}>
                        {t("register")}
                    </MDBBtn>
                    
                </MDBContainer>
            </div>
        </div>
    );
}

export default LoginPage;