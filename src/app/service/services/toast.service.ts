// toast.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts: {message: string, type: 'success' | 'error', duration: number}[] = [];
  private toastElement: HTMLElement | null = null;

  constructor() {
    this.initializeToastElement();
  }

  private initializeToastElement() {
    this.toastElement = document.createElement('div');
    this.toastElement.className = 'toast-container';
    document.body.appendChild(this.toastElement);
  }

  show(message: string, type: 'success' | 'error' = 'success', duration: number = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    this.toastElement?.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => {
        this.toastElement?.removeChild(toast);
      }, 300);
    }, duration);
  }
}