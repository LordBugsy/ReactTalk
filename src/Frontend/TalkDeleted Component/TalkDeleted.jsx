import styles from './TalkDeleted.module.css';
import { useContext } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import { useNavigate } from 'react-router-dom';

const TalkDeleted = () => {
    const navigate = useNavigate();
    const { selectedTalk } = useContext(DataContext);

    return (
        <div className={`${styles.deleteTalkContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Why have you deleted your Talk?</h1>
            <div className={styles.deleteTalk}>
                <h1 className={styles.talkTitle}><span className={styles.target}>"{selectedTalk}"</span></h1>

                <textarea name='deleteTalk' className={styles.deleteTalkInput} placeholder="Please provide a reason on why you deleted your talk.." />

                <div>
                    <button onClick={() => navigate('/reacttalk')} className={`${styles.button} ${styles.deleteTalk}`}>Send</button>
                </div>
                
            </div>
        </div>
    )
}

export default TalkDeleted;