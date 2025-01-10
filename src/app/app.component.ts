import { Component } from '@angular/core';
import { ProgressiveForDirective } from './progressive-for.directive';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.less',
  imports: [
    ProgressiveForDirective,
  ],
})
export class AppComponent {
  public data: {id: number}[] = [];

  generateData(): void {
    this.data = Array.from({ length: 50000 }, (_, idx) => ({
      id: idx,
      content: Math.random() + idx
    }))
  }
}
