import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
import { MatTableDataSource } from '@angular/material/table';
import { GrnSubmitToAccountsService } from '../service/grn-submit-to-accounts.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrl: './print-page.component.scss'
})
export class PrintPageComponent implements OnInit {
  Empid: number = 0
  footerColumns: string[] = ['footer'];
  constructor(public PrintPagedialog: MatDialogRef<PrintPageComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private date: DatePipe,
    private dialog: MatDialog, public PrintPage: MatDialogRef<PrintPageComponent>, private grnSubmittoAccService: GrnSubmitToAccountsService,
    private router: Router) {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    this.Empid = user.empid
  }
  Status: boolean = false;
  CurrDate: any
  grnSubmitToAccDataSource = new MatTableDataSource()
  ngOnInit() {
    if (this.data.Comp_Name === 'grnSubmitToAcc') {
      this.grnSubmitToAccDataSource = this.data.dataSource
      console.log(this.data.dataSource);

    }
    this.CurrDate = this.date.transform(new Date(), 'dd-MM-yyyy')
    console.log(this.data.dataSource.reduce((acc: number, t: any) => acc + Number(t.value), 0), this.getTotal());

  }
  getTotal(): any {
    return this.data.dataSource
      .reduce((acc: number, t: any) => acc + Number(t.value), 0);
  }


  // printSection() {
  //   const printContents = document.getElementById('print-section')?.innerHTML;
  //   const originalContents = document.body.innerHTML;

  //   if (printContents) {
  //     document.body.innerHTML = printContents;
  //     window.print();
  //     document.body.innerHTML = originalContents;
  //     location.reload(); // Reload page to restore bindings
  //   }
  // }
  @ViewChild('closebtn', { static: false }) closebtn!: ElementRef<HTMLButtonElement>;

  grnSubmitToAccSave() {
    this.Error = 'Do You Want To Save ?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((res: any) => {
      if (res) {
        let updateData: any[] = []
        this.data.dataSource.forEach((data: any) => {
          updateData.push({
            PrintId: this.data.PrintId,
            Printedby: this.Empid,
            grn_ref_no: data.Grn_Ref_no
          })
        })
        this.grnSubmittoAccService.update(updateData).subscribe({
          next: (res: any) => {
            if (res.length > 0) {
              if (res[0].status == 'Y') {
                this.Error = res[0].Msg
                this.userHeader = 'Information'
                this.opendialog()
                this.dialogRef.afterClosed().subscribe((res: any) => {
                  if (res) {
                    this.downloadPDF()
                    this.PrintPage.close(true)
                  }
                });
              } else {
                this.Error = res[0].Msg
                this.userHeader = 'Error'
                return this.opendialog()
              }
            }
          }
        })
      } else {
        this.Error = 'Save  Cancelled?'
        this.userHeader = 'Information'
        return this.opendialog()
      }
    })
  }
  downloadPDF() {
    const doc = new jsPDF('p', 'mm', 'a4');
    const chunkSize = 30;
    const dataArray = this.data.dataSource;

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    let locid = JSON.parse(sessionStorage.getItem('location') || '{}');
    const title = `SANDFITS FOUNDRIES PVT LTD-UNIT-${locid}`;
    const subtitle = `GRN GATE PASS DETAILS FOR THE DATE ${this.CurrDate}`;
    const totalValue = Number(this.getTotal()) || 0;

    for (let i = 0; i < dataArray.length; i += chunkSize) {
      if (i > 0) doc.addPage();

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 105, 15, { align: 'center' });

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 122, 23, { align: 'right' });

      const chunk = dataArray.slice(i, i + chunkSize);
      const finalBody = chunk.map((row: any, index: number) => {
        const [year, month, day] = row.grndate.split('-');
        const formatted = `${day}-${month}-${year}`;
        return [
          i + index + 1,
          row.Grn_Ref_no,
          formatted,
          row.supname,
          row.value,
        ];
      });

      const isLastPage = i + chunkSize >= dataArray.length;
      if (isLastPage) {
        finalBody.push(['', '', '', 'Total', totalValue.toFixed(2)]);
      }

      autoTable(doc, {
        head: [['S.No', 'GRN Ref No', 'Date', 'Supplier', 'Value']],
        body: finalBody,
        startY: 30,
        styles: {
          lineWidth: 0.2,
          lineColor: [10, 10, 10],
          fontSize: 9,
          valign: 'middle',
          cellPadding: 2
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: 0,
          fontStyle: 'bold',
          lineWidth: 0.2,
        },
        columnStyles: {
          4: { halign: 'right' }, // Value column
        },
        didParseCell: function (data) {
          if (
            data.row.index === finalBody.length - 1 &&
            data.cell.raw === totalValue.toFixed(2)
          ) {
            data.cell.styles.fontStyle = 'bold';
          }
          if (data.column.index === 0) {
            data.cell.styles.halign = 'center';
          }
          if (data.column.index === 4) {
            data.cell.styles.halign = 'right';
          }
          if (
            data.row.index === finalBody.length - 1 &&
            data.cell.raw === 'Total'
          ) {
            data.cell.styles.fontStyle = 'bold';
          }
        },
        theme: 'grid',
      });
    }
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${totalPages}`, 105, 290, { align: 'center' });
    }
    const Curdate = this.date.transform(new Date(), 'dd-MM-yyyy HH:mm:ss');

    const signatureY = 270;  // vertical position near bottom
    const leftX = 20;
    const rightX = 150;
    doc.setFontSize(10);

    // Store Department Signature
    doc.text('Store Department Signature', leftX, signatureY);
    // doc.line(leftX, signatureY + 2, leftX + 60, signatureY + 2);
    doc.text(`Date: ${Curdate}`, leftX, signatureY + 10);

    // Accounts Department Signature
    doc.text('Accounts Department Signature', rightX, signatureY);
    // doc.line(rightX, signatureY + 2, rightX + 60, signatureY + 2);
    doc.text(`Date: `, rightX, signatureY + 10);


    doc.save(`GRN-Submit To Accounts ${Curdate}.pdf`);
  }

  closebtndisabled: boolean = false
  Error: string = ''
  userHeader: string = ''
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true,
      width: 'auto',
      data: { Msg: this.Error, Type: this.userHeader }
    });

  }
}
