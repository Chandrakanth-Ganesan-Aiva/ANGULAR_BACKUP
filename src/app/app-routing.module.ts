import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component';
import { SetupComponent } from './setup/setup.component';
import { DemoComponent } from './demo/demo.component';
import { ExamblesComponent } from './exambles/exambles.component';
import { NavigationComponent } from './navigation/navigation.component';
import { DirectIndentComponent } from './direct-indent/direct-indent.component';
import { IssueRequestComponent } from './issue-request/issue-request.component';
import { StoreIssueComponent } from './store-issue/store-issue.component';
import { AdminComponent } from './admin/admin.component';
import { MaterialReturnFrmDeptComponent } from './material-Recived-frm-dept/material-return-frm-dept.component';
import { ReworkissueComponent } from './reworkissue/reworkissue.component';
import { StorageQtyAllocationComponent } from './storage-qty-allocation/storage-qty-allocation.component';
import { ShelfLifeBatchQtyComponent } from './shelf-life-batch-qty/shelf-life-batch-qty.component';
import { StoreToStoreMomentComponent } from './store-to-store-moment/store-to-store-moment.component';
import { StoreissuelogoutComponent } from './storeissuelogout/storeissuelogout.component';
import { IndentEntryComponent } from './indent-entry/indent-entry.component';
import { AuthGuard } from './auth.guard';
import { GrnWithoutBillENtryApprComponent } from './grn-without-bill-entry-appr/grn-without-bill-entry-appr.component';
import { WeighmentRejApprComponent } from './weighment-rej-appr/weighment-rej-appr.component';
import { WeighmentDelayApprComponent } from './weighment-delay-appr/weighment-delay-appr.component';
import { GrndeleteComponent } from './grndelete/grndelete.component';
import { GrndeleterequestComponent } from './grndeleterequest/grndeleterequest.component';
import { WeighmentRejectionRequestComponent } from './weighment-rejection-request/weighment-rejection-request.component';
import { GateEntryDelayComponent } from './gate-entry-delay/gate-entry-delay.component';
import { GateEntryDelayApprComponent } from './gate-entry-delay-appr/gate-entry-delay-appr.component';
import { WeighPrintDaimlrComponent } from './weigh-print-daimlr/weigh-print-daimlr.component';
import { MinmumMaximumEntryComponent } from './minmum-maximum-entry/minmum-maximum-entry.component';
import { QtyDeAllocationComponent } from './qty-de-allocation/qty-de-allocation.component';
import { ItemMasterApprovalComponent } from './item-master-approval/item-master-approval.component';
import { QcRequiredComponent } from './qc-required/qc-required.component';
import { ShelfLifeRecertificateComponent } from './shelf-life-recertificate/shelf-life-recertificate.component';
import { PDRawmaterialChangeComponent } from './pd-rawmaterial-change/pd-rawmaterial-change.component';
import { RawmaterialSplitComponent } from './rawmaterial-split/rawmaterial-split.component';
import { PackingWeightComponent } from './packing-weight/packing-weight.component';
import { CustomerReturnComponent } from './customer-return/customer-return.component';
import { GrnWithoutBillEntryComponent } from './grn-without-bill-entry/grn-without-bill-entry.component';
import { RawMaterialSplitMasterComponent } from './raw-material-split-master/raw-material-split-master.component';
//Purchase
import { POCloseComponent } from './poclose/poclose.component';
import { Poclose2Component } from './poclose2/poclose2.component';
import { Poclose3Component } from './poclose3/poclose3.component';
import { CreditdaysApprovalComponent } from './creditdays-approval/creditdays-approval.component';
import { ClearingApprovalComponent } from './clearing-approval/clearing-approval.component';
import { IndentPendingApprovalComponent } from './indent-pending-approval/indent-pending-approval.component';
import { SupplierregAppPurComponent } from './supplierreg-app-pur/supplierreg-app-pur.component';
import { SupplierregAppFinComponent } from './supplierreg-app-fin/supplierreg-app-fin.component';
import { SupplierregApprovalTecComponent } from './supplierreg-approval-tec/supplierreg-approval-tec.component';
import { PaymentTermsComponent } from './payment-terms/payment-terms.component';
import { MailNumberUpdateComponent } from './mail-number-update/mail-number-update.component';
import { CustomerPackingDetComponent } from './customer-packing-det/customer-packing-det.component';
import { SuppliergstComponent } from './suppliergst/suppliergst.component';
import { SupplierregComponent } from './supplierreg/supplierreg.component';
//
import { GRNEntryComponent } from './grnentry/grnentry.component';
import { GrnSubmitToAccountsComponent } from './grn-submit-to-accounts/grn-submit-to-accounts.component';
import { ItemMasterComponent } from './item-master/item-master.component';
import { GrnPrintComponent } from './grn-print/grn-print.component';
import { StockReportComponent } from './stock-report/stock-report.component';
import { PrintPageComponent } from './print-page/print-page.component';
import { StoreReqMatlDetComponent } from './store-req-matl-det/store-req-matl-det.component';
import { IndentApprovalComponent } from './indent-approval/indent-approval.component';
// import { DashboardCommericaComponent } from './dashboard-commerica/dashboard-commerica.component';

