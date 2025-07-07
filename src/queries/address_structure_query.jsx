import { useQuery } from '@tanstack/react-query';

// create fake data for address structure using Promise and custome useFetchAddressStructure hook
export const useFetchAddressStructure = () => {
  return useQuery({
    queryKey: ['addressStructure'],
    queryFn: () => new Promise((resolve) => resolve(fakeAddressData)),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
  });
};

const fakeAddressData = [
  {
    id: 1,
    name: 'Oromia',
    level: 'region',
    children: [
      {
        id: 2,
        name: 'Bale',
        level: 'zone',
        children: [
          {
            id: 3,
            name: 'Woreda A',
            level: 'woreda',
            children: [],
          },
        ],
      },
    ],
  },
];
