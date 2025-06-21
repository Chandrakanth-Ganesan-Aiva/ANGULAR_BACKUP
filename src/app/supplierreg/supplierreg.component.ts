import { Component } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-supplierreg',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './supplierreg.component.html',
  styleUrl: './supplierreg.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SupplierregComponent {
  type: string = ''
  Selectedtype(event: Event, selected: string) {
    const input = event.target as HTMLInputElement
    if (input.checked) {
      this.type = selected
      console.log(this.type)
    }
    else {
      this.type = ''
      console.log(this.type)
    }
  }
  SelectedSupplier(event:Event,selected:string) {
    
  }
}
