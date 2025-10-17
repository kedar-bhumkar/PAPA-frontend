import ConceptBox from '../ConceptBox';
import { Calendar, MapPin, Users } from 'lucide-react';
import eventBg from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function ConceptBoxExample() {
  const eventItems = [
    { label: 'Date', value: 'June 15, 2025', icon: Calendar },
    { label: 'Place', value: 'Central Park, New York', icon: MapPin },
    { label: 'Event', value: 'Summer Music Festival - Live performances from top artists', icon: Users },
    { label: 'Date', value: 'June 22, 2025', icon: Calendar },
    { label: 'Place', value: 'Blue Note, Manhattan', icon: MapPin },
    { label: 'Event', value: 'Jazz Night - Intimate evening with renowned musicians', icon: Users },
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
