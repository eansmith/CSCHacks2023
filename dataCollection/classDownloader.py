import requests

#Downloads all Spring 2024 classes and merges into one file

termNumber = 2244

#endPoint = "https://pitcsprd.csps.pitt.edu/psc/pitcsprd/EMPLOYEE/SA/s/WEBLIB_HCX_CM.H_CLASS_SEARCH.FieldFormula.IScript_ClassSearch"

endPoint = "https://pitcsprd.csps.pitt.edu/psc/pitcsprd/EMPLOYEE/SA/s/WEBLIB_HCX_CM.H_CLASS_SEARCH.FieldFormula.IScript_ClassSearch?institution=UPITT&term=2244&date_from=&date_thru=&subject=&subject_like=&catalog_nbr=&time_range=&days=&campus=PIT&location=&x_acad_career=UGRD&acad_group=&rqmnt_designtn=&instruction_mode=&keyword=&class_nbr=&acad_org=&enrl_stat=&crse_attr=&crse_attr_value=&instructor_name=&session_code=&units=&page=10000"

data = {'institution' : 'UPITT' ,
        'term' : termNumber,
        'date_from' : None,
        'date_thru' : None,
        'subject' : None,
        'subject_like' : None,
        'catalog_nbr' : None,
        'time_range' : None,
        'days' : None,
        'campus' : 'PIT',
        'location' : None,
        'x_acad_career' : 'UGRD',
        'acad_group' : None,
        'rqmnt_designtn' : None,
        'instruction_mode' : None,
        'keyword' : None,
        'class_nbr' : None,
        'acad_org' : None,
        'enrl_stat' : None,
        'crse_attr' : None,
        'crse_attr_value' : None,
        'instructor_name' : None,
        'session_code' : None,
        'units' : None,
        'page' : '1'}

#r = requests.get(url=endPoint, data=data)
r = requests.get(url=endPoint)

print(len(r.content))
#print(r.text)