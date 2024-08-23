import request from 'supertest';
import app from '../app';
import Card from '../schema/cards.schema';

jest.mock('../schema/cards.schema.ts');

describe('CRUD e Autenticação de Cards', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Deve criar um card autenticado', async () => {
    const mockCard = { name: 'Mock Card', mana_cost: 5 };
    (Card.create as jest.Mock).mockResolvedValue(mockCard);

    const response = await request(app)
      .post('/cards-auth-create')
      .set('Authorization', 'Bearer fake-jwt-token')
      .send(mockCard);

    // Log para verificar a resposta e o status
    console.log('Resposta ao criar card autenticado:', response.body);
    console.log('Status ao criar card autenticado:', response.status);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockCard);
  });

  it('Deve falhar ao criar um card sem autenticação', async () => {
    const mockCard = { name: 'Mock Card', mana_cost: 5 };

    const response = await request(app)
      .post('/cards-auth-create')
      .send(mockCard);

    console.log('Resposta ao criar card sem autenticação:', response.body);
    console.log('Status ao criar card sem autenticação:', response.status);

    expect(response.status).toBe(401);
  });

  it('Deve buscar todos os cards', async () => {
    const mockCards = [
      { name: 'Card 1', mana_cost: 3 },
      { name: 'Card 2', mana_cost: 4 },
    ];
    (Card.find as jest.Mock).mockResolvedValue(mockCards);

    const response = await request(app).get('/cards');

    console.log('Resposta ao buscar todos os cards:', response.body);
    console.log('Status ao buscar todos os cards:', response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCards);
  });

  it('Deve atualizar um card autenticado', async () => {
    const mockCard = { name: 'Updated Card', mana_cost: 7 };
    (Card.findByIdAndUpdate as jest.Mock).mockResolvedValue(mockCard);

    const response = await request(app)
      .put('/cards-auth-put/1')
      .set('Authorization', 'Bearer fake-jwt-token')
      .send(mockCard);

    console.log('Resposta ao atualizar card autenticado:', response.body);
    console.log('Status ao atualizar card autenticado:', response.status);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockCard);
  });

  it('Deve falhar ao atualizar um card sem autenticação', async () => {
    const mockCard = { name: 'Updated Card', mana_cost: 7 };

    const response = await request(app)
      .put('/cards-auth-put/1')
      .send(mockCard);

    console.log('Resposta ao atualizar card sem autenticação:', response.body);
    console.log('Status ao atualizar card sem autenticação:', response.status);

    expect(response.status).toBe(401);
  });

  it('Deve deletar um card autenticado', async () => {
    (Card.findByIdAndDelete as jest.Mock).mockResolvedValue(true);

    const response = await request(app)
      .delete('/cards-auth-delete/1')
      .set('Authorization', 'Bearer fake-jwt-token');

    console.log('Resposta ao deletar card autenticado:', response.body);
    console.log('Status ao deletar card autenticado:', response.status);

    expect(response.status).toBe(204);
  });

  it('Deve falhar ao deletar um card sem autenticação', async () => {
    const response = await request(app)
      .delete('/cards-auth-delete/1');

    console.log('Resposta ao deletar card sem autenticação:', response.body);
    console.log('Status ao deletar card sem autenticação:', response.status);

    expect(response.status).toBe(401);
  });
});
