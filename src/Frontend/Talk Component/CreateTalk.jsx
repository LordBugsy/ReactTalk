import { useState, useRef, useContext } from 'react';
import styles from './Talk.module.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { DataContext } from '../DataProvider/DataProvider';
import { useNavigate } from 'react-router-dom';

const CreateTalk = () => {
    const navigate = useNavigate();
    const {localUserId} = useContext(DataContext);
    const [talkTitle, setTalkTitle] = useState('');
    const [talkDescription, setTalkDescription] = useState('');
    const talkContainer = useRef(null);

    const isFormValid = talkTitle.trim().length >= 3 && talkDescription.trim().length >= 10;

    const navigateToMain = () => {
        talkContainer.current.classList.replace(styles.fadeIn, styles.fadeOut);
        setTimeout(() => {
            navigate('/reacttalk');
            
        }, 500);
    }

    const createTalk = async (event) => {
        event.preventDefault();
        try {
            const backendResponse = await axios.post('http://localhost:5172/api/talk', { talkName: talkTitle, talkDescription, userID: localUserId });

            // Navigate to another page after successful creation
            navigateToMain();
        } 
        
        catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <div ref={talkContainer} className={`${styles.createTalkContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Create a Talk</h1>
            <form method='post' className={styles.createTalk} onSubmit={createTalk}>
                <label htmlFor='talkTitle' className={styles.label}>Talk Title</label>
                <input spellCheck='false' id='talkTitle' type='text'  placeholder='Enter your talk title..' className={styles.input} name='talkTitle' value={talkTitle} onChange={(e) => setTalkTitle(e.target.value)} required />

                <label htmlFor='talkDescription' className={styles.label}>Talk Description</label>
                <textarea spellCheck='false' id='talkDescription' placeholder='Enter your talk description..' className={styles.textArea} name='talkDescription' value={talkDescription} onChange={(e) => setTalkDescription(e.target.value)} required />

                <div className={styles.controls}>
                    <Link to='/reacttalk'>
                        <button className={`${styles.button} ${styles.cancel}`}>Cancel</button>
                    </Link>

                    <button className={`${styles.button} ${isFormValid ? styles.create : styles.disabled}`} disabled={!isFormValid}>Create Talk</button>
                </div>
            </form>
        </div>
    );
}

export default CreateTalk;
