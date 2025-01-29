import { NgClass, TitleCasePipe } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import {
  NgbDropdownModule,
  NgbModal,
  NgbPaginationModule,
} from '@ng-bootstrap/ng-bootstrap'
import { NgxBootstrapIconsModule } from 'ngx-bootstrap-icons'
import { LegalEntity } from 'src/app/data/legalentity'
import { FILTER_HAS_LEGAL_ENTITY_ANY } from 'src/app/data/filter-rule-type'
import { IfPermissionsDirective } from 'src/app/directives/if-permissions.directive'
import { SortableDirective } from 'src/app/directives/sortable.directive'
import { CustomDatePipe } from 'src/app/pipes/custom-date.pipe'
import { DocumentListViewService } from 'src/app/services/document-list-view.service'
import {
  PermissionsService,
  PermissionType,
} from 'src/app/services/permissions.service'
import { LegalEntityService } from 'src/app/services/rest/legalentity.service'
import { ToastService } from 'src/app/services/toast.service'
import { LegalEntityEditDialogComponent } from '../../common/edit-dialog/legalentity-edit-dialog/legalentity-edit-dialog.component'
import { PageHeaderComponent } from '../../common/page-header/page-header.component'
import { ManagementListComponent } from '../management-list/management-list.component'

@Component({
  selector: 'pngx-legalentity-list',
  templateUrl: './../management-list/management-list.component.html',
  styleUrls: ['./../management-list/management-list.component.scss'],
  providers: [{ provide: CustomDatePipe }],
  imports: [
    SortableDirective,
    IfPermissionsDirective,
    PageHeaderComponent,
    TitleCasePipe,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    NgbDropdownModule,
    NgbPaginationModule,
    NgxBootstrapIconsModule,
  ],
})
export class LegalEntityListComponent extends ManagementListComponent<LegalEntity> {
  constructor(
    legalEntitiesService: LegalEntityService,
    modalService: NgbModal,
    toastService: ToastService,
    documentListViewService: DocumentListViewService,
    permissionsService: PermissionsService,
    private datePipe: CustomDatePipe
  ) {
    super(
      legalEntitiesService,
      modalService,
      LegalEntityEditDialogComponent,
      toastService,
      documentListViewService,
      permissionsService,
      FILTER_HAS_LEGAL_ENTITY_ANY,
      $localize`legal entity`,
      $localize`legal entities`,
      PermissionType.LegalEntity,
      [
        {
          key: 'last_use_legal_entity',
          name: $localize`Last used`,
          valueFn: (c: LegalEntity) => {
            if (c.last_use_legal_entity) {
              let date = new Date(c.last_use_legal_entity)
              if (date.toString() == 'Invalid Date') {
                // very old date strings are unable to be parsed
                date = new Date(
                  c.last_use_legal_entity
                    ?.toString()
                    .replace(/([-+])(\d\d):\d\d:\d\d/gm, `$1$2:00`)
                )
              }
              return this.datePipe.transform(date)
            }
            return ''
          },
        },
      ]
    )
  }

  public reloadData(): void {
    super.reloadData({ last_use_legal_entity: true })
  }

  getDeleteMessage(object: LegalEntity) {
    return $localize`Do you really want to delete the legal entity "${object.name}"?`
  }
}
