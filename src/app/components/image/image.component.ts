import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {

  @Input() src:any;
  @Input() alt:any = "";

  constructor(
    public theme: ThemeService
  ) { }

  ngOnInit(): void {
  }

}
