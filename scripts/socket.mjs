import { VoteResults } from './apps/vote-results.mjs';
import { util } from './util.mjs';
export const socket = {
  emit: function (data) {
    game.socket.emit('module.vote-party', data);
  },
  registerSocket: function () {
    game.socket.on('module.vote-party', VP.socket.HandleSocket);
  },
  HandleSocket: async function (socketData, id) {
    const data = socketData.data;
    const type = socketData.type;
    let singleGM = game.users.filter((u) => u.isGM && u.active)[0];
    switch (type) {
      case 'open-all':
        console.log('<------ open vote panel ------>', data);
        new VP.app.VoteBooth({ data: data }).render(true);
        break;
      case 'call-vote':
        console.log('call vote', data);
        if(data.object.users.includes(game.user.uuid)){
        new VP.app.VoteBooth({ data: data }).render(true);
      }
        break;
      case 'submit-vote':
        if (game.user.uuid !== data.caller) return;
        VP.socket.submitVote(data.uuid, data.user, data.vote);
        break;
      case 'render-results':
        if (game.user.uuid === data.user) {
          VP.app.VoteResults({ uuid: data.uuid }).render(true);
        }
        break;
      case 'refresh-request':
        console.log('refresh request', data);
        if (game.user.uuid !== data.object.caller) return;
        VP.socket.handleResultsRefresh(data);
        break;
      case 'refresh-results':
        console.log(`---- refresh results ----`, data);
        // if(game.user.uuid !== data.object.caller) return

        VP.socket.refreshResults(data);
        break;
      case 're-render-booth':
        break;
      case 'default':
        console.log('---------------socket emitted----------------', data, type);
    }
  },
  submitVote: async function (uuid, user, vote) {
    const bucket = VP.votes.find((i) => i.uuid == uuid);
    if (!bucket) {
      ui.notifications.warn(`Vote uuid: ${uuid} not found.`);
      return;
    }
    const existing = bucket.votes.find((i) => i.user == user);
    if (existing) {
      ui.notifications.warn('User has already voted in this voting round.');
      return;
    }
    bucket.votes.push({ user, vote: vote });
     //tally results here
     
    VP.socket.emit({ type: 'refresh-results', data: bucket });
  },
  refreshResults: function (data) {
    const app = foundry.applications.instances.get('vp-results');
    // console.log("FUCK YOU", data,  app.data.uuid == data.uuid)
    if (app && app.data.uuid == data.uuid) {
     
      app.data = data;
      app.render();
    }
  },
  handleResultsRefresh: function (data) {
    console.log('----------------------------------------------------------------------', data);
    const vote = VP.votes.find((i) => i.uuid == data.uuid);
    // if (vote.object.caller == game.user.uuid) {
    VP.socket.emit({
      type: 'refresh-results',
      data: vote
    });
    VP.socket.refreshResults(vote);
  }

  // }
};

// function handleResultsRefresh(data) {
//   console.log('----------------------------------------------------------------------', data);
//   const vote = VP.votes.find((i) => i.uuid == data.uuid);
//   // if (vote.object.caller == game.user.uuid) {
//   console.log('vote', vote);
//   VP.socket.emit({
//     type: 'refresh-results',
//     data: vote
//   });
//   refreshResults(vote);

//   // }
// }

// function refreshResults(data) {
//   const app = foundry.applications.instances.get('vp-results');
//   // console.log("FUCK YOU", data,  app.data.uuid == data.uuid)
//   if (app && app.data.uuid == data.uuid) {
//     app.data = data;
//     app.render();
//   }
// }

// async function submitVote(uuid, user, vote) {
//   const bucket = VP.votes.find((i) => i.uuid == uuid);
//   if (!bucket) {
//     ui.notifications.warn(`Vote uuid: ${uuid} not found.`);
//     return;
//   }
//   const existing = bucket.votes.find((i) => i.user == user);
//   if (existing) {
//     ui.notifications.warn('User has already voted in this voting round.');
//     return;
//   }
//   bucket.votes.push({ user, vote: vote });
//   VP.socket.emit({ type: 'refresh-results', data: bucket });
// }
