import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[PFor]',
  standalone: true,
})
export class ProgressiveForDirective<T extends {id: number}> {
  @Input({required: true, alias: 'PForOf'}) public set data(value: T[]) {
    this.interval && clearInterval(this.interval);
    this.containerRef.clear();
    const chunks = slicer(value, this.chunkLength);
    this.interval = setInterval(() => {
       const chunk = chunks.next();
       if (chunk.done) {
         clearInterval(this.interval);
         return;
       }
       this.render(chunk.value);
    }, this.renderTimeout)
  }

  @Input('PForChunkLength') public chunkLength = 50;

  @Input('PForRenderTimeout') public renderTimeout = 100;

  private interval: ReturnType<typeof setTimeout> | undefined = undefined;

  constructor(
    private containerRef: ViewContainerRef,
    private template: TemplateRef<any>,
  ) {}

  private render(items: { id: number }[]): void {
    for (const item of items) {
      this.containerRef.createEmbeddedView(
        this.template,
        { $implicit: item },
        { index: item.id },
      )
    }
  }
}

function* slicer<T=unknown>(data: T[], chunkLength=50): Generator<T[]> {
  for (let startIndex=0; startIndex < data.length; startIndex += chunkLength) {
    yield data.slice(startIndex, startIndex + chunkLength)
  }
}
