import { Component } from '@angular/core';
import { addEventListener } from '@ionic/core/dist/types/utils/helpers';
import {FormControl} from "@angular/forms";
import {interval, Subject} from "rxjs";
import {map, takeUntil, takeWhile} from "rxjs/operators";
import {addSeconds, format} from "date-fns";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  MAILLON_BLEU = "assets/maillon-bleu.png";
  MAILLON_ROUGE = "assets/maillon-rouge.png";

  secs: number;
  countdownDisplay?: string;
  starter$ = new Subject<void>();

  iterationMaillon = 0;
  totalBanque = 0;
  megaTotal = 0;
  valeurMaillon: number[];

  partieEstEnCours: boolean;
  audioGeneral: HTMLAudioElement;
  audioVote: HTMLAudioElement;

  constructor() {
    this.audioGeneral = new Audio();
    this.audioVote = new Audio();
    this.audioGeneral.src = "assets/son/general.wav";
    this.audioVote.src = "assets/son/vote.wav";
    this.audioGeneral.load();
    this.audioVote.load();
    

    this.partieEstEnCours = false;
    this.secs = 155;
    this.countdownDisplay = "2:30";
    this.valeurMaillon = [50, 100, 200, 300, 600, 900, 1200, 1600, 2000];
    this.megaTotal = 0;

    document.addEventListener("keydown",(e:KeyboardEvent) => {this.onKeyboardPressEvent(e)});
  }

  onKeyboardPressEvent(event: KeyboardEvent){
    switch(event.key){
      case "ArrowDown":
      case "ArrowLeft":
         console.log("Réponse FAUSSE");
         this.reponseFausse();
        break;
      case "ArrowUp":
      case "ArrowRight":
        console.log("Réponse VRAIE");
        this.reponseVraie();
        break;
      case "Enter":
        console.log("BANQUE");
        this.banque();
        break;
      case "g":
        this.audioVote.pause();
        this.audioVote.currentTime = 0;
        this.audioGeneral.play();
        break;
      case "v":
        this.audioGeneral.pause();
        this.audioGeneral.currentTime = 0;
        this.audioVote.play();
    }

    console.log(`Key pressed: ${event.key}`);
  }


  lancerMusique() {
    this.audioGeneral.pause();
    this.audioGeneral.currentTime = 0;
    this.audioVote.pause();
    this.audioVote.currentTime = 0;

    if(!this.partieEstEnCours){
      this.partieEstEnCours = true;
      this.playMusic();
      this.lancerPartie();
    }
  }

  async lancerPartie() {
     this.startCountdown()
     this.iterationMaillon = 0;
     var x = document.getElementById(this.retrieveIdByValeurMaillon());
     x.setAttribute("src", this.MAILLON_ROUGE);
  }

  resetMaillons() {
    while(this.iterationMaillon>=0){
      var x = document.getElementById(this.retrieveIdByValeurMaillon());
      x.setAttribute("src", this.MAILLON_BLEU);
      this.iterationMaillon--;

    }
    this.iterationMaillon = 0;
    x = document.getElementById(this.retrieveIdByValeurMaillon());
    x.setAttribute("src", this.MAILLON_ROUGE);
  }

  reponseFausse() {
    let audio = new Audio();
    audio.src = "assets/son/wrong.wav";
    audio.load();
    audio.play();
    this.resetMaillons();
  }

  reponseVraie() {
    let audio = new Audio();
    audio.src = "assets/son/correct.wav";
    audio.load();
    audio.play();

    this.iterationMaillon++;
    var x = document.getElementById(this.retrieveIdByValeurMaillon());
    x.setAttribute("src", this.MAILLON_ROUGE);
  }

  banque() {
    if(this.iterationMaillon>0){
      this.totalBanque += this.valeurMaillon[this.iterationMaillon-1];
      var x = document.getElementById("banque");
      x.textContent= this.totalBanque+" €";
      this.resetMaillons();
    }
  }

  finDePartie() {
    this.resetMaillons();

    this.megaTotal += this.totalBanque;
    var x = document.getElementById("total");
    x.textContent= this.megaTotal+" €";

    this.totalBanque = 0;
    x = document.getElementById("banque");
    x.textContent= this.totalBanque+" €";
    
    this.partieEstEnCours = false

    this.audioGeneral.play();
  }

  async playMusic(){
    let audio = new Audio();
    audio.src = "assets/son/roundMusic.wav";
    audio.load();
    audio.play();
  }

  retrieveIdByValeurMaillon(): string {
    return "image"+this.valeurMaillon[this.iterationMaillon];
  }

  startCountdown(): void {
    this.starter$.next();  // clear pending timers
    let nsecs = this.secs;
    interval(1000)
      .pipe(
        takeUntil(this.starter$),
        takeWhile(countup => countup <= nsecs),
        map(countup => {
          let countdown = nsecs - countup;
          if(countdown == 0){
            this.finDePartie();
            return "0:00"
          }
          else if(countdown<=150) {
            let d = new Date();
            d.setHours(0,0,0,0);
            d = addSeconds(d, countdown);
            let fmt = format(d, "m:ss");
            return fmt;
         } else {
           return "2:30"
        }
        }))
      .subscribe(cd => 
        this.countdownDisplay = cd,
        (err) => console.log(err));
  }

  wait(ms){
    var start = new Date().getTime();
    var end = start;
    while(end < start + ms) {
      end = new Date().getTime();
   }
 }

}
