import ConceptBox from '../ConceptBox';
import eventBg from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function ConceptBoxExample() {
  const eventItems = [
    { date: 'June 15, 2025', place: 'Central Park, New York', event: 'Summer Music Festival' },
    { date: 'June 22, 2025', place: 'Blue Note, Manhattan', event: 'Jazz Night Live' },
    { date: 'July 10, 2025', place: 'Convention Center, SF', event: 'Tech Summit 2025' },
  ];

  return (
    <ConceptBox
      title="Today's Picks"
      category="Events"
      items={eventItems}
      imageUrl={eventBg}
      categoryColor="bg-primary/20"
    />
  );
}
