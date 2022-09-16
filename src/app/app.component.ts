import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'giphy-namesake';

  constructor(private router: Router) { }

  ngOnInit(): void {
    // on reload get back to "home"
    this.router.navigate([""]);
  }
}
