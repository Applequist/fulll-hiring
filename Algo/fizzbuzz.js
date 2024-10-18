const fizzbuzz = (n) => {
  const fizz = n % 3 == 0;
  const buzz = n % 5 == 0;
  if (fizz && buzz) {
    return "FizzBuzz";
  } else if (fizz) {
    return "Fizz";
  } else if (buzz){
    return "Buzz";
  } else return n;
}

exports.fizzbuzz = fizzbuzz;
