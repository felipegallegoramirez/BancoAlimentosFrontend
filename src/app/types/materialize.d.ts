declare namespace M {
  interface Modal {
    open(): void;
    close(): void;
    destroy(): void;
  }

  interface Toast {
    html: string;
    classes?: string;
  }

  interface FormSelect {
    init(elem: HTMLElement, options?: any): FormSelect;
  }

  function Modal(elem: HTMLElement, options?: any): Modal;
  function FormSelect(elem: HTMLElement, options?: any): FormSelect;
  function toast(options: Toast): void;
  function updateTextFields(): void;
} 