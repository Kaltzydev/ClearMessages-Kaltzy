const {
  greenBright,
  cyanBright,
  cyan
} = require("chalk");
const chalk = require('chalk')
const ora = require('ora')
const per = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});
const {
  Client
} = require('discord.js-selfbot-v13')
const config = require("./config.json");
const client = new Client({
  checkUpdate: false
});

console.clear()



    
    per.question(chalk.hex('#ff0000').bold(
      `					   
╔═╗╔╗╔╔╦╗╦═╗╔═╗╔╗╔╔╦╗╔═╗  ╔╗╔╔═╗╔═╗  ╔═╗╔═╗╦═╗╔╦╗╔═╗╔═╗╔═╗  ╔╦╗╔═╗  ╦╔╗╔╔═╗╔═╗╦═╗╔╗╔╔═╗
║╣ ║║║ ║ ╠╦╝╠═╣║║║ ║║║ ║  ║║║║ ║╚═╗  ╠═╝║ ║╠╦╝ ║ ║ ║║╣ ╚═╗   ║║║ ║  ║║║║╠╣ ║╣ ╠╦╝║║║║ ║
╚═╝╝╚╝ ╩ ╩╚═╩ ╩╝╚╝═╩╝╚═╝  ╝╚╝╚═╝╚═╝  ╩  ╚═╝╩╚═ ╩ ╚═╝╚═╝╚═╝  ═╩╝╚═╝  ╩╝╚╝╚  ╚═╝╩╚═╝╚╝╚═╝


 
(•) Insira o ID do usuário para apagar: `), async id_user => {
        console.clear()

        per.question(chalk.hex('#ff0000').bold(
      `					   
╔═╗╔╗╔╔╦╗╦═╗╔═╗╔╗╔╔╦╗╔═╗  ╔╗╔╔═╗╔═╗  ╔═╗╔═╗╦═╗╔╦╗╔═╗╔═╗╔═╗  ╔╦╗╔═╗  ╦╔╗╔╔═╗╔═╗╦═╗╔╗╔╔═╗
║╣ ║║║ ║ ╠╦╝╠═╣║║║ ║║║ ║  ║║║║ ║╚═╗  ╠═╝║ ║╠╦╝ ║ ║ ║║╣ ╚═╗   ║║║ ║  ║║║║╠╣ ║╣ ╠╦╝║║║║ ║
╚═╝╝╚╝ ╩ ╩╚═╩ ╩╝╚╝═╩╝╚═╝  ╝╚╝╚═╝╚═╝  ╩  ╚═╝╩╚═ ╩ ╚═╝╚═╝╚═╝  ═╩╝╚═╝  ╩╝╚╝╚  ╚═╝╩╚═╝╚╝╚═╝


 
(•) Delay: `),
          async delay => {
            console.clear()


            var token = config.token

            let id = id_user
            if(!id) return console.clear(), spin(
              'Insira o ID do usuário', 'fail')

            try {
              await client.login(token.trim().replaceAll(
                '"', ''))
            }
            catch (e) {
              return console.clear(), spin(
                'A token fornecida é inválida', 'fail')
            }

            let contador = 0;
            let nome;
            let canal = client.channels.cache.get(id)
            if(!canal) {
              var usr = await client.users.fetch(id)
                .catch(e => {
                  return console.clear(), spin(
                    'O ID fornecido é inválido',
                    'fail')
                })
              await usr.createDM().then(dmchannel => {
                id = dmchannel.id
                nome = usr.username
              }).catch(e => {
                return console.clear(), spin(
                  'Não consegui abrir a DM com esse usuário',
                  'fail')
              })
            }
            else {
              nome = (canal.type == "GROUP_DM") ? "DM" :
                canal.name
            }

            var todas_msg = await fetch_msgs(id)
            if(!todas_msg.length) return console.clear(),
              spin(
                'Não tem nenhuma mensagem sua no chat para apagar...',
                'fail')


            for(var nuts of todas_msg) {
              await new Promise(resolve => setTimeout(
                resolve, delay * 1000))

              await nuts.delete().then(kk => {
                contador++
                console.clear(), spin(
                  `${contador} apagadas de ${todas_msg.length}`,
                  'info')
              }).catch(() => {})
            }

            console.clear(), spin(
              `Todas as mensagens foram apagadas com sucesso`,
              'success')
          })


      });

async function fetch_msgs(canal) {
  spin(`(•) Iniciando...`, 'info')
  const canall = client.channels.cache.get(canal);
  let ultimoid;
  let messages = [];

  while(true) {
    const fetched = await canall.messages.fetch({
      limit: 100,
      ...(ultimoid && {
        before: ultimoid
      }),
    });

    if(fetched.size === 0) {
      return messages.filter(msg => msg.author.id == client.user
      .id);
    }

    messages = messages.concat(Array.from(fetched.values()));
    ultimoid = fetched.lastKey();
  }
}
async function spin(text, type) {
  const spinner = ora({
    discardStdin: false,
    text: text,
    spinner: process.argv[2],
  });
  var sp = spinner
  if(type == 'start') sp = spinner.start()
  if(type == 'fail') sp = spinner.fail()
  if(type == 'info') sp = spinner.info()
  if(type == 'success') sp = spinner.succeed()
  return sp
}