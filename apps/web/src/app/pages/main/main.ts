import { Component } from '@angular/core';
import { Posts } from '../../features/posts/posts';

@Component({
  selector: 'app-main',
  imports: [Posts],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
