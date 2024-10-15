import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ApiService } from './services/api/api.service';
import { FormsModule } from '@angular/forms';
import { FileInterface } from './interfaces/file';
import { VoiceInputComponent } from './components/voice-input-component/voice-input/voice-input.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    VoiceInputComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = '1lab-front';
  
  public files: FileInterface[] = [] 
  public inputString: string = ''
  public fileInfo: string = ''

  constructor(
    private apiService: ApiService
  ) { }
  
  public getFiles(): void {
    this.files = []
    this.apiService.getFiles(this.inputString).subscribe(response => {
      for (let key in response) {
        this.files.push({
          name: key,
          value: (response[key]) ? response[key].toFixed(2) : 0
        })
      }
      this.files = this.files
      .filter((file) => file.value > 0)
      .sort((a, b) => b.value - a.value)
    })
  }

  public getFileInfo(fileName: string): void {
    this.apiService.getFileInfo(fileName).subscribe(response => {
      console.log(response, typeof response)
      this.fileInfo = response.join(' ')
    })
  }

  public getRecognizedText(event: string) {
    this.inputString = event
    console.log(this.inputString)
  }

  public closeFileInfo(): void {
    this.fileInfo = ''
  }
}
