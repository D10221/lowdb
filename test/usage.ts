/*
* Testing usage from Ts 
 */

import  *as test from 'tape' ;

import {LowChain} from "../built/interfaces";

import {low} from '../built/index';

const storage = require('../built/file-sync');

interface iPost {
    id: string;
    title : string;
}

// https://github.com/typicode/underscore-db/blob/master/src/index.js
function uuid(a?,b?){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}

class Post implements iPost{
    
    id = uuid();
    
    constructor(public title:string){
        
    }
}

function exists<T>(db: LowChain<T>, find: (t:T)=> boolean){
    
    var found = db.find(find) ;
    
    return found!= null;
}

var matchTitle = title=> p => p && p.title.match(title).length>0;

var titleEquals = title=> 
    x => 
    x.title == title;

test('itWorks',(t)=>{

    const db = low('test/db.json', { storage }) as LowChain<iPost>;

    var posts :  LowChain<iPost> = db('posts');

    var title = 'lowdb is awesome';

    if(!exists(posts, matchTitle(title))){
        posts.push(new Post(title));
    }

    var post = posts.find(titleEquals(title));

    posts.commit();
    
    t.equal(post.title, title);

    t.end();
});