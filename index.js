const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./Assets/generateHTML");
var fs = require("fs");
const convertFactory = require('electron-html-to');
const util = require("util");
const writeFileAsync = util.promisify(fs.writeFile);

//setup the questions
const questions = [
  {
    type: "input",
    name: "username",
    message: "What's Your GitHub User Name? "
  },
  {
    type: "list",
    name: "favColor",
    message: "What's You're Favorate Color ? ",
    choices: ["green", "blue", "pink", "red"]
  }
];

inquirer.prompt(questions).then(function(response) {
  console.log(response);
  // use axios to get the data from github
  const mainUrl = "https://api.github.com/users/" + response.username;
  const startUrl =
    "https://api.github.com/users/" + response.username + "/starred"; // "stargazers_count": 1,

  //axios call
  axios.get(mainUrl).then(function({ data }) {
    console.log(data);
    // 2nd axios to get the starts count
    axios.get(startUrl).then(function(res) {
      const starCount = res.data.map(elt => {
        return elt.stargazers_count;
      });

      const totalCount = starCount.length;
      //   console.log(totalCount);

      //build the parameters to populate the hmtl
      const htmlData = {
        color: response.favColor,
        avatar_url: data.avatar_url,
        name: data.name,
        location: data.location,
        company: data.company,
        html_url: data.html_url,
        blog: data.blog,
        bio: data.bio,
        public_repos: data.public_repos,
        followers: data.followers,
        stars: totalCount,
        following: data.following
      };

      //generate hmtl
      var htmlCode = generateHTML(htmlData);
      //console.log(htmlCode);

      //write the page so electrron can intercept the html page 
      writeFileAsync("./index.html", htmlCode);

      //build the pdf using electron ./pdf/generatedPDF.pdf
      const conversion = convertFactory({
        converterPath: convertFactory.converters.PDF
      });

      conversion({ html: htmlCode }, function(err, result) {
        if (err) throw err;
        result.stream.pipe(fs.createWriteStream('./profile.pdf'));
        conversion.kill(); 
      });
    });
  });
});
