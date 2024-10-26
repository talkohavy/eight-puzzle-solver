type printTheTimeItTookToSolveProps = {
  name: string;
};

function printTheTimeItTookToSolve(props: printTheTimeItTookToSolveProps) {
  const { name } = props;

  performance.measure(name, `start-${name}`, `end-${name}`);
  const [aStarPerformance] = performance.getEntriesByName(name);

  const prettyDuration = Math.floor(aStarPerformance!.duration);

  console.log(`${name} algorithm ran for: ${prettyDuration}ms.`);

  // performance.clearMarks();
  // performance.clearMeasures();
}

export { printTheTimeItTookToSolve };
