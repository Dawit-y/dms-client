import { faker } from '@faker-js/faker';

const range = (len) => {
  return Array.from({ length: len }, (_, i) => i);
};

// 👇 Generate a single mock document object
const newDocument = () => {
  return {
    title: faker.lorem.words(3),
    type: faker.helpers.arrayElement(['PDF', 'Word', 'Excel', 'Image']),
    uploadedBy: faker.person.fullName(),
    uploadedAt: faker.date.recent({ days: 30 }).toISOString(), // or just use new Date() if simpler
  };
};

// 👇 Generate nested or flat mock data
export function makeData(...lens) {
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth];
    return range(len).map(() => ({
      ...newDocument(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}
