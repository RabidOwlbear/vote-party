import { util } from "../util.mjs";
import { VPApplication } from "./vp-app.mjs";

export class VoteResults extends VPApplication{

  constructor(options ) {
    super(options);
    this.uuid = options.uuid;
    this.data = options.data;
    this.userCount = this.data.object.callerVote ? this.data.object.users.length + 1 : this.data.object.users.length
  }
  static DEFAULT_OPTIONS = {
    id: 'vp-results',
    classes: ['vp-app', 'vp-results'],
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
      template: 'modules/vote-party/templates/results/main.hbs'
    }
  };
  async _prepareContext(options) {
    let context = await super._prepareContext(options);
    context = foundry.utils.mergeObject(context, {});
    context.data = this.data;
    console.log('data',this.data)
    return context;
  }
  _onRender(context, options) {
    const results = this._displayResults()
    const resCount = this.data.votes.length;
    const closeBtn = this.element.querySelector('.close')
    console.log(results)
    // if(resCount == this.userCount){

      
    //   const el = this.element.querySelector('.result-row');
    //   console.log('row',el)
    //   el.classList.add('blink')

    // }
    closeBtn.addEventListener('click', ()=> this.close())
 }

 _displayResults(){
  const resultCont = this.element.querySelector('.results-cont')
  const results = util.tallyVote(this.data).options.sort((a,b)=> {
    if(a.count > b.count){
      return -1
    }else if(a.count < b.count){
      return 1
    } else{
      return 0
    }
  })
  const winVal = results[0].count
  console.log(results.length, winVal, this.userCount);
  
  results.forEach(r=>{
    const el = document.createElement('div')
    el.classList.add('result-row')
    el.dataset.count = r.count
    console.log(results.length, this.userCount, results.length == this.userCount, r.count == winVal)
    if(this.data.votes.length == this.userCount && r.count == winVal){
      el.classList.add('blink')
    }

    const text = document.createElement('div');
    text.classList.add('text');
    text.innerText = r.text;
    el.appendChild(text);

    const voteCont = document.createElement('div');
    voteCont.classList.add('vote-cont');
    el.appendChild(voteCont);

    for(let i = 0; i < r.count; i++){
      const voteIcon = document.createElement('i');
      voteIcon.classList.add('fa-solid', 'fa-circle');
      voteCont.appendChild(voteIcon)
    }
    resultCont.appendChild(el)
  })
  return results
 }
 _resultDisplay(results){
  const winCount = ''

 }
}