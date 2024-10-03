import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker/.';

describe('Company', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://api-desafio-qa.onrender.com';
  let companyId = '';

  const fakeId = 4566454655;

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  it('Get Companies', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company`)
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            name: { type: 'string' }
          },
          required: ['id', 'name']
        }
      });
  });

  it('Create Company', async () => {
    companyId = (
      await p
        .spec()
        .post(`${baseUrl}/company`)
        .withJson({
          name: faker.internet.userName(),
          cnpj: '12345678901234',
          state: faker.address.state(),
          city: faker.address.city(),
          address: faker.address.streetAddress(),
          sector: faker.company.name()
        })
        .expectStatus(StatusCodes.CREATED)
    )?.body.id;
  });

  it('Get Company infos', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK)
      .expectJsonSchema({
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string' }
        },
        required: ['id', 'name']
      });
  });

  it('Edit Company infos', async () => {
    await p
      .spec()
      .put(`${baseUrl}/company/${companyId}`)
      .withJson({
        name: faker.internet.userName(),
        cnpj: '12345678901234',
        state: faker.address.state(),
        city: faker.address.city(),
        address: faker.address.streetAddress(),
        sector: faker.company.name()
      })
      .expectStatus(StatusCodes.OK);
  });

  it('Get Company products', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/products`)
      .expectStatus(StatusCodes.OK);
  });

  it('Create Company Product', async () => {
    await p
      .spec()
      .post(`${baseUrl}/company/${companyId}/products`)
      .withJson({
        productName: faker.commerce.productName(),
        productDescription: faker.commerce.productDescription(),
        price: 100
      })
      .expectStatus(StatusCodes.CREATED);
  });

  it('Try get the company product; it does not exist.', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/products/${fakeId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Try editing the company product; it does not exist.', async () => {
    await p
      .spec()
      .put(`${baseUrl}/company/${companyId}/products/${fakeId}`)
      .withJson({
        productName: faker.commerce.productName(),
        productDescription: faker.commerce.productDescription(),
        price: 100
      })
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Try delete the company product; it does not exist.', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}/products/${fakeId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Get Company employees', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/employees`)
      .expectStatus(StatusCodes.OK);
  });

  it('Create Company employee', async () => {
    await p
      .spec()
      .post(`${baseUrl}/company/${companyId}/employees`)
      .withJson({
        name: faker.name.fullName(),
        position: 'Admin',
        email: faker.internet.email()
      })
      .expectStatus(StatusCodes.CREATED);
  });

  it('Try get the company employee; it does not exist.', async () => {
    await p
      .spec()
      .get(`${baseUrl}/company/${companyId}/employees/${fakeId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Try editing the company employee; it does not exist.', async () => {
    await p
      .spec()
      .put(`${baseUrl}/company/${companyId}/employees/${fakeId}`)
      .withJson({
        productName: faker.commerce.productName(),
        productDescription: faker.commerce.productDescription(),
        price: 100
      })
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Try delete the employee product; it does not exist.', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}/employees/${fakeId}`)
      .expectStatus(StatusCodes.NOT_FOUND);
  });

  it('Delete Company', async () => {
    await p
      .spec()
      .delete(`${baseUrl}/company/${companyId}`)
      .expectStatus(StatusCodes.OK);
  });
});