const routes: Routes = [
  // -----------------------Home-----------------
  { path: '', component: LoginComponent, pathMatch: 'full', data: { hideNavbar: true } },
  { path: 'login', component: LoginComponent, data: { hideNavbar: true } },
  { path: 'print', component: PrintPageComponent, data: { hideNavbar: true } },
  { path: 'storeReqDet', component: StoreReqMatlDetComponent, data: { hideNavbar: true } },
  { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'demo', component: DemoComponent, canActivate: [AuthGuard] },
  { path: 'examble', component: ExamblesComponent, canActivate: [AuthGuard] },
  { path: 'nav', component: NavigationComponent, canActivate: [AuthGuard] },
  // ---------------------Inventory---------------------------
  { path: 'PurchaseReq', component: PurchaseRequestComponent, canActivate: [AuthGuard], data: { menuId: 374 } },
  { path: 'issueReq', component: IssueRequestComponent, canActivate: [AuthGuard], data: { menuId: 242 } },
  { path: 'directIndent', component: DirectIndentComponent, canActivate: [AuthGuard], data: { menuId: 143 } },
  { path: 'storeissue', component: StoreIssueComponent, canActivate: [AuthGuard], data: { menuId: 166 } },
  { path: 'reworkissue', component: ReworkissueComponent, canActivate: [AuthGuard], data: { menuId: 396 } },
  { path: 'MatlReceiveFrmDept', component: MaterialReturnFrmDeptComponent, canActivate: [AuthGuard], data: { menuId: 282 } },
  { path: 'StorageQtyAlloc', component: StorageQtyAllocationComponent, canActivate: [AuthGuard], data: { menuId: 471 } },
  { path: 'Shelflife', component: ShelfLifeBatchQtyComponent, canActivate: [AuthGuard], data: { menuId: 440 } },
  { path: 'StoretoStore', component: StoreToStoreMomentComponent, canActivate: [AuthGuard], data: { menuId: 472 } },
  { path: 'GateEntryDelayAppr', component: GateEntryDelayApprComponent, canActivate: [AuthGuard], data: { menuId: 192 } },
  { path: 'GrnDeleteReq', component: GrndeleterequestComponent, canActivate: [AuthGuard], data: { menuId: 202 } },
  { path: 'shelflifeRecertificate', component: ShelfLifeRecertificateComponent, canActivate: [AuthGuard], data: { menuId: 441 } },
  { path: 'RawmatSplit', component: RawmaterialSplitComponent, canActivate: [AuthGuard], data: { menuId: 386 } },
  { path: 'customerreturn', component: CustomerReturnComponent, canActivate: [AuthGuard], data: { menuId: 112 } },
  { path: 'grnwithoutbillentry', component: GrnWithoutBillEntryComponent, canActivate: [AuthGuard], data: { menuId: 212 } },
  { path: 'RawmatSpiltMaster', component: RawMaterialSplitMasterComponent, canActivate: [AuthGuard], data: { menuId: 387 } },
  { path: 'grnEntry', component: GRNEntryComponent, canActivate: [AuthGuard], data: { menuId: 203 } },
  { path: 'indentApproval', component: IndentApprovalComponent, canActivate: [AuthGuard], data: { menuId: 229 } },
  // ---------------------------Inventory-Transaction------------------------------
  // { path: 'GrnDeleteReq', component: GrndeleterequestComponent, canActivate: [AuthGuard] },
  { path: 'IndentEntry', component: IndentEntryComponent, canActivate: [AuthGuard], data: { menuId: 234 } },
  { path: 'QtyDellaco', component: QtyDeAllocationComponent, canActivate: [AuthGuard], data: { menuId: 378 } },
  // ---------------------Inventory-Weigment---------------------------
  { path: 'WeighRejReq', component: WeighmentRejectionRequestComponent, canActivate: [AuthGuard], data: { menuId: 539 } },
  { path: 'WeighprintDailmr', component: WeighPrintDaimlrComponent, canActivate: [AuthGuard], data: { menuId: 538 } },
  //---------------------Purchase-------------------------------------
  { path: 'POClose1', component: POCloseComponent, canActivate: [AuthGuard], data: { menuId: 349 } },
  { path: 'poclose2', component: Poclose2Component, canActivate: [AuthGuard], data: { menuId: 350 } },
  { path: 'poclose3', component: Poclose3Component, canActivate: [AuthGuard], data: { menuId: 563 } },
  { path: 'creditdaysApprovals', component: CreditdaysApprovalComponent, canActivate: [AuthGuard], data: { menuId: 93 } },
  { path: 'clearingFrechargesApprovals', component: ClearingApprovalComponent, canActivate: [AuthGuard], data: { menuId: 76 } },
  { path: 'IndentApprovalPending', component: IndentPendingApprovalComponent, canActivate: [AuthGuard], data: { menuId: 231 } },
  { path: 'SupplierRegAppApurchase', component: SupplierregAppPurComponent, canActivate: [AuthGuard], data: { menuId: 488 } },
  { path: 'SupplierRegAppFin', component: SupplierregAppFinComponent, canActivate: [AuthGuard], data: { menuId: 487 } },
  { path: 'SupplierRegAppTec', component: SupplierregApprovalTecComponent, canActivate: [AuthGuard], data: { menuId: 489 } },
  { path: 'PaymentTerms', component: PaymentTermsComponent, canActivate: [AuthGuard], data: { menuId: 333 } },
  { path: 'MailNumberUpdate', component: MailNumberUpdateComponent, canActivate: [AuthGuard], data: { menuId: 155 } },
  { path: 'customerPackDet', component: CustomerPackingDetComponent, canActivate: [AuthGuard], data: { menuId: 108 } },
  { path: 'suppliergst', component: SuppliergstComponent, canActivate: [AuthGuard], data: { menuId: 494 } },
  { path: 'supplierreg', component: SupplierregComponent, canActivate: [AuthGuard], data: { menuId: 495 } },
  // ---------------------------------Inventory Report-------------------------------
  { path: 'grnSubmitToAcc', component: GrnSubmitToAccountsComponent, canActivate: [AuthGuard], data: { menuId: 208 } },
  { path: 'grnprint', component: GrnPrintComponent, canActivate: [AuthGuard], data: { menuId: 568 } },
  { path: 'stockreport', component: StockReportComponent, canActivate: [AuthGuard], data: { menuId: 467 } },
  // ---------------------------------Inventory-Master------------------------------
  { path: 'GateEntryDelay', component: GateEntryDelayComponent, canActivate: [AuthGuard], data: { menuId: 191 } },
  { path: 'minmaxEntry', component: MinmumMaximumEntryComponent, canActivate: [AuthGuard], data: { menuId: 285 } },
  { path: 'itemmaster', component: ItemMasterComponent, canActivate: [AuthGuard], data: { menuId: 245 } },
  { path: 'itemMasterAppr', component: ItemMasterApprovalComponent, canActivate: [AuthGuard], data: { menuId: 246 } },
  { path: 'QcReq', component: QcRequiredComponent, canActivate: [AuthGuard], data: { menuId: 112 } },
  { path: 'pdRawmatchange', component: PDRawmaterialChangeComponent, canActivate: [AuthGuard], data: { menuId: 336 } },
  { path: 'packweight', component: PackingWeightComponent, canActivate: [AuthGuard], data: { menuId: 322 } },
  // ---------------------------------Approval------------------------------
  { path: 'grnWithoutbillEntryAppr', component: GrnWithoutBillENtryApprComponent, canActivate: [AuthGuard], data: { menuId: 213 } },
  { path: 'WeighRejAppr', component: WeighmentRejApprComponent, canActivate: [AuthGuard], data: { menuId: 394 } },
  { path: 'WeighDelAppr', component: WeighmentDelayApprComponent, canActivate: [AuthGuard], data: { menuId: 534 } },
  { path: 'GrnDelete', component: GrndeleteComponent, canActivate: [AuthGuard], data: { menuId: 201 } },
  //  ---------------------------Admin---------------------------------
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { menuId: 1 } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }