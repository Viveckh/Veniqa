import throwIfMissing from './util/throwIfMissing';
import { addClasses, removeClasses } from './util/dom';

let __instance = (function () {
  let instance;
  return (newInstance) => {
    if (newInstance) {
      instance = newInstance;
    }
    return instance;
  }
}());


export default class BoundingBox {
  constructor(options) {
    if (__instance()) {
      return __instance()
    }

    this.isShowing = false;

    let {
      namespace = null,
      zoomFactor = throwIfMissing(),
      containerEl = throwIfMissing(),
    } = options;

    this.settings = { namespace, zoomFactor, containerEl };

    this.openClasses = this._buildClasses('open');

    this._buildElement();
    __instance(this);
  }

  _buildClasses(suffix) {
    let classes = [`drift-${suffix}`];

    let ns = this.settings.namespace;
    if (ns) {
      classes.push(`${ns}-${suffix}`);
    }

    return classes;
  }

  _buildElement() {
    this.el = this.el ? this.el : document.createElement('div');
    addClasses(this.el, this._buildClasses('bounding-box'));
  }

  show(zoomPaneWidth, zoomPaneHeight) {
    this.isShowing = true;
    document.querySelector('body').appendChild(this.el)

    let style = this.el.style;
    style.width = `${Math.round(zoomPaneWidth / this.settings.zoomFactor)}px`;
    style.height = `${Math.round(zoomPaneHeight / this.settings.zoomFactor)}px`;

    addClasses(this.el, this.openClasses);
  }

  hide() {
    if (this.isShowing) {
      document.querySelector('body').removeChild(this.el)
    }

    this.isShowing = false;

    removeClasses(this.el, this.openClasses);
  }

  setPosition(movementPercentageOffsetX, movementPercentageOffsetY, triggerRect) {

    let pageXOffset = window.pageXOffset;
    let pageYOffset = window.pageYOffset;
    
    let inlineLeft = triggerRect.left + (movementPercentageOffsetX * triggerRect.width)
      - (this.el.clientWidth / 2) + pageXOffset;
    let inlineTop = triggerRect.top + (movementPercentageOffsetY * triggerRect.height)
      - (this.el.clientHeight / 2) + pageYOffset;

    if (inlineLeft < triggerRect.left + pageXOffset) {
      inlineLeft = triggerRect.left + pageXOffset;
    } else if (inlineLeft + this.el.clientWidth > triggerRect.left + triggerRect.width + pageXOffset) {
      inlineLeft = triggerRect.left + triggerRect.width - this.el.clientWidth + pageXOffset;
    }

    if (inlineTop < triggerRect.top + pageYOffset) {
      inlineTop = triggerRect.top + pageYOffset;
    } else if (inlineTop + this.el.clientHeight > triggerRect.top + triggerRect.height + pageYOffset) {
      inlineTop = triggerRect.top + triggerRect.height - this.el.clientHeight + pageYOffset;
    }

    this.el.style.left = `${inlineLeft}px`;
    this.el.style.top = `${inlineTop}px`;
  }
}