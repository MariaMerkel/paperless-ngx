import { Component } from '@angular/core'
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { first } from 'rxjs'
import { EditDialogComponent } from 'src/app/components/common/edit-dialog/edit-dialog.component'
import { Correspondent } from 'src/app/data/correspondent'
import { LegalEntity } from 'src/app/data/legalentity'
import { DocumentType } from 'src/app/data/document-type'
import { MailAccount } from 'src/app/data/mail-account'
import {
  MailAction,
  MailFilterAttachmentType,
  MailMetadataCorrespondentOption,
  MailMetadataTitleOption,
  MailMetadataLegalEntityOption,
  MailRule,
  MailRuleConsumptionScope,
} from 'src/app/data/mail-rule'
import { CorrespondentService } from 'src/app/services/rest/correspondent.service'
import { DocumentTypeService } from 'src/app/services/rest/document-type.service'
import { MailAccountService } from 'src/app/services/rest/mail-account.service'
import { MailRuleService } from 'src/app/services/rest/mail-rule.service'
import { LegalEntityService } from 'src/app/services/rest/legalentity.service'
import { UserService } from 'src/app/services/rest/user.service'
import { SettingsService } from 'src/app/services/settings.service'
import { CheckComponent } from '../../input/check/check.component'
import { NumberComponent } from '../../input/number/number.component'
import { SelectComponent } from '../../input/select/select.component'
import { SwitchComponent } from '../../input/switch/switch.component'
import { TagsComponent } from '../../input/tags/tags.component'
import { TextComponent } from '../../input/text/text.component'

const ATTACHMENT_TYPE_OPTIONS = [
  {
    id: MailFilterAttachmentType.Attachments,
    name: $localize`Only process attachments`,
  },
  {
    id: MailFilterAttachmentType.Everything,
    name: $localize`Process all files, including 'inline' attachments`,
  },
]

const CONSUMPTION_SCOPE_OPTIONS = [
  {
    id: MailRuleConsumptionScope.Attachments,
    name: $localize`Only process attachments`,
  },
  {
    id: MailRuleConsumptionScope.Email_Only,
    name: $localize`Process message as .eml`,
  },
  {
    id: MailRuleConsumptionScope.Everything,
    name: $localize`Process message as .eml and attachments separately`,
  },
]

const ACTION_OPTIONS = [
  {
    id: MailAction.Delete,
    name: $localize`Delete`,
  },
  {
    id: MailAction.Move,
    name: $localize`Move to specified folder`,
  },
  {
    id: MailAction.MarkRead,
    name: $localize`Mark as read, don't process read mails`,
  },
  {
    id: MailAction.Flag,
    name: $localize`Flag the mail, don't process flagged mails`,
  },
  {
    id: MailAction.Tag,
    name: $localize`Tag the mail with specified tag, don't process tagged mails`,
  },
]

const METADATA_TITLE_OPTIONS = [
  {
    id: MailMetadataTitleOption.FromSubject,
    name: $localize`Use subject as title`,
  },
  {
    id: MailMetadataTitleOption.FromFilename,
    name: $localize`Use attachment filename as title`,
  },
  {
    id: MailMetadataTitleOption.None,
    name: $localize`Do not assign title from this rule`,
  },
]

const METADATA_CORRESPONDENT_OPTIONS = [
  {
    id: MailMetadataCorrespondentOption.FromNothing,
    name: $localize`Do not assign a correspondent`,
  },
  {
    id: MailMetadataCorrespondentOption.FromEmail,
    name: $localize`Use mail address`,
  },
  {
    id: MailMetadataCorrespondentOption.FromName,
    name: $localize`Use name (or mail address if not available)`,
  },
  {
    id: MailMetadataCorrespondentOption.FromCustom,
    name: $localize`Use correspondent selected below`,
  },
]

const METADATA_LEGAL_ENTITY_OPTIONS = [
  {
    id: MailMetadataLegalEntityOption.FromNothing,
    name: $localize`Do not assign a legal entity`,
  },
  {
    id: MailMetadataLegalEntityOption.FromEmail,
    name: $localize`Use mail address`,
  },
  {
    id: MailMetadataLegalEntityOption.FromName,
    name: $localize`Use name (or mail address if not available)`,
  },
  {
    id: MailMetadataLegalEntityOption.FromCustom,
    name: $localize`Use legal entity selected below`,
  },
]

