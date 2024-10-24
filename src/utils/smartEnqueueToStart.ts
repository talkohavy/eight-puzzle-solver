type SmartEnqueueToStartProps<T> = {
  arr: Array<T>;
  item: T;
  getValue: (item: T) => number;
};

function smartEnqueueToStart<T = any>(props: SmartEnqueueToStartProps<T>) {
  const { arr, item, getValue } = props;

  let isInserted = false;
  const insertedItemValue = getValue(item);

  // Traverse from the end of the array
  for (let i = arr.length - 1; i >= 0; i--) {
    if (insertedItemValue >= getValue(arr[i]!)) {
      // Insert entity after the current element
      arr.splice(i + 1, 0, item);
      isInserted = true;
      break;
    }
  }

  // If the entity is smaller than the first element, insert it at the beginning
  if (!isInserted) arr.unshift(item);
}

export { smartEnqueueToStart };
