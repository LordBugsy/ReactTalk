import styles from './Sign.module.css'
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate  } from 'react-router-dom';
import { useContext, useState, useRef } from 'react';
import Loading from '../Loading/Loading';
import { DataContext } from '../DataProvider/DataProvider';

const SignUp = () => {
    const { updateLocalUsername, updateLocalUserId, updateProfileColour } = useContext(DataContext);
    const [signUpResult, setSignupResult] = useState();
    const navigate = useNavigate(); // Initialize useNavigate

    const containerRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    const closeSignUp = () => {
        // containerRef.current.classList.replace(styles.fadeIn, styles.fadeOut);

        setTimeout(() => navigate("/reacttalk"), 500);
    }

    const submitForm = async (event) => {
        event.preventDefault();

        try {
            setSignupResult(true); // Show loading spinner
            const isUsernameAvailable = await axios.get(`http://localhost:5172/api/users/${usernameRef.current.value}`);
            if (isUsernameAvailable.data.messageState) {
                setSignupResult(false);
                return;
            };
            
            const backendResponse = await axios.post('http://localhost:5172/api/signup', { username: usernameRef.current.value, password: passwordRef.current.value });
            
            updateLocalUsername(backendResponse.data.username);
            updateLocalUserId(backendResponse.data._id);
            updateProfileColour(backendResponse.data.profileColour);

            closeSignUp();
        }

        catch (error) {
            console.error(error);
        }
    }

    return (
        <div ref={containerRef} className={`${styles.signUpContainer}`}>
            <h1 className='logo'>ReactTalk</h1>
            <div className={styles.signUp}>
                <h1 className={styles.header}>Create an account</h1>
                <form id='signUpContainer' method='post' className={styles.signUpForm} onSubmit={submitForm}>
                    <div className={styles.inputBox}>
                        <label htmlFor='username' className={styles.label}>Username</label>
                        <input ref={usernameRef} autoComplete='true' id='username' min='3' max='16' type='text' placeholder='Enter your username..' className={styles.input} name='username' required /> {/* name='username' so we can get the value in Express with req.body.username */}
                    </div>

                    <div className={styles.inputBox}>
                        <label htmlFor='password' className={styles.label}>Password</label>
                        <input ref={passwordRef} id='password' type='password' placeholder='Enter your password..' className={styles.input} name='password' required /> {/* name='password' so we can get the value in Express with req.body.password */}
                    </div>

                    <div className={styles.checkBox}>
                        <input type='checkbox' id='terms' className={styles.checkbox} required />
                        <label htmlFor='terms' className={`${styles.terms} ${styles.label}`}>I have read and agreed to ReactTalk's <a className={styles.legalCompliance} href=''>ToS</a> and <a className={styles.legalCompliance} href=''>Privacy Policy</a>.</label>
                    </div>

                    {signUpResult === false && <p className={styles.error}>Username is already taken. Please pick another one.</p>}
                    {signUpResult === true && <Loading />} 

                    <button type='submit' className={`${styles.button} ${styles.sign}`}>Sign Up</button>

                </form>

                <Link className='link' to='/login'>
                    <p className={styles.redirect}>Already have an account?</p>
                </Link>

            </div>
        </div>
    );
};

export default SignUp;