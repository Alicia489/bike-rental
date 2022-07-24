
export class  Util{
    static setLoggedInUserDetails(token, user) {
        localStorage.setItem('USER', JSON.stringify(user));
        return localStorage.setItem('AUTH_TOKEN', token)
    }

    static getAuthToken() {
        return localStorage.getItem('AUTH_TOKEN');
    }

    static getUserDetails() {
        return JSON.parse(localStorage.getItem('USER'));
    }

    static setUserRole(role) {
        return localStorage.setItem('USER_ROLE', role)
    }

    static getUserRole() {
        return localStorage.getItem('USER_ROLE');
    }
    
}