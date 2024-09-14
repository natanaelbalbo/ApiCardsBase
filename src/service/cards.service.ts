import Card from '../schema/cards.schema';
import cardsSchema from '../schema/cards.schema';
import Deck, { IDeck } from '../schema/deck.schema';

class CardsService {

    async create(cardData: { name: string; type: string }) {
        try {
            const card = new cardsSchema(cardData);
            return await card.save();
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao criar card');
        }
    }

    async findAll() {
        try {
            const cards = await cardsSchema.find();
            return cards;
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao buscar cards');
        }
    }

    async update(id: string, cardData: { name: string; type: string }) {
        try {
            const updatedCard = await cardsSchema.findByIdAndUpdate(
                id,
                {
                    name: cardData.name,
                    type: cardData.type,
                },
                { new: true }
            );
            return updatedCard;
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao atualizar card');
        }
    }

    async delete(id: string) {
        try {
            const deletedCard = await cardsSchema.findByIdAndDelete(id);
            if (deletedCard) {
                return "Card removido com sucesso";
            } else {
                return "Card não encontrado";
            }
        } catch (error) {
            console.error(error);
            throw new Error('Erro ao deletar card');
        }
    }

    async createDeck(commanderId: string, cardIds: string[], userId: string): Promise<IDeck> {
        const commander = await Card.findById(commanderId);
        if (!commander || commander.type !== 'Legendary Creature — Human Rebel') {
            throw new Error('Commander não encontrado ou tipo incorreto');
        }

        // const cards = await Card.find({ _id: { $in: cardIds } });
        // if (cards.length !== 99) {
            // throw new Error('Número incorreto de cartas. Um deck deve conter exatamente 99 cartas.');
        // }

        const deck = new Deck({
            commanderId,   
            cardIds,       
            userId         
        });

        return deck.save();
    }

    async getDeck(id: string): Promise<IDeck | null> {
        return Deck.findById(id).populate('commanderId cardIds');
    }

    async updateDeck(deckId: string, commanderId: string, cardIds: string[]): Promise<IDeck | null> {
        return Deck.findByIdAndUpdate(deckId, {
            commanderId,
            cardIds
        }, { new: true });
    }
}

export default new CardsService();
