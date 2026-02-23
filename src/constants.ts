import { MathTrick } from './types';

export interface MathStep {
  text: string;
  interactive?: {
    type: 'input' | 'choice';
    question: string;
    answer: string | number;
    hint: string;
  };
}

export interface MathTrickExtended extends MathTrick {
  interactiveSteps: MathStep[];
  badge: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
}

export const MATH_TRICKS: MathTrickExtended[] = [
  {
    id: 1,
    title: "The Magic 9s",
    secretCode: "The Finger Trick",
    explanation: [
      "Hold up all 10 fingers in front of you.",
      "To multiply 9 by 'n', fold down your 'nth' finger from the left.",
      "The fingers to the left of the folded one are the tens, and the ones to the right are the units!"
    ],
    interactiveSteps: [
      { text: "Hold up all 10 fingers in front of you. Ready-uh?" },
      { 
        text: "Let's try 9 x 3. Guess which finger you should fold down from the left? try 3",
        interactive: { type: 'input', question: "Enter finger number (1-10):", answer: 3, hint: "It's the 3rd finger, nanba!" }
      },
      { text: "Now look at your hands. How many fingers are to the LEFT of the folded one?" },
      { 
        text: "And how many are to the RIGHT?",
        interactive: { type: 'input', question: "Fingers on right:", answer: 7, hint: "Count them carefully!" }
      }
    ],
    example: {
      question: "9 x 4",
      answer: 36,
      explanation: "Fold your 4th finger. You have 3 fingers on the left and 6 on the right. 36! Super-pa!"
    },
    scenario: "You're buying 9 packets of Murukku for your friends. Each costs 4 rupees. How much total?",
    badge: { id: 'finger-wizard', name: 'Finger Wizard', icon: '🖐️', color: '#FDB913' }
  },
  {
    id: 2,
    title: "High-Five 5s",
    secretCode: "Half it and add a Zero",
    explanation: [
      "To multiply any even number by 5, first find half of that number.",
      "Then, just stick a zero at the end of it!",
      "If it's odd, subtract 1, half it, and stick a 5 at the end."
    ],
    interactiveSteps: [
      { text: "Multiplying by 5 is like a high-five! Let's try 5 x 14." },
      { 
        text: "Step 1: What is half of 14?",
        interactive: { type: 'input', question: "Half of 14 is:", answer: 7, hint: "14 divided by 2 is...?" }
      },
      { 
        text: "Step 2: Now add a zero to the end of 7. What do you get?",
        interactive: { type: 'input', question: "Final answer:", answer: 70, hint: "Just put a 0 after the 7!" }
      }
    ],
    example: {
      question: "5 x 12",
      answer: 60,
      explanation: "Half of 12 is 6. Add a zero... 60! Correct-u!"
    },
    scenario: "An auto fare to Marina Beach is 5 rupees per kilometer. You traveled 12km. What's the fare?",
    badge: { id: 'high-five-hero', name: 'High-Five Hero', icon: '✋', color: '#F27D26' }
  },
  {
    id: 3,
    title: "The 11s Sandwich",
    secretCode: "Split and Add",
    explanation: [
      "To multiply a 2-digit number by 11, split the two digits apart.",
      "Add the two digits together.",
      "Put that sum in the middle of the original two digits!"
    ],
    interactiveSteps: [
      { text: "Let's make an 11s sandwich with 11 x 34!" },
      { text: "First, split 3 and 4. They are the bread!" },
      { 
        text: "Now, add 3 + 4 to get the filling. What is the sum?",
        interactive: { type: 'input', question: "3 + 4 =", answer: 7, hint: "Simple addition, nanba!" }
      },
      { 
        text: "Put the 7 in the middle of 3 and 4. What's the final number?",
        interactive: { type: 'input', question: "Final answer:", answer: 374, hint: "3 [7] 4" }
      }
    ],
    example: {
      question: "11 x 25",
      answer: 275,
      explanation: "Split 2 and 5. Add them: 2+5=7. Sandwich it: 275! Semme!"
    },
    scenario: "CSK scored 25 runs in 11 different overs. How many total runs is that?",
    badge: { id: 'sandwich-master', name: 'Sandwich Master', icon: '🥪', color: '#004BA0' }
  },
  {
    id: 4,
    title: "The 1000s Subtraction",
    secretCode: "All from 9, last from 10",
    explanation: [
      "Subtracting from 1000? Don't borrow! Use the code.",
      "Subtract every digit of the number from 9.",
      "But subtract the very last digit from 10!"
    ],
    interactiveSteps: [
      { text: "Subtracting from 1000 is a breeze! Let's do 1000 - 467." },
      { 
        text: "First digit is 4. Subtract it from 9.",
        interactive: { type: 'input', question: "9 - 4 =", answer: 5, hint: "9 minus 4 is...?" }
      },
      { 
        text: "Second digit is 6. Subtract it from 9.",
        interactive: { type: 'input', question: "9 - 6 =", answer: 3, hint: "9 minus 6 is...?" }
      },
      { 
        text: "Last digit is 7. Subtract it from 10!",
        interactive: { type: 'input', question: "10 - 7 =", answer: 3, hint: "The last one is from 10!" }
      }
    ],
    example: {
      question: "1000 - 345",
      answer: 655,
      explanation: "9-3=6, 9-4=5, 10-5=5. Put them together: 655! Easy-peasy!"
    },
    scenario: "You gave a 1000 rupee note for a 345 rupee meal at a T.Nagar canteen. How much change?",
    badge: { id: 'change-maker', name: 'Change Maker', icon: '💰', color: '#10B981' }
  },
  {
    id: 5,
    title: "The Double-Double 4s",
    secretCode: "The Double-Double",
    explanation: [
      "Multiplying by 4 is just doubling twice!",
      "Double the number once.",
      "Then double that result again."
    ],
    interactiveSteps: [
      { text: "Multiplying by 4? Just double it twice! Let's try 4 x 15." },
      { 
        text: "Step 1: Double 15. What do you get?",
        interactive: { type: 'input', question: "15 + 15 =", answer: 30, hint: "15 doubled is...?" }
      },
      { 
        text: "Step 2: Now double 30. What's the final answer?",
        interactive: { type: 'input', question: "30 + 30 =", answer: 60, hint: "Double it again!" }
      }
    ],
    example: {
      question: "4 x 18",
      answer: 72,
      explanation: "Double 18 is 36. Double 36 is 72! Double-dhamaka!"
    },
    scenario: "4 friends are sharing 18 idlis each. How many idlis did the canteen master make?",
    badge: { id: 'double-dynamo', name: 'Double Dynamo', icon: '⚡', color: '#8B5CF6' }
  },
  {
    id: 6,
    title: "Friendly 10s",
    secretCode: "Move numbers to make a 10",
    explanation: [
      "Addition is easier with 10s!",
      "Take a bit from one number to make the other a round 10.",
      "Then add what's left."
    ],
    interactiveSteps: [
      { text: "Let's add 19 + 26 using friendly 10s!" },
      { 
        text: "19 is so close to 20! How much do we need to take from 26 to make 19 into 20?",
        interactive: { type: 'input', question: "Take how much?", answer: 1, hint: "19 + ? = 20" }
      },
      { 
        text: "Now 19 becomes 20, and 26 becomes 25. What is 20 + 25?",
        interactive: { type: 'input', question: "20 + 25 =", answer: 45, hint: "Add the tens first!" }
      }
    ],
    example: {
      question: "18 + 27",
      answer: 45,
      explanation: "Take 2 from 27 and give it to 18. Now it's 20 + 25. That's 45! Smart-u!"
    },
    scenario: "You have 18 blue marbles and 27 red marbles from the Besant Nagar beach shop. Total?",
    badge: { id: 'ten-tastic', name: 'Ten-tastic', icon: '🔟', color: '#EC4899' }
  },
  {
    id: 7,
    title: "Zero Heroes",
    secretCode: "Slide the Zero",
    explanation: [
      "Multiplying by 10, 100, or 1000 is just sliding!",
      "Count how many zeros are in the multiplier.",
      "Just slide that many zeros to the end of your number."
    ],
    interactiveSteps: [
      { text: "Slide those zeros! Let's do 1000 x 52." },
      { 
        text: "How many zeros are in 1000?",
        interactive: { type: 'input', question: "Number of zeros:", answer: 3, hint: "Count them in 1000!" }
      },
      { 
        text: "Now slide 3 zeros to the end of 52. What do you get?",
        interactive: { type: 'input', question: "Final answer:", answer: 52000, hint: "52 followed by 3 zeros!" }
      }
    ],
    example: {
      question: "100 x 45",
      answer: 4500,
      explanation: "45 with two zeros at the end... 4500! Zero hero!"
    },
    scenario: "100 kids each bought a 45 rupee kite at the Marina festival. Total collection?",
    badge: { id: 'zero-hero', name: 'Zero Hero', icon: '🦸', color: '#3B82F6' }
  },
  {
    id: 8,
    title: "The Half-Half /4",
    secretCode: "The Half-Half",
    explanation: [
      "Dividing by 4 is just halving twice!",
      "Cut the number in half once.",
      "Then cut that half in half again."
    ],
    interactiveSteps: [
      { text: "Dividing by 4? Just half it twice! Let's do 84 / 4." },
      { 
        text: "Step 1: What is half of 84?",
        interactive: { type: 'input', question: "Half of 84 is:", answer: 42, hint: "84 divided by 2 is...?" }
      },
      { 
        text: "Step 2: Now what is half of 42?",
        interactive: { type: 'input', question: "Half of 42 is:", answer: 21, hint: "42 divided by 2 is...?" }
      }
    ],
    example: {
      question: "128 / 4",
      answer: 32,
      explanation: "Half of 128 is 64. Half of 64 is 32! Cut-it-out!"
    },
    scenario: "128 Rose Milks were shared equally among 4 cricket teams. How many per team?",
    badge: { id: 'half-half-pro', name: 'Half-Half Pro', icon: '🔪', color: '#F59E0B' }
  },
  {
    id: 9,
    title: "The Near-Miss 99s",
    secretCode: "The Near-Miss",
    explanation: [
      "Multiplying by 99? It's almost 100!",
      "Multiply the number by 100 first.",
      "Then subtract the original number once."
    ],
    interactiveSteps: [
      { text: "99 is almost 100! Let's do 99 x 6." },
      { 
        text: "First, what is 100 x 6?",
        interactive: { type: 'input', question: "100 x 6 =", answer: 600, hint: "Just add two zeros!" }
      },
      { 
        text: "Now subtract the original number (6) from 600. What do you get?",
        interactive: { type: 'input', question: "600 - 6 =", answer: 594, hint: "Subtract carefully!" }
      }
    ],
    example: {
      question: "99 x 7",
      answer: 693,
      explanation: "100 x 7 = 700. 700 - 7 = 693! Near-miss success!"
    },
    scenario: "A ticket for a movie at Sathyam Cinemas is 99 rupees. You need 7 tickets. Total?",
    badge: { id: 'near-miss-ninja', name: 'Near-Miss Ninja', icon: '🥷', color: '#1F2937' }
  },
  {
    id: 10,
    title: "The 5-Square Secret",
    secretCode: "First digit x (First digit + 1), then attach 25",
    explanation: [
      "Squaring a number ending in 5? Easy!",
      "Take the first digit and multiply it by the next number up.",
      "Then just write '25' at the end of that result."
    ],
    interactiveSteps: [
      { text: "Squaring numbers ending in 5 is magic! Let's do 45 x 45." },
      { 
        text: "The first digit is 4. What is the next number after 4?",
        interactive: { type: 'input', question: "Next number:", answer: 5, hint: "What comes after 4?" }
      },
      { 
        text: "Now multiply 4 by that next number (5). What do you get?",
        interactive: { type: 'input', question: "4 x 5 =", answer: 20, hint: "4 times 5 is...?" }
      },
      { 
        text: "Now just attach '25' to the end of 20. What's the final answer?",
        interactive: { type: 'input', question: "Final answer:", answer: 2025, hint: "20 followed by 25!" }
      }
    ],
    example: {
      question: "35 x 35",
      answer: 1225,
      explanation: "3 x 4 = 12. Attach 25... 1225! You're a Math Wizard now!"
    },
    scenario: "A square tile at the Kapaleeshwarar temple is 35cm wide. What is its area?",
    badge: { id: 'square-sorcerer', name: 'Square Sorcerer', icon: '🔮', color: '#7C3AED' }
  }
];
