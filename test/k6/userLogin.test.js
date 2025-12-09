import http from 'k6/http';
import { sleep, check } from 'k6';
import { getBaseURL } from './helpers/getBaseURL.js';
import { SharedArray } from 'k6/data';

const dataUsers = new SharedArray('dataUsers', function () {
  return JSON.parse(open('../data/data.login.test.json'));
});

export const options = {
    vus: 4,
    iterations: 4,
    thresholds: {
        'http_req_duration': ['p(95)<1500'],
    },
};

export function setup() {
    // Registra os usuários antes de executar os testes
    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    dataUsers.forEach(user => {
        const registerPayload = JSON.stringify({
            username: user.email,
            password: user.password,
            favorecidos: []
        });

        const registerResponse = http.post(`${getBaseURL()}/users/register`, registerPayload, params);
        console.log(`Registro de ${user.email}: ${registerResponse.status}`);
    });
}

export default function () {
    const user = dataUsers[(__VU - 1) % dataUsers.length];

    const loginPayload = JSON.stringify({
        username: user.email,
        password: user.password,
    });

    const params = {
        headers: { 'Content-Type': 'application/json' },
    };

    const response = http.post(`${getBaseURL()}/users/login`, loginPayload, params);

    check(response, {
        'Login status 200': (r) => r.status === 200,
        'Token recebido': (r) => r.json('token') !== undefined
    });

    sleep(1);
}
