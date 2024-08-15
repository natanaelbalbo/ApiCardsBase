import cardsSchema from '../schema/cards.schema';

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
}

export default new CardsService();
