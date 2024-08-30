import styles from './Talk.module.css';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import Loading from '../Loading/Loading';
import { useNavigate } from 'react-router-dom';

const SearchTalk = () => {
    const navigate = useNavigate();

    const { updateSelectedTalk, updateSelectedTalkId, localSearchTalk } = useContext(DataContext);
    const [searchResults, updateSearchResults] = useState([]);
    const [loading, updateLoading] = useState(true);

    const [searchButton, setSearchButton] = useState(false);

    const searchTalk = async () => {
        try {
            const response = await axios.get(`http://localhost:5172/api/searchtalks/${localSearchTalk}`);
            updateSearchResults(response.data.talks);
        } 
        
        catch (error) {
            console.error(error);
        }

        finally {
            updateLoading(false);
            setSearchButton(!searchButton);
        }
    }

    const getTalkInfo = (name, id) => {
        updateSelectedTalk(name);
        updateSelectedTalkId(id);

        navigate('/talk');
    }

    useEffect(() => {
        searchTalk();
    }, [searchButton]);

    return (
        <div className={`${styles.searchContainer} ${styles.fadeIn}`}>
            <h1 className='title'>Search Results</h1>
            <div className={styles.search}>
                { loading && <Loading /> }
                { searchResults.length > 0 ? searchResults.map((talk, index) => (
                    <div key={index} className={styles.talk}>
                        <h2 className={styles.talkTitle}>{talk.talkName}</h2>

                        <div>
                            <p className={styles.talkCreator}>Created by: {talk.userID.username}</p>
                            <p className={styles.talkAmount}>Joined by <span className={styles.bold}>{talk.usersList.length} Reacters</span></p>
                        </div>
                        <button onClick={() => getTalkInfo(talk.talkName, talk._id)} className={`${styles.button} ${styles.moreInfo}`}>More Info</button>
                    </div>
                )) : 
                (
                <div className={styles.noResults}>
                    <h1 className={styles.noResultsTitle}>No Results Found</h1>
                    <p className={styles.noResultsDescription}>Try searching for something else</p>
                </div>
                )}
            </div>
        </div>
    )
}

export default SearchTalk;