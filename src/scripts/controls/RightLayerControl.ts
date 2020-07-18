import { Control } from 'leaflet'

export class RightLayerControl extends Control.Layers {
  protected _addItem(...args) {
    const label: HTMLLabelElement = (Control.Layers
      .prototype as any)._addItem.apply(this, args)

    label.children[0].appendChild(label.children[0].children[0])

    return label
  }
}
