import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'tips-bar',
  templateUrl: './tips-bar.component.html',
  styleUrls: ['./tips-bar.component.scss']
})
export class TipsBarComponent implements OnInit {

  @Output() a: EventEmitter<any> = new EventEmitter<any>();
  @Output() b: EventEmitter<any> = new EventEmitter<any>();

  @Input() showB:any = true;
  @Input() showA:any = true;

  constructor(
    public theme: ThemeService
  ) { }

  onA(evt?){
    this.a.emit(evt);
  }
  onB(evt?){
    this.b.emit(evt);
  }

  ngOnInit(): void {
  }

}
