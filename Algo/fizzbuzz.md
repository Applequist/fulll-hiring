## [Algo] Fizzbuzz

### Instructions

This is the very classical Fizz Buzz.

### Subject

Display numbers between **1** and **N** by following the rules:

- if number can be divided by 3: display **Fizz** ;
- if number can be divided by 5: display **Buzz** ;
- if number can be divided by 3 **AND** 5 : display **FizzBuzz** ;
- else: display the number.

#### Guidelines

- Write it in your favorite language (one of: javascript, php)
- Push your code to a Github repository or any sandbox environment like [codesandbox](https://codesandbox.io)
- Get ready to justify some of your choices for the interview

#### Evaluation

- Quality of the code
- Scalability of the algorithm
- Usage of good practices and modern programming language features

#### Result

##### Naive implementation

```sh
fulll-hiring/Algo on  master [⇡] is 📦 v1.0.0 via  v14.21.3 
❯ npm run bench

> algo@1.0.0 bench /home/brieuc/Repositories/fulll-hiring/Algo
> node index.js bench

Running on Node 14.21.3
Warmup(50 iterations): 0.04 ms / iteration
Iteration(10000 iterations): 0.01 ms / iteration
```

##### Constant folding

Fold `n % 3 == 0` and `n % 5 == 0` into constant.

```sh
fulll-hiring/Algo on  master [!⇡] is 📦 v1.0.0 via  v14.21.3 
❯ npm run bench

> algo@1.0.0 bench /home/brieuc/Repositories/fulll-hiring/Algo
> node index.js bench

Running on Node 14.21.3
Warmup(50 iterations): 0.04 ms / iteration
Iteration(10000 iterations): 0.0107 ms / iteration
```

