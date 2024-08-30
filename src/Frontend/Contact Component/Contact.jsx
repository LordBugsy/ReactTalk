import styles from './Contact.module.css';
import { Link } from 'react-router-dom';

const Contact = () => {

    return (
        <div className={`${styles.contactContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Contact</h1>
            <div className={styles.contact}>
                <h1 className={styles.talkTitle}>Let us know what's happening so we can enhance the user experience on ReactTalk.</h1>

                <textarea name='contactInput' className={styles.contactInput} placeholder="Please provide a reason for your report.." />

                <div>
                    <Link className='link' to='/reacttalk'> {/* This button doesn't do what it is supposed to because ReactTalk is a project, not a real social media. If it was one, this button would've been correctly implemented */}
                        <button className={`${styles.button} ${styles.send}`}>Send</button>
                    </Link>
                </div>
                
            </div>
        </div>
    )
}

export default Contact;