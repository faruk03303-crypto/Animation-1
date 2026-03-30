import { Character, Scene, AnimationAction } from './types/studio';

export const CHARACTERS: Character[] = [
  { id: 'c1', name: 'Dr. Rahim', age: 'Adult', gender: 'Male', profession: 'Doctor', outfit: 'Premium White Coat', image: 'https://picsum.photos/seed/doctor_male_v2/400/600' },
  { id: 'c2', name: 'Officer Salma', age: 'Adult', gender: 'Female', profession: 'Police', outfit: 'Tactical Uniform', image: 'https://picsum.photos/seed/police_female_v2/400/600' },
  { id: 'c3', name: 'Karim Krisok', age: 'Adult', gender: 'Male', profession: 'Farmer', outfit: 'Traditional Lungi & Panjabi', image: 'https://picsum.photos/seed/farmer_male_v2/400/600' },
  { id: 'c4', name: 'Student Anika', age: 'Teenager', gender: 'Female', profession: 'Student', outfit: 'Modern School Uniform', image: 'https://picsum.photos/seed/student_female_v2/400/600' },
  { id: 'c5', name: 'CEO Ahmed', age: 'Adult', gender: 'Male', profession: 'Businessman', outfit: 'Luxury Italian Suit', image: 'https://picsum.photos/seed/business_male_v2/400/600' },
  { id: 'c6', name: 'Grandpa', age: 'Elderly', gender: 'Male', profession: 'Office Worker', outfit: 'Classic Dhoti', image: 'https://picsum.photos/seed/old_man_v2/400/600' },
  { id: 'c7', name: 'Anime Hero', age: 'Teenager', gender: 'Male', profession: 'Student', outfit: 'Anime Battle Suit', image: 'https://picsum.photos/seed/anime_hero/400/600' },
  { id: 'c8', name: 'Tech Engineer', age: 'Adult', gender: 'Female', profession: 'Engineer', outfit: 'Cyberpunk Techwear', image: 'https://picsum.photos/seed/engineer_female/400/600' },
  { id: 'c9', name: 'Village Girl', age: 'Kids', gender: 'Female', profession: 'Student', outfit: 'Colorful Saree', image: 'https://picsum.photos/seed/village_girl/400/600' },
  { id: 'c10', name: 'Prisoner 702', age: 'Adult', gender: 'Male', profession: 'Criminal', outfit: 'Striped Uniform', image: 'https://picsum.photos/seed/prisoner/400/600' },
];

export const SCENES: Scene[] = [
  { id: 's1', name: 'Village Field', background: 'https://picsum.photos/seed/village_v2/1280/720', lighting: 'Day', weather: 'Sunny' },
  { id: 's2', name: 'Cyber City', background: 'https://picsum.photos/seed/cyber_city/1280/720', lighting: 'Night', weather: 'Cloudy' },
  { id: 's3', name: 'Anime School', background: 'https://picsum.photos/seed/anime_school/1280/720', lighting: 'Day', weather: 'Sunny' },
  { id: 's4', name: 'Hospital ICU', background: 'https://picsum.photos/seed/hospital_v2/1280/720', lighting: 'Day', weather: 'Sunny' },
  { id: 's5', name: 'Police HQ', background: 'https://picsum.photos/seed/police_hq/1280/720', lighting: 'Day', weather: 'Sunny' },
  { id: 's6', name: 'Secret Lab', background: 'https://picsum.photos/seed/secret_lab/1280/720', lighting: 'Night', weather: 'Cloudy' },
];

export const ACTIONS: AnimationAction[] = [
  { id: 'a1', name: 'Walking', category: 'Basic' },
  { id: 'a2', name: 'Running', category: 'Basic' },
  { id: 'a3', name: 'Sitting', category: 'Basic' },
  { id: 'a4', name: 'Talking', category: 'Interaction' },
  { id: 'a5', name: 'Giving Salam', category: 'Interaction' },
  { id: 'a6', name: 'Driving Car', category: 'Vehicle' },
  { id: 'a7', name: 'Happy', category: 'Emotion' },
  { id: 'a8', name: 'Sad', category: 'Emotion' },
  { id: 'a9', name: 'Fighting', category: 'Basic' },
  { id: 'a10', name: 'Flying', category: 'Basic' },
  { id: 'a11', name: 'Dancing', category: 'Basic' },
  { id: 'a12', name: 'Handshake', category: 'Interaction' },
  { id: 'a13', name: 'Crying', category: 'Emotion' },
  { id: 'a14', name: 'Surprised', category: 'Emotion' },
  { id: 'a15', name: 'Driving Bike', category: 'Vehicle' },
];
