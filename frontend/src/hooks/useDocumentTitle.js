import { useEffect } from 'react';

/**
 * Custom hook to update the browser's document title dynamcially.
 * @param {string} title - The specific title suffix to display.
 */
const useDocumentTitle = (title) => {
    useEffect(() => {
        const baseTitle = "devMatch";
        if (title) {
            document.title = `${title} | ${baseTitle}`;
        } else {
            document.title = `${baseTitle} | Elite Developer Network`;
        }
    }, [title]);
};

export default useDocumentTitle;
