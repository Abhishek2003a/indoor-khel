let abuse_String_Array=[
        "abuse",
        "abusive",
        "asshole",
        "bitch",
        "bastard",
        "damn",
        "hell",
        "shit",
        "whore",
        "dick",
        "pussy",
        "fucker",
        "motherfucker",
        "cunt",
        "slut",
        "twat",
        "bloody",
        "fuck",
        "fucking",
        "fuck!",
        "fucker",
        "fuckin",
        "motherfucker",
        "bullshit",
        "douche",
        "prick",
        "bsdk",
        "madarchod",
        "randi",
        "chutiya",
        "gandu",
        "loda",
        "lund",
        "maderchod",
        "behenchod",
        "bhosdi",
        "bhonsdi",
        "bhenchod",
        "bhosdiwala",
        "bhosdiwalle",
        "bhosdiwalon",
        "bhosdiwalo",
        "bhosdiwalu",
        "bhosdiwal"
    ];


class Node{
    constructor(){
        this.children={};
        this.isEndOfWord=false;
    }
    containsKey(ch){
        return this.children[ch] !== undefined;
    }
    getChild(ch){
        return this.children[ch];
    }
    putChild(ch,node){
        this.children[ch]=node;
    }
    markEnd(){
        this.isEndOfWord=true;
    }
    isEnd(){
        return this.isEndOfWord;
    }
}
class Trie{
    constructor(){
        this.root=new Node();
    }
    insert(word){
        let current=this.root;
        for(let ch of word){
            if(!current.containsKey(ch)){
                current.putChild(ch,new Node());
            }
            current=current.getChild(ch);
        }
        current.markEnd();
    }
    search(word){
        let current=this.root;
        for(let ch of word){
            if(!current.containsKey(ch)){
                return false;
            }
            current=current.getChild(ch);
        }
        return current.isEnd();
    }
}

const trieBuild=new Trie();
const buildTrie=()=>{
    for(let abuse of abuse_String_Array){
        trieBuild.insert(abuse.toLowerCase());
    }
}

module.exports={trieBuild,buildTrie};