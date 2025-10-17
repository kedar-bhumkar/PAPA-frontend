import ConceptCarousel from '../ConceptCarousel';
import { Calendar, MapPin, Users, DollarSign, TrendingUp, Briefcase } from 'lucide-react';
import eventBg1 from '@assets/generated_images/Event_card_gradient_background_8c68dd6e.png';
import eventBg2 from '@assets/generated_images/Concert_event_background_cb08115d.png';
import eventBg3 from '@assets/generated_images/Tech_conference_background_3124e347.png';

export default function ConceptCarouselExample() {
  const concepts = [
    {
      title: "Today's Picks",
      category: "Events",
      imageUrl: eventBg1,
      categoryColor: "bg-primary/20",
      items: [
        { label: 'Date', value: 'June 15, 2025', icon: Calendar },
        { label: 'Place', value: 'Central Park, NYC', icon: MapPin },
        { label: 'Event', value: 'Summer Music Festival', icon: Users },
        { label: 'Date', value: 'June 22, 2025', icon: Calendar },
        { label: 'Place', value: 'Blue Note, Manhattan', icon: MapPin },
        { label: 'Event', value: 'Jazz Night Live', icon: Users },
        { label: 'Date', value: 'July 10, 2025', icon: Calendar },
        { label: 'Place', value: 'Convention Center, SF', icon: MapPin },
        { label: 'Event', value: 'Tech Summit 2025', icon: Users },
      ],
    },
    {
      title: "PAPA",
      category: "Appointments",
      imageUrl: eventBg2,
      categoryColor: "bg-chart-2/20",
      items: [
        { label: 'Date', value: 'June 18, 2025', icon: Calendar },
        { label: 'Location', value: 'Medical Center', icon: MapPin },
        { label: 'Event', value: 'Annual Health Checkup', icon: Briefcase },
        { label: 'Date', value: 'June 25, 2025', icon: Calendar },
        { label: 'Location', value: 'Downtown Office', icon: MapPin },
        { label: 'Event', value: 'Business Meeting', icon: Briefcase },
      ],
    },
    {
      title: "Main Usa",
      category: "Financial",
      imageUrl: eventBg3,
      categoryColor: "bg-chart-3/20",
      items: [
        { label: 'Account', value: 'Checking - $5,240', icon: DollarSign },
        { label: 'Investment', value: 'Portfolio +12%', icon: TrendingUp },
        { label: 'Savings', value: 'Goal: $10,000', icon: DollarSign },
        { label: 'Recent', value: 'Payment Received', icon: TrendingUp },
      ],
    },
  ];

  return <ConceptCarousel concepts={concepts} />;
}
