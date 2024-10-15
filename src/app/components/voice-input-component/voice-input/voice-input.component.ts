import { Component, EventEmitter, Output } from '@angular/core';
import { ApiService } from '../../../services/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-voice-input',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voice-input.component.html',
  styleUrl: './voice-input.component.scss'
})
export class VoiceInputComponent {

  @Output() recognizedTextEvent = new EventEmitter<string>() 

  recognizedText: string = '';
  isListening: boolean = false

  startListening() {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.lang = 'en'; // Установите язык на русский
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      this.recognizedText = event.results[0][0].transcript.toLowerCase();
      this.isListening = false;
      this.recognizedTextEvent.emit(this.recognizedText)
    };

    recognition.onerror = (event: any) => {
      console.error('Ошибка распознавания:', event.error);
    };

    this.isListening = true;

    recognition.start();
  }

}
