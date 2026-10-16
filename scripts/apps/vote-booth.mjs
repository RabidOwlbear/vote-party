import { VPApplication } from './vp-app.mjs';
import { util } from '../util.mjs';
export class VoteBooth extends VPApplication {
  constructor(options = {}) {
    super(options);
    this.vote = options.data;
    this.data = this.vote.object
    

  }
  static DEFAULT_OPTIONS = {
    id: 'vp-booth',
    classes: ['vp-app', 'vp-booth'],
    position: {
      width: 300,
      height: 450
    },
    tag: 'vp-app',
    window: { 
      title: 'Vote Booth',
      icon: 'fas fa-book'
    },
    tabs: [],
    preserveScrollPositions: true
  };
  static PARTS = {
    main: {
      template: 'modules/vote-party/templates/booth/main.hbs'
    }
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {});
    context.data = this.data;
    return context;
  }
  _onRender(context, options) {

    const submitBtn = this.element.querySelector('.submit')?.addEventListener('click', e=>{
      e.preventDefault();
      this._submitVote()
      
      
    })  



  }

  async _submitVote(){
    const inputs = [...this.element.querySelectorAll('input.select')];
    console.log('submit vote',this.data.type, this.data);
    switch(this.data.type){
      case 'single':
        const pick = inputs.find(i=>i.checked);
        const subData = {
          type: 'submit-vote',
          data: {
            caller: this.data.caller,
            uuid: this.data.uuid,
            user: game.user.uuid,
            vote: [pick.dataset.uuid],
          }
        }
        if(this.data.caller == game.user.uuid){
          VP.socket.submitVote(subData.data.uuid, game.user.uuid, subData.data.vote)
        }else{
           await VP.socket.emit(subData)
        }
       
        new VP.app.VoteResults({data: this.vote}).render(true);
        await util.sleep(500);
        console.log('fuck off', this.vote)
        VP.socket.emit({type: 'refresh-request', data: this.vote})
        this.close()
    }
  }
}
