import { VPApplication } from './vp-app.mjs';
import { util } from '../util.mjs';

export class VoteConfigApp extends VPApplication {
  constructor(options = {}) {
    super(options);
    this.data = this.data || this._init_data();
    // this.dragDrop = this._createDragDropHandlers();
    this.isEditable = game.user.isGM;
    
  }
  static DEFAULT_OPTIONS = {
    id: 'vote-config',
    classes: ['vp-app', 'vote-config'],
    position: {
      width: 500,
      height: 600
    },
    tag: 'vp-app',
    window: {
      title: 'Vote Config',
      icon: 'fas fa-book'
    },
    tabs: [],
    // tabs: [
    //   {
    //     navSelector: '.tabs',
    //     contentSelector: '.tab-content',
    //     initial: 'main'
    //   }
    // ],
    // dragDrop: [{ dragSelector: '[data-drag]', dropSelector: '.drop' }],
    // Enable automatic scroll position preservation
    preserveScrollPositions: true
  };
  static PARTS = {
    main: {
      template: 'modules/vote-party/templates/config/main.hbs'
    }
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {});
    context.title = this.data.title;
    context.description = this.data.description;
    context.voteOptions = this.data.options;
    context.enrichedDescription = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.description, { secrets: game.user.isGM });
    return context;
  }
  _onRender(context, options) {
    const pm = this.element.querySelector('prose-mirror');
    const title = this.element.querySelector("[name='title']");
    const addOption = this.element.querySelector('.add-option');
    const deleteBtns = [...this.element.querySelectorAll('.option .delete')];
    const optionNames = [...this.element.querySelectorAll('.option .option-text')];
    const optionDescriptions = [...this.element.querySelectorAll('.option .option-description')];
    const detailConts = [...this.element.querySelectorAll('.option details')];
    const callVote = this.element.querySelector('.vote');
    const selfVoteToggle = this.element.querySelector('#selfvote');

    selfVoteToggle.addEventListener('click', ()=>this.data.callerVote = !this.data.callerVote);

    callVote.addEventListener('click', (e) => {
      this._callVote();
    });

    // detailConts.forEach(c=>{
    //   c.addEventListener('click', e=>{
    //     if (e.target.tagName != "SUMMARY"){
    //       e.preventDefault;
    //       return
    //     }

    //   })
    // })

    optionNames.forEach((nameInp) => {
      nameInp.addEventListener('change', (e) => {
        const containerState = e.target.closest('details').open;
        const uuid = e.target.closest('.option').dataset.uuid;
        const option = this.data.options.find((i) => i.uuid == uuid);
        option.text = e.target.value.trim();
        // option.expanded = containerState
        this.render();
      });
    });
    optionDescriptions.forEach((nameInp) => {
      nameInp.addEventListener('change', (e) => {
        const containerState = e.target.closest('details').open;
        const uuid = e.target.closest('.option').dataset.uuid;
        const option = this.data.options.find((i) => i.uuid == uuid);
        option.description = e.target.value.trim();
        // option.expanded = containerState
        this.render();
      });
    });

    deleteBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const uuid = btn.closest('.option')?.dataset?.uuid;
        this._delete_option(uuid);
        this.render();
      });
    });

    if (title) {
      title.addEventListener('change', () => {
        this.data.title = title.value;
      });
    }
    if (pm) {
      pm.addEventListener('save', () => {
        this.data.description = pm.value;
        this.render();
      });
    }

    addOption.addEventListener('click', (e) => {
      e.preventDefault();
      this._add_option();
      this.render();
    });
  }

  _init_data() {
    return {
      uuid: foundry.utils.randomID(16),
      title: '',
      description: '',
      options: [],
      users: [], 
      complete: false,
      callerVote: false,
      type: 'single',
      caller: game.user.uuid
    };
  }
  _add_option() {
    this.data.options.push({
      uuid: foundry.utils.randomID(16),
      text: `Option ${this.data.options.length + 1}`,
      description: '',
      selected: false
    });
  }
  _edit_option(data) {
    const entry = this.data.options.find((i) => i.uuid === data.uuid);
    entry.name = data.name;
    entry.description = data.description;
    if (data?.selected) entry.selected = data.selected;
  }
  _delete_option(uuid) {
    this.data.options = this.data.options.filter((i) => i.uuid != uuid);
  }

  _callVote() {
    console.log(this.data);
    this.data.users = util.addUsers(this.data.caller, this.data.callerVote)
    const voteData = {
      uuid: this.data.uuid,
      object: this.data,
      votes: []
    };

    if(this.data.options.length < 2){
      ui.notifications.warn("Vote must have at least 2 options.")
      return
    }
    VP.votes.push(voteData);
    VP.socket.emit({
      type: 'call-vote',
      data: voteData
    });
    if(this.data.callerVote){
      new VP.app.VoteBooth({ data: voteData }).render(true);
    }else{
       new VP.app.VoteResults({ data: voteData }).render(true);
    }
    console.log("data",voteData)
    this.close();
  }
}

// vote item template
/*
{

}
*/
