export type CharacterAge = 'Baby' | 'Kids' | 'Teenager' | 'Adult' | 'Elderly';
export type CharacterGender = 'Male' | 'Female';
export type Profession = 'Doctor' | 'Police' | 'Teacher' | 'Farmer' | 'Driver' | 'Businessman' | 'Student' | 'Engineer' | 'Shopkeeper' | 'Criminal' | 'Delivery' | 'Office Worker' | 'Content Creator';

export interface Character {
  id: string;
  name: string;
  age: CharacterAge;
  gender: CharacterGender;
  profession: Profession;
  outfit: string;
  image: string;
}

export interface Scene {
  id: string;
  name: string;
  background: string;
  lighting: 'Day' | 'Night' | 'Sunset';
  weather: 'Sunny' | 'Rainy' | 'Cloudy';
}

export interface AnimationAction {
  id: string;
  name: string;
  category: 'Basic' | 'Interaction' | 'Vehicle' | 'Emotion';
}

export interface TimelineItem {
  id: string;
  type: 'character' | 'background' | 'audio';
  startTime: number;
  duration: number;
  assetId: string;
  properties: any;
}

export interface Project {
  id: string;
  name: string;
  scenes: TimelineItem[];
}
