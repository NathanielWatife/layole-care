# Generated by Django 5.0.3 on 2024-03-22 05:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0008_rename_note_contact_message'),
    ]

    operations = [
        migrations.CreateModel(
            name='Newsletter',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('email', models.EmailField(max_length=254, unique=True)),
            ],
        ),
    ]
