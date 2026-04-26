import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink, ButtonModule, CardModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss',
})
export class NotFoundPage {}
