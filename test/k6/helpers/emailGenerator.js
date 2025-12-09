import { Faker } from "k6/x/faker"

export function generateRandomEmail() {
    const seed = Date.now() + Math.random() * 1000000;
    let faker = new Faker(seed);
    return faker.person.email();
}
