import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[PFor]',
  standalone: true,
})
export class ProgressiveForDirective<T extends {id: number}> {
  @Input({ required: true, alias: 'PForOf' })
  public set data(value: T[]) {
    this.containerRef.clear();
    this._data = value;
    void this.generateSequence();
  }

  @Input('PForChunkLength') public chunkLength = 50;

  @Input('PForRenderTimeout') public renderDelay = 100;

  private _data: T[] = [];

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

  private async generateSequence(): Promise<void> {
    const sequence = generateSequence<T>(this._data, this.chunkLength, this.renderDelay);
    for await (const chunk of sequence) {
      this.render(chunk);
    }
  }
}

function* slicer<T=unknown>(data: T[], chunkLength=50): Generator<T[]> {
  for (let startIndex=0; startIndex < data.length; startIndex += chunkLength) {
    yield data.slice(startIndex, startIndex + chunkLength)
  }
}

async function* generateSequence<T=unknown>(data: T[], chunkLength=50, delay=100): AsyncGenerator<T[]> {
  const chunks = slicer<T>(data, chunkLength);
  for (const chunk of chunks) {
    await new Promise(resolve => setTimeout(resolve, delay));
    yield chunk;
  }
}
