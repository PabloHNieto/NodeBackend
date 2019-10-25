const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (a < 0 || b < 0) reject("Only positive numbers");
      resolve( a + b)}, 
    1000)
  })
}

const doWork = async () => { 
  const sum = await add(2, 4);
const sum2 = await add(-20, 30);
  return [sum, sum2];
};


doWork().then((res) => 
  console.log(res)
).catch((e) => console.error(e));