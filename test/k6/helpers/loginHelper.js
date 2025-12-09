import http from 'k6/http';
import { check } from 'k6';

export function login(baseURL, username, password) {
    const loginPayload = JSON.stringify({
        username: username,
        password: password,
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const response = http.post(`${baseURL}/users/login`, loginPayload, params);

    check(response, {
        'Login status is 200': (r) => r.status === 200,
    });

    if (response.status === 200) {
        const body = JSON.parse(response.body);
        return body.token;
    }

    return null;
}
