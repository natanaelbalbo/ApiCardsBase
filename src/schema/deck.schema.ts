// deck.schema.ts
import { Schema, model, Document } from 'mongoose';
import { ICard } from './cards.schema'; // Importando a interface de Card

interface IDeck extends Document {
    commanderId: Schema.Types.ObjectId;
    cardIds: Schema.Types.ObjectId[];
}

const deckSchema = new Schema<IDeck>({
    commanderId: { type: Schema.Types.ObjectId, ref: 'Card', required: true },
    cardIds: [{ type: Schema.Types.ObjectId, ref: 'Card', required: true }],
});

deckSchema.pre('save', async function (next) {
    if (this.cardIds.length !== 99) {
        return next(new Error('Um deck deve conter exatamente 99 cards além do comandante'));
    }
    next();
});

const Deck = model<IDeck>('Deck', deckSchema);

export default Deck;
export { IDeck };
