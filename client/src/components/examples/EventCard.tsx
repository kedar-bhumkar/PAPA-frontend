import EventCard from '../EventCard';
import eventBg from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function EventCardExample() {
  return (
    <EventCard
      title="Summer Music Festival"
      date="Jun 15, 2025"
      location="Central Park, New York"
      description="Experience an unforgettable evening of live music featuring top artists from around the world."
      category="Music"
      imageUrl={eventBg}
    />
  );
}
