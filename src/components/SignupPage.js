import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
    MDBContainer,
    MDBInput,
    MDBBtn,
} from 'mdb-react-ui-kit';
import { useTranslation } from "react-i18next";

function SignupPage() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();
    const { t, i18n } = useTranslation();

    const handleSignup = async () => {
        try {
            // Check for empty fields
            if (!fullName || !email || !password || !confirmPassword) {
                setError(t('please_fill_in'));
                return;
            }

            if (password !== confirmPassword) {
                throw new Error(t('passwords_do_not_match'));
            }

            await axios.post(`${process.env.REACT_APP_PICHESS_BACKEND_URL}auth/signup`, {
                fullName,
                email,
                password
            });
            history('/dashboard');
        } catch (error) {
            console.error('Signup failed:', error.response ? error.response.data : error.message);
            setError(error.response ? error.response.data : error.message);
        }
    };

    const handleLogin = () => {
        history('/');
    };

    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="border rounded-lg p-4" style={{ width: '500px', height: 'auto', background: '#222' }}>
                <div className="text-center">
                    <img src="images/background-chess-title.png" alt="chess" style={{margin: '3em auto', width: '70%'}} />
                </div>
                <MDBContainer className="p-3">
                    <h2 className="mb-4 text-center">{t("sign_up_title")}</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <MDBInput wrapperClass='mb-4' size="lg" id={t("full_name")} label={t("full_name")} 
                        value={fullName} type='text' onChange={(e) => setFullName(e.target.value)}/>
                    <MDBInput wrapperClass='mb-4' size="lg" label={t("email_address")} id='email' 
                        value={email} type='email' onChange={(e) => setEmail(e.target.value)}/>
                    <MDBInput wrapperClass='mb-4' size="lg" label={t("password")} id='password' type='password' 
                        value={password} onChange={(e) => setPassword(e.target.value)}/>
                    <MDBInput wrapperClass='mb-4' size="lg" label={t("confirm_password")} id='confirmPassword' type='password' 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                    <MDBBtn className='mb-5 d-block' size='lg' rounded color='success' 
                        style={{ height:'50px',width: '100%' }} onClick={handleSignup}>{t("sign_up")}</MDBBtn>

                    <div className="text-center">
                        <p>{t("already_registered")}</p>
                    </div>
                    <MDBBtn className='mb-4 d-block' size='lg' rounded color='info' style={{ height:'50px',width: '100%' }} onClick={handleLogin}>
                        {t("login")}
                    </MDBBtn>

                </MDBContainer>
            </div>
        </div>
    );
}

export default SignupPage;