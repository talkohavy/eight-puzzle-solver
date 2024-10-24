import { getRandomIntegerBetween } from './getRandomIntegerBetween.js';

function toShuffledArray(inputArr: Array<number>) {
  const newArray = [...inputArr];

  newArray.forEach((_, currentIndex) => {
    const differentIndex = getRandomIntegerBetween({ max: inputArr.length });

    const temp = newArray[differentIndex]!;
    newArray[differentIndex] = newArray[currentIndex]!;
    newArray[currentIndex] = temp;
  });

  return newArray;
}

export { toShuffledArray };
