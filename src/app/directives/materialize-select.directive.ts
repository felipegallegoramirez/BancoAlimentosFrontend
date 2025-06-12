import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

declare const M: any;

@Directive({
  selector: '[materializeSelect]'
})
export class MaterializeSelectDirective implements AfterViewInit {
  @Input() materializeSelectOptions: any[];

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    M.FormSelect.init(this.elementRef.nativeElement);
  }
} 