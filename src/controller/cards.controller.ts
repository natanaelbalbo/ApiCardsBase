import { Request, Response } from 'express';
import axios from 'axios';
import cardsService from '../service/cards.service';
import Card from '../schema/cards.schema';
import fs from 'fs';
import { IUser } from '../schema/user.schema';  

interface ICardData {
    name: string;
    type: string;
}

class CardsController {

    async buscarCards(req: Request, res: Response) {
        try {
            const baseUrl = 'https://api.magicthegathering.io/v1/cards?colors=w&pageSize=34';
            let cardsCriados = 0;
            let cardsArray: ICardData[] = [];
            let currentPage = 1;
            let hasNextPage = true;

            const axiosInstance = axios.create({
                timeout: 120000, 
            });

            const promises = [];

            while (hasNextPage) {
                const apiCardsUrl = `${baseUrl}&page=${currentPage}`;
                promises.push(axiosInstance.get(apiCardsUrl));

                currentPage++;
                hasNextPage = currentPage <= 4; 
            }

            const responses = await Promise.all(promises);

            for (const response of responses) {
                const data = response.data.cards;

                for (const dataCard of data) {
                    const cardExist = await Card.findOne({ name: dataCard.name });

                    if (!cardExist) {
                        const modelCard: ICardData = {
                            name: dataCard.name,
                            type: dataCard.type,
                        };

                        await cardsService.create(modelCard);
                        cardsCriados++;
                        cardsArray.push(modelCard);
                    }
                }
            }

            fs.writeFileSync('cards.json', JSON.stringify(cardsArray, null, 2), 'utf-8');

            if (cardsCriados > 0) {
                return res.status(200).json({ message: `${cardsCriados} Cards Criados com sucesso` });
            } else {
                return res.status(200).json({ message: 'Nenhum card novo foi criado, todos já existiam' });
            }

        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Erro de requisição Axios:', error.message);
                return res.status(500).json({ message: 'Erro ao criar cards', error: error.message });
            } else if (error instanceof Error) {
                console.error('Erro geral:', error.message);
                return res.status(500).json({ message: 'Erro ao criar cards', error: error.message });
            } else {
                console.error('Erro desconhecido:', error);
                return res.status(500).json({ message: 'Erro desconhecido ao criar cards' });
            }
        }
    }

    async create(req: Request, res: Response) {
        try {
            const cardData: ICardData = req.body;
            const cardExist = await Card.findOne({ name: cardData.name });

            if (cardExist) {
                return res.status(400).json({ message: 'Card já existe' });
            }

            const card = await cardsService.create(cardData);
            return res.status(201).json(card);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar card' });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const cards = await cardsService.findAll();
            return res.status(200).json(cards);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao buscar cards' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const cards = await cardsService.update(req.params.id, req.body);
            return res.status(200).json(cards);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar card' });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const cards = await cardsService.delete(req.params.id);
            return res.status(200).json({ message: 'Card removido com sucesso' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao deletar card' });
        }
    }

    async createDeck(req: Request, res: Response) {
        try {
            const { commanderId, cardIds } = req.body;

            if (!req.user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            const userId = (req.user as IUser)._id; 
            const deck = await cardsService.createDeck(commanderId, cardIds, userId.toString());
            res.status(201).json(deck);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erro ao criar deck' });
        }
    }

    async updateDeck(req: Request, res: Response) {
        try {
            const deckId = req.params.id;
            const { commanderId, cardIds } = req.body;
            
            const deck = await cardsService.getDeck(deckId);

            if (!deck) {
                return res.status(404).json({ message: 'Deck não encontrado' });
            }

            if (!req.user) {
                return res.status(401).json({ message: 'Usuário não autenticado' });
            }

            if (!deck.userId || !req.user._id) {
                return res.status(400).json({ message: 'Usuário ou deck inválido' });
            }
    
            if (deck.userId.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Você não tem permissão para editar este deck' });
            }
    
            const updatedDeck = await cardsService.updateDeck(deckId, commanderId, cardIds);
            return res.status(200).json(updatedDeck);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao atualizar deck' });
        }
    }

    async getDeck(req: Request, res: Response) {
        try {
            const deckId = req.params.id;
            const deck = await cardsService.getDeck(deckId);

            if (!deck) {
                return res.status(404).json({ message: 'Deck não encontrado' });
            }

            return res.status(200).json(deck);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao obter deck' });
        }
    }

}

export default new CardsController();
