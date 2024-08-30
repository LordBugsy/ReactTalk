import styles from './Report.module.css';
import { useContext } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import { Link } from 'react-router-dom';

const Report = () => {
    const { selectedTalk } = useContext(DataContext);

    return (
        <div className={`${styles.reportContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Report Talk</h1>
            <div className={styles.report}>
                <h1 className={styles.talkTitle}>Why are you reporting <span className={styles.target}>{selectedTalk}</span>?</h1>

                <textarea name='reportInput' className={styles.reportInput} placeholder="Please provide a reason for your report.." />

                <div>
                    <Link className='link' to='/reacttalk'> {/* This button doesn't do what it is supposed to because ReactTalk is a project, not a real social media. If it was one, this button would've been correctly implemented */}
                        <button className={`${styles.button} ${styles.report}`}>Send Report</button>
                    </Link>
                </div>
                
            </div>
        </div>
    )
}

export default Report;