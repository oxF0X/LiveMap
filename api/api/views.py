from django.urls import path
from . import views

urlpatterns = [
    path("events/", views.index, name = "events")
    ]

[ec2-user@ip-10-0-23-6 api]$ cat views.py 
from django.shortcuts import render
from django.http import HttpResponse
from map_database import DBManager

db = DBManager()

def index(request):
    return HttpResponse(db.select_rows())
