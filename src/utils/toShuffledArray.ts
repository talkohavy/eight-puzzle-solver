import { getRandomIntegerBetween } from './getRandomIntegerBetween';

function toShuffledArray(inputArr: Array<number>) {
  const newArray = [...inputArr];

  newArray.forEach((_, currentIndex) => {
    const differentIndex = getRandomIntegerBetween({ max: inputArr.length });

    newArray[currentIndex] = newArray[differentIndex]!;
    newArray[differentIndex] = newArray[currentIndex]!;
  });

  return newArray;
}

export { toShuffledArray };
