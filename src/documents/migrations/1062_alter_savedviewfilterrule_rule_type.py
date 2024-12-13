# Generated by Django 5.1.4 on 2024-12-13 15:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("documents", "1061_merge_20241213_1509"),
    ]

    operations = [
        migrations.AlterField(
            model_name="savedviewfilterrule",
            name="rule_type",
            field=models.PositiveIntegerField(
                choices=[
                    (0, "title contains"),
                    (1, "content contains"),
                    (2, "ASN is"),
                    (3, "correspondent is"),
                    (4, "document type is"),
                    (5, "is in inbox"),
                    (6, "has tag"),
                    (7, "has any tag"),
                    (8, "created before"),
                    (9, "created after"),
                    (10, "created year is"),
                    (11, "created month is"),
                    (12, "created day is"),
                    (13, "added before"),
                    (14, "added after"),
                    (15, "modified before"),
                    (16, "modified after"),
                    (17, "does not have tag"),
                    (18, "does not have ASN"),
                    (19, "title or content contains"),
                    (20, "fulltext query"),
                    (21, "more like this"),
                    (22, "has tags in"),
                    (23, "ASN greater than"),
                    (24, "ASN less than"),
                    (25, "storage path is"),
                    (26, "has correspondent in"),
                    (27, "does not have correspondent in"),
                    (28, "has document type in"),
                    (29, "does not have document type in"),
                    (30, "has storage path in"),
                    (31, "does not have storage path in"),
                    (32, "owner is"),
                    (33, "has owner in"),
                    (34, "does not have owner"),
                    (35, "does not have owner in"),
                    (36, "has custom field value"),
                    (37, "is shared by me"),
                    (38, "legal entity is"),
                    (39, "has legal entity in"),
                    (40, "does not have legal entity in"),
                    (41, "due date before"),
                    (42, "due date after"),
                    (43, "due date year is"),
                    (44, "due date month is"),
                    (45, "due date day is"),
                    (46, "has custom fields"),
                    (47, "has custom field in"),
                    (48, "does not have custom field in"),
                    (49, "does not have custom field"),
                    (50, "custom fields query"),
                ],
                verbose_name="rule type",
            ),
        ),
    ]