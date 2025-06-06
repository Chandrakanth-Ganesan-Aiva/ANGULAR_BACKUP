import { Component } from '@angular/core';
import { CustomerPackingDetService } from '../service/customer-packing-det.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DialogCompComponent } from '../dialog-comp/dialog-comp.component';
@Component({
  selector: 'app-customer-packing-det',
  templateUrl: './customer-packing-det.component.html',
  styleUrl: './customer-packing-det.component.scss'
})
export class CustomerPackingDetComponent {
  constructor(private service: CustomerPackingDetService, private dialog: MatDialog) { }
  ngOnInit() {
    const user = JSON.parse(sessionStorage.getItem('session') || '{}');
    // this.empid = user.empid
    this.empid = 154234
    this.locationid = 1
    this.service.load().subscribe((result: any) => {
      this.CustArray = result
    })
    this.service.load1().subscribe((result: any) => {
      if (Array.isArray(result)) {
        this.packageArray = result.map((item: any) => ({
          ...item,
          rawmatname: item.rawmatname.replace(/\s*\(\d+\)$/, '')
        }));
      } else {
        console.error("Unexpected response type, expected array:", result);
        this.packageArray = [];
      }
      console.log(this.packageArray);

    });
  }
  empid: number | null = 0
  CustArray: any[] = []
  ProductArray: any[] = []
  packageArray: any[] = []
  custid: number | null = null
  locationid: number | null = 0
  matlid: number | null = null
  materialid: number | null = null
  TableArray: any[] = []
  packingwt: number | null = null
  tempArray: any[] = []
  packingqty: number | null = null
  casting: number | null = null
  show: boolean = true;
  packingmaterial: number | null = null
  custshow: boolean = false
  filteredPackageArray: any[] = [];
  selectedMaterials: any[] = [];
  prod: string | null = null
  maxid: number | null = null
  Tableshow: boolean = false
  threefield: boolean = false
  editIndex: number | null = null;
  Error: string = ''
  userHeader: string = ''
  customer() {
    this.ProductArray = []
    this.prod = null
    this.TableArray = []
    this.packingmaterial = null
    this.packingwt = null
    this.packingqty = null
    this.Tableshow = false
    this.threefield = false
    if (this.custid) {
      this.service.cust(this.custid, this.locationid).subscribe((result: any) => {
        this.ProductArray = result;
        console.log(this.ProductArray);

        this.show = false;
      })
    }
    else {
      this.custid = null
      this.show = true;
      this.ProductArray = []
    }
  }
  product(event: any) {
    this.TableArray = []
    this.packingmaterial = null
    this.packingwt = null
    this.packingqty = null
    this.Tableshow = false
    if (event) {
      this.casting = null
      this.matlid = event.matlid
      if (this.matlid) {
        this.Tableshow = true
        this.service.castingw(this.matlid, this.locationid).subscribe((result: any) => {
          if (result.length > 0 && result[0].machined) {
            this.casting = result[0].machined;
          } else {
            this.casting = 0;
          }
          this.service.maxid(this.custid, this.matlid).subscribe((result: any) => {
            this.maxid = result[0].maxid
            console.log(this.maxid, 'this.maxid');
            this.service.table(this.custid, this.matlid, this.maxid).subscribe((result: any) => {
              this.TableArray = result
            })
          })
        })
      }
      else {
        this.matlid = null
      }
      this.threefield = true
    }
    else {
      this.matlid = null
      this.casting = null
      this.threefield = true
    }
  }
  add() {
    if (this.custid) {
      if (this.matlid) {
        if (this.packingmaterial) {
          if (this.packingwt) {
            if (this.packingqty) {
              const selectedMaterial = this.packageArray.find(item => item.rawmatid === this.packingmaterial);
              if (selectedMaterial) {
                const existingItem = this.TableArray.find(item => item.rawmatname === selectedMaterial.rawmatname);
                if (existingItem) {
                  this.Error = 'This material is already added!'
                  this.userHeader = 'Information'
                  this.opendialog()
                  return;
                }
                this.TableArray.push({
                  rawmatname: selectedMaterial.rawmatname,
                  packingid: selectedMaterial.rawmatid,
                  uom: selectedMaterial.uom,
                  packingwt: Number(this.packingwt),
                  packingqty: Number(this.packingqty)
                });
                this.packingmaterial = null;
                this.packingwt = null;
                this.packingqty = null;
              }
            }
            else {
              this.Error = 'Enter the Packing Quantity'
              this.userHeader = 'Information'
              this.opendialog()
            }
          }
          else {
            this.Error = 'Enter the Packing weight'
            this.userHeader = 'Information'
            this.opendialog()
          }
        } else {
          this.Error = 'Please the Select the Material'
          this.userHeader = 'Information'
          this.opendialog()
        }
      }
      else {
        this.Error = 'Select the Product name'
        this.userHeader = 'Information'
        this.opendialog()
      }
    }
    else {
      this.Error = 'Select the Customer'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  packing(event: any) {
    this.packingqty = null
    if (event) {
      console.log(event);
      this.packingwt = event.weight
    }
    else {
      this.packingwt = null
    }
  }
  save() {
    if (this.custid) {
      if (this.matlid) {
        if (this.TableArray.length > 0) {
          this.Error = 'Are you to Approve ?'
          this.userHeader = 'Save'
          this.opendialog()
          this.dialogRef.afterClosed().subscribe((result: boolean) => {
            if (result) {
              console.log(this.TableArray);
              this.service.save(this.TableArray).subscribe((result: any) => {
                this.Error = result.message
                this.userHeader = 'Information'
                this.opendialog()
                this.clear()
              })
            }
          })
        }
        else {
          this.Error = 'Select the Package Material'
          this.userHeader = 'Information'
          this.opendialog()
        }
      }
      else {
        this.Error = 'Select the Product'
        this.userHeader = 'Information'
        this.opendialog()
      }
    }
    else {
      this.Error = 'Select the Customer'
      this.userHeader = 'Information'
      this.opendialog()
    }
  }
  removeRow(index: number) {
    this.Error = 'Are you sure to Remove?'
    this.userHeader = 'Save'
    this.opendialog()
    this.dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.TableArray.splice(index, 1);
        this.TableArray = [...this.TableArray];
      }
    })
  }
  clear() {
    this.ProductArray = []
    this.custid = null
    this.matlid = null
    this.materialid = null
    this.TableArray = []
    this.packingwt = null
    this.tempArray = []
    this.packingqty = null
    this.casting = null
    this.show = true;
    this.packingmaterial = null
    this.custshow = false
    this.filteredPackageArray = [];
    this.selectedMaterials = [];
    this.prod = null
    this.maxid = null
    this.Tableshow = false
    this.threefield = false
    this.editIndex = null
  }
  edit(index: number) {
    this.editIndex = index;
  }
  saverow(index: number) {
    this.editIndex = null;
  }
  dialogRef!: MatDialogRef<DialogCompComponent>
  opendialog() {
    this.dialogRef = this.dialog.open(DialogCompComponent, {
      disableClose: true, width: 'auto', data: { Msg: this.Error, Type: this.userHeader }
    })
  }
}