function benchmark(name, iteration_count, func) {
  const iter_start = Date.now();
  for (var i = 0; i < iteration_count; i++) {
    func();
  }
  const iter_end = Date.now();
  console.log(`${name}(${iteration_count} iterations): ${(iter_end - iter_start) / iteration_count} ms / iteration`);
}
  
console.log(`Running on Node ${process.versions.node}`);

const fizzbuzz = (n) => {
  if (n % 3 == 0 && n % 5 == 0) {
    return "FizzBuzz";
  } else if (n % 3 == 0) {
    return "Fizz";
  } else if (n % 5 == 0){
    return "Buzz";
  } else return n;
}

benchmark("Warmup", 50, () => {
  for (var i = 0; i < 10000; i++) {
    let _ = fizzbuzz(i);
  }
});


benchmark("Iteration", 10000, () => {
  for (var i = 0; i < 10000; i++) {
    let _ = fizzbuzz(i);
  }
});

