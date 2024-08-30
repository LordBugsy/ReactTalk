import styles from './Header.module.css'
import { useContext, useEffect, useRef } from 'react';
import { DataContext } from '../DataProvider/DataProvider';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const { localUsername, localProfileColour, updateLocalSearchTalk } = useContext(DataContext)

    const searchInput = useRef(null);
    const responsiveSearchInput = useRef(null);
    const hiddenNavBar = useRef(null);
    const hiddenSearchBar = useRef(null);

    const burgerSearch = useRef(null);
    const iconSearch = useRef(null);

    const showNavBar = () => {
        // if it contains slideRight, then its hidden, else its visible. it should be the other way around but since I don't want to mess anything up, I'll just do let it be
        hiddenNavBar.current.classList.contains(styles.slideLeft) ? hiddenNavBar.current.classList.replace(styles.slideLeft, styles.slideRight) : hiddenNavBar.current.classList.replace(styles.slideRight, styles.slideLeft);
    }

    const showSearchBar = () => {
        hiddenSearchBar.current.classList.contains(styles.slideUp) ? hiddenSearchBar.current.classList.replace(styles.slideUp, styles.slideDown) : hiddenSearchBar.current.classList.replace(styles.slideDown, styles.slideUp);
    }

    const searchTalk = searchedTalk => {
        updateLocalSearchTalk(searchedTalk);
        navigate('/search');
    }

    useEffect(() => {
        const handleClickOutsideNavBar = event => {
            if (hiddenNavBar.current.classList.contains(styles.slideLeft) && !hiddenNavBar.current.contains(event.target) && !burgerSearch.current.contains(event.target)) showNavBar();
        }

        document.addEventListener('mousedown', handleClickOutsideNavBar);

        return () => document.removeEventListener('mousedown', handleClickOutsideNavBar);
    }, []);

    useEffect(() => {
        const handleClickOutsideSearchBar = event => {
            if (hiddenSearchBar.current.classList.contains(styles.slideDown) && !hiddenSearchBar.current.contains(event.target) && !iconSearch.current.contains(event.target)) showSearchBar();
        }

        document.addEventListener('mousedown', handleClickOutsideSearchBar);

        return () => document.removeEventListener('mousedown', handleClickOutsideSearchBar);
    }, []);

    return (
        <>
            <div className={styles.headerContainer}>
                <div className={styles.header}>
                    <div className={styles.left}>
                        <i ref={burgerSearch} onClick={showNavBar} className={`ri-menu-line ${styles.icon}`}></i>
                        <Link className='link' to='/reacttalk'><h2 className='logo'>ReactTalk</h2></Link>
                    </div>

                    <div className={`${styles.searchContainer} ${styles.visibleResponsive}`}>
                        <input ref={searchInput} name='searchResult' type='text' placeholder='Search for a talk...' className={`${styles.input} ${styles.search}`} />
                        <button onClick={() => searchTalk(searchInput.current.value)} className={`${styles.button} ${styles.search}`}><i className={`ri-search-line ${styles.icon}`}></i></button>
                    </div>

                    <div className={`${styles.right} ${styles.visibleResponsive}`}>
                        <h2 className={styles.username}>{localUsername}</h2>
                    </div>

                    <i onClick={showSearchBar} className={`ri-search-line ${styles.responsive} ${styles.icon}`}></i>
                </div>
            </div>

            <div ref={hiddenSearchBar} className={`${styles.responsiveSearchContainer} ${styles.slideUp}`}>
                <div className={styles.responsiveSearch}>
                    <input ref={responsiveSearchInput} name='searchResult' type='text' placeholder='Search for a talk...' className={`${styles.input} ${styles.search}`} />
                    <button onClick={() => searchTalk(responsiveSearchInput.current.value)} ref={iconSearch} className={`${styles.button} ${styles.search}`}><i className={`ri-search-line ${styles.icon}`}></i></button>
                </div>
            </div>

            <div ref={hiddenNavBar} className={`${styles.headerNavBar} ${styles.slideRight}`}>
                <div className={styles.top}>
                    <div className={styles.image}>
                        <div onClick={() => console.log("Feature not added yet.")} className={styles.overlay}><i className={`ri-pencil-line ${styles.icon}`}></i></div>
                        <img src={`/${localProfileColour}.png`} alt='Profile' className={styles.profileImage} />' 
                        {/* Files in the public directory are served at the root path, so we use for example "/2.png" instead of "/public/2.png" */}
                    </div>
                    <h1 className={styles.username}>{localUsername}</h1>
                </div>

                <div className={styles.links}>
                    <Link className='link' to='/profile'>
                        <p className={styles.navLink}>Your Talks</p>
                    </Link>

                    <Link className='link' to='/createtalk'>
                        <p className={styles.navLink}>Create Talk</p>
                    </Link>

                    <Link className='link' to='/contact'>
                        <p className={styles.navLink}>Contact</p>
                    </Link>

                    <Link onClick={() => window.location.reload()} className='link' to='/'>
                        <p className={styles.navLink}>Logout</p>
                    </Link>
                </div>
                
                <div className={styles.bottom}>
                    <div className={styles.legalContainer}>
                        <p className={styles.legal}>Terms of Service</p>
                        <p className={styles.legal}>Privacy Policy</p>
                    </div>
                    <p className={styles.copyright}>Made by LordBugsy © 2024. All Rights Reserved</p>
                </div>
            </div>
        </>
    );
}

export default Header;