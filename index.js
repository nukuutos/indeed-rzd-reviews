const axios = require("axios").default;
const fs = require("fs");

const getPages = async () => {
  const promises = [];

  for (let i = 0; i <= 1450; i += 20) {
    promises.push(
      axios.get(
        `https://www.indeed.com/cmp/%D0%9E%D0%B0%D0%BE-%22%D1%80%D0%B6%D0%B4%22/reviews?fcountry=RU&start=${i}`
      )
    );
  }

  const responses = await Promise.all(promises);

  const pages = responses.map((response) => response.data);

  for (let i = 0; i < pages.length; i++) {
    let page = pages[i];

    const startWord = '"items":';
    const endWord = ',"loginURL';

    const startWordIndex = page.indexOf(startWord);
    const startWordLength = startWord.length;

    const endWordIndex = page.indexOf(endWord);

    console.log(startWordIndex, endWordIndex);

    page = page.substring(startWordIndex + startWordLength, endWordIndex);

    fs.writeFileSync(`./pages/${i}.json`, page, { encoding: "utf-8" });
  }
};

const joinJsonData = () => {
  const result = [];
  for (let i = 0; i < 73; i++) {
    const page = JSON.parse(fs.readFileSync(`./pages/${i}.json`));
    for (const review of page) {
      result.push(review);
    }
  }

  console.log(result.length);

  fs.writeFileSync(`./result.json`, JSON.stringify(result), { encoding: "utf-8" });
};

const checkDuplicates = () => {
  const data = JSON.parse(fs.readFileSync(`./result.json`));

  const duplicates = [];

  for (let i = 0; i < data.length - 1; i++) {
    const currentReview = JSON.stringify(data[i]);

    for (let j = i + 1; j < data.length; j++) {
      const reviewToCompare = JSON.stringify(data[j]);

      if (currentReview === reviewToCompare) {
        duplicates.push([i, j]);
      }
    }
  }

  console.log(duplicates);
};

// getPages();
// joinJsonData();
checkDuplicates();
