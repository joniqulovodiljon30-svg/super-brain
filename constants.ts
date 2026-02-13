
import { WordData } from './types';

export const LANGUAGES = [
  { code: 'EN', name: 'English' },
  { code: 'UZ', name: 'O\'zbekcha' }
];

export const CATEGORIES = ['Nature', 'Objects', 'Abstract', 'Common'];

export const WORDS_DB: Record<string, string[]> = {
  EN: [
    'Sun', 'Moon', 'Star', 'Earth', 'Water', 'Fire', 'Air', 'Tree', 'Flower', 'Mountain', 
    'River', 'Sea', 'City', 'Village', 'House', 'School', 'Book', 'Pen', 'Notebook', 'Friend', 
    'Family', 'Bread', 'Tea', 'Apple', 'Grape', 'Horse', 'Dog', 'Cat', 'Bird', 'Plane', 
    'Car', 'Bicycle', 'Road', 'Bridge', 'Happiness', 'Love', 'Peace', 'Knowledge', 'Strength', 'Time', 
    'Color', 'White', 'Black', 'Red', 'Blue', 'Green', 'Yellow', 'Hot', 'Cold', 'Big', 
    'Small', 'New', 'Old', 'Sweet', 'Bitter', 'Fast', 'Slow', 'High', 'Low', 'Beautiful', 
    'Rich', 'Poor', 'Health', 'Work', 'Rest', 'Morning', 'Evening', 'Today', 'Tomorrow', 'Yesterday', 
    'Week', 'Month', 'Year', 'Spring', 'Summer', 'Autumn', 'Winter', 'Cloud', 'Rain', 'Snow',
    'Window', 'Door', 'Chair', 'Table', 'Phone', 'Music', 'Camera', 'Heart', 'Hand', 'Face',
    'Space', 'Rocket', 'Forest', 'Ocean', 'Desert', 'Gold', 'Silver', 'Iron', 'Paper', 'Glass',
    'Keyboard', 'Laptop', 'Screen', 'Coffee', 'Juice', 'Milk', 'Bread', 'Butter', 'Cheese', 'Salt',
    'Sugar', 'Pepper', 'Pencil', 'Eraser', 'Ruler', 'Map', 'Globe', 'Clock', 'Watch', 'Battery',
    'Light', 'Dark', 'Sound', 'Silence', 'Dream', 'Night', 'Day', 'Future', 'Past', 'Goal',
    'Life', 'Death', 'Youth', 'Age', 'Speed', 'Weight', 'Distance', 'Price', 'Value', 'Luck',
    'Logic', 'Soul', 'Body', 'Brain', 'Memory', 'Mind', 'Idea', 'Thought', 'Voice', 'Word',
    'Sentence', 'Story', 'Hero', 'Enemy', 'King', 'Queen', 'Prince', 'Princess', 'Castle', 'Tower',
    'Wall', 'Gate', 'Key', 'Lock', 'Box', 'Bag', 'Wallet', 'Card', 'Coin', 'Money',
    'Shop', 'Market', 'Mall', 'Bank', 'Post', 'Office', 'Farm', 'Park', 'Garden', 'Zoo',
    'Ship', 'Boat', 'Truck', 'Bus', 'Train', 'Metro', 'Bike', 'Helmet', 'Wheel', 'Tire',
    'Sky', 'Hell', 'Devil', 'Angel', 'Magic', 'Science', 'Art', 'Sport', 'Game', 'Fun'
  ],
  UZ: [
    'Quyosh', 'Oy', 'Yulduz', 'Yer', 'Suv', 'Olov', 'Havo', 'Daraxt', 'Gul', 'Tog\'', 
    'Daryo', 'Dengiz', 'Shahar', 'Qishloq', 'Uy', 'Maktab', 'Kitob', 'Qalam', 'Daftar', 'Do\'st', 
    'Oila', 'Non', 'Choy', 'Olma', 'Uzum', 'Ot', 'It', 'Mushuk', 'Qush', 'Samolyot', 
    'Mashina', 'Velosiped', 'Yo\'l', 'Ko\'prik', 'Baxt', 'Sevgi', 'Tinchlik', 'Bilim', 'Kuch', 'Vaqt', 
    'Rang', 'Oq', 'Qora', 'Qizil', 'Ko\'k', 'Yashil', 'Sariq', 'Issiq', 'Sovuq', 'Katta', 
    'Kichik', 'Yangi', 'Eski', 'Shirin', 'Achchiq', 'Tez', 'Sekin', 'Baland', 'Past', 'Chiroyli', 
    'Boy', 'Kambag\'al', 'Sog\'liq', 'Ish', 'Dam', 'Ertalab', 'Kechqurun', 'Bugun', 'Ertaga', 'Kecha', 
    'Hafta', 'Oy', 'Yil', 'Bahor', 'Yoz', 'Kuz', 'Qish', 'Bulut', 'Yomg\'ir', 'Qor',
    'Deraza', 'Eshik', 'O\'rindiq', 'Stol', 'Telefon', 'Musiqa', 'Kamera', 'Yurak', 'Qo\'l', 'Yuz',
    'Fazoviy', 'Raketa', 'O\'rmon', 'Ummon', 'Sahro', 'Oltin', 'Kumush', 'Temir', 'Qog\'oz', 'Shisha',
    'Klaviatura', 'Noutbuk', 'Ekran', 'Qahva', 'Sharbat', 'Sut', 'Yog\'', 'Pishloq', 'Tuz', 'Shakar',
    'Murch', 'O\'chirg\'ich', 'Chizg\'ich', 'Xarita', 'Globus', 'Soat', 'Batareya', 'Yorug\'lik', 'Zulmat', 'Ovoz',
    'Sukunat', 'Tush', 'Tun', 'Kun', 'Kelajak', 'O\'tmish', 'Maqsad', 'Hayot', 'Olim', 'Yoshlik',
    'Qarilik', 'Tezlik', 'Og\'irlik', 'Masofa', 'Narx', 'Qiymat', 'Omad', 'Mantiq', 'Ruh', 'Tana',
    'Miya', 'Xotira', 'Aql', 'G\'oya', 'Fikr', 'Gap', 'Hikoya', 'Qahramon', 'Dushman', 'Qirol',
    'Malika', 'Shahzoda', 'Qasr', 'Minora', 'Devor', 'Darvoza', 'Kalit', 'Qulf', 'Quti', 'Sumka',
    'Hamyon', 'Karta', 'Tanga', 'Pul', 'Do\'kon', 'Bozor', 'Bank', 'Pochta', 'Idora', 'Ferma',
    'Bog\'', 'Hayvonot bog\'i', 'Kema', 'Qayiq', 'Yuk mashinasi', 'Avtobus', 'Poyezd', 'Metro', 'Kaska', 'G\'ildirak',
    'Osmon', 'Do\'zax', 'Iblis', 'Farishta', 'Sehr', 'Fan', 'San\'at', 'Sport', 'O\'yin', 'Zavq'
  ]
};

export const INITIAL_WORDS: WordData[] = [];
export const NAMES = ["James", "Sarah", "Alex", "Elena", "Dmitry", "Fatima", "Mehmet", "Leyla", "John", "Maria"];
export const OCCUPATIONS = ["Architect", "Chef", "Doctor", "Musician", "Artist", "Engineer", "Writer", "Pilot"];
export const FEATURES = ["Blue eyes", "Red glasses", "Sharp jawline", "Curly hair", "Freckles", "Bright smile"];
