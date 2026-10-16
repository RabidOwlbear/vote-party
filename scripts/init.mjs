import { socket } from "./socket.mjs";
import { VoteConfigApp } from "./apps/vote-config.mjs";
import { VoteBooth } from "./apps/vote-booth.mjs";
import { VoteResults } from "./apps/vote-results.mjs";
import { util } from "./util.mjs";

Hooks.on('init', ()=>{
  console.log(`
░██    ░██               ░██                         
░██    ░██               ░██                         
░██    ░██  ░███████  ░████████  ░███████            
░██    ░██ ░██    ░██    ░██    ░██    ░██           
 ░██  ░██  ░██    ░██    ░██    ░█████████           
  ░██░██   ░██    ░██    ░██    ░██                  
   ░███     ░███████      ░████  ░███████            
                                                     
                                                     
                                                     
░█████████                         ░██               
░██     ░██                        ░██               
░██     ░██  ░██████   ░██░████ ░████████ ░██    ░██ 
░█████████        ░██  ░███        ░██    ░██    ░██ 
░██          ░███████  ░██         ░██    ░██    ░██ 
░██         ░██   ░██  ░██         ░██    ░██   ░███ 
░██          ░█████░██ ░██          ░████  ░█████░██ 
                                                 ░██ 
                                           ░███████  `
  );

  window.VP = {};
  VP.socket = socket;
  VP.app = {
    VoteConfigApp,
    VoteBooth,
    VoteResults
  };
  VP.votes = []
  VP.util = util

  socket.registerSocket()



  Hooks.on('renderPlayers', e=>{
    console.log('ready')
    if(game.user.isGM){
    const users = document.getElementById('players-active');
    const btn = document.createElement('button');
    const icon = document.createElement('i');
    icon.classList.add('fa-solid','fa-ballot')
    btn.classList.add('vote-config-btn');
    btn.title= "New Vote"
    users.classList.add("relative");
    btn.addEventListener('click', e=>{
      new VP.app.VoteConfigApp().render(true)
    })
    btn.appendChild(icon);
    users.appendChild(btn);
  }
  })

})