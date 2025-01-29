import { Component } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { LegalEntity } from 'src/app/data/legalentity'
import { DEFAULT_MATCHING_ALGORITHM } from 'src/app/data/matching-model'
import { IfOwnerDirective } from 'src/app/directives/if-owner.directive'
import { LegalEntityService } from 'src/app/services/rest/legalentity.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { PermissionsFormComponent } from '../../input/permissions/permissions-form/permissions-form.component'
import { SelectComponent } from '../../input/select/select.component'
import { TextComponent } from '../../input/text/text.component'

@Component({
  selector: 'pngx-legalentity-edit-dialog',
  templateUrl: './legalentity-edit-dialog.component.html',
  styleUrls: ['./legalentity-edit-dialog.component.scss'],
  imports: [
    SelectComponent,
    PermissionsFormComponent,
    TextComponent,
    IfOwnerDirective,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class LegalEntityEditDialogComponent extends EditDialogComponent<LegalEntity> {
  constructor(
    service: LegalEntityService,
    activeModal: NgbActiveModal,
    userService: UserService,
    settingsService: SettingsService
  ) {
    super(service, activeModal, userService, settingsService)
  }

  getCreateTitle() {
    return $localize`Create new legal entity`
  }

  getEditTitle() {
    return $localize`Edit legal entity`
  }

  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      matching_algorithm: new FormControl(DEFAULT_MATCHING_ALGORITHM),
      match: new FormControl(''),
      is_insensitive: new FormControl(true),
      permissions_form: new FormControl(null),
    })
  }
}
