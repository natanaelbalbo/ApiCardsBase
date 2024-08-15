import request from 'supertest';
import app from '../app';
import Card from '../schema/cards.schema';

jest.mock('../schema/cards.schema');

describe('POST /cards-create', () => {
  it('deve criar um novo card com sucesso', async () => {
    const mockCard = {
      name: 'Magic Card',
      type: 'Spell',
    };

    (Card.create as jest.Mock).mockResolvedValue(mockCard);

    const response = await request(app)
      .post('/cards-create')
      .send(mockCard);

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject(mockCard);
  });

  it('deve retornar erro 400 se o card já existir', async () => {
    const mockCard = {
      name: 'Magic Card',
      type: 'Spell',
    };

    (Card.findOne as jest.Mock).mockResolvedValue(mockCard);

    const response = await request(app)
      .post('/cards-create')
      .send(mockCard);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Card já existe');
  });
});
