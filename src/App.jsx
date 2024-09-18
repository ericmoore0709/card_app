import { useState, useEffect } from 'react';

const App = () => {
  const [deckId, setDeckId] = useState('');
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [shuffling, setShuffling] = useState(false);

  // Fetch a new deck on component mount
  useEffect(() => {
    const fetchDeck = async () => {
      const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/');
      const data = await response.json();
      setDeckId(data.deck_id);
    };
    fetchDeck();
  }, []);

  // Draw a card
  const drawCard = async () => {
    const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=1`);
    const data = await response.json();
    if (data.remaining === 0) {
      setError('Error: no cards remaining!');
    } else {
      setCards([...cards, ...data.cards]);
      setError(null);
    }
  };

  // Shuffle the deck
  const shuffleDeck = async () => {
    setShuffling(true);
    await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
    setCards([]); // Remove all displayed cards
    setShuffling(false);
  };

  return (
    <div>
      <h1>Card Drawing App</h1>
      <button onClick={drawCard} disabled={shuffling}>Draw Card</button>
      <button onClick={shuffleDeck} disabled={shuffling}>Shuffle Deck</button>
      {error && <p>{error}</p>}
      <div>
        {cards.map((card, index) => (
          <img key={index} src={card.image} alt={card.value + ' of ' + card.suit} />
        ))}
      </div>
    </div>
  );
};

export default App;
