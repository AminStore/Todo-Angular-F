import { AfterContentInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[appAutofocus]'
})
export class AutofocusDirective implements AfterContentInit {
    @Input() appAutofocus: boolean = true;
    @Input() focusDelay: number = 0;

    constructor(private elementRef: ElementRef) {}

    ngAfterContentInit(): void {
        this.triggerFocus();
    }

    ngOnChanges(): void {
        this.triggerFocus();
    }

    private triggerFocus(): void {
        if (this.appAutofocus) {
            setTimeout(() => {
                try {
                    this.elementRef.nativeElement.focus();
                } catch (err) {
                    console.error('Error while setting focus:', err);
                }
            }, this.focusDelay);
        }
    }
}