export const isAuthenticated = (url) => {
    if(localStorage.getItem('myToken')) {
        return true;
    }
    return false;
}