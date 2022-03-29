import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Route } from '@angular/router';

@Component({
  selector: 'app-finale',
  templateUrl: './finale.page.html',
  styleUrls: ['./finale.page.scss'],
})
export class FinalePage implements OnInit {

  CORRECT = "assets/finalecorrect.png";
  INCORRECT = "assets/finaleincorrect.png";
  RESET = "assets/maillon-bleu.png";

  megaTotal;
  iterationQuestion: number;

  constructor(private activatedRoute: ActivatedRoute) { 
    this.megaTotal = this.activatedRoute.snapshot.paramMap.get('megaTotal')+" €";
    this.iterationQuestion = 1;

    document.addEventListener("keydown",(e:KeyboardEvent) => {this.onKeyboardPressEvent(e)});
  }

  onKeyboardPressEvent(event: KeyboardEvent){
    switch(event.key){
      case "ArrowDown":
      case "ArrowLeft":
        this.reponseIncorrect();
        break;
      case "ArrowUp":
      case "ArrowRight":
        this.reponseCorrect()
        break;
      case "'":
        let audio = new Audio();
        audio.src = "assets/son/suddendeath.wav";
        audio.load();
        audio.play();
        break;
      case "Backspace":
        this.annuler();
    }

    console.log(`Key pressed: ${event.key}`);
  }

  reponseCorrect() {
    var x = document.getElementById("maillon"+this.iterationQuestion);
    x.setAttribute("src", this.CORRECT);
    this.iterationQuestion++
  }

  reponseIncorrect() {
    var x = document.getElementById("maillon"+this.iterationQuestion);
    x.setAttribute("src", this.INCORRECT);
    this.iterationQuestion++
  }

  annuler() {
    this.iterationQuestion--
    var x = document.getElementById("maillon"+this.iterationQuestion);
    x.setAttribute("src", this.RESET);
  }

  ngOnInit() {
   
  }


}
