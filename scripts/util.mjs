export const util = {
  addUsers: function(uuid){
    let users = []
      game.users.filter(i=>i.active ).map(u=> {if(u.uuid != uuid){ users.push(u.uuid)}})
  
    return users
  },
  submitVote: function (uuid, user, vote) {
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
  },
  tallyVote: function(data){
    // const data = data//VP.votes.find(i=>i.uuid == uuid);
    if(!data || !data.object)return
    const result = {
      title: data.object.title,
      description: data.object.description,
      options: []
    }
    
    
    for(let opt of data.object.options){
      result.options.push({
        text: opt.text,
        count: data.votes.filter(v=>v.vote[0] == opt.uuid)?.length || 0,
        users: data.votes.map(i=>{
          if(i.uuid == opt.uuid)return i.uuid 
        })
      })
    }
    result.options = result.options.sort((a,b)=> {
    if(a.count > b.count){
      return -1
    }else if(a.count < b.count){
      return 1
    } else{
      return 0
    }
    })
    return result
  },
  sleep: (ms) => new Promise((res) => setTimeout(res, ms))

};
