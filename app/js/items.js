
'use strict';

export class Items{
    
    constructor(){
       
        this.notesContainer = document.getElementById('notes-container');
        this.noteMessageInput = document.getElementById('message');
        this.addNoteButton = document.getElementById('save');
        this.notesSectionTitle = document.getElementById('notes-section-title');
    
        this.recordedMessage = '';
    }
    
    record(message){
        this.recordedMessage = message;
    }
    
    play(){
        console.log(this.recordedMessage);
    }
    
}