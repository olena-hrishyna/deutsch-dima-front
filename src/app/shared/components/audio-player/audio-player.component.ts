import {
  Component,
  ElementRef,
  HostListener,
  Input,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss',
})
export class AudioPlayerComponent {
  _audio: any;

  @Input() isControls = false;
  @Input() isAutoPlay = true;
  @Input() set audio(a: any) {
    this._audio = a;
    if (this.isAutoPlay) {
      this.onPlay();
    }
  };

  @ViewChild('audioPlayer') audioPlayerRef?: ElementRef<HTMLAudioElement>;

  @HostListener('document:keydown', ['$event']) onKeydown(
    event: KeyboardEvent
  ): void {
    if (event.key === 'End') {
      this.onPlay();
    }
  }

  ngAfterViewInit(): void {
    if (this.isAutoPlay) {
      this.onPlay();
    }
  }

  onPlay(): void {
    if (this._audio && this.audioPlayerRef) {
      const blob = new Blob([new Uint8Array(this._audio)], {
        type: 'audio/mp3',
      });

      const audioUrl = URL.createObjectURL(blob);
      const audioPlayer = this.audioPlayerRef.nativeElement;
      if (audioPlayer) {
        audioPlayer.src = audioUrl;
        if (typeof audioPlayer.play === 'function') {
          audioPlayer.play();
        }
      }
    }
  }
}
