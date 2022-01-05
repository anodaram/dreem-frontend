import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// To avoid showing a scrolled screen when changing between menu links
// (e.g.: if user scrolls down in screen A, when changing to screen B, 
//  the scroll is kept -when it shouldn't be)
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;
