import ConceptCarousel from '../ConceptCarousel';
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';

export default function ConceptCarouselExample() {
  const concepts = [
    {
      title: "Today's Picks",
      category: "Events",
      imageUrl: eventBg1,
      categoryColor: "bg-primary/20",
      items: [
        { date: 'June 15, 2025', place: 'Central Park, NYC', event: 'Summer Music Festival' },
        { date: 'June 22, 2025', place: 'Blue Note, Manhattan', event: 'Jazz Night Live' },
        { date: 'July 10, 2025', place: 'Convention Center, SF', event: 'Tech Summit 2025' },
      ],
    },
  ];

  return <ConceptCarousel concepts={concepts} />;
}
