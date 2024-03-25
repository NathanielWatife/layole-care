from django.db import models
from django.utils import timezone

# Create your models here.
class Appointment(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=11, blank=True)
    email = models.EmailField(unique=True)
    date1 = models.DateField(default=timezone.now, null=True, blank=True)
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name
    
    
class Contact(models.Model):
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=11, blank=True)
    email = models.EmailField(unique=True)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True) 
    
    def __str__(self):
        return self.email
	

# class Newsletter(models.Model):
    # email = models.EmailField()
    