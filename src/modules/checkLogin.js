import Axios from 'axios';
import getApiPath from './getApiPath';

export default function(_this) {
    var gotoLogin = () => {
        localStorage.clear();
        delete Axios.defaults.headers.common['authorization'];
        _this.$message({
            type: 'warning',
            duration: 3000,
            message: '身份未认证或认证已过期'
        });
        _this.$router.push({ name: 'Login' });
    };

    // Default navigation behavior
    if(localStorage.getItem('accessToken')) {
        // Set the authorization
        Axios.defaults.headers.common['authorization']
            = localStorage['accessToken'];
        Axios.get(getApiPath('login/auth'))
            .then((res) => {
                if(res.status !== 200) { gotoLogin(); return; }
            });
    } else {
        gotoLogin();
    }
}