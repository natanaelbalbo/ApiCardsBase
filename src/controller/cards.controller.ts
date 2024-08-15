import { Request, Response } from 'express';
import axios from 'axios';
import cardsService from '../service/cards.service';
import Card from '../schema/cards.schema';
import fs from 'fs';

interface ICardData {
    name: string;
    type: string;
}

class CardsController {

    async buscarCards(req: Request, res: Response) {
        try {
            const apiCards = 'https://api.magicthegathering.io/v1/cards?colors=w';
            const response = await axios.get(apiCards);
            const data = response.data.cards;

            let cardsCriados = 0;
            const cardsArray: ICardData[] = [];

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

            fs.writeFileSync('cards.json', JSON.stringify(cardsArray, null, 2), 'utf-8');
            
            if (cardsCriados > 0) {
                return res.status(200).json({ message: `${cardsCriados} Cards Criados com sucesso` });
            } else {
                return res.status(200).json({ message: 'Nenhum card novo foi criado, todos já existiam' });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Erro ao criar cards' });
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

}

export default new CardsController();
