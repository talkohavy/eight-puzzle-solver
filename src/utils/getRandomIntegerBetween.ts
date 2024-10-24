type GetRandomIntegerBetweenProps = {
  /**
   * @default 0
   */
  min?: number;
  max: number;
};

/**
 * @description
 * including `min`, not including `max`.
 */
export function getRandomIntegerBetween(props: GetRandomIntegerBetweenProps) {
  const { min = 0, max } = props;

  return min + Math.floor(Math.random() * max);
}
