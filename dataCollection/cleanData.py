import json

#clean dump file by forming a list of all classes and removing anything that isn't a class like recitaions or labs
#possible class types are
# THE = thesis
# REC = recitaion
# INT = intership
# SEM = seminar
# CLQ = colloquium
# IND = indepent study
# PRA = practicum
# LAB = lab
# LEC = lecture       <- only thing important
# CLB = credit lab
# DIR = directed studies
# WRK = workshop
# CLN = clinical

file = open('CSCHacks2023\dataCollection\dump\dumpEdited.json')

data = json.load(file)
classDict = {}


#print(len(data))

for item in data :

    #only keeps lectures
    if(item["component"] != "LEC"):
        continue

    #checks if course id has already been entered on list
    if(item["crse_id"] in classDict):
        continue

    #set class data
    classData = {"catalog_nbr":None,"subject":None,"crse_attr":None,"crse_attr_value":None, "class_nbr":None, "descr":None}
    for key in classData:
        classData[key] = item[key]

    #add to main dict   
    classDict[item["crse_id"]] = classData

#print(len(classDict))

#save json file
with open("cleanData.json", "x") as ofile: 
    json.dump(classDict, ofile)