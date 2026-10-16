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


})