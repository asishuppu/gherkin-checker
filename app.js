const parser = require("gherkin-parse");
const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
let jsonObject;
try{
    jsonObject = parser.convertFeatureFileToJSON("res/sample.feature");
} catch(ex){
    console.log("-------------------------Error---------------------");
    console.log(ex.toString().split('at Object')[0]);
}


router.get('/', function (req, res) {
    console.log(jsonObject)

    console.log(jsonObject.feature.children)

    console.log(jsonObject.feature.children[0].steps)
    res.sendFile(path.join(__dirname + '/index.html'));
    //__dirname : It will resolve to your project folder.
});

//app.use('/', router);
//app.listen(process.env.port || 3000);

console.log('Running at Port 3000');

analyse(jsonObject);
function analyse(resJson){
    resultSet = [];
    if(resJson){
        if(resJson.feature){
            if(resJson.feature.children && resJson.feature.children.length > 0){
                resJson.feature.children.forEach((scenario)=>{
                  console.log('---------------------------------------scenario------------------------------------')
                  console.log(scenario);
                  if(scenario && scenario.steps &&  scenario.steps.length > 0){
                    const manSteps = [];
                    const manStepText = [];
                    scenario.steps.forEach((step)=>{
                        manSteps.push(step.keyword.trim())
                        if(manStepText.find((t)=> t.toLowerCase() == step.text.trim().toLowerCase())){
                            resultSet.push('Scenario has Duplicate Steps found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                        }
                        manStepText.push(step.text.trim())
                        // console.log('---------------------------------------Step------------------------------------')
                        // console.log(step);
                    });
                    console.log(manSteps);
                    console.log(manStepText);
                    if(!(manSteps.find(s=>s == 'Given') && manSteps.find(s=>s == 'When') && manSteps.find(s=>s == 'Then'))){
                        resultSet.push('Scenario Should contain Given When Then found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                    }else{
                        if((manSteps.indexOf('Given') < manSteps.indexOf('When')) && (manSteps.indexOf('When') < manSteps.indexOf('Then'))  && (manSteps.indexOf('Then') > manSteps.indexOf('Given')) ){
                          //
                        }else{
                            resultSet.push('Scenario has improper order of  given when then Excpected, Gien -> When -> Then found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                        }
                    }
                    if(manSteps.filter((s=>s == "Given")).length > 1){
                        resultSet.push('Scenario has Multiple Given found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                    }
                    if(manSteps.filter((s=>s == "When")).length > 1){
                        resultSet.push('Scenario has Multiple When found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                    }
                    if(manSteps.filter((s=>s == "Then")).length > 1){
                        resultSet.push('Scenario has Multiple Then found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                    }
                  }else{
                    resultSet.push('Scenario With no steps found at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                  }
                  if(scenario.name.trim() == ''){
                    resultSet.push('Scenario Does not Contain Description at line:' + scenario.location.line+', Column:'+ scenario.location.column)
                  }
                });
            }
        }
    }
    resultSet.forEach((res)=>{
      console.log(res);
    });
}



