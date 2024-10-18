const { fizzbuzz } = require("./fizzbuzz.js");

function bench(name, iteration_count, func) {
  const iter_start = Date.now();
  for (var i = 0; i < iteration_count; i++) {
    func();
  }
  const iter_end = Date.now();
  console.log(`${name}(${iteration_count} iterations): ${(iter_end - iter_start) / iteration_count} ms / iteration`);
}
  

function run_bench(n, warmup, iter_count) {
  bench("Warmup", warmup, () => {
    for (var i = 1; i <= n; i++) {
      let _ = fizzbuzz(i);
    }
  });

  bench("Iteration", iter_count, () => {
    for (var i = 1; i <= n; i++) {
      let _ = fizzbuzz(i);
    }
  });
}

function run_fizzbuzz(n) {
  for (var i = 1; i <= n; i++) {
    console.log(fizzbuzz(i));
  }
}

const DEFAULT_WARMUP = 50;
const DEFAULT_ITER = 10000;
const DEFAULT_N = 10000;

const usage = "\
node index.js fizzbuzz [N]\n\
node index.js bench [N warmup iteration]\n\
\n\
Options:\n\
  N        : Iteration max bound: each iteration run fizzbuzz for integers from 1 to N. Default to 100.\n\
  warmup   : Bench warmup iteration count. Default to 50.\n\
  iteration: Bench iteration count. Default to 10000.";

function parse_cmd(args) {
  if (args[0] == "fizzbuzz") {
    const N = parseInt(args[1]) || DEFAULT_N;
    return () => {
      console.log(`Running on Node ${process.versions.node}`);
      run_fizzbuzz(N);
    };
  } else if (args[0] == "bench") {
    const N = parseInt(args[1]) || DEFAULT_N;
    const warmup = parseInt(args[2]) || DEFAULT_WARMUP;
    const iter = parseInt(args[3]) || DEFAULT_ITER;
    return () => {
      console.log(`Running on Node ${process.versions.node}`);
      run_bench(N, warmup, iter);
    };
  } else {
    return () => console.log(usage);
  }
}

const cmd = parse_cmd(process.argv.slice(2));
cmd();
