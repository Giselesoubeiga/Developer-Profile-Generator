// 1. set up dependencies => always bring the package to your server by doing 

//const <name> = require("<name>");
const inquirer = require("inquirer");
const axios = require("axios");
const generateHTML = require("./Assets/generateHTML");
const fs = require('fs');
const convertFactory = require('electron-html-to');

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
        choices: ["green", "blue","pink","red"]
    }
];

inquirer.prompt(questions).then(function (response) {
 
    // use axios to get the data from github
    const mainUrl = "https://api.github.com/users/" + response.username;
    const startUrl = "https://api.github.com/users/" + response.username + "/starred";

    //axios call
    axios.get(mainUrl).then(function (response) {
         
        response.data.map(eles=>{
            console.log(eles)
        })
          
      //  console.log(response.data);

        // pdf.create(generateHTML(els)).toFile('./devportfolio.pdf', function (err, res) {
        //     if (err) throw (err);
        // })


        //build the html page and use electron to pdf
        // var conversion = convertFactory({
        //     converterPath: convertFactory.converters.PDF
        // });

        // conversion({ html: generateHTML(data) }, function (err, result) {
        //     if (err) {
        //         return console.error(err);
        //     }

        //     result.stream.pipe(fs.createWriteStream('./pdf/generatedPDF.pdf'));
        //     conversion.kill(); // necessary if you use the electron-server strategy, see bellow for detai
        // })
    })
});
