from django.db.models import Q
from django_filters.rest_framework import BooleanFilter
from django_filters.rest_framework import Filter
from django_filters.rest_framework import FilterSet
from rest_framework_guardian.filters import ObjectPermissionsFilter

from .models import Correspondent
from .models import LegalEntity
from .models import Document
from .models import DocumentType
from .models import Log
from .models import StoragePath
from .models import Tag

CHAR_KWARGS = ["istartswith", "iendswith", "icontains", "iexact"]
ID_KWARGS = ["in", "exact"]
INT_KWARGS = ["exact", "gt", "gte", "lt", "lte", "isnull"]
DATE_KWARGS = ["year", "month", "day", "date__gt", "gt", "date__lt", "lt"]


class CorrespondentFilterSet(FilterSet):
    class Meta:
        model = Correspondent
        fields = {"name": CHAR_KWARGS}

class LegalEntityFilterSet(FilterSet):
    class Meta:
        model = LegalEntity
        fields = {"name": CHAR_KWARGS}

class TagFilterSet(FilterSet):
    class Meta:
        model = Tag
        fields = {"name": CHAR_KWARGS}


class DocumentTypeFilterSet(FilterSet):
    class Meta:
        model = DocumentType
        fields = {"name": CHAR_KWARGS}


class ObjectFilter(Filter):
    def __init__(self, exclude=False, in_list=False, field_name=""):
        super().__init__()
        self.exclude = exclude
        self.in_list = in_list
        self.field_name = field_name

    def filter(self, qs, value):
        if not value:
            return qs

        try:
            object_ids = [int(x) for x in value.split(",")]
        except ValueError:
            return qs

        if self.in_list:
            qs = qs.filter(**{f"{self.field_name}__id__in": object_ids}).distinct()
        else:
            for obj_id in object_ids:
                if self.exclude:
                    qs = qs.exclude(**{f"{self.field_name}__id": obj_id})
                else:
                    qs = qs.filter(**{f"{self.field_name}__id": obj_id})

        return qs


class InboxFilter(Filter):
    def filter(self, qs, value):
        if value == "true":
            return qs.filter(tags__is_inbox_tag=True)
        elif value == "false":
            return qs.exclude(tags__is_inbox_tag=True)
        else:
            return qs


class TitleContentFilter(Filter):
    def filter(self, qs, value):
        if value:
            return qs.filter(Q(title__icontains=value) | Q(content__icontains=value))
        else:
            return qs


class DocumentFilterSet(FilterSet):
    is_tagged = BooleanFilter(
        label="Is tagged",
        field_name="tags",
        lookup_expr="isnull",
        exclude=True,
    )

    tags__id__all = ObjectFilter(field_name="tags")

    tags__id__none = ObjectFilter(field_name="tags", exclude=True)

    tags__id__in = ObjectFilter(field_name="tags", in_list=True)

    correspondent__id__none = ObjectFilter(field_name="correspondent", exclude=True)

    legal_entity__id__none = ObjectFilter(field_name="legal_entity", exclude=True)

    document_type__id__none = ObjectFilter(field_name="document_type", exclude=True)

    storage_path__id__none = ObjectFilter(field_name="storage_path", exclude=True)

    is_in_inbox = InboxFilter()

    title_content = TitleContentFilter()

    owner__id__none = ObjectFilter(field_name="owner", exclude=True)

    class Meta:
        model = Document
        fields = {
            "title": CHAR_KWARGS,
            "content": CHAR_KWARGS,
            "archive_serial_number": INT_KWARGS,
            "created": DATE_KWARGS,
            "added": DATE_KWARGS,
            "modified": DATE_KWARGS,
            "original_filename": CHAR_KWARGS,
            "checksum": CHAR_KWARGS,
            "correspondent": ["isnull"],
            "correspondent__id": ID_KWARGS,
            "correspondent__name": CHAR_KWARGS,
            "legal_entity": ["isnull"],
            "legal_entity__id": ID_KWARGS,
            "legal_entity__name": CHAR_KWARGS,
            "tags__id": ID_KWARGS,
            "tags__name": CHAR_KWARGS,
            "document_type": ["isnull"],
            "document_type__id": ID_KWARGS,
            "document_type__name": CHAR_KWARGS,
            "storage_path": ["isnull"],
            "storage_path__id": ID_KWARGS,
            "storage_path__name": CHAR_KWARGS,
            "owner": ["isnull"],
            "owner__id": ID_KWARGS,
        }


class LogFilterSet(FilterSet):
    class Meta:
        model = Log
        fields = {"level": INT_KWARGS, "created": DATE_KWARGS, "group": ID_KWARGS}


class StoragePathFilterSet(FilterSet):
    class Meta:
        model = StoragePath
        fields = {
            "name": CHAR_KWARGS,
            "path": CHAR_KWARGS,
        }


class ObjectOwnedOrGrantedPermissionsFilter(ObjectPermissionsFilter):
    """
    A filter backend that limits results to those where the requesting user
    has read object level permissions, owns the objects, or objects without
    an owner (for backwards compat)
    """

    def filter_queryset(self, request, queryset, view):
        objects_with_perms = super().filter_queryset(request, queryset, view)
        objects_owned = queryset.filter(owner=request.user)
        objects_unowned = queryset.filter(owner__isnull=True)
        return objects_with_perms | objects_owned | objects_unowned
