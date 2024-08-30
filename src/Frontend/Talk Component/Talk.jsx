import styles from './Talk.module.css';
import { useEffect, useRef, useContext, useState } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';

const Talk = () => {
    const { selectedTalk, selectedTalkId, localUserId } = useContext(DataContext);
    const navigate = useNavigate();
    const bottomRef = useRef(null);
    const messageInput = useRef(null);

    const [talkContent, setTalkContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [messageSent, setMessageSent] = useState(false);

    const sendMessage = async (event) => {
        setMessageSent(true);
        event.preventDefault();
        const message = event.target.messageToSend.value;
    
        try {
            const backendResponse = await axios.post('http://localhost:5172/api/message', { userID: localUserId, talkID: selectedTalkId, message });
        }

        catch(error) {
            console.error(error);
        }

        finally {
            event.target.messageToSend.value = '';
            setMessageSent(false);
        }
    };

    const talkAction = async (action) => {
        try {
            const backendResponse = await axios.post(`http://localhost:5172/api/${action}talk/${selectedTalkId}`, { userID: localUserId });
        }

        catch(error) {
            console.error(error);
        }

        finally {
            setMessageSent(true);
            if (action === "leave") navigate('/reacttalk');
        }
    }

    useEffect(() => {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView(); // 'scrollIntoView' is a method that scrolls the element into the visible area of the browser window
        }
    }, [talkContent]); 

    useEffect(() => {
        const getTalkById = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:5172/api/talks/${selectedTalkId}`);
                setTalkContent(response.data);
            } 
            
            catch (error) {
                console.error(error);
            } 
            
            finally {
                setLoading(false); 
            }
        };
    
        getTalkById();
    }, [selectedTalkId, messageSent]);

    useEffect(() => {
        if (messageInput.current) messageInput.current.focus();
    }, [messageSent, talkContent])

    return (
        <div className={`${styles.talkContainer} ${styles.fadeIn}`}>
            {loading ? (
                <Loading />
            ) : (
                <>
                    <div className={styles.talkHeader}>
                        <i onClick={() => navigate('/reacttalk')} className={`ri-arrow-left-line ${styles.icon}`}></i>
                        <p className={styles.talkName}>{talkContent ? talkContent.talk.talkName : selectedTalk}</p>
    
                        <div className={styles.right}>
                            {talkContent && talkContent.talk.usersList.includes(localUserId) ? (
                                (talkContent.talk.userID._id !== localUserId && <button onClick={() => talkAction('leave')} className={`${styles.button} ${styles.leave}`}>Leave</button>)
                            ) : (
                                <button onClick={() => talkAction('join')} className={`${styles.button} ${styles.join}`}>Join</button>
                            )}
                            <button onClick={() => navigate('/report')} className={`${styles.button} ${styles.report}`}>Report</button>
                        </div>
                    </div>
    
                    <div className={`${styles.responsive} ${styles.controls}`}>
                            {talkContent && talkContent.talk.usersList.includes(localUserId) ? (
                                (talkContent.talk.userID._id !== localUserId && <button onClick={() => talkAction('leave')} className={`${styles.button} ${styles.leave}`}>Leave</button>)
                            ) : (
                                <button onClick={() => talkAction('join')} className={`${styles.button} ${styles.join}`}>Join</button>
                            )}
                        <button className={`${styles.button} ${styles.report}`}>Report</button>
                    </div>

                    <div className={styles.sep} />
    
                    {talkContent && talkContent.messages && talkContent.messages.length > 0 ? (
                        talkContent.messages.map((message, index) => {
                            // Determine if the talkAuthor div should be shown
                            const showAuthor = index === 0 || message.userID._id !== talkContent.messages[index - 1].userID._id;

                            return (
                                    <div key={index} className={styles.talkMessages}>
                                        <div className={styles.talkCard}>
                                            {showAuthor && (
                                                <>
                                                <div className={styles.messageSep} />
                                                <div className={styles.talkAuthor}>
                                                    <img src={`/${message.userID.profileColour}.png`} alt="Author" className={styles.authorImage} />
                                                    <p className={styles.authorName}>{message.userID.username}</p>
                                                </div>
                                                </>
                                            )}

                                            <div className={styles.talkContent}>
                                                <p className={styles.talkText}>{message.message}</p>
                                            </div>
                                        </div>
                                    </div>
                            );
                        })
                    ) : (
                        <p className={styles.noMessages}>No messages sent in this talk yet, why don't you become the first one?</p>
                    )}
                    <div className={styles.bottomRef} ref={bottomRef} />
    
                
                    {talkContent && talkContent.talk.usersList.includes(localUserId) ? (
                        <form method='post' className={styles.talkInput} onSubmit={sendMessage}>
                            <input ref={messageInput} name='messageToSend' type="text" placeholder="Type a message..." max="99" className={styles.input} />
                            <button className={`${styles.button} ${styles.send}`}>
                                <i className={`ri-send-plane-fill`}></i>
                            </button>
                        </form>
                    ) : (
                        <p className={styles.noMessages}>You need to join this talk to send messages!</p>
                    )
                }
                </>
            )}
        </div>
    );
}

export default Talk;