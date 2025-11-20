import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  vus: 1,
  // duration: '5s',
  iterations: 1,
   thresholds: {
    http_req_duration: ['p(90)<=6', 'p(95)<=7'],
    http_req_failed: ['rate<0.01'],
  },
};

// Criei 2 usuarios no sistema: vania e Paula no swagger
export default function () {

  let responseUserLogin = http.post(
     'http://localhost:3000/users/login',
    JSON.stringify({
      username: 'vania',
      password: '123456',
    }),
    {
      headers: {
        'Content-Type': 'application/json'
      },
    })

  check(responseUserLogin, {
    'status deve ser igual a 200': (r) => r.status === 200
  });



  let responseTransfer = http.post(
    'http://localhost:3000/transfers',
    JSON.stringify({
      from: 'vania',
      to: 'Paula',
      value: 100,
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${responseUserLogin.json('token')}`
      },
    })

  check(responseTransfer, {
    'status deve ser igual a 201': (r) => r.status === 201
  });

    group('Simulando o pensamento do usuário', function() {
    sleep(1); // User Think Time
  })

};
