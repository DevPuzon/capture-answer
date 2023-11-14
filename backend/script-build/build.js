const fs = require('fs');

async function main(){
    const args = process.argv;
    const environments = args[2]; 

    let strEnv = '';
    let strMainTs = '';
    if(environments == '--prod'){
        strEnv = await fs.readFileSync('src/environments/environment.prod.ts',{encoding:'utf-8'});
        strMainTs = await fs.readFileSync('src/main.prod.ts',{encoding:'utf-8'});
    }else if(environments == '--dev'){
        strEnv = await fs.readFileSync('src/environments/environment.dev.ts',{encoding:'utf-8'});
        strMainTs = await fs.readFileSync('src/main.dev.ts',{encoding:'utf-8'});
    }else{
        strEnv = await fs.readFileSync('src/environments/environment.local.ts',{encoding:'utf-8'});
        strMainTs = await fs.readFileSync('src/main.local.ts',{encoding:'utf-8'});
    } 
    await fs.writeFileSync('src/environments/environment.ts',strEnv);
    await fs.writeFileSync('src/main.ts',strMainTs);
}

main();