import styles from './ReactTalk.module.css';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import { DataContext } from '../DataProvider/DataProvider';

const ReactTalk = () => {
    const [loadedTalks, setLoadedTalks] = useState([]);
    const [loading, setLoading] = useState(false);

    const {updateSelectedTalk, updateSelectedTalkId, localUserId, localUsername} = useContext(DataContext)
    const reactTalk = useRef(null);

    const navigate = useNavigate();

    const navigateTalk = (selectedComponent) => {
        reactTalk.current.classList.replace(styles.fadeIn, styles.fadeOut);

        setTimeout(() => navigate(`/${selectedComponent}`), 500);
    }

    const selectedTalk = (name, id) => {
        updateSelectedTalk(name);
        updateSelectedTalkId(id);
    }

    const deleteTalk = async (name, id) => {
        try {
            updateSelectedTalk(name);
            const response = await axios.delete(`http://localhost:5172/api/deletetalk/${id}`);
            
            navigateTalk('deletetalk');
        }

        catch (error) {
            console.error(error);
        }
    }
    
    const deleteEverything = async () => {
        // This function will delete EVERYTHING from the database, use with caution!
        try {
            await axios.get('http://localhost:5172/api/deleteusers');
            await axios.get('http://localhost:5172/api/deletemessages');
            await axios.get('http://localhost:5172/api/deletetalks');
        }

        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const loadTalks = async () => {
            setLoading(true);
            try {
                const talks = await axios.get('http://localhost:5172/api/talks');
                setLoadedTalks(talks.data.talksList);
            }

            catch (error) {
                console.error(error);
            }

            finally {
                setLoading(false);
            }
        }

        loadTalks();
    }, [loadedTalks.length]);

    return (
        <div ref={reactTalk} className={`${styles.reactTalkContainer} ${styles.fadeIn}`}>
            
            <h1 className='title'>ReactTalk Homepage</h1>
            <Link to="/createtalk">
                <button className={`${styles.button} ${styles.createTalk}`}>Create Talk</button>
            </Link>
            
            <div className={styles.reactTalk}>
                {loading && <Loading />}

                { loadedTalks.length === 0 ?
                    <p className={styles.noTalks}>No one created a talk, why don't you become the first one?</p>
                    :
                    
                loadedTalks.map((talk, index) => (
                        <div onClick={() => selectedTalk(talk.talkName, talk._id)} key={index} className={styles.talkCard}>
                            <div className={styles.talkInfo}>
                                <div className={styles.left}>
                                    <div className={styles.image}>
                                        <img src={`/${talk.userID.profileColour}.png`} alt='Profile' className={styles.profileImage} />
                                    </div>
                                    <p className={styles.talkAuthor}>Created by <span className={styles.bold}>{talk.userID.username}</span></p>
                                </div>
                                
                                <div className={styles.right}>
                                    <div className={styles.talkDetails}>
                                        <p className={styles.talkMembers}>Joined by <span className={styles.bold}>{talk.usersList.length} Reacters</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.talkContent}>
                                <h1 className={styles.talkTitle}>{talk.talkName}</h1>
                                <p className={styles.talkDescription}>{talk.talkDescription}</p>
                            </div>

                            <div className={styles.talkActions}>
                                <Link to='/talk'>
                                    <button className={`${styles.button} ${styles.seeChat}`}>See Chat</button>
                                </Link>
                                {talk.userID._id === localUserId ? (
                                    <button onClick={() => deleteTalk(talk.talkName, talk._id)} className={`${styles.button} ${styles.delete}`}>
                                        Delete Talk
                                    </button>
                                ) : (
                                    <Link className='link' to='/report'>
                                        <p className={styles.report}>Report Talk</p>
                                    </Link>
                                )}                            
                            </div>    
                        </div>
                ))}

                {/* If you want to make this button admin only, change the way it works so the button is rendered only when someone has an admin role, not according to their username */}
                {localUsername === "LordBugsy" && <button onClick={() => deleteEverything()} className={`${styles.button} ${styles.delete}`}>Delete Everything</button>}

            </div>
        </div>
    )
}

export default ReactTalk;