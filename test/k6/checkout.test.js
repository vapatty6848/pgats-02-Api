import http from 'k6/http';
import { check, group } from 'k6';
import { Trend } from 'k6/metrics';
import { getBaseURL } from './helpers/getBaseURL.js';
import { generateRandomEmail } from './helpers/emailGenerator.js';
import { login } from './helpers/loginHelper.js';

const transferDuration = new Trend('transfer_duration');

export const options = {
    stages: [
        { duration: '5s', target: 5 },   // Ramp-up: 0 to 5 VUs em 5s
        { duration: '10s', target: 10 }, // Carga: aumenta para 10 VUs em 10s
        { duration: '5s', target: 10 },  // Sustenta: mantém 10 VUs por 5s
        { duration: '5s', target: 0 },   // Ramp-down: reduz para 0 VUs em 5s
    ],
    thresholds: {
        'http_req_duration': ['p(95)<2000'],
        'transfer_duration': ['p(95)<2000'],
    },
};

export default function () {
    const baseURL = getBaseURL();

    const senderUsername = generateRandomEmail();
    const recipientUsername = generateRandomEmail();
    const password = 'Test@123';


    group('Registro de Usuários', function () {
        const params = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        // Tenta registrar o sender (ignora se já existe)
        const senderRegisterPayload = JSON.stringify({
            username: senderUsername,
            password: password,
            favorecidos: []
        });

        const senderRegisterResponse = http.post(`${baseURL}/users/register`, senderRegisterPayload, params);

        check(senderRegisterResponse, {
            'Sender Register status is 201': (r) => r.status === 201,
        });

        // Tenta registrar o recipient (ignora se já existe)
        const recipientRegisterPayload = JSON.stringify({
            username: recipientUsername,
            password: password,
            favorecidos: []
        });

        const recipientRegisterResponse = http.post(`${baseURL}/users/register`, recipientRegisterPayload, params);

        check(recipientRegisterResponse, {
            'Recipient Register status is 201': (r) => r.status === 201,
        });
    });

    let senderToken, recipientToken;
    group('Login dos Usuários', function () {

        senderToken = login(baseURL, senderUsername, password);

        recipientToken = login(baseURL, recipientUsername, password);
    });


    if (senderToken && recipientToken) {
        group('Checkout (Transferência)', function () {
            const checkoutPayload = JSON.stringify({
                from: senderUsername,
                to: recipientUsername,
                value: 100
            });

            const params = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${senderToken}`,
                },
            };

            const checkoutResponse = http.post(`${baseURL}/transfers`, checkoutPayload, params);

            transferDuration.add(checkoutResponse.timings.duration);

            check(checkoutResponse, {
                'Checkout status is 201': (r) => r.status === 201,
            });
        });
    }
}
