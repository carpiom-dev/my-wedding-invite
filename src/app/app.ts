import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ADD_PERSON, LIST_PERSONS } from '@infrastructure/di/injection-tokens';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
