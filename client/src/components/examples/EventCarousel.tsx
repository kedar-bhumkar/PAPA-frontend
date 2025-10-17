import EventCarousel from '../EventCarousel';
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';
import eventBg2 from '@assets/generated_images/Concert_event_background_cb08115d.png';
import eventBg3 from '@assets/generated_images/Tech_conference_background_3124e347.png';

export default function EventCarouselExample() {
  const mockEvents = [
    {
      title: "Summer Music Festival",
      date: "Jun 15, 2025",
      location: "Central Park, New York",
      description: "Experience an unforgettable evening of live music featuring top artists from around the world.",
      category: "Music",
      imageUrl: eventBg1,
    },
    {
      title: "Live Jazz Night",
      date: "Jun 22, 2025",
      location: "Blue Note, Manhattan",
      description: "An intimate evening with renowned jazz musicians in the heart of the city.",
      category: "Concert",
      imageUrl: eventBg2,
    },
    {
      title: "Tech Summit 2025",
      date: "Jul 10, 2025",
      location: "Convention Center, SF",
      description: "Join industry leaders to explore the latest innovations in technology and AI.",
      category: "Conference",
      imageUrl: eventBg3,
    },
    {
      title: "Art Gallery Opening",
      date: "Jul 18, 2025",
      location: "MoMA, New York",
      description: "Discover contemporary masterpieces from emerging artists worldwide.",
      category: "Art",
      imageUrl: eventBg1,
    },
    {
      title: "Food & Wine Festival",
      date: "Aug 5, 2025",
      location: "Napa Valley, CA",
      description: "Savor exquisite cuisine and fine wines from award-winning chefs and vintners.",
      category: "Food",
      imageUrl: eventBg2,
    },
  ];

  return <EventCarousel events={mockEvents} />;
}
