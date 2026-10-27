import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Komponenti rrënjë. Ai vetëm shfaq faqen aktuale sipas URL-së (<router-outlet>).
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent {}
