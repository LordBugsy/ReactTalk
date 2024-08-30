import styles from './Profile.module.css';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import axios from 'axios';
import Loading from '../Loading/Loading';
import { Link, useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const {localUserId, updateSelectedTalk, updateSelectedTalkId } = useContext(DataContext);
    const [talksJoined, setTalksJoined] = useState();
    const [talksCreated, setTalksCreated] = useState();

    useEffect(() => {
        const getTalksJoined = async () => {
            try {
                const response = await axios.get(`http://localhost:5172/api/talksjoined/${localUserId}`);
                setTalksJoined(response.data.talks);
            } 
    
            catch (error) {
                console.error(error);
                return;
            }
        }

        const getTalksCreated = async () => {
            try {
                const response = await axios.get(`http://localhost:5172/api/talkscreated/${localUserId}`);
                setTalksCreated(response.data.talks);
            } 
    
            catch (error) {
                console.error(error);
                return;
            }
        }

        getTalksJoined();
        getTalksCreated();
    }, [localUserId]);

    const redirectTalk = (talkID, talkName) => {
        updateSelectedTalk(talkName);
        updateSelectedTalkId(talkID);
        navigate('/talk');
    }

    const deleteTalk = async (talkId) => {
        try {
            const response = await axios.delete(`http://localhost:5172/api/deletetalk/${talkId}`);
            setTalksCreated(talksCreated.filter(talk => talk._id !== talkId));
        }

        catch (error) {
            console.error(error);
        }

        finally {
            navigate('/reacttalk');
        }
    }

    return (
        <div className={`${styles.profileContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Your Talks</h1>
            <div className={styles.profile}>
                <div className={styles.talksJoined}>
                    <h1 className={styles.divTitle}>Talks Joined</h1>
                    <div className={styles.talks}>
                        {talksJoined && talksJoined.length > 0 ? (
                            talksJoined.map((talk, index) => (
                                <div key={index} className={styles.talk}>
                                    <h1 className={styles.talkTitle}>
                                        {talk.talkName} <span className={styles.reacterAmount}>({talk.usersList.length} Reacters)</span>
                                    </h1>
                                    <button onClick={() => redirectTalk(talk._id, talk.talkName)} className={`${styles.button} ${styles.view}`}>
                                        View
                                    </button>
                                </div>
                            ))
                        ) : talksJoined ? (
                            <p className={styles.noTalks}>
                                You haven't joined any talks yet. Why don't you <span className={styles.redirect}><Link className='link' to='/reacttalk'>join one?</Link></span>
                            </p>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>

                <div className={styles.talksCreated}>
                    <h1 className={styles.divTitle}>Talks Created</h1>
                    <div className={styles.talks}>
                        {talksCreated && talksCreated.length > 0 ? (
                            talksCreated.map((talk, index) => (
                                <div key={index} className={styles.talk}>
                                    <h1 className={styles.talkTitle}>
                                        {talk.talkName} <span className={styles.reacterAmount}>({talk.usersList.length} Reacters)</span>
                                    </h1>
                                    <div className={styles.controls}>
                                        <button className={`${styles.button} ${styles.view}`}>View</button>
                                        <button onClick={() => {deleteTalk(talk._id)}} className={`${styles.button} ${styles.delete}`}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : talksCreated ? (
                            <p className={styles.noTalks}>
                                You haven't created any talks yet. Why don't you <span className={styles.redirect}><Link className='link' to='/createtalk'>create one?</Link></span>
                            </p>
                        ) : (
                            <Loading />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;