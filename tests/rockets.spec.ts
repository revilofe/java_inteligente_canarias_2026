import { expect, test } from '@playwright/test';

type RocketPayload = {
  name: string;
  range: string;
  capacity: number;
};

const createRocketPayload = (): RocketPayload => ({
  name: `rocket-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
  range: 'moon',
  capacity: 4,
});

test.describe('Rockets API', () => {
  test('should create a rocket with POST /api/rockets and return 201', async ({ request }) => {
    const payload = createRocketPayload();

    const response = await request.post('/api/rockets', {
      data: payload,
    });

    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data).toMatchObject({
      id: expect.any(String),
      name: payload.name,
      range: payload.range,
      capacity: payload.capacity,
    });
  });

  test('should validate capacity between 1 and 10 and return 400', async ({ request }) => {
    const response = await request.post('/api/rockets', {
      data: {
        ...createRocketPayload(),
        capacity: 11,
      },
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toMatchObject({
      error: expect.stringContaining('Validation failed'),
    });
  });

  test('should validate allowed range values and return 400', async ({ request }) => {
    const response = await request.post('/api/rockets', {
      data: {
        ...createRocketPayload(),
        range: 'pluto',
      },
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data).toMatchObject({
      error: expect.stringContaining('Validation failed'),
    });
  });

  test('should retrieve all rockets with GET /api/rockets', async ({ request }) => {
    const createResponse = await request.post('/api/rockets', {
      data: createRocketPayload(),
    });
    expect(createResponse.status()).toBe(201);
    const createdRocket = await createResponse.json();

    const response = await request.get('/api/rockets');

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: createdRocket.id,
          name: createdRocket.name,
          range: createdRocket.range,
          capacity: createdRocket.capacity,
        }),
      ]),
    );
  });

  test('should retrieve a specific rocket with GET /api/rockets/{id}', async ({ request }) => {
    const payload = createRocketPayload();
    const createResponse = await request.post('/api/rockets', {
      data: payload,
    });
    expect(createResponse.status()).toBe(201);
    const createdRocket = await createResponse.json();

    const response = await request.get(`/api/rockets/${createdRocket.id}`);

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject({
      id: createdRocket.id,
      name: payload.name,
      range: payload.range,
      capacity: payload.capacity,
    });
  });

  test('should update a rocket with PUT /api/rockets/{id} and return 200', async ({ request }) => {
    const createResponse = await request.post('/api/rockets', {
      data: createRocketPayload(),
    });
    expect(createResponse.status()).toBe(201);
    const createdRocket = await createResponse.json();

    const updatePayload = {
      name: `${createdRocket.name}-updated`,
      range: 'mars',
      capacity: 6,
    };

    const updateResponse = await request.put(`/api/rockets/${createdRocket.id}`, {
      data: updatePayload,
    });

    expect(updateResponse.status()).toBe(200);
    const updated = await updateResponse.json();
    expect(updated).toMatchObject({
      id: createdRocket.id,
      ...updatePayload,
    });
  });

  test('should delete a rocket with DELETE /api/rockets/{id}', async ({ request }) => {
    const createResponse = await request.post('/api/rockets', {
      data: createRocketPayload(),
    });
    expect(createResponse.status()).toBe(201);
    const createdRocket = await createResponse.json();

    const deleteResponse = await request.delete(`/api/rockets/${createdRocket.id}`);
    expect(deleteResponse.status()).toBe(204);

    const getAfterDelete = await request.get(`/api/rockets/${createdRocket.id}`, {
      failOnStatusCode: false,
    });
    expect(getAfterDelete.status()).toBe(404);
  });
});
