const fs = require('fs')
const ora = require('ora')
var { prompt } = require('inquirer')
var moment = require('moment')

const spinner = ora('Loading')


function main()
{
    newFile()
}



function newFile()
{
    
    inputStream().then(function(data){
        let {fileJson} = data.name

        spinner.start()
        
        if(data.context)
        {

            for(let context in data.context.length)
            {

                console.log(context)
            }
            
            spinner.succeed("Success")
        }
        else
        {
            setTimeout(function(){
                appendFile(fileJson, function(err){
                
                    if(err)
                    {
                        spinner.fail("Error")
                    }
                    let date = moment().unix()
                    let name = fileJson + date
                    fs.writeFile('./storage/list/' + name  + '.json' , 'test', 'utf8', function(err){
                        if(err)
                        {
                        spinner.fail("Error Created Connection")
                        }
                        spinner.text = "File Name " + fileJson
                    })                
                    spinner.succeed("Success")
                })    
            }, 2000)
        }
        
    })
}

async function inputStream(){
    try
    {
        let list = await listFile()        
        const form = list.length > 0 ? 
            {
                type:'list',
                name: 'fileJson',
                message: 'Choose Data Json',
                choices: list,
                filter: function(val){
                    return val.toLowerCase()
                }
            }
    
            : 
            {
                type:'input',
                name: 'fileJson',
                message: 'Choose Data Json'
            }
        

        let data = await prompt(form)
        let context = list.length > 0 ? list : null
        return {name:  data, context}
    }
    catch(error)
    {
        console.log(error)
    }
}

//check folder

async function listFile()
{
   return new Promise(function(resolve, reject){
    let path = './storage/list'
    fs.readdir(path, function(err, items){
        if(err)
        {
            reject(err)
        }

        resolve(items)
    })
   })
   
}

function appendFile(value, cb)
{

    fs.readFile('./storage/connect.json', 'utf8', function(err, data){
        if(err) throw err
        let json = JSON.parse(data)
        json.connect = value
        fs.writeFile('./storage/connect.json', JSON.stringify(json), 'utf8', function(err){
            if(err){
            
                cb(err)
            }

            cb(null)
        })
    })

}


main()