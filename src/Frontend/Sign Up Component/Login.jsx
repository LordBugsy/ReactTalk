import styles from './Sign.module.css'
import { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import Loading from '../Loading/Loading';

const Login = () => {
    const [loginResult, setLoginResult] = useState();
    const { updateLocalUsername, updateLocalUserId, updateProfileColour } = useContext(DataContext);
    const navigate = useNavigate(); 

    const containerRef = useRef(null);

    const submitForm = async (event) => {
        event.preventDefault();
        try {
            setLoginResult(true); // Show loading spinner
            const backendResponse = await axios.post('http://localhost:5172/api/login', { username: event.target.username.value, password: event.target.password.value });

            // Redirect to ReactTalk if login is successful
            if (backendResponse.data.message !== 'Login successful') {
                setLoginResult(false);
                return;
            };

            // console.log(`Username: ${backendResponse.data.username}, \nID: ${backendResponse.data._id} \nProfile Colour: ${backendResponse.data.profileColour}`);
            updateLocalUsername(backendResponse.data.username);
            updateLocalUserId(backendResponse.data._id);
            updateProfileColour(backendResponse.data.profileColour);

            navigate("/reacttalk");
        }

        catch (error) {
            console.error(error);
        }
    }

    return (
        <div ref={containerRef} className={`${styles.loginContainer}`}>
            <h1 className='logo'>ReactTalk</h1>
            <div className={styles.login}>
                <h1 className={styles.header}>Log in to your account</h1>
                <form id='loginContainer' method='post' className={styles.loginForm} onSubmit={submitForm}>
                    <div className={styles.inputBox}>
                        <label htmlFor='username' className={styles.label}>Username</label>
                        <input autoComplete='true' id='username' type='text' placeholder='Enter your username..' className={styles.input} name='username' required /> {/* name='username' so we can get the value in Express with req.body.username */}
                    </div>

                    <div className={styles.inputBox}>
                        <label htmlFor='password' className={styles.label}>Password</label>
                        <input id='password' type='password' placeholder='Enter your password..' className={styles.input} name='password' required /> {/* name='password' so we can get the value in Express with req.body.password */}
                    </div>

                    <div className={styles.loginResult}>
                        {loginResult === false && <p className={styles.error}>Wrong username or password. Try again.</p>}
                        {loginResult === true && <Loading />} 
                    </div>

                    <button type='submit' className={`${styles.button} ${styles.log}`}>Login</button>

                </form>

                <Link className='link' to='/signup'>
                    <p className={styles.redirect}>Don't have an account?</p>
                </Link>
            </div>
        </div>
    );
};

export default Login;