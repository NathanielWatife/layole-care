from django.shortcuts import render, redirect
from .models import Appointment, Contact
from django.contrib import messages
from datetime import datetime
from django.http.response import HttpResponseRedirect
from django.conf import settings
from django.core.mail import send_mail

# Create your views here.
def home(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        date1_str = request.POST['date1']  # Corrected variable name
        note = request.POST['note']
        
        # Create new appointment
        try:
            # Parse the date string into correct format
            date1 = datetime.strptime(date1_str, '%d/%m/%Y').strftime('%Y-%m-%d')
            appoint = Appointment.objects.create(name=name, email=email, date1=date1, phone=phone, note=note)
            appoint.save()
            

            messages.success(request, "Booking has been saved. An email has been sent with booking details.")
        except ValueError:
            messages.error(request, "Invalid date format. Please enter the date in the format DD/MM/YYYY")
        except Exception as e:
            messages.error(request, f"An error occurred: {e}")
        
        return redirect('/')
    
    return render(request, 'index.html')


def contact(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        phone = request.POST['phone']
        message = request.POST['message']
        # create new apointment
        details = Contact.objects.create(name=name, email=email, phone=phone, message=message)
        details.save()
        messages.success(request, "Your message has been saved and sent!")
        return redirect('/contact')
    else:
        return render(request, 'contact.html')


# def newsletter(request):
#     if request.method == 'POST':
#         email = request.POST['email']
        
#         # save details
#         letter = Newsletter.objects.create(email=email)
#         letter.save()
#         messages.success(request, "Email has saved,You will always receive medical update from us. Stay turned!!")
#         return redirect('/')
#     else:
#         messages.error("Invalid. Please you email again!!")
#         return redirect('/')
    
    
    
def about(request):
    return render(request, 'about.html')


def services(request):
    return render(request, 'services.html')