@Component({
  selector: 'pngx-mail-rule-edit-dialog',
  templateUrl: './mail-rule-edit-dialog.component.html',
  styleUrls: ['./mail-rule-edit-dialog.component.scss'],
  imports: [
    SelectComponent,
    TagsComponent,
    CheckComponent,
    TextComponent,
    NumberComponent,
    SwitchComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class MailRuleEditDialogComponent extends EditDialogComponent<MailRule> {
  accounts: MailAccount[]
  correspondents: Correspondent[]
  legalEntities: LegalEntity[]
  documentTypes: DocumentType[]

  constructor(
    service: MailRuleService,
    activeModal: NgbActiveModal,
    accountService: MailAccountService,
    correspondentService: CorrespondentService,
    legalEntityService: LegalEntityService,
    documentTypeService: DocumentTypeService,
    userService: UserService,
    settingsService: SettingsService
  ) {
    super(service, activeModal, userService, settingsService)

    accountService
      .listAll()
      .pipe(first())
      .subscribe((result) => (this.accounts = result.results))

    correspondentService
      .listAll()
      .pipe(first())
      .subscribe((result) => (this.correspondents = result.results))

    documentTypeService
      .listAll()
      .pipe(first())
      .subscribe((result) => (this.documentTypes = result.results))

    legalEntityService
      .listAll()
      .pipe(first())
      .subscribe((result) => (this.legalEntities = result.results))
  }

  getCreateTitle() {
    return $localize`Create new mail rule`
  }

  getEditTitle() {
    return $localize`Edit mail rule`
  }

  getForm(): FormGroup {
    return new FormGroup({
      name: new FormControl(null),
      account: new FormControl(null),
      enabled: new FormControl(true),
      folder: new FormControl('INBOX'),
      filter_from: new FormControl(null),
      filter_to: new FormControl(null),
      filter_subject: new FormControl(null),
      filter_body: new FormControl(null),
      filter_attachment_filename_include: new FormControl(null),
      filter_attachment_filename_exclude: new FormControl(null),
      maximum_age: new FormControl(null),
      attachment_type: new FormControl(MailFilterAttachmentType.Attachments),
      consumption_scope: new FormControl(MailRuleConsumptionScope.Attachments),
      order: new FormControl(null),
      action: new FormControl(MailAction.MarkRead),
      action_parameter: new FormControl(null),
      assign_title_from: new FormControl(MailMetadataTitleOption.FromSubject),
      assign_tags: new FormControl([]),
      assign_document_type: new FormControl(null),
      assign_correspondent_from: new FormControl(
        MailMetadataCorrespondentOption.FromNothing
      ),
      assign_correspondent: new FormControl(null),
      assign_legal_entity_from: new FormControl(
        MailMetadataLegalEntityOption.FromNothing
      ),
      assign_legal_entity: new FormControl(null),
      assign_owner_from_rule: new FormControl(true),
    })
  }

  get showCorrespondentField(): boolean {
    return (
      this.objectForm?.get('assign_correspondent_from')?.value ==
      MailMetadataCorrespondentOption.FromCustom
    )
  }

  get showLegalEntityField(): boolean {
    return (
      this.objectForm?.get('assign_legal_entity_from')?.value ==
      MailMetadataLegalEntityOption.FromCustom
    )
  }

  get showActionParamField(): boolean {
    return (
      this.objectForm?.get('action')?.value == MailAction.Move ||
      this.objectForm?.get('action')?.value == MailAction.Tag
    )
  }

  get attachmentTypeOptions() {
    return ATTACHMENT_TYPE_OPTIONS
  }

  get actionOptions() {
    return ACTION_OPTIONS
  }

  get metadataTitleOptions() {
    return METADATA_TITLE_OPTIONS
  }

  get metadataCorrespondentOptions() {
    return METADATA_CORRESPONDENT_OPTIONS
  }

  get metadataLegalEntityOptions() {
    return METADATA_LEGAL_ENTITY_OPTIONS
  }

  get consumptionScopeOptions() {
    return CONSUMPTION_SCOPE_OPTIONS
  }
}
