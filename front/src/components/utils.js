export const isAuthenticated = () => {
    if(localStorage.getItem('myToken')) {
        return true;
    }
    return false;
}

export const clearAndGoAdmin = () => {
    localStorage.removeItem('myToken');
    localStorage.removeItem('user');
    window.location.href="/admin";
}