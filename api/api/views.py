from django.shortcuts import render
from django.http import HttpResponse
from map_database import DBManager

db = DBManager()

def index(request):
    return HttpResponse(db.select_rows())