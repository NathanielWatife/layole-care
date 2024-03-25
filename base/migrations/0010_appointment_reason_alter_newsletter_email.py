# Generated by Django 5.0.3 on 2024-03-22 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('base', '0009_newsletter'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointment',
            name='reason',
            field=models.CharField(blank=True, max_length=50000),
        ),
        migrations.AlterField(
            model_name='newsletter',
            name='email',
            field=models.EmailField(max_length=254),
        ),
    ]