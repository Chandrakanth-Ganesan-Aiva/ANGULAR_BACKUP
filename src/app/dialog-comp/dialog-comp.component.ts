import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-comp',
  templateUrl: './dialog-comp.component.html',
  styleUrls: ['./dialog-comp.component.scss'],
})
export class DialogCompComponent {
  // open(DialogCompComponent: typeof DialogCompComponent, arg1: {}) {
  //   throw new Error('Method not implemented.');
  // }
  ErrorMsg!: SafeHtml;
  constructor(
    public dialogRef: MatDialogRef<DialogCompComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private sanitizer: DomSanitizer) {
    this.ErrorMsg = this.sanitizer.bypassSecurityTrustHtml(data.Msg)
  }

  Status: boolean = this.data.Type == 'Information' ? true : false
  Yes() {
    this.Status = true
    this.dialogRef.close(this.Status);
  } No() {
    this.Status = false
    this.dialogRef.close(this.Status)
  }
  closeDialog(value: string): void {
    this.dialogRef.close(value);
  }
  isSelectingText: any
  checkTextSelectionStart(event: MouseEvent) {
    const selection = window.getSelection();
    if (selection && selection.toString().length === 0) {
      this.isSelectingText = true;
    }
  }
  checkTextSelectionEnd(event: MouseEvent) {
    setTimeout(() => {
      const selection = window.getSelection();
      this.isSelectingText = selection && selection.toString().length > 0;
      // Reset drag-disabled after short delay
      setTimeout(() => this.isSelectingText = false, 200);
    }, 0);
  }

  //
  reason: string = '';
  approve() {
    this.Status = true;
    this.dialogRef.close('Approved');
  }
   saveReason() {     
    if (this.reason.trim()) {
      this.dialogRef.close({ approved: true, reason: this.reason.trim() });
    }
  }

}